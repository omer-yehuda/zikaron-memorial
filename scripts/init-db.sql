-- Zikaron Memorial — Neon PostgreSQL schema
-- Run once against your Neon database to enable persistent candle counts.
--
-- Connection: set DATABASE_URL in Vercel environment variables or .env.local
--   DATABASE_URL=postgres://user:password@ep-xxx.neon.tech/neondb?sslmode=require

CREATE TABLE IF NOT EXISTS candle_counts (
  soldier_id VARCHAR(20) PRIMARY KEY,
  count      INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS candle_votes (
  soldier_id  VARCHAR(20) NOT NULL,
  client_hash CHAR(64)    NOT NULL,  -- SHA-256 hex of client IP (never stored raw)
  vote_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (soldier_id, client_hash, vote_date)
);

-- Index for fast per-soldier lookups
CREATE INDEX IF NOT EXISTS idx_candle_votes_soldier
  ON candle_votes (soldier_id, vote_date);
