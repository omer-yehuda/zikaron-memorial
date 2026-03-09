'use client';

import { StarOfDavid } from './StarOfDavid';
import { AnimatedCounter } from './AnimatedCounter';
import { Box, Text, Inp } from './primitives';

interface HeaderProps {
  totalFallen: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header = ({
  totalFallen,
  searchQuery,
  onSearchChange,
}: HeaderProps) => (
  <Box
    as="header"
    className="h-[60px] bg-bg-card border-b border-electric/15 flex items-center px-5 gap-5 relative z-[100] shrink-0"
  >
    {/* bottom gradient accent */}
    <Box className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric/50 to-transparent pointer-events-none" />

    {/* logo */}
    <Box className="flex items-center gap-3 shrink-0">
      <Box className="[filter:drop-shadow(0_0_8px_rgba(255,215,0,0.5))]">
        <StarOfDavid size={26} color="#ffd700" />
      </Box>
      <Box className="flex flex-col leading-none gap-0.5">
        <Text className="font-he text-[21px] font-black text-hebrew [text-shadow:0_0_14px_rgba(255,215,0,0.35)]">
          זיכרון
        </Text>
        <Text className="font-mono text-[8px] text-electric/70 tracking-[0.25em]">
          ZIKARON · MEMORIAL
        </Text>
      </Box>
    </Box>

    {/* divider */}
    <Box className="w-px h-7 bg-electric/15 shrink-0" />

    {/* search */}
    <Box className="flex-1 max-w-[420px] mx-auto relative">
      <Box
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        aria-hidden="true"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="8.5" y1="8.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </Box>
      <Inp
        type="text"
        className="w-full bg-bg/60 border border-electric/20 rounded-lg py-[7px] pl-8.5 pr-12 text-text text-[13px] outline-none transition-all duration-200 [direction:ltr] focus:border-electric/50 focus:bg-bg/80 focus:shadow-[0_0_0_2px_rgba(0,180,216,0.08)] placeholder:text-muted/60"
        placeholder="Search name, unit, city…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search soldiers"
      />
      <Box className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Text className="font-mono text-[9px] text-muted/40 border border-muted/20 rounded px-1 py-0.5">
          /
        </Text>
      </Box>
    </Box>

    {/* divider */}
    <Box className="w-px h-7 bg-electric/15 shrink-0" />

    {/* fallen counter */}
    <Box className="flex flex-col items-end shrink-0">
      <AnimatedCounter
        value={totalFallen}
        className="font-mono text-[22px] font-bold text-gold [text-shadow:0_0_10px_rgba(244,162,97,0.45)] leading-none tabular-nums"
      />
      <Text className="font-he text-[10px] text-muted/80 [direction:rtl] mt-0.5">
        נפלו לאחר אחינו
      </Text>
    </Box>
  </Box>
);
