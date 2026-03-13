'use client';

import dynamic from 'next/dynamic';
import type { Soldier } from '@/lib/types';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

interface MapViewProps {
  soldiers: Soldier[];
  selected: Soldier | null;
  onSelect: (s: Soldier) => void;
}

export default function MapView({ soldiers, selected, onSelect }: MapViewProps) {
  return (
    <div className="relative w-full h-full">
      {/* HUD Frame */}
      <span className="absolute top-3 left-3 z-10 text-xs text-cyan-400 font-mono bg-black/60 px-2 py-1 pointer-events-none">
        ISRAEL THEATER / MEMORIAL ARCHIVE
      </span>
      <span className="absolute top-3 right-3 z-10 text-xs text-cyan-400 font-mono bg-black/60 px-2 py-1 pointer-events-none">
        32°N 35°E
      </span>
      <span className="absolute bottom-3 right-3 z-10 text-xs text-gray-400 font-mono bg-black/70 px-2 py-1 pointer-events-none">
        SCALE · STATUS: ACTIVE
      </span>

      {/* Corner brackets */}
      <span className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/40 pointer-events-none z-10" />
      <span className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400/40 pointer-events-none z-10" />
      <span className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400/40 pointer-events-none z-10" />
      <span className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400/40 pointer-events-none z-10" />

      <LeafletMap soldiers={soldiers} selected={selected} onSelect={onSelect} />
    </div>
  );
}
