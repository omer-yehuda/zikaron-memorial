'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Soldier, UnitBranch } from '@/lib/types';
import { BRANCHES, BRANCH_COLOR_MAP } from '@/lib/constants';
import { StarOfDavid } from '@/components/ui/StarOfDavid';
import { formatDateEnglish } from '@/lib/soldiers';
import styles from './SoldiersPageClient.module.css';

type SortKey = 'newest' | 'oldest' | 'az';

interface SoldiersPageClientProps {
  soldiers: Soldier[];
}

export const SoldiersPageClient = ({ soldiers }: SoldiersPageClientProps) => {
  const [query, setQuery] = useState('');
  const [activeBranches, setActiveBranches] = useState<Set<UnitBranch>>(
    new Set()
  );
  const [sort, setSort] = useState<SortKey>('newest');

  const toggleBranch = (b: UnitBranch) => {
    setActiveBranches((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = soldiers;

    if (query.trim()) {
      const lower = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name_en.toLowerCase().includes(lower) ||
          s.name_he.includes(query) ||
          s.unit.toLowerCase().includes(lower) ||
          s.city_of_origin.toLowerCase().includes(lower)
      );
    }

    if (activeBranches.size > 0) {
      list = list.filter((s) => activeBranches.has(s.unit_branch));
    }

    return [...list].sort((a, b) => {
      if (sort === 'newest')
        return (
          new Date(b.date_of_fall).getTime() -
          new Date(a.date_of_fall).getTime()
        );
      if (sort === 'oldest')
        return (
          new Date(a.date_of_fall).getTime() -
          new Date(b.date_of_fall).getTime()
        );
      return a.name_en.localeCompare(b.name_en);
    });
  }, [soldiers, query, activeBranches, sort]);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          ← Back to Map
        </Link>
        <h1 className={styles.pageTitle}>לוחמים שנפלו — Fallen Soldiers</h1>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name, unit, city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.pillGroup}>
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              className={`${styles.pill} ${activeBranches.has(b.id) ? styles.pillActive : ''}`}
              onClick={() => toggleBranch(b.id)}
            >
              {b.label_en}
            </button>
          ))}
        </div>
        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Name A–Z</option>
        </select>
        <span className={styles.resultCount}>
          {filtered.length} / {soldiers.length}
        </span>
      </div>

      <div className={styles.grid}>
        {filtered.map((soldier) => {
          const color = BRANCH_COLOR_MAP[soldier.unit_branch];
          return (
            <Link
              key={soldier.id}
              href={`/soldiers/${soldier.id}`}
              className={styles.card}
            >
              <div
                className={styles.branchIndicator}
                style={{ background: color }}
              />
              {soldier.photo_url ? (
                <img
                  src={soldier.photo_url}
                  alt={soldier.name_en}
                  className={styles.cardPhoto}
                />
              ) : (
                <div className={styles.cardPhotoPlaceholder}>
                  <StarOfDavid size={28} color={color} />
                </div>
              )}
              <div className={styles.cardNameHe}>{soldier.name_he}</div>
              <div className={styles.cardNameEn}>{soldier.name_en}</div>
              <div className={styles.cardRank}>{soldier.rank_en}</div>
              <div className={styles.cardUnit}>{soldier.unit}</div>
              <div className={styles.cardDate}>
                {formatDateEnglish(soldier.date_of_fall)}
              </div>
              <div className={styles.cardLocation}>
                📍 {soldier.location_name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
