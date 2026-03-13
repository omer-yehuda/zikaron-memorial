'use client';

import { useEffect, useRef, useState } from 'react';
import type { Soldier, SoldierStats, UnitBranch } from '@/lib/types';
import { BRANCHES } from '@/lib/constants';
import { SoldierCard } from './SoldierCard';

interface SoldierPanelProps {
  soldiers: Soldier[];
  selectedSoldier: Soldier | null;
  onSoldierSelect: (s: Soldier) => void;
  stats: SoldierStats;
  branchFilters: Set<UnitBranch>;
  onBranchToggle: (b: UnitBranch) => void;
}

const TABS = ['OPERATIONAL MEMORIAL', 'LIVE DATA FEED'] as const;
type Tab = (typeof TABS)[number];

export const SoldierPanel = ({
  soldiers,
  selectedSoldier,
  onSoldierSelect,
  stats,
  branchFilters,
  onBranchToggle,
}: SoldierPanelProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('OPERATIONAL MEMORIAL');
  const selectedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedSoldier?.id]);

  return (
    <aside className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-cyan-400/30 flex flex-col overflow-hidden shrink-0">

      {/* Tab navigation */}
      <div className="flex border-b border-cyan-400/30 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2 py-2.5 text-[10px] font-medium tracking-wide transition-colors font-heebo ${
              activeTab === tab
                ? 'bg-cyan-400/20 text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OPERATIONAL MEMORIAL tab */}
      {activeTab === 'OPERATIONAL MEMORIAL' && (
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase">
              Fallen Soldiers
            </span>
            <span className="font-mono text-sm font-bold text-orange-400">
              {soldiers.length.toLocaleString()}
            </span>
          </div>

          {soldiers.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 py-12 text-center">
              <span className="font-he text-lg text-gray-500">אין חיילים בטווח זה</span>
              <span className="text-xs text-gray-600 font-heebo">No soldiers in this time range</span>
            </div>
          ) : (
            soldiers.map((soldier) => (
              <SoldierCard
                key={soldier.id}
                soldier={soldier}
                isSelected={selectedSoldier?.id === soldier.id}
                onSelect={onSoldierSelect}
                cardRef={selectedSoldier?.id === soldier.id ? selectedRef : undefined}
              />
            ))
          )}
        </div>
      )}

      {/* LIVE DATA FEED tab */}
      {activeTab === 'LIVE DATA FEED' && (
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 font-heebo">

          {/* Days counter */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-center">
            <div className="font-mono text-4xl font-bold text-red-400 leading-none">
              {stats.daysSinceStart}
            </div>
            <div className="text-[10px] text-red-400/60 font-mono tracking-widest mt-1.5 uppercase">
              Days Since Oct 7
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-800/40 border border-cyan-400/20 rounded-lg p-3">
            <div className="text-[9px] font-mono text-cyan-400/70 tracking-[0.22em] uppercase mb-3">
              Statistics
            </div>
            <div className="space-y-2">
              {[
                { label: 'Total Fallen', value: stats.total, cls: 'text-orange-400 text-lg font-bold' },
                { label: 'Cities', value: stats.citiesCount, cls: 'text-white text-sm font-bold' },
                { label: 'Units', value: stats.unitsCount, cls: 'text-white text-sm font-bold' },
              ].map(({ label, value, cls }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">{label}</span>
                  <span className={`font-mono ${cls}`}>{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Branch filters */}
          <div className="bg-gray-800/40 border border-cyan-400/20 rounded-lg p-3 flex-1">
            <div className="text-[9px] font-mono text-cyan-400/70 tracking-[0.22em] uppercase mb-3">
              Branch Filter
            </div>
            <div className="space-y-1.5">
              {BRANCHES.map((branch) => {
                const active = branchFilters.has(branch.id);
                const count = stats.byBranch[branch.id] ?? 0;
                const pct = Math.round((count / Math.max(...Object.values(stats.byBranch), 1)) * 100);
                return (
                  <label
                    key={branch.id}
                    className={`flex flex-col gap-1.5 p-2 rounded-md border cursor-pointer transition-all ${
                      active ? 'border-white/10 bg-white/5' : 'border-transparent hover:bg-white/3'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={active}
                        onChange={() => onBranchToggle(branch.id)}
                      />
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
                        style={{
                          background: active ? branch.color : 'rgba(107,114,128,0.4)',
                          boxShadow: active ? `0 0 6px ${branch.color}80` : 'none',
                        }}
                      />
                      <span className={`text-[12px] flex-1 select-none ${active ? 'text-white' : 'text-gray-400'}`}>
                        {branch.label_en}
                      </span>
                      <span className={`font-mono text-[11px] font-bold ${active ? 'text-white' : 'text-gray-600'}`}>
                        {count}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: active ? branch.color : 'rgba(107,114,128,0.2)',
                        }}
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
