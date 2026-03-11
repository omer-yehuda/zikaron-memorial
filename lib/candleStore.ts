import { createHash } from 'crypto';
import { DynamoDBClient, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

// ─── In-memory fallback (no AWS credentials configured) ───────────────────────
const memCount = new Map<string, number>();
const memVotes = new Map<string, Set<string>>();

// ─── DynamoDB client (lazy, singleton) ───────────────────────────────────────
let _docClient: DynamoDBDocumentClient | null = null;

const getDocClient = (): DynamoDBDocumentClient | null => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.DYNAMO_TABLE) return null;
  if (!_docClient) {
    const ddb = new DynamoDBClient({
      region: process.env.AWS_REGION ?? 'us-east-1',
    });
    _docClient = DynamoDBDocumentClient.from(ddb, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return _docClient;
};

const TABLE = (): string => process.env.DYNAMO_TABLE!;
const today = (): string => new Date().toISOString().slice(0, 10);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** SHA-256 of raw client IP — never stored in plaintext (GDPR). */
export const hashClient = (raw: string): string =>
  createHash('sha256').update(raw).digest('hex');

// ─── Public API ───────────────────────────────────────────────────────────────

export const getCount = async (soldierId: string): Promise<number> => {
  const db = getDocClient();
  if (db) {
    const res = await db.send(
      new GetCommand({ TableName: TABLE(), Key: { PK: `COUNT#${soldierId}` } })
    );
    return (res.Item?.count as number) ?? 0;
  }
  return memCount.get(soldierId) ?? 0;
};

export const hasVotedToday = async (
  soldierId: string,
  clientHash: string
): Promise<boolean> => {
  const db = getDocClient();
  if (db) {
    const res = await db.send(
      new GetCommand({
        TableName: TABLE(),
        Key: { PK: `VOTE#${soldierId}#${clientHash}#${today()}` },
      })
    );
    return !!res.Item;
  }
  return memVotes.get(`${clientHash}:${soldierId}`)?.has(today()) ?? false;
};

export const recordVote = async (
  soldierId: string,
  clientHash: string
): Promise<number> => {
  const db = getDocClient();
  if (db) {
    // TTL = tomorrow epoch — DynamoDB auto-deletes old vote records (free cleanup)
    const ttl = Math.floor((Date.now() + 86_400_000) / 1000);

    try {
      await db.send(
        new PutCommand({
          TableName: TABLE(),
          Item: { PK: `VOTE#${soldierId}#${clientHash}#${today()}`, ttl },
          // Atomic guard — prevents double-counting in concurrent requests
          ConditionExpression: 'attribute_not_exists(PK)',
        })
      );
    } catch (err) {
      if (err instanceof ConditionalCheckFailedException) {
        // Race condition: already voted — return current count without incrementing
        return getCount(soldierId);
      }
      throw err;
    }

    const res = await db.send(
      new UpdateCommand({
        TableName: TABLE(),
        Key: { PK: `COUNT#${soldierId}` },
        UpdateExpression: 'ADD #c :inc',
        ExpressionAttributeNames: { '#c': 'count' },
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: 'UPDATED_NEW',
      })
    );
    return (res.Attributes?.count as number) ?? 0;
  }

  // In-memory fallback
  const key = `${clientHash}:${soldierId}`;
  const votes = memVotes.get(key) ?? new Set<string>();
  votes.add(today());
  memVotes.set(key, votes);
  const current = memCount.get(soldierId) ?? 0;
  memCount.set(soldierId, current + 1);
  return current + 1;
};
