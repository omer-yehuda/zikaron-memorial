'use client';

import type { Soldier } from '@/lib/types';
import { BRANCH_LABELS } from '@/lib/constants';
import SoldierAvatar from '@/components/ui/SoldierAvatar';

interface SoldierPanelProps {
  soldiers: Soldier[];
  selected: Soldier | null;
  onSelect: (s: Soldier) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SoldierPanel({ soldiers, selected, onSelect }: SoldierPanelProps) {
  return (
    <aside className="w-80 flex flex-col bg-gray-900/50 backdrop-blur-sm border-r border-cyan-400/30 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-cyan-400/20 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 tracking-widest">MEMORIAL ROLL</span>
        <span className="text-xs text-gray-500 font-mono">{soldiers.length} RECORDS</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {soldiers.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-sm">אין תוצאות</div>
        )}
        {soldiers.map((soldier) => {
          const branchMeta = BRANCH_LABELS[soldier.branch];
          const isSelected = selected?.id === soldier.id;
          return (
            <button
              key={soldier.id}
              onClick={() => onSelect(soldier)}
              className={`w-full text-right p-3 border-b border-gray-800/50 flex items-center gap-3 transition-all hover:bg-cyan-400/5 hover:border-cyan-400/30 cursor-pointer ${
                isSelected ? 'bg-cyan-400/10 border-l-2 border-l-cyan-400' : ''
              }`}
            >
              <SoldierAvatar soldier={soldier} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{soldier.name_he}</div>
                <div className="text-xs text-gray-400 truncate" dir="rtl">{soldier.rank_he} · {soldier.unit_he}</div>
                <div className="text-xs font-mono mt-0.5 flex items-center gap-2">
                  <span style={{ color: branchMeta?.color }} className="text-[10px] tracking-wide">
                    {branchMeta?.en?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-mono text-cyan-400">{formatDate(soldier.date_of_death)}</div>
                <div className="w-2 h-2 bg-orange-400 rounded-full mx-auto mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
