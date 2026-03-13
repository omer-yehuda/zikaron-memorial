'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import type { Soldier } from '@/lib/types';
import { CONFLICT_START_DATE, TIMELINE_END } from '@/lib/constants';
import { dateToPercent, percentToDate, getDayNumber, formatTimelineDate } from './timelineUtils';

const MEMORIAL_YEARS = [1948, 1967, 1973, 1982, 2006, 2023, 2024, 2025, 2026];
const DISPLAY_YEARS = [1948, 1967, 1973, 1982, 2006, 2023, 2024, 2025, 2026];
const SPEEDS = [1, 5, 10] as const;
type Speed = (typeof SPEEDS)[number];

interface TimelineBarProps {
  selectedDate: Date;
  onDateChange: (d: Date | ((prev: Date) => Date)) => void;
  soldiers: Soldier[];
  visibleCount: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  playSpeed: Speed;
  onSpeedChange: (s: Speed) => void;
}

export const TimelineBar = ({
  selectedDate,
  onDateChange,
  soldiers: _soldiers,
  visibleCount,
  isPlaying,
  onPlayToggle,
  playSpeed,
  onSpeedChange,
}: TimelineBarProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => () => { dragging.current = false; }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      onDateChange((prev: Date) => {
        const next = new Date(prev.getTime() + playSpeed * 86400000);
        return next >= TIMELINE_END ? TIMELINE_END : next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [isPlaying, playSpeed, onDateChange]);

  const pct = dateToPercent(selectedDate, CONFLICT_START_DATE, TIMELINE_END);
  const dayNum = getDayNumber(selectedDate, CONFLICT_START_DATE);

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    onDateChange(percentToDate((x / rect.width) * 100, CONFLICT_START_DATE, TIMELINE_END));
  }, [onDateChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (me: MouseEvent) => {
      if (!trackRef.current || !dragging.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(me.clientX - rect.left, rect.width));
      onDateChange(percentToDate((x / rect.width) * 100, CONFLICT_START_DATE, TIMELINE_END));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [onDateChange]);

  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  return (
    <div className="h-16 bg-gray-900/80 backdrop-blur-sm border-t border-cyan-400/30 flex items-center px-6 gap-4 shrink-0 relative">

      {/* Date range label */}
      <div className="text-cyan-400 text-sm font-mono whitespace-nowrap shrink-0">
        OCT 2023 - {TIMELINE_END.getFullYear()}
      </div>

      {/* Play / Reset controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onPlayToggle}
          className="w-8 h-8 bg-cyan-400/20 border border-cyan-400/40 rounded flex items-center justify-center hover:bg-cyan-400/30 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying
            ? <Pause className="w-3.5 h-3.5 text-cyan-400" />
            : <Play className="w-3.5 h-3.5 text-cyan-400" />
          }
        </button>
        <button
          onClick={() => onDateChange(CONFLICT_START_DATE)}
          className="w-8 h-8 bg-gray-700/50 border border-gray-600/40 rounded flex items-center justify-center hover:bg-gray-600/50 transition-colors"
          aria-label="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-1.5 h-6 rounded font-mono text-[10px] border transition-colors ${
              playSpeed === s
                ? 'bg-cyan-400/20 border-cyan-400/60 text-cyan-400'
                : 'bg-transparent border-gray-600/40 text-gray-500 hover:text-gray-300'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      {/* Timeline track */}
      <div className="flex-1 relative">
        {/* Track */}
        <div
          ref={trackRef}
          className="h-1 bg-gray-700 rounded-full relative cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Progress fill */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400/50 to-orange-400/60 rounded-full pointer-events-none"
            style={{ width: `${pct}%` }}
          />

          {/* Draggable handle */}
          <div
            className="absolute top-1/2 w-3 h-3 bg-orange-400 rounded-full glow-orange cursor-grab z-10 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${pct}%` }}
            onMouseDown={handleMouseDown}
          />

          {/* Year markers */}
          {DISPLAY_YEARS.map((year) => {
            const yearDate = new Date(`${year}-01-01`);
            const yPct = dateToPercent(yearDate, CONFLICT_START_DATE, TIMELINE_END);
            if (yPct < 0 || yPct > 100) return null;
            const isMemorial = MEMORIAL_YEARS.includes(year);
            return (
              <div
                key={year}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${yPct}%` }}
                onMouseEnter={() => setHoveredYear(year)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                <div className={`w-2.5 h-2.5 rounded-full border-2 border-black z-10 transition-all ${
                  isMemorial
                    ? 'bg-orange-400 glow-orange'
                    : 'bg-gray-500'
                } ${hoveredYear === year ? 'scale-125' : ''}`} />
                <div className={`text-[9px] mt-3 font-mono whitespace-nowrap transition-colors ${
                  hoveredYear === year ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  {year}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status label */}
        <div className="text-[9px] text-cyan-400 mt-5 text-center font-mono tracking-widest">
          DAY {dayNum} · {formatTimelineDate(selectedDate)} · {visibleCount} FALLEN
        </div>
      </div>
    </div>
  );
};
