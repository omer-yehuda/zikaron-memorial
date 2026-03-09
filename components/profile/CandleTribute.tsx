'use client';

import { useEffect, useState } from 'react';
import { Box, Text, Btn } from '@/components/ui/primitives';

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
    const stored = localStorage.getItem(RATE_LIMIT_KEY(soldierId));
    if (stored && Date.now() - parseInt(stored, 10) < RATE_LIMIT_MS) {
      setAlreadyLit(true);
    }

    const controller = new AbortController();
    fetch(`/api/candles?id=${soldierId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d: { count: number }) => setCount(d.count))
      .catch((e: unknown) => {
        if ((e as { name?: string }).name !== 'AbortError') setCount(0);
      });
    return () => controller.abort();
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
    <Box className="bg-bg-card border border-electric/20 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
      <svg
        className="animate-glow"
        width="40"
        height="60"
        viewBox="0 0 40 60"
      >
        <ellipse
          className="animate-candle-flicker [transform-origin:center_bottom]"
          cx="20"
          cy="12"
          rx="6"
          ry="10"
          fill="#f4a261"
          opacity="0.9"
        />
        <ellipse cx="20" cy="14" rx="3" ry="6" fill="#ffd700" opacity="0.8" />
        <line x1="20" y1="22" x2="20" y2="26" stroke="#333" strokeWidth="1.5" />
        <rect
          x="13"
          y="26"
          width="14"
          height="30"
          rx="2"
          fill="#e8e0d0"
          opacity="0.9"
        />
        <rect
          x="13"
          y="26"
          width="4"
          height="30"
          rx="1"
          fill="#d4c9b5"
          opacity="0.5"
        />
      </svg>

      <Text className="block font-mono text-[28px] font-bold text-gold leading-none">
        {count ?? '...'}
      </Text>
      <Text className="block font-he text-[16px] text-hebrew [direction:rtl]">
        נרות הודלקו לזכרו/ה
      </Text>

      <Btn
        className="bg-gold/10 border border-gold/50 text-gold px-5 py-2 rounded-md text-[14px] font-he [direction:rtl] transition-all duration-200 hover:enabled:bg-gold/20 hover:enabled:shadow-[0_0_12px_rgba(244,162,97,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleLight}
        disabled={alreadyLit || loading}
      >
        🕯 הדלק נר לזכרו/ה
      </Btn>

      {alreadyLit && (
        <Text className="font-mono text-[12px] text-muted">
          הדלקת נר היום · You have already lit a candle today
        </Text>
      )}
    </Box>
  );
};
