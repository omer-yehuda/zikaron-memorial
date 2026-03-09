'use client';

import { StarOfDavid } from './StarOfDavid';
import { AnimatedCounter } from './AnimatedCounter';
import styles from './Header.module.css';

interface HeaderProps {
  totalFallen: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header = ({
  totalFallen,
  searchQuery,
  onSearchChange,
}: HeaderProps) => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <div className={styles.logoIcon}>
        <StarOfDavid size={28} color="#ffd700" />
      </div>
      <div className={styles.logoText}>
        <span className={styles.logoHe}>זיכרון</span>
        <span className={styles.logoEn}>ZIKARON · MEMORIAL</span>
      </div>
    </div>

    <div className={styles.searchWrapper}>
      <span className={styles.searchIcon} aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="8.5" y1="8.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search soldiers, units, cities..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search soldiers"
      />
    </div>

    <div className={styles.counter}>
      <AnimatedCounter
        value={totalFallen}
        className={styles.counterValue}
      />
      <span className={styles.counterLabel}>נפלו לאחר אחינו</span>
    </div>
  </header>
);
