import { describe, it, expect } from 'vitest';
import { getAllSoldiers, searchSoldiers, filterByBranch } from '@/lib/soldiers';

// Test the underlying library functions that power the API route
// (Next.js API routes require a full server context to test directly)

describe('API soldiers - library functions', () => {
  it('getAllSoldiers returns 150 entries', () => {
    const soldiers = getAllSoldiers();
    expect(soldiers.length).toBe(150);
  });

  it('searchSoldiers with empty string returns all', () => {
    const result = searchSoldiers('');
    expect(result.length).toBe(150);
  });

  it('searchSoldiers filters by name', () => {
    const result = searchSoldiers('Cohen');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((s) => s.name_en.includes('Cohen'))).toBe(true);
  });

  it('filterByBranch with ground returns only ground soldiers', () => {
    const all = getAllSoldiers();
    const result = filterByBranch(all, ['ground']);
    expect(result.every((s) => s.unit_branch === 'ground')).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('filterByBranch with multiple branches works', () => {
    const all = getAllSoldiers();
    const result = filterByBranch(all, ['air', 'navy']);
    expect(
      result.every((s) => s.unit_branch === 'air' || s.unit_branch === 'navy')
    ).toBe(true);
  });

  it('filterByBranch with empty returns all', () => {
    const all = getAllSoldiers();
    expect(filterByBranch(all, []).length).toBe(all.length);
  });

  it('soldier data has valid coordinates for entries that have them', () => {
    const soldiers = getAllSoldiers();
    for (const s of soldiers) {
      if (!s.coordinates) continue;
      expect(s.coordinates.lat).toBeGreaterThan(20);
      expect(s.coordinates.lat).toBeLessThan(40);
      expect(s.coordinates.lng).toBeGreaterThan(30);
      expect(s.coordinates.lng).toBeLessThan(40);
    }
  });
});
