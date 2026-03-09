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
    className="h-[60px] bg-bg-card border-b border-electric/20 flex items-center px-4 gap-4 relative z-[100] shrink-0"
  >
    {/* gradient line */}
    <Box className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric to-transparent opacity-60 pointer-events-none" />

    <Box className="flex items-center gap-2.5 shrink-0">
      <Box className="flex items-center [filter:drop-shadow(0_0_6px_rgba(255,215,0,0.6))]">
        <StarOfDavid size={28} color="#ffd700" />
      </Box>
      <Box className="flex flex-col leading-none">
        <Text className="font-he text-[22px] font-black text-hebrew [text-shadow:0_0_12px_rgba(255,215,0,0.4)]">
          זיכרון
        </Text>
        <Text className="font-mono text-[9px] text-electric tracking-[0.2em] mt-px">
          ZIKARON · MEMORIAL
        </Text>
      </Box>
    </Box>

    <Box className="flex-1 max-w-[400px] mx-auto relative">
      <Box
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted flex items-center pointer-events-none"
        aria-hidden="true"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
          <line
            x1="8.5"
            y1="8.5"
            x2="12"
            y2="12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Box>
      <Inp
        type="text"
        className="w-full bg-bg-card/80 border border-electric/20 rounded-md py-[7px] pl-8 pr-3 text-text font-sans text-[13px] outline-none transition-all duration-200 [direction:ltr] focus:border-electric/50 focus:shadow-[0_0_0_2px_rgba(0,180,216,0.1)] placeholder:text-muted"
        placeholder="Search soldiers, units, cities..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search soldiers"
      />
    </Box>

    <Box className="flex flex-col items-end shrink-0">
      <AnimatedCounter
        value={totalFallen}
        className="font-mono text-[22px] font-bold text-gold [text-shadow:0_0_8px_rgba(244,162,97,0.5)] leading-none"
      />
      <Text className="font-he text-[11px] text-muted [direction:rtl] mt-0.5">
        נפלו לאחר אחינו
      </Text>
    </Box>
  </Box>
);
