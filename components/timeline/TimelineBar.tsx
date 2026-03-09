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
import styles from './TimelineBar.module.css';

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

  useEffect(() => {
    setDensity(
      getCasualtyDensity(soldiers, CONFLICT_START_DATE, TIMELINE_END, DENSITY_BUCKETS)
    );
  }, [soldiers]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      onDateChange((prev: Date) => {
        const next = new Date(prev.getTime() + playSpeed * 24 * 60 * 60 * 1000);
        if (next >= TIMELINE_END) {
          return TIMELINE_END;
        }
        return next;
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
      const newPct = (x / rect.width) * 100;
      onDateChange(percentToDate(newPct, CONFLICT_START_DATE, TIMELINE_END));
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
        const newPct = (x / rect.width) * 100;
        onDateChange(percentToDate(newPct, CONFLICT_START_DATE, TIMELINE_END));
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

  const handleReset = () => {
    onDateChange(CONFLICT_START_DATE);
  };

  return (
    <div className={styles.timelineBar}>
      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${isPlaying ? styles.btnActive : ''}`}
          onClick={onPlayToggle}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </button>
        <button className={styles.btn} onClick={handleReset} aria-label="Reset">
          ↺ RESET
        </button>
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={`${styles.speedBtn} ${playSpeed === s ? styles.speedBtnActive : ''}`}
            onClick={() => onSpeedChange(s)}
          >
            {s}×
          </button>
        ))}
        <span className={styles.statusText}>
          Day {dayNum} · {formatTimelineDate(selectedDate)} · {visibleCount} Fallen
        </span>
      </div>

      <div className={styles.trackWrapper}>
        <div className={styles.densityBar}>
          {density.map((count, i) => (
            <div
              key={i}
              className={styles.densityBucket}
              style={{
                background: `rgba(244, 162, 97, ${0.1 + (count / maxDensity) * 0.9})`,
                opacity: i / DENSITY_BUCKETS <= pct / 100 ? 1 : 0.3,
              }}
            />
          ))}
        </div>

        <div
          ref={trackRef}
          className={styles.track}
          onClick={handleTrackClick}
        >
          <div className={styles.trackFill} style={{ width: `${pct}%` }} />
          <div
            className={styles.handle}
            style={{ left: `${pct}%` }}
            onMouseDown={handleMouseDown}
          />
        </div>

        <div className={styles.ticks}>
          {ticks
            .filter((_, i) => i % 2 === 0)
            .map((tick) => {
              const tickPct = dateToPercent(tick.date, CONFLICT_START_DATE, TIMELINE_END);
              return (
                <div
                  key={tick.label}
                  className={styles.tick}
                  style={{ left: `${tickPct}%` }}
                >
                  {tick.label}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
