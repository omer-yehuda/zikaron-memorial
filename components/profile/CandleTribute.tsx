'use client';

import { useEffect, useState } from 'react';
import styles from './CandleTribute.module.css';

interface CandleTributeProps {
  soldierId: string;
}

const RATE_LIMIT_KEY = (id: string) => `candle_lit_${id}`;
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000;

export const CandleTribute = ({ soldierId }: CandleTributeProps) => {
  const [count, setCount] = useState<number | null>(null);
  const [alreadyLit, setAlreadyLit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key = RATE_LIMIT_KEY(soldierId);
    const stored = localStorage.getItem(key);
    if (stored) {
      const ts = parseInt(stored, 10);
      if (Date.now() - ts < RATE_LIMIT_MS) setAlreadyLit(true);
    }

    fetch(`/api/candles?id=${soldierId}`)
      .then((r) => r.json())
      .then((data: { count: number }) => setCount(data.count))
      .catch(() => setCount(0));
  }, [soldierId]);

  const handleLight = async () => {
    if (alreadyLit || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/candles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: soldierId }),
      });
      const data = (await res.json()) as { count: number };
      setCount(data.count);
      setAlreadyLit(true);
      localStorage.setItem(RATE_LIMIT_KEY(soldierId), String(Date.now()));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.tribute}>
      <svg
        className={styles.candleSvg}
        width="40"
        height="60"
        viewBox="0 0 40 60"
      >
        {/* Flame */}
        <ellipse
          className={styles.flame}
          cx="20"
          cy="12"
          rx="6"
          ry="10"
          fill="#f4a261"
          opacity="0.9"
        />
        <ellipse cx="20" cy="14" rx="3" ry="6" fill="#ffd700" opacity="0.8" />
        {/* Wick */}
        <line x1="20" y1="22" x2="20" y2="26" stroke="#333" strokeWidth="1.5" />
        {/* Candle body */}
        <rect x="13" y="26" width="14" height="30" rx="2" fill="#e8e0d0" opacity="0.9" />
        <rect x="13" y="26" width="4" height="30" rx="1" fill="#d4c9b5" opacity="0.5" />
      </svg>

      <div className={styles.countNum}>{count ?? '...'}</div>
      <div className={styles.countText}>נרות הודלקו לזכרו/ה</div>

      <button
        className={styles.btn}
        onClick={handleLight}
        disabled={alreadyLit || loading}
      >
        🕯 הדלק נר לזכרו/ה
      </button>

      {alreadyLit && (
        <div className={styles.alreadyLit}>
          הדלקת נר היום · You have already lit a candle today
        </div>
      )}
    </div>
  );
};
