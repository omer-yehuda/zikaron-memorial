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
import { TimelineBar } from './timeline/TimelineBar';

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
  const [branchFilters, setBranchFilters] = useState<Set<UnitBranch>>(new Set(ALL_BRANCHES));
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<PlaySpeed>(1);

  const upToDate = useMemo(() => getSoldiersUpToDate(selectedDate), [selectedDate]);

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
      if (!p && selectedDate >= TIMELINE_END) setSelectedDate(CONFLICT_START_DATE);
      return !p;
    });
  }, [selectedDate]);

  const handleDateChange = useCallback((dateOrUpdater: Date | ((prev: Date) => Date)) => {
    setSelectedDate((prev) => {
      const next = typeof dateOrUpdater === 'function' ? dateOrUpdater(prev) : dateOrUpdater;
      if (next >= TIMELINE_END) { setIsPlaying(false); return TIMELINE_END; }
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-heebo flex flex-col overflow-hidden">

      {/* Tech corner borders */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-400/20" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-400/20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyan-400/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-400/20" />
      </div>

      <Header
        totalFallen={stats.total}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex flex-1 overflow-hidden min-h-0">
        <SoldierPanel
          soldiers={visibleSoldiers}
          selectedSoldier={selectedSoldier}
          onSoldierSelect={setSelectedSoldier}
          stats={stats}
          branchFilters={branchFilters}
          onBranchToggle={handleBranchToggle}
        />
        <div className="flex-1 relative">
          <div className="absolute top-3 right-4 text-xs text-cyan-400 z-20 font-mono tracking-widest">
            ISRAEL THEATER / DEPLOYED MAPPING
          </div>
          <MapView
            soldiers={visibleSoldiers}
            selectedSoldier={selectedSoldier}
            onSoldierSelect={setSelectedSoldier}
          />
        </div>
      </main>

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
