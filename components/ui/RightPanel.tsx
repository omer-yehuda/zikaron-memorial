'use client';

import type { SoldierStats, UnitBranch } from '@/lib/types';
import { BRANCHES } from '@/lib/constants';
import styles from './RightPanel.module.css';

interface RightPanelProps {
  stats: SoldierStats;
  branchFilters: Set<UnitBranch>;
  onBranchToggle: (branch: UnitBranch) => void;
}

export const RightPanel = ({
  stats,
  branchFilters,
  onBranchToggle,
}: RightPanelProps) => {
  const maxBranch = Math.max(...Object.values(stats.byBranch), 1);

  return (
    <aside className={styles.panel}>
      <div className={styles.section}>
        <div className={styles.dayCounter}>
          <div className={styles.dayNumber}>{stats.daysSinceStart}</div>
          <div className={styles.dayLabel}>DAYS SINCE OCT 7</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Statistics</div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Total Fallen</span>
          <span className={styles.statValue}>{stats.total.toLocaleString()}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Cities</span>
          <span className={styles.statValueSmall}>{stats.citiesCount}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Units</span>
          <span className={styles.statValueSmall}>{stats.unitsCount}</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Branch Filter</div>
        <div className={styles.branchFilter}>
          {BRANCHES.map((branch) => {
            const active = branchFilters.has(branch.id);
            const count = stats.byBranch[branch.id] ?? 0;
            const pct = Math.round((count / maxBranch) * 100);
            return (
              <label
                key={branch.id}
                className={`${styles.branchRow} ${active ? styles.branchRowActive : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.branchCheckbox}
                  checked={active}
                  onChange={() => onBranchToggle(branch.id)}
                />
                <span
                  className={styles.branchDot}
                  style={{ background: active ? branch.color : 'rgba(168, 178, 193, 0.3)' }}
                />
                <span className={styles.branchLabel}>{branch.label_en}</span>
                <span className={styles.branchCount}>{count}</span>
                <div
                  className={styles.miniBar}
                  style={{
                    width: `${pct}%`,
                    background: active ? branch.color : 'rgba(168, 178, 193, 0.2)',
                    minWidth: count > 0 ? '4px' : '0',
                  }}
                />
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
