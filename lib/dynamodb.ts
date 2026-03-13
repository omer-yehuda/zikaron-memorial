import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Soldier, CandlePayload } from './types';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      }
    : undefined, // uses IAM role on Amplify
});

const docClient = DynamoDBDocumentClient.from(client);

const SOLDIERS_TABLE = process.env.DYNAMODB_SOLDIERS_TABLE ?? 'ZikaronSoldiers';
const CANDLES_TABLE = process.env.DYNAMODB_CANDLES_TABLE ?? 'ZikaronCandles';

export async function getAllSoldiers(): Promise<Soldier[]> {
  const result = await docClient.send(new ScanCommand({ TableName: SOLDIERS_TABLE }));
  return (result.Items ?? []) as Soldier[];
}

export async function getSoldierById(id: string): Promise<Soldier | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: SOLDIERS_TABLE, Key: { id } })
  );
  return (result.Item as Soldier) ?? null;
}

export async function putSoldier(soldier: Soldier): Promise<void> {
  await docClient.send(new PutCommand({ TableName: SOLDIERS_TABLE, Item: soldier }));
}

export async function getCandles(soldierId: string): Promise<CandlePayload | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: CANDLES_TABLE, Key: { soldier_id: soldierId } })
  );
  return (result.Item as CandlePayload) ?? null;
}

export async function incrementCandles(soldierId: string): Promise<number> {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: CANDLES_TABLE,
      Key: { soldier_id: soldierId },
      UpdateExpression: 'ADD #count :one SET last_lit_at = :ts',
      ExpressionAttributeNames: { '#count': 'count' },
      ExpressionAttributeValues: { ':one': 1, ':ts': new Date().toISOString() },
      ReturnValues: 'UPDATED_NEW',
    })
  );
  return Number(result.Attributes?.count ?? 0);
}
