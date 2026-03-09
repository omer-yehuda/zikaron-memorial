import { describe, it, expect } from 'vitest';
import {
  dateToPercent,
  percentToDate,
  getMonthTicks,
  getCasualtyDensity,
  formatTimelineDate,
  getDayNumber,
} from '@/components/timeline/timelineUtils';
import { getAllSoldiers } from '@/lib/soldiers';

const START = new Date('2023-10-07');
const END = new Date('2026-03-08');

describe('dateToPercent', () => {
  it('returns 0 for start date', () => {
    expect(dateToPercent(START, START, END)).toBe(0);
  });

  it('returns 100 for end date', () => {
    expect(dateToPercent(END, START, END)).toBe(100);
  });

  it('returns ~50 for midpoint', () => {
    const mid = new Date((START.getTime() + END.getTime()) / 2);
    const pct = dateToPercent(mid, START, END);
    expect(pct).toBeGreaterThan(45);
    expect(pct).toBeLessThan(55);
  });

  it('clamps to 0 below start', () => {
    expect(dateToPercent(new Date('2020-01-01'), START, END)).toBe(0);
  });

  it('clamps to 100 above end', () => {
    expect(dateToPercent(new Date('2030-01-01'), START, END)).toBe(100);
  });
});

describe('percentToDate', () => {
  it('returns start for 0%', () => {
    expect(percentToDate(0, START, END).getTime()).toBe(START.getTime());
  });

  it('returns end for 100%', () => {
    expect(percentToDate(100, START, END).getTime()).toBe(END.getTime());
  });

  it('roundtrips through dateToPercent', () => {
    const testDate = new Date('2024-06-15');
    const pct = dateToPercent(testDate, START, END);
    const back = percentToDate(pct, START, END);
    expect(Math.abs(back.getTime() - testDate.getTime())).toBeLessThan(1000);
  });
});

describe('getMonthTicks', () => {
  it('returns tick for each month between start and end', () => {
    const ticks = getMonthTicks(START, END);
    expect(ticks.length).toBeGreaterThan(20);
    expect(ticks[0].label).toContain('Nov');
  });

  it('each tick has date and label', () => {
    const ticks = getMonthTicks(START, END);
    for (const t of ticks) {
      expect(t.date).toBeInstanceOf(Date);
      expect(typeof t.label).toBe('string');
    }
  });
});

describe('getCasualtyDensity', () => {
  it('returns array of given bucket length', () => {
    const soldiers = getAllSoldiers();
    const result = getCasualtyDensity(soldiers, START, END, 60);
    expect(result.length).toBe(60);
  });

  it('total counts equal soldier count within range', () => {
    const soldiers = getAllSoldiers();
    const result = getCasualtyDensity(soldiers, START, END, 60);
    const sum = result.reduce((a, b) => a + b, 0);
    expect(sum).toBe(soldiers.length);
  });

  it('returns all zeros for empty range', () => {
    const result = getCasualtyDensity([], START, END, 10);
    expect(result.every((n) => n === 0)).toBe(true);
  });
});

describe('formatTimelineDate', () => {
  it('formats correctly', () => {
    const result = formatTimelineDate(new Date('2023-10-07'));
    expect(result).toContain('October');
    expect(result).toContain('7');
    expect(result).toContain('2023');
  });
});

describe('getDayNumber', () => {
  it('returns 1 for start date', () => {
    expect(getDayNumber(START, START)).toBe(1);
  });

  it('returns 2 for next day', () => {
    const next = new Date(START.getTime() + 24 * 60 * 60 * 1000);
    expect(getDayNumber(next, START)).toBe(2);
  });

  it('returns correct count for known date', () => {
    const d = new Date('2024-10-07');
    const result = getDayNumber(d, START);
    expect(result).toBe(367);
  });
});
