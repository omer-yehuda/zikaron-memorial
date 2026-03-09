'use client';

import { useEffect, useRef } from 'react';
import type { Soldier } from '@/lib/types';
import { BRANCH_COLOR_MAP } from '@/lib/constants';
import { formatDateEnglish } from '@/lib/soldiers';
import styles from './SoldierPanel.module.css';

interface SoldierPanelProps {
  soldiers: Soldier[];
  selectedSoldier: Soldier | null;
  onSoldierSelect: (s: Soldier) => void;
}

export const SoldierPanel = ({
  soldiers,
  selectedSoldier,
  onSoldierSelect,
}: SoldierPanelProps) => {
  const selectedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedSoldier]);

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Fallen Soldiers</div>
        <div className={styles.count}>{soldiers.length.toLocaleString()}</div>
      </div>

      <div className={styles.list}>
        {soldiers.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyHe}>אין חיילים בטווח זה</div>
            <div className={styles.emptyEn}>No soldiers in this time range</div>
          </div>
        )}
        {soldiers.map((soldier) => {
          const isSelected = selectedSoldier?.id === soldier.id;
          const branchColor = BRANCH_COLOR_MAP[soldier.unit_branch];
          return (
            <div
              key={soldier.id}
              ref={isSelected ? selectedRef : null}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              style={{ '--branch-color': branchColor } as React.CSSProperties}
              onClick={() => onSoldierSelect(soldier)}
            >
              <div className={styles.nameHe}>{soldier.name_he}</div>
              <div className={styles.nameEn}>{soldier.name_en}</div>
              <div className={styles.meta}>
                <span className={styles.rank}>{soldier.rank_en}</span>
                <span className={styles.sep}>·</span>
                <span className={styles.unit}>{soldier.unit}</span>
              </div>
              <div className={styles.dateRow}>
                <span className={styles.date}>
                  {formatDateEnglish(soldier.date_of_fall)}
                </span>
                <span className={styles.location}>
                  📍 {soldier.location_name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
