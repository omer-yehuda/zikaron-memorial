'use client';

import type { SoldierStats, UnitBranch } from '@/lib/types';
import { BRANCHES } from '@/lib/constants';
import { Box, Text, Label, Inp } from './primitives';

interface RightPanelProps {
  stats: SoldierStats;
  branchFilters: Set<UnitBranch>;
  onBranchToggle: (b: UnitBranch) => void;
}

const SectionLabel = ({ children }: { children: string }) => (
  <Text className="block font-mono text-[9px] text-electric/70 tracking-[0.22em] uppercase mb-3">
    {children}
  </Text>
);

const statRows = [
  {
    key: 'total' as const,
    label: 'Total Fallen',
    getValue: (s: SoldierStats) => s.total,
    cls: 'font-mono font-bold text-[18px] text-gold leading-none',
  },
  {
    key: 'cities' as const,
    label: 'Cities',
    getValue: (s: SoldierStats) => s.citiesCount,
    cls: 'font-mono font-bold text-[13px] text-text',
  },
  {
    key: 'units' as const,
    label: 'Units',
    getValue: (s: SoldierStats) => s.unitsCount,
    cls: 'font-mono font-bold text-[13px] text-text',
  },
] as const;

export const RightPanel = ({
  stats,
  branchFilters,
  onBranchToggle,
}: RightPanelProps) => {
  const maxBranch = Math.max(...Object.values(stats.byBranch), 1);

  return (
    <Box
      as="aside"
      className="w-[220px] bg-glass backdrop-blur-[12px] border-l border-electric/20 flex flex-col p-3 gap-3 overflow-y-auto shrink-0"
    >
      {/* Days counter */}
      <Box className="border border-danger/25 rounded-lg p-3 bg-danger/[0.05] text-center">
        <Text className="block font-mono text-[42px] font-bold text-danger leading-none [text-shadow:0_0_24px_rgba(230,57,70,0.35)]">
          {stats.daysSinceStart}
        </Text>
        <Box className="mt-1.5 flex items-center justify-center gap-1.5">
          <Box className="h-px flex-1 bg-danger/20" />
          <Text className="font-mono text-[8px] text-danger/60 tracking-[0.2em] uppercase">
            Days Since Oct 7
          </Text>
          <Box className="h-px flex-1 bg-danger/20" />
        </Box>
      </Box>

      {/* Statistics */}
      <Box className="border border-electric/20 rounded-lg p-3 bg-bg/40">
        <SectionLabel>Statistics</SectionLabel>
        <Box className="flex flex-col gap-2.5">
          {statRows.map(({ key, label, getValue, cls }) => (
            <Box key={key} className="flex justify-between items-center">
              <Text className="text-[11px] text-muted">{label}</Text>
              <Text className={cls}>{getValue(stats).toLocaleString()}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Branch Filter */}
      <Box className="border border-electric/20 rounded-lg p-3 bg-bg/40 flex-1">
        <SectionLabel>Branch Filter</SectionLabel>
        <Box className="flex flex-col gap-1.5">
          {BRANCHES.map((branch) => {
            const active = branchFilters.has(branch.id);
            const count = stats.byBranch[branch.id] ?? 0;
            const pct = Math.round((count / maxBranch) * 100);
            return (
              <Label
                key={branch.id}
                className={
                  active
                    ? 'flex flex-col gap-1.5 cursor-pointer p-2 rounded-md border border-white/[0.07] bg-white/[0.04] transition-all duration-150'
                    : 'flex flex-col gap-1.5 cursor-pointer p-2 rounded-md border border-transparent transition-all duration-150 hover:bg-white/[0.03]'
                }
              >
                <Box className="flex items-center gap-2">
                  <Inp
                    type="checkbox"
                    className="hidden"
                    checked={active}
                    onChange={() => onBranchToggle(branch.id)}
                  />
                  <Box
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-150"
                    style={{
                      background: active ? branch.color : 'rgba(168,178,193,0.25)',
                      boxShadow: active ? `0 0 6px ${branch.color}80` : 'none',
                    }}
                  />
                  <Text className={active ? 'text-[12px] flex-1 select-none text-text' : 'text-[12px] flex-1 select-none text-muted'}>
                    {branch.label_en}
                  </Text>
                  <Text className={active ? 'font-mono text-[11px] font-bold text-text' : 'font-mono text-[11px] text-muted/50'}>
                    {count}
                  </Text>
                </Box>

                {/* progress bar */}
                <Box className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <Box
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: active ? branch.color : 'rgba(168,178,193,0.12)',
                      minWidth: count > 0 ? '6px' : '0',
                    }}
                  />
                </Box>
              </Label>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
