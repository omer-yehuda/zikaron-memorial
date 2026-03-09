import { describe, it, expect } from 'vitest';
import {
  getAllSoldiers,
  getSoldierById,
  getSoldiersUpToDate,
  searchSoldiers,
  filterByBranch,
  getStats,
  formatDateEnglish,
  formatDateHebrew,
  getDaysSinceStart,
} from '@/lib/soldiers';

describe('getAllSoldiers', () => {
  it('returns an array of 150 soldiers', () => {
    const soldiers = getAllSoldiers();
    expect(Array.isArray(soldiers)).toBe(true);
    expect(soldiers.length).toBe(150);
  });

  it('each soldier has required fields', () => {
    const soldiers = getAllSoldiers();
    for (const s of soldiers) {
      expect(s.id).toBeTruthy();
      expect(s.name_he).toBeTruthy();
      expect(s.name_en).toBeTruthy();
      expect(s.unit_branch).toMatch(/^(ground|air|navy|special)$/);
    }
  });
});

describe('getSoldierById', () => {
  it('returns the correct soldier', () => {
    const s = getSoldierById('IDF-001');
    expect(s).toBeDefined();
    expect(s?.id).toBe('IDF-001');
    expect(s?.name_en).toBe('Yosef Cohen');
  });

  it('returns undefined for unknown id', () => {
    expect(getSoldierById('UNKNOWN-999')).toBeUndefined();
  });
});

describe('getSoldiersUpToDate', () => {
  it('returns only soldiers fallen on or before the given date', () => {
    const cutoff = new Date('2023-10-08');
    const result = getSoldiersUpToDate(cutoff);
    expect(result.length).toBeGreaterThan(0);
    for (const s of result) {
      expect(new Date(s.date_of_fall).getTime()).toBeLessThanOrEqual(cutoff.getTime());
    }
  });

  it('returns 0 for date before conflict start', () => {
    const result = getSoldiersUpToDate(new Date('2023-01-01'));
    expect(result.length).toBe(0);
  });
});

describe('searchSoldiers', () => {
  it('returns all soldiers for empty query', () => {
    expect(searchSoldiers('').length).toBe(150);
  });

  it('filters by English name', () => {
    const result = searchSoldiers('Cohen');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((s) => s.name_en.includes('Cohen'))).toBe(true);
  });

  it('returns empty array for no match', () => {
    expect(searchSoldiers('XYZNOTFOUND123').length).toBe(0);
  });
});

describe('filterByBranch', () => {
  it('returns all when empty array', () => {
    const all = getAllSoldiers();
    expect(filterByBranch(all, []).length).toBe(all.length);
  });

  it('filters to only ground soldiers', () => {
    const all = getAllSoldiers();
    const result = filterByBranch(all, ['ground']);
    expect(result.every((s) => s.unit_branch === 'ground')).toBe(true);
  });
});

describe('getStats', () => {
  it('returns correct structure', () => {
    const soldiers = getAllSoldiers();
    const stats = getStats(soldiers);
    expect(typeof stats.total).toBe('number');
    expect(stats.total).toBe(150);
    expect(typeof stats.byBranch.ground).toBe('number');
    expect(typeof stats.byBranch.air).toBe('number');
    expect(typeof stats.byBranch.navy).toBe('number');
    expect(typeof stats.byBranch.special).toBe('number');
    expect(typeof stats.citiesCount).toBe('number');
    expect(typeof stats.unitsCount).toBe('number');
    expect(stats.citiesCount).toBeGreaterThan(0);
    expect(stats.unitsCount).toBeGreaterThan(0);
  });

  it('branch counts sum to total', () => {
    const stats = getStats(getAllSoldiers());
    const sum = Object.values(stats.byBranch).reduce((a, b) => a + b, 0);
    expect(sum).toBe(stats.total);
  });
});

describe('formatDateEnglish', () => {
  it('formats a date string', () => {
    const result = formatDateEnglish('2023-10-07');
    expect(typeof result).toBe('string');
    expect(result).toContain('2023');
  });
});

describe('formatDateHebrew', () => {
  it('formats a date string in Hebrew', () => {
    const result = formatDateHebrew('2023-10-07');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('getDaysSinceStart', () => {
  it('returns a positive number', () => {
    expect(getDaysSinceStart()).toBeGreaterThan(0);
  });

  it('returns 0 for date before start', () => {
    expect(getDaysSinceStart(new Date('2023-01-01'))).toBe(0);
  });
});
