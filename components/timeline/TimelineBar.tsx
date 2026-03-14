'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineBarProps {
  minDate: string;
  maxDate: string;
  currentDate: string;
  onChange: (date: string) => void;
}

function dateToValue(date: string, min: string, max: string): number {
  const d = new Date(date).getTime();
  const mn = new Date(min).getTime();
  const mx = new Date(max).getTime();
  if (mx === mn) return 100;
  return ((d - mn) / (mx - mn)) * 100;
}

function valueToDate(pct: number, min: string, max: string): string {
  const mn = new Date(min).getTime();
  const mx = new Date(max).getTime();
  const ts = mn + (pct / 100) * (mx - mn);
  return new Date(ts).toISOString().slice(0, 10);
}

export default function TimelineBar({ minDate, maxDate, currentDate, onChange }: TimelineBarProps) {
  const [playing, setPlaying] = useState(false);

  const value = dateToValue(currentDate, minDate, maxDate);

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const pct = Number(e.target.value);
      onChange(valueToDate(pct, minDate, maxDate));
    },
    [minDate, maxDate, onChange]
  );

  const reset = () => {
    setPlaying(false);
    onChange(minDate);
  };

  const togglePlay = () => setPlaying((p) => !p);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      const next = valueToDate(Math.min(value + 2, 100), minDate, maxDate);
      onChange(next);
      if (value >= 99.5) setPlaying(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [playing, value, minDate, maxDate, onChange]);

  return (
    <footer className="h-16 bg-gray-900/80 backdrop-blur-sm border-t border-cyan-400/30 flex items-center px-6 gap-4">
      {/* Period label */}
      <span className="text-cyan-400 text-xs font-mono whitespace-nowrap">
        {minDate.slice(0, 7)} — {maxDate.slice(0, 7)}
      </span>

      {/* Play / Reset */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="w-8 h-8 bg-cyan-400/20 rounded flex items-center justify-center hover:bg-cyan-400/30 transition-colors"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
        </button>
        <button
          onClick={reset}
          className="w-8 h-8 bg-gray-700/50 rounded flex items-center justify-center hover:bg-gray-600/50 transition-colors"
          aria-label="Reset"
        >
          <RotateCcw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Scrubber */}
      <div className="flex-1 relative flex items-center">
        <div className="w-full h-1 bg-gray-700 rounded-full relative">
          <div
            className="absolute left-0 top-0 h-1 bg-gradient-to-r from-cyan-400/50 to-orange-400/80 rounded-full"
            style={{ width: `${value}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={value}
          onChange={handleSlider}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          aria-label="Timeline scrubber"
        />
      </div>

      {/* Current date */}
      <span className="text-orange-400 text-xs font-mono whitespace-nowrap">{currentDate}</span>
    </footer>
  );
}
