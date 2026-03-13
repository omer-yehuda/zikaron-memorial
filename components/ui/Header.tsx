'use client';

import { Star } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface HeaderProps {
  totalFallen: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header = ({ totalFallen, searchQuery, onSearchChange }: HeaderProps) => (
  <header className="h-20 bg-gray-900/80 backdrop-blur-sm border-b border-cyan-400/30 flex items-center justify-center relative shrink-0 z-[100]">

    {/* Left: Hebrew logo */}
    <div className="absolute left-8 flex items-center gap-3">
      <div className="text-orange-400 text-2xl font-bold font-he">זיכרון</div>
      <div className="text-xs text-gray-400 font-heebo">לזכר חללי צה״ל</div>
    </div>

    {/* Center: Star + title */}
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 border-2 border-cyan-400 flex items-center justify-center glow">
        <Star className="w-6 h-6 text-cyan-400 fill-current" />
      </div>
      <div className="text-center">
        <div className="text-white text-2xl font-bold font-he">זיכרון</div>
        <div className="text-xs text-cyan-400 font-heebo">לזכר חללי צה״ל ישראל</div>
      </div>
    </div>

    {/* Right: search + counter */}
    <div className="absolute right-8 flex items-center gap-4">
      <input
        type="text"
        placeholder="Search soldier…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-gray-800/80 border border-cyan-400/30 text-white text-xs px-3 py-1.5 rounded outline-none focus:border-cyan-400/60 placeholder:text-gray-500 w-40 font-heebo"
      />
      <div className="text-right">
        <AnimatedCounter
          value={totalFallen}
          className="font-mono text-xl font-bold text-orange-400 leading-none tabular-nums"
        />
        <div className="text-[9px] text-gray-400 font-he mt-0.5">נפלו לאחר אחינו</div>
      </div>
    </div>

    {/* Corner decorations */}
    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50" />
    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50" />
    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/30" />
    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/30" />
  </header>
);
