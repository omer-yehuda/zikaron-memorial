import soldiersData from '@/data/soldiers.json';
import type { Soldier, SoldierStats, UnitBranch } from './types';
import { CONFLICT_START_DATE } from './constants';

const soldiers = soldiersData as Soldier[];

export const getAllSoldiers = (): Soldier[] => soldiers;

export const getSoldierById = (id: string): Soldier | undefined =>
  soldiers.find((s) => s.id === id);

export const getSoldiersUpToDate = (date: Date): Soldier[] =>
  soldiers.filter((s) => new Date(s.date_of_fall) <= date);

export const searchSoldiers = (query: string): Soldier[] => {
  if (!query.trim()) return soldiers;
  const lower = query.toLowerCase();
  return soldiers.filter(
    (s) =>
      s.name_en.toLowerCase().includes(lower) ||
      s.name_he.includes(query) ||
      s.unit.toLowerCase().includes(lower) ||
      s.city_of_origin.toLowerCase().includes(lower) ||
      s.location_name.toLowerCase().includes(lower)
  );
};

export const filterByBranch = (
  input: Soldier[],
  branches: UnitBranch[]
): Soldier[] => {
  if (branches.length === 0) return input;
  return input.filter((s) => branches.includes(s.unit_branch));
};

export const getStats = (input: Soldier[]): SoldierStats => {
  const byBranch: Record<UnitBranch, number> = {
    ground: 0,
    air: 0,
    navy: 0,
    special: 0,
  };

  const byMonth: Record<string, number> = {};
  const cities = new Set<string>();
  const units = new Set<string>();

  for (const s of input) {
    byBranch[s.unit_branch] = (byBranch[s.unit_branch] ?? 0) + 1;
    const month = s.date_of_fall.slice(0, 7);
    byMonth[month] = (byMonth[month] ?? 0) + 1;
    cities.add(s.city_of_origin);
    units.add(s.unit);
  }

  return {
    total: input.length,
    byBranch,
    byMonth,
    citiesCount: cities.size,
    unitsCount: units.size,
    daysSinceStart: getDaysSinceStart(),
  };
};

export const formatDateHebrew = (dateStr: string): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('he-IL', options);
};

export const formatDateEnglish = (dateStr: string): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

export const getDaysSinceStart = (date?: Date): number => {
  const target = date ?? new Date();
  const diff = target.getTime() - CONFLICT_START_DATE.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};
