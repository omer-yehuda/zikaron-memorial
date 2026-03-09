import type { Soldier } from '@/lib/types';

export const dateToPercent = (date: Date, start: Date, end: Date): number => {
  const total = end.getTime() - start.getTime();
  if (total === 0) return 0;
  const elapsed = date.getTime() - start.getTime();
  return Math.max(0, Math.min(100, (elapsed / total) * 100));
};

export const percentToDate = (pct: number, start: Date, end: Date): Date => {
  const total = end.getTime() - start.getTime();
  return new Date(start.getTime() + (pct / 100) * total);
};

export const getMonthTicks = (
  start: Date,
  end: Date
): { date: Date; label: string }[] => {
  const ticks: { date: Date; label: string }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  cursor.setMonth(cursor.getMonth() + 1);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  while (cursor <= end) {
    const shortYear = String(cursor.getFullYear()).slice(2);
    ticks.push({
      date: new Date(cursor),
      label: `${monthNames[cursor.getMonth()]} '${shortYear}`,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return ticks;
};

export const getCasualtyDensity = (
  soldiers: Soldier[],
  start: Date,
  end: Date,
  buckets: number
): number[] => {
  const counts = Array<number>(buckets).fill(0);
  const totalMs = end.getTime() - start.getTime();
  if (totalMs <= 0) return counts;

  for (const s of soldiers) {
    const d = new Date(s.date_of_fall);
    if (d < start || d > end) continue;
    const idx = Math.min(
      buckets - 1,
      Math.floor(((d.getTime() - start.getTime()) / totalMs) * buckets)
    );
    counts[idx]++;
  }

  return counts;
};

export const formatTimelineDate = (date: Date): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const getDayNumber = (date: Date, start: Date): number =>
  Math.max(1, Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
