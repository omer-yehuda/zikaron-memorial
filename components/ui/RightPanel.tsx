'use client';

import type { SoldierStats, UnitBranch } from '@/lib/types';
import { BRANCHES } from '@/lib/constants';
import { Box, Text, Label, Inp } from './primitives';
import { cn } from '@/lib/cn';

interface RightPanelProps {
  stats: SoldierStats;
  branchFilters: Set<UnitBranch>;
  onBranchToggle: (b: UnitBranch) => void;
}

const SectionTitle = ({ children }: { children: string }) => (
  <Text className="block font-mono text-[9px] text-electric tracking-[0.2em] uppercase mb-2">
    {children}
  </Text>
);

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
      <Box className="border border-electric/20 rounded-md p-2.5 bg-bg/40">
        <Box className="text-center py-1">
          <Text className="block font-mono text-[36px] font-bold text-danger leading-none [text-shadow:0_0_16px_rgba(230,57,70,0.5)]">
            {stats.daysSinceStart}
          </Text>
          <Text className="block font-mono text-[9px] text-muted tracking-[0.15em] mt-0.5">
            DAYS SINCE OCT 7
          </Text>
        </Box>
      </Box>

      <Box className="border border-electric/20 rounded-md p-2.5 bg-bg/40">
        <SectionTitle>Statistics</SectionTitle>
        {(
          [
            ['Total Fallen', stats.total, 'text-[16px] text-gold'],
            ['Cities', stats.citiesCount, 'text-[13px] text-text'],
            ['Units', stats.unitsCount, 'text-[13px] text-text'],
          ] as const
        ).map(([label, val, cls]) => (
          <Box key={label} className="flex justify-between items-baseline mb-1.5">
            <Text className="text-[11px] text-muted">{label}</Text>
            <Text className={cn('font-mono font-bold', cls)}>
              {val.toLocaleString()}
            </Text>
          </Box>
        ))}
      </Box>

      <Box className="border border-electric/20 rounded-md p-2.5 bg-bg/40">
        <SectionTitle>Branch Filter</SectionTitle>
        <Box className="flex flex-col gap-1.5">
          {BRANCHES.map((branch) => {
            const active = branchFilters.has(branch.id);
            const count = stats.byBranch[branch.id] ?? 0;
            const pct = Math.round((count / maxBranch) * 100);
            return (
              <Label
                key={branch.id}
                className={cn(
                  'flex items-center gap-2 cursor-pointer p-1 rounded transition-colors duration-150',
                  !active && 'hover:bg-white/[0.04]'
                )}
              >
                <Inp
                  type="checkbox"
                  className="hidden"
                  checked={active}
                  onChange={() => onBranchToggle(branch.id)}
                />
                <Box
                  className="w-2 h-2 rounded-full shrink-0 transition-colors duration-150"
                  style={{
                    background: active
                      ? branch.color
                      : 'rgba(168,178,193,0.3)',
                  }}
                />
                <Text
                  className={cn(
                    'text-[12px] flex-1 select-none',
                    active ? 'text-text' : 'text-muted'
                  )}
                >
                  {branch.label_en}
                </Text>
                <Text
                  className={cn(
                    'font-mono text-[11px]',
                    active ? 'text-text' : 'text-muted'
                  )}
                >
                  {count}
                </Text>
                <Box
                  className="h-1 rounded-sm transition-all duration-300 mt-0.5"
                  style={{
                    width: `${pct}%`,
                    background: active
                      ? branch.color
                      : 'rgba(168,178,193,0.2)',
                    minWidth: count > 0 ? '4px' : '0',
                  }}
                />
              </Label>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
