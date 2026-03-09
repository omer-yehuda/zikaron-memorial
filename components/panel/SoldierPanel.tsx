'use client';

import { useEffect, useRef } from 'react';
import type { Soldier } from '@/lib/types';
import { Box, Text } from '@/components/ui/primitives';
import { SoldierCard } from './SoldierCard';

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

        {soldiers.map((soldier) => (
          <SoldierCard
            key={soldier.id}
            soldier={soldier}
            isSelected={selectedSoldier?.id === soldier.id}
            onSelect={onSoldierSelect}
            cardRef={selectedSoldier?.id === soldier.id ? selectedRef : undefined}
          />
        ))}
      </Box>
    </Box>
  );
};
