import { createHash } from 'crypto';
import { getDb } from './db';

// ─── In-memory fallback (resets on cold start / no DATABASE_URL) ─────────────
const memCount = new Map<string, number>();
const memVotes = new Map<string, Set<string>>();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** SHA-256 of the raw client IP — never stored as plaintext (GDPR). */
export const hashClient = (raw: string): string =>
  createHash('sha256').update(raw).digest('hex');

const today = (): string => new Date().toISOString().slice(0, 10);

// ─── Public API ───────────────────────────────────────────────────────────────

export const getCount = async (soldierId: string): Promise<number> => {
  const db = getDb();
  if (db) {
    const rows = await db`
      SELECT count FROM candle_counts WHERE soldier_id = ${soldierId}
    `;
    return (rows[0]?.count as number) ?? 0;
  }
  return memCount.get(soldierId) ?? 0;
};

export const hasVotedToday = async (
  soldierId: string,
  clientHash: string
): Promise<boolean> => {
  const db = getDb();
  if (db) {
    const rows = await db`
      SELECT 1 FROM candle_votes
      WHERE soldier_id  = ${soldierId}
        AND client_hash = ${clientHash}
        AND vote_date   = ${today()}
    `;
    return rows.length > 0;
  }
  return memVotes.get(`${clientHash}:${soldierId}`)?.has(today()) ?? false;
};

export const recordVote = async (
  soldierId: string,
  clientHash: string
): Promise<number> => {
  const db = getDb();
  if (db) {
    await db`
      INSERT INTO candle_votes (soldier_id, client_hash, vote_date)
      VALUES (${soldierId}, ${clientHash}, ${today()})
      ON CONFLICT DO NOTHING
    `;
    const rows = await db`
      INSERT INTO candle_counts (soldier_id, count)
      VALUES (${soldierId}, 1)
      ON CONFLICT (soldier_id)
      DO UPDATE SET count = candle_counts.count + 1
      RETURNING count
    `;
    return rows[0].count as number;
  }

  // in-memory fallback
  const key = `${clientHash}:${soldierId}`;
  const votes = memVotes.get(key) ?? new Set<string>();
  votes.add(today());
  memVotes.set(key, votes);
  const current = memCount.get(soldierId) ?? 0;
  memCount.set(soldierId, current + 1);
  return current + 1;
};
