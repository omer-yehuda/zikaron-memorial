import soldiersData from '@/data/soldiers.json';
import type { Soldier, Stats } from './types';

// Local JSON fallback — used when DynamoDB is not configured (dev / static build)
export function getLocalSoldiers(): Soldier[] {
  return soldiersData as Soldier[];
}

export function computeStats(soldiers: Soldier[]): Stats {
  const by_branch: Stats['by_branch'] = {
    infantry: 0, armor: 0, navy: 0, air_force: 0,
    special_forces: 0, engineering: 0, intelligence: 0, artillery: 0, other: 0,
  };
  const by_month: Record<string, number> = {};
  let first_date = soldiers[0]?.date_of_death ?? '';
  let last_date = '';

  for (const s of soldiers) {
    by_branch[s.branch] = (by_branch[s.branch] ?? 0) + 1;
    const month = s.date_of_death.slice(0, 7);
    by_month[month] = (by_month[month] ?? 0) + 1;
    if (s.date_of_death < first_date) first_date = s.date_of_death;
    if (s.date_of_death > last_date) last_date = s.date_of_death;
  }

  return { total: soldiers.length, by_branch, by_month, first_date, last_date };
}
