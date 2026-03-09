'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Soldier } from '@/lib/types';
import { CONFLICT_START_DATE, TIMELINE_END } from '@/lib/constants';
import {
  dateToPercent,
  percentToDate,
  getMonthTicks,
  getCasualtyDensity,
  formatTimelineDate,
  getDayNumber,
} from './timelineUtils';
import { Box, Text, Btn } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

const DENSITY_BUCKETS = 60;
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
  soldiers,
  visibleCount,
  isPlaying,
  onPlayToggle,
  playSpeed,
  onSpeedChange,
}: TimelineBarProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [density, setDensity] = useState<number[]>([]);
  const dragging = useRef(false);

  useEffect(() => () => { dragging.current = false; }, []);

  useEffect(() => {
    setDensity(
      getCasualtyDensity(soldiers, CONFLICT_START_DATE, TIMELINE_END, DENSITY_BUCKETS)
    );
  }, [soldiers]);

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
  const ticks = getMonthTicks(CONFLICT_START_DATE, TIMELINE_END);
  const maxDensity = Math.max(...density, 1);
  const dayNum = getDayNumber(selectedDate, CONFLICT_START_DATE);

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      onDateChange(
        percentToDate((x / rect.width) * 100, CONFLICT_START_DATE, TIMELINE_END)
      );
    },
    [onDateChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;

      const onMove = (me: MouseEvent) => {
        if (!trackRef.current || !dragging.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(me.clientX - rect.left, rect.width));
        onDateChange(
          percentToDate((x / rect.width) * 100, CONFLICT_START_DATE, TIMELINE_END)
        );
      };

      const onUp = () => {
        dragging.current = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [onDateChange]
  );

  const btnBase =
    'bg-transparent border border-electric/20 text-text px-2.5 py-0.5 rounded font-mono text-[12px] transition-all duration-150 cursor-pointer whitespace-nowrap hover:border-electric hover:text-electric';

  return (
    <Box className="h-[96px] bg-bg-card border-t border-electric/20 flex flex-col px-4 py-2 shrink-0 relative z-50">
      <Box className="flex items-center gap-2.5 mb-1.5">
        <Btn
          className={cn(btnBase, isPlaying && 'border-gold text-gold')}
          onClick={onPlayToggle}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </Btn>
        <Btn
          className={btnBase}
          onClick={() => onDateChange(CONFLICT_START_DATE)}
          aria-label="Reset"
        >
          ↺ RESET
        </Btn>
        {SPEEDS.map((s) => (
          <Btn
            key={s}
            className={cn(
              'bg-transparent border border-electric/30 text-muted px-1.5 py-0.5 rounded font-mono text-[10px] transition-all duration-150 cursor-pointer',
              playSpeed === s && 'border-electric text-electric'
            )}
            onClick={() => onSpeedChange(s)}
          >
            {s}×
          </Btn>
        ))}
        <Text className="font-mono text-[11px] text-muted ml-auto">
          Day {dayNum} · {formatTimelineDate(selectedDate)} · {visibleCount} Fallen
        </Text>
      </Box>

      <Box className="relative flex-1 flex flex-col justify-center">
        <Box className="flex h-2 gap-px mb-1 rounded overflow-hidden">
          {density.map((count, i) => (
            <Box
              key={i}
              className="flex-1 rounded-[1px] transition-opacity duration-200"
              style={{
                background: `rgba(244,162,97,${0.1 + (count / maxDensity) * 0.9})`,
                opacity: i / DENSITY_BUCKETS <= pct / 100 ? 1 : 0.3,
              }}
            />
          ))}
        </Box>

        <Box
          ref={trackRef}
          className="relative h-1 bg-electric/15 rounded cursor-pointer"
          onClick={handleTrackClick}
        >
          <Box
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold to-gold-fade rounded pointer-events-none"
            style={{ width: `${pct}%` }}
          />
          <Box
            className="absolute top-1/2 w-3 h-3 bg-gold border-2 border-bg cursor-grab rotate-45 shadow-[0_0_8px_rgba(244,162,97,0.8)] hover:shadow-[0_0_16px_rgba(244,162,97,1)] transition-shadow z-10"
            style={{
              left: `${pct}%`,
              transform: 'translate(-50%,-50%) rotate(45deg)',
            }}
            onMouseDown={handleMouseDown}
          />
        </Box>

        <Box className="relative h-4 mt-0.5">
          {ticks
            .filter((_, i) => i % 2 === 0)
            .map((tick) => {
              const tp = dateToPercent(tick.date, CONFLICT_START_DATE, TIMELINE_END);
              return (
                <Text
                  key={tick.label}
                  className="absolute top-0 font-mono text-[8px] text-muted opacity-60 whitespace-nowrap pointer-events-none -translate-x-1/2"
                  style={{ left: `${tp}%` }}
                >
                  {tick.label}
                </Text>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};
