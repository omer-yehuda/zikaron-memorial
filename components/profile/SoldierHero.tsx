import type { Soldier } from '@/lib/types';
import { BRANCH_COLOR_MAP } from '@/lib/constants';
import { StarOfDavid } from '@/components/ui/StarOfDavid';
import { formatDateEnglish } from '@/lib/soldiers';
import styles from './SoldierHero.module.css';

interface SoldierHeroProps {
  soldier: Soldier;
}

export const SoldierHero = ({ soldier }: SoldierHeroProps) => {
  const branchColor = BRANCH_COLOR_MAP[soldier.unit_branch];

  return (
    <div className={styles.hero}>
      <div className={styles.photoWrapper}>
        {soldier.photo_url ? (
          <img
            src={soldier.photo_url}
            alt={soldier.name_en}
            className={styles.photo}
          />
        ) : (
          <div className={styles.photoPlaceholder}>
            <StarOfDavid size={56} color="#f4a261" />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.nameHe}>{soldier.name_he}</div>
        <div className={styles.nameEn}>{soldier.name_en}</div>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeRank}`}>
            {soldier.rank_en}
          </span>
          <span className={`${styles.badge} ${styles.badgeUnit}`}>
            {soldier.unit}
          </span>
          <span
            className={`${styles.badge} ${styles.badgeBranch}`}
            style={{
              borderColor: `${branchColor}60`,
              color: branchColor,
              background: `${branchColor}12`,
            }}
          >
            {soldier.unit_branch}
          </span>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Born</span>
            <span className={styles.detailValue}>
              {formatDateEnglish(soldier.date_of_birth)}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Fell</span>
            <span className={styles.detailValue}>
              {formatDateEnglish(soldier.date_of_fall)} · Age {soldier.age_at_fall}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>{soldier.location_name}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>City of Origin</span>
            <span className={styles.detailValue}>{soldier.city_of_origin}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>War</span>
            <span className={styles.detailValue}>{soldier.conflict}</span>
          </div>
        </div>

        <div className={styles.ornament}>
          <div className={styles.ornamentLine} />
          <span>הנצחה לעולם ועד</span>
        </div>
      </div>
    </div>
  );
};
