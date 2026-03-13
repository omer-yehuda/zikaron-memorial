'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Soldier } from '@/lib/types';
import Header from './ui/Header';
import SoldierPanel from './panel/SoldierPanel';
import MapView from './map/MapView';
import TimelineBar from './timeline/TimelineBar';
import SoldierDetail from './panel/SoldierDetail';
import { OPERATION_START } from '@/lib/constants';

interface MapAppProps {
  initialSoldiers: Soldier[];
}

export default function MapApp({ initialSoldiers }: MapAppProps) {
  const [soldiers] = useState<Soldier[]>(initialSoldiers);
  const [selected, setSelected] = useState<Soldier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(() => {
    const last = [...initialSoldiers].sort((a, b) =>
      b.date_of_death.localeCompare(a.date_of_death)
    )[0]?.date_of_death;
    return last ?? new Date().toISOString().slice(0, 10);
  });

  const minDate = OPERATION_START;
  const maxDate = useMemo(() => {
    const dates = soldiers.map((s) => s.date_of_death).sort();
    return dates[dates.length - 1] ?? new Date().toISOString().slice(0, 10);
  }, [soldiers]);

  // Filter soldiers by date and search
  const visible = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return soldiers.filter((s) => {
      if (s.date_of_death > currentDate) return false;
      if (q && !s.name_he.includes(q) && !s.name_en.toLowerCase().includes(q) && !s.unit_en.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [soldiers, currentDate, searchQuery]);

  const handleSelect = useCallback((s: Soldier) => setSelected(s), []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden relative">
      {/* HUD corner brackets */}
      <span className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-cyan-400/20 pointer-events-none z-20" />
      <span className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 border-cyan-400/20 pointer-events-none z-20" />
      <span className="absolute bottom-0 left-0 w-10 h-10 border-l-2 border-b-2 border-cyan-400/20 pointer-events-none z-20" />
      <span className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-cyan-400/20 pointer-events-none z-20" />

      <Header
        totalFallen={visible.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex flex-1 overflow-hidden">
        <SoldierPanel soldiers={visible} selected={selected} onSelect={handleSelect} />

        <div className="flex-1 relative">
          <MapView soldiers={visible} selected={selected} onSelect={handleSelect} />
          {selected && <SoldierDetail soldier={selected} onClose={handleClose} />}
        </div>
      </main>

      <TimelineBar
        minDate={minDate}
        maxDate={maxDate}
        currentDate={currentDate}
        onChange={setCurrentDate}
      />
    </div>
  );
}
