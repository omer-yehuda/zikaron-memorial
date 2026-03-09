'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Soldier, UnitBranch } from '@/lib/types';
import { CONFLICT_START_DATE, TIMELINE_END } from '@/lib/constants';
import {
  getAllSoldiers,
  getSoldiersUpToDate,
  searchSoldiers,
  filterByBranch,
  getStats,
} from '@/lib/soldiers';
import { Header } from './ui/Header';
import { SoldierPanel } from './panel/SoldierPanel';
import { RightPanel } from './ui/RightPanel';
import { TimelineBar } from './timeline/TimelineBar';
import styles from './MapApp.module.css';

const MapView = dynamic(
  () => import('./map/MapView').then((m) => ({ default: m.MapView })),
  { ssr: false }
);

const ALL_BRANCHES: UnitBranch[] = ['ground', 'air', 'navy', 'special'];
type PlaySpeed = 1 | 5 | 10;

const allSoldiers = getAllSoldiers();

export default function MapApp() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilters, setBranchFilters] = useState<Set<UnitBranch>>(
    new Set(ALL_BRANCHES)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<PlaySpeed>(1);

  const upToDate = useMemo(
    () => getSoldiersUpToDate(selectedDate),
    [selectedDate]
  );

  const searched = useMemo(
    () => (searchQuery ? searchSoldiers(searchQuery) : upToDate),
    [searchQuery, upToDate]
  );

  const visibleSoldiers = useMemo(
    () => filterByBranch(searched, Array.from(branchFilters)),
    [searched, branchFilters]
  );

  const stats = useMemo(() => getStats(visibleSoldiers), [visibleSoldiers]);

  const handleBranchToggle = useCallback((branch: UnitBranch) => {
    setBranchFilters((prev) => {
      const next = new Set(prev);
      if (next.has(branch)) next.delete(branch);
      else next.add(branch);
      return next;
    });
  }, []);

  const handlePlayToggle = useCallback(() => {
    setIsPlaying((p) => {
      if (!p && selectedDate >= TIMELINE_END) {
        setSelectedDate(CONFLICT_START_DATE);
      }
      return !p;
    });
  }, [selectedDate]);

  const handleDateChange = useCallback((dateOrUpdater: Date | ((prev: Date) => Date)) => {
    setSelectedDate((prev) => {
      const next = typeof dateOrUpdater === 'function' ? dateOrUpdater(prev) : dateOrUpdater;
      if (next >= TIMELINE_END) {
        setIsPlaying(false);
        return TIMELINE_END;
      }
      return next;
    });
  }, []);

  return (
    <div className={styles.app}>
      <Header
        totalFallen={stats.total}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className={styles.mainRow}>
        <SoldierPanel
          soldiers={visibleSoldiers}
          selectedSoldier={selectedSoldier}
          onSoldierSelect={setSelectedSoldier}
        />
        <MapView
          soldiers={visibleSoldiers}
          selectedSoldier={selectedSoldier}
          onSoldierSelect={setSelectedSoldier}
        />
        <RightPanel
          stats={stats}
          branchFilters={branchFilters}
          onBranchToggle={handleBranchToggle}
        />
      </div>
      <TimelineBar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        soldiers={allSoldiers}
        visibleCount={visibleSoldiers.length}
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
        playSpeed={playSpeed}
        onSpeedChange={setPlaySpeed}
      />
    </div>
  );
}
