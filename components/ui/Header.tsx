'use client';

import { Star, Search } from 'lucide-react';

interface HeaderProps {
  totalFallen: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({ totalFallen, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="relative h-20 bg-gray-900/80 backdrop-blur-sm border-b border-cyan-400/30 flex items-center justify-between px-6">
      {/* Corner decorations */}
      <span className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50 pointer-events-none" />
      <span className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50 pointer-events-none" />
      <span className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50 pointer-events-none" />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50 pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-4 z-10">
        <div className="w-11 h-11 border-2 border-cyan-400 flex items-center justify-center bg-black/40">
          <Star className="w-5 h-5 text-cyan-400 fill-current" />
        </div>
        <div>
          <div className="text-white text-xl font-bold leading-tight">זיכרון</div>
          <div className="text-xs text-cyan-400 font-mono tracking-widest">לזכר חללי צה״ל</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative z-10">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
        <input
          type="text"
          placeholder="חפש חיילים..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-gray-800/60 border border-cyan-400/30 text-white placeholder-gray-500 text-sm rounded px-4 pr-10 py-2 w-64 focus:outline-none focus:border-cyan-400/70 font-heebo"
          dir="rtl"
        />
      </div>

      {/* Fallen counter */}
      <div className="z-10 text-right">
        <div className="text-3xl font-bold text-orange-400 font-mono tabular-nums">
          {totalFallen.toLocaleString()}
        </div>
        <div className="text-xs text-gray-400 tracking-widest">FALLEN SOLDIERS</div>
      </div>
    </header>
  );
}
