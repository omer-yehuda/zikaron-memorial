'use client';

import type { Soldier } from '@/lib/types';
import { formatDateEnglish } from '@/lib/soldiers';

interface SoldierCardProps {
  soldier: Soldier;
  isSelected: boolean;
  onSelect: (s: Soldier) => void;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export const SoldierCard = ({ soldier, isSelected, onSelect, cardRef }: SoldierCardProps) => {
  const [month, year] = formatDateEnglish(soldier.date_of_fall).split(' ').reduce<[string, string]>(
    (acc, part, i) => { if (i === 0) acc[0] = part.toUpperCase().slice(0, 3); else acc[1] = part; return acc; },
    ['', '']
  );

  return (
    <div
      ref={cardRef ?? null}
      onClick={() => onSelect(soldier)}
      className={`timeline-item rounded-lg p-3 border cursor-pointer transition-all duration-200 font-heebo ${
        isSelected
          ? 'bg-cyan-400/10 border-cyan-400/60 shadow-[0_0_12px_rgba(0,255,255,0.15)]'
          : 'bg-gray-800/50 border-gray-700/50 hover:border-cyan-400/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Date column */}
        <div className="text-[11px] font-bold w-12 shrink-0 font-mono text-cyan-400 leading-tight">
          {month}<br />{year}
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/30 shrink-0 bg-gray-700 flex items-center justify-center">
          {soldier.photo_url ? (
            <img src={soldier.photo_url} alt={soldier.name_en} className="w-full h-full object-cover" />
          ) : (
            <span className="text-cyan-400 font-bold text-sm font-he">
              {soldier.name_he[0]}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate font-he">{soldier.name_he}</div>
          <div className="text-[11px] text-gray-400 truncate">{soldier.name_en}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-tight truncate">
            {soldier.rank_en} · {soldier.unit}
          </div>
        </div>

        {/* Status dot */}
        <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-cyan-400 glow' : 'bg-orange-400 glow-orange'}`} />
      </div>
    </div>
  );
};
