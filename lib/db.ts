import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | null = null;

/**
 * Returns a Neon SQL client when DATABASE_URL is configured,
 * or null when running without a database (falls back to in-memory).
 */
export const getDb = (): NeonQueryFunction<false, false> | null => {
  if (!process.env.DATABASE_URL) return null;
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
};
