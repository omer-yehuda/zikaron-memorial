'use client';

import type { Soldier } from '@/lib/types';
import { BRANCH_COLOR_MAP } from '@/lib/constants';
import { formatDateEnglish, getLocationDisplay } from '@/lib/soldiers';
import { Box, Text } from '@/components/ui/primitives';

interface SoldierCardProps {
  soldier: Soldier;
  isSelected: boolean;
  onSelect: (s: Soldier) => void;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const baseCard =
  'relative overflow-hidden bg-bg/50 border border-electric/20 rounded-lg px-3 py-3 cursor-pointer transition-all duration-150 flex gap-3 items-start animate-fade-in-fast hover:border-electric/40 hover:bg-bg-card/80';

const activeCard =
  'relative overflow-hidden bg-gold/[0.06] border border-gold/60 rounded-lg px-3 py-3 cursor-pointer transition-all duration-150 flex gap-3 items-start animate-fade-in-fast shadow-[0_0_14px_rgba(244,162,97,0.12)]';

export const SoldierCard = ({
  soldier,
  isSelected,
  onSelect,
  cardRef,
}: SoldierCardProps) => {
  const branchColor = BRANCH_COLOR_MAP[soldier.unit_branch] ?? '#00b4d8';
  const accentColor = isSelected ? '#f4a261' : branchColor;

  return (
    <Box
      ref={cardRef ?? null}
      className={isSelected ? activeCard : baseCard}
      onClick={() => onSelect(soldier)}
    >
      {/* branch accent bar */}
      <Box
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l"
        style={{ background: accentColor }}
      />

      {/* avatar */}
      <Box
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border"
        style={{ background: `${accentColor}18`, borderColor: `${accentColor}45` }}
      >
        <Text
          className="font-he text-[16px] font-bold leading-none"
          style={{ color: accentColor }}
        >
          {soldier.name_he[0]}
        </Text>
      </Box>

      {/* content */}
      <Box className="flex-1 flex flex-col gap-1 min-w-0">
        <Text className="block font-he text-[16px] font-bold text-hebrew [direction:rtl] leading-[1.2]">
          {soldier.name_he}
        </Text>
        <Text className="block text-[12px] text-text/80 font-medium leading-none truncate">
          {soldier.name_en}
        </Text>

        <Box className="flex items-center gap-1 flex-wrap">
          {soldier.rank_en && (
            <Text className="font-mono text-[10px] text-electric uppercase tracking-[0.04em]">
              {soldier.rank_en}
            </Text>
          )}
          {soldier.rank_en && (
            <Text className="text-[10px] text-electric/30">·</Text>
          )}
          <Text className="text-[10px] text-muted truncate">{soldier.unit}</Text>
        </Box>

        <Box className="flex justify-between items-center gap-1">
          <Text className="font-mono text-[10px] text-muted">
            {formatDateEnglish(soldier.date_of_fall)}
          </Text>
          <Text className="text-[10px] text-muted/70 truncate max-w-[110px]">
            {getLocationDisplay(soldier)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
