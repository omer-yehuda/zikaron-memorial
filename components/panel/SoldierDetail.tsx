'use client';

import { X, Flame } from 'lucide-react';
import { useState } from 'react';
import type { Soldier } from '@/lib/types';
import { BRANCH_LABELS } from '@/lib/constants';
import SoldierAvatar from '@/components/ui/SoldierAvatar';

interface SoldierDetailProps {
  soldier: Soldier;
  onClose: () => void;
}

export default function SoldierDetail({ soldier, onClose }: SoldierDetailProps) {
  const [candles, setCandles] = useState(0);
  const [lit, setLit] = useState(false);
  const branch = BRANCH_LABELS[soldier.branch];

  const lightCandle = async () => {
    if (lit) return;
    try {
      const res = await fetch('/api/candles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soldierId: soldier.id }),
      });
      const data = await res.json() as { count: number };
      setCandles(data.count);
      setLit(true);
    } catch {
      setCandles((c) => c + 1);
      setLit(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-cyan-400/30 rounded-lg max-w-md w-full p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3">
            <SoldierAvatar soldier={soldier} size="lg" />
          </div>
          <h2 className="text-xl font-bold text-white">{soldier.name_he}</h2>
          <p className="text-sm text-gray-400">{soldier.name_en}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="bg-gray-800/50 rounded p-3">
            <div className="text-xs text-gray-500 mb-1 font-mono">RANK</div>
            <div className="text-white">{soldier.rank_he} · {soldier.rank_en}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-3">
            <div className="text-xs text-gray-500 mb-1 font-mono">UNIT</div>
            <div className="text-white">{soldier.unit_he}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-3">
            <div className="text-xs text-gray-500 mb-1 font-mono">BRANCH</div>
            <div style={{ color: branch?.color }}>{branch?.he}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-3">
            <div className="text-xs text-gray-500 mb-1 font-mono">DATE</div>
            <div className="text-cyan-400 font-mono">{soldier.date_of_death}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-3">
            <div className="text-xs text-gray-500 mb-1 font-mono">CITY</div>
            <div className="text-white">{soldier.city_he}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-3">
            <div className="text-xs text-gray-500 mb-1 font-mono">AGE</div>
            <div className="text-white">{soldier.age}</div>
          </div>
        </div>

        {/* Bio */}
        {soldier.description_he && (
          <p className="text-sm text-gray-300 text-right mb-6 leading-relaxed" dir="rtl">
            {soldier.description_he}
          </p>
        )}

        {/* Candle button */}
        <button
          onClick={lightCandle}
          disabled={lit}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded border transition-all ${
            lit
              ? 'border-orange-400/50 bg-orange-400/10 text-orange-400 cursor-default'
              : 'border-orange-400/30 hover:border-orange-400/70 hover:bg-orange-400/10 text-orange-300 cursor-pointer'
          }`}
        >
          <Flame className={`w-4 h-4 ${lit ? 'fill-orange-400' : ''}`} />
          <span className="text-sm font-mono">
            {lit ? `נר הודלק · ${candles} נרות` : 'הדלק נר'}
          </span>
        </button>
      </div>
    </div>
  );
}
