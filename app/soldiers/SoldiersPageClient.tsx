'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Soldier, UnitBranch } from '@/lib/types';
import { BRANCHES, BRANCH_COLOR_MAP } from '@/lib/constants';
import { StarOfDavid } from '@/components/ui/StarOfDavid';
import { formatDateEnglish, getLocationDisplay } from '@/lib/soldiers';
import { Box, Text, Inp, Btn, Select, Img } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

type SortKey = 'newest' | 'oldest' | 'az';

export const SoldiersPageClient = ({ soldiers }: { soldiers: Soldier[] }) => {
  const [query, setQuery] = useState('');
  const [activeBranches, setActiveBranches] = useState<Set<UnitBranch>>(
    new Set()
  );
  const [sort, setSort] = useState<SortKey>('newest');

  const toggleBranch = (b: UnitBranch) =>
    setActiveBranches((prev) => {
      const n = new Set(prev);
      if (n.has(b)) n.delete(b);
      else n.add(b);
      return n;
    });

  const filtered = useMemo(() => {
    let list = soldiers;
    if (query.trim()) {
      const lower = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name_en.toLowerCase().includes(lower) ||
          s.name_he.includes(query) ||
          s.unit.toLowerCase().includes(lower) ||
          s.city_of_origin.toLowerCase().includes(lower)
      );
    }
    if (activeBranches.size > 0)
      list = list.filter((s) => activeBranches.has(s.unit_branch));

    return [...list].sort((a, b) =>
      sort === 'newest'
        ? new Date(b.date_of_fall).getTime() -
          new Date(a.date_of_fall).getTime()
        : sort === 'oldest'
          ? new Date(a.date_of_fall).getTime() -
            new Date(b.date_of_fall).getTime()
          : a.name_en.localeCompare(b.name_en)
    );
  }, [soldiers, query, activeBranches, sort]);

  return (
    <Box className="min-h-screen bg-bg p-6">
      <Box className="flex items-center gap-4 mb-6 flex-wrap">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-electric no-underline font-mono text-[12px] border border-electric/20 px-3 py-1.5 rounded transition-all duration-150 hover:border-electric hover:bg-electric/[0.08]"
        >
          ← Back to Map
        </Link>
        <Text
          as="h1"
          className="font-he text-[24px] font-bold text-hebrew [direction:rtl]"
        >
          לוחמים שנפלו — Fallen Soldiers
        </Text>
      </Box>

      <Box className="flex gap-3 mb-5 flex-wrap items-center">
        <Inp
          type="text"
          className="bg-bg-card border border-electric/20 rounded-md px-3.5 py-2 text-text text-[13px] outline-none w-[280px] [direction:ltr] focus:border-electric/50 placeholder:text-muted"
          placeholder="Search by name, unit, city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Box className="flex gap-1.5 flex-wrap">
          {BRANCHES.map((b) => (
            <Btn
              key={b.id}
              className={cn(
                'px-3 py-1 rounded-full border font-mono text-[11px] cursor-pointer transition-all duration-150',
                activeBranches.has(b.id)
                  ? 'text-gold border-gold/50 bg-gold/[0.08]'
                  : 'text-muted border-electric/20 bg-transparent hover:border-gold/30'
              )}
              onClick={() => toggleBranch(b.id)}
            >
              {b.label_en}
            </Btn>
          ))}
        </Box>
        <Select
          className="bg-bg-card border border-electric/20 rounded-md px-2.5 py-1.5 text-text text-[12px] outline-none cursor-pointer"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Name A–Z</option>
        </Select>
        <Text className="font-mono text-[11px] text-muted ml-auto">
          {filtered.length} / {soldiers.length}
        </Text>
      </Box>

      <Box className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {filtered.map((soldier) => {
          const color = BRANCH_COLOR_MAP[soldier.unit_branch];
          return (
            <Link
              key={soldier.id}
              href={`/soldiers/${soldier.id}`}
              className="relative overflow-hidden bg-bg-card border border-electric/20 rounded-lg p-4 no-underline flex flex-col gap-1.5 transition-all duration-150 animate-fade-in hover:border-gold/40 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              <Box
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: color }}
              />
              {soldier.photo_url ? (
                <Img
                  src={soldier.photo_url}
                  alt={soldier.name_en}
                  className="w-14 h-14 rounded-full object-cover border border-electric/20 mb-1"
                />
              ) : (
                <Box className="w-14 h-14 rounded-full bg-gold/[0.08] border border-gold/30 flex items-center justify-center mb-1">
                  <StarOfDavid size={28} color={color} />
                </Box>
              )}
              <Text className="block font-he text-[16px] font-bold text-hebrew [direction:rtl] leading-[1.2]">
                {soldier.name_he}
              </Text>
              <Text className="block text-[12px] text-text font-medium">
                {soldier.name_en}
              </Text>
              <Text className="block font-mono text-[10px] text-electric">
                {soldier.rank_en}
              </Text>
              <Text className="block text-[11px] text-muted truncate">
                {soldier.unit}
              </Text>
              <Text className="block font-mono text-[10px] text-muted mt-1">
                {formatDateEnglish(soldier.date_of_fall)}
              </Text>
              <Text className="block text-[10px] text-muted">
                {getLocationDisplay(soldier)}
              </Text>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
};
