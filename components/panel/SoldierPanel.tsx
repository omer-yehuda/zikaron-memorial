'use client';

import { useEffect, useRef } from 'react';
import type { Soldier } from '@/lib/types';
import { BRANCH_COLOR_MAP } from '@/lib/constants';
import { formatDateEnglish, getLocationDisplay } from '@/lib/soldiers';
import { Box, Text } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

interface SoldierPanelProps {
  soldiers: Soldier[];
  selectedSoldier: Soldier | null;
  onSoldierSelect: (s: Soldier) => void;
}

export const SoldierPanel = ({
  soldiers,
  selectedSoldier,
  onSoldierSelect,
}: SoldierPanelProps) => {
  const selectedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedSoldier?.id]);

  return (
    <Box
      as="aside"
      className="w-[320px] bg-glass backdrop-blur-[12px] border-r border-electric/20 flex flex-col overflow-hidden shrink-0"
    >
      <Box className="px-3 py-2.5 border-b border-electric/20 shrink-0">
        <Text className="block font-mono text-[9px] text-electric tracking-[0.2em] uppercase">
          Fallen Soldiers
        </Text>
        <Text className="block font-mono text-[20px] font-bold text-gold leading-[1.1]">
          {soldiers.length.toLocaleString()}
        </Text>
      </Box>

      <Box className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-1">
        {soldiers.length === 0 && (
          <Box className="flex flex-col items-center justify-center flex-1 gap-2 p-6 text-center">
            <Text className="block font-he text-[18px] text-muted [direction:rtl]">
              אין חיילים בטווח זה
            </Text>
            <Text className="block text-[12px] text-muted/60">
              No soldiers in this time range
            </Text>
          </Box>
        )}

        {soldiers.map((soldier) => {
          const isSelected = selectedSoldier?.id === soldier.id;
          const branchColor = BRANCH_COLOR_MAP[soldier.unit_branch];
          return (
            <Box
              key={soldier.id}
              ref={isSelected ? selectedRef : null}
              className={cn(
                'relative overflow-hidden bg-bg/50 border border-electric/20 rounded-md px-3.5 py-3 cursor-pointer transition-all duration-150 flex flex-col gap-1 animate-fade-in-fast',
                'hover:border-electric/40 hover:bg-bg-card/80',
                isSelected &&
                  'border-gold/60 bg-gold/[0.06] shadow-[0_0_12px_rgba(244,162,97,0.15)]'
              )}
              onClick={() => onSoldierSelect(soldier)}
            >
              {/* Branch accent bar */}
              <Box
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l"
                style={{
                  background: isSelected
                    ? '#f4a261'
                    : (branchColor ?? 'rgba(0,180,216,0.2)'),
                }}
              />
              <Text className="block font-he text-[17px] font-bold text-hebrew [direction:rtl] leading-[1.3]">
                {soldier.name_he}
              </Text>
              <Text className="block text-[13px] text-text font-medium">
                {soldier.name_en}
              </Text>
              <Box className="flex items-center gap-1 mt-0.5 flex-wrap">
                <Text className="font-mono text-[11px] text-electric uppercase tracking-[0.05em]">
                  {soldier.rank_en}
                </Text>
                {soldier.rank_en && (
                  <Text className="text-[11px] text-electric/20">·</Text>
                )}
                <Text className="text-[11px] text-muted truncate">
                  {soldier.unit}
                </Text>
              </Box>
              <Box className="flex justify-between items-center flex-wrap gap-1 mt-1">
                <Text className="font-mono text-[11px] text-muted">
                  {formatDateEnglish(soldier.date_of_fall)}
                </Text>
                <Text className="text-[11px] text-muted truncate max-w-[130px]">
                  {getLocationDisplay(soldier)}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
