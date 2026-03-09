'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Soldier, UnitBranch } from '@/lib/types';
import { BRANCHES, BRANCH_COLOR_MAP } from '@/lib/constants';
import { StarOfDavid } from '@/components/ui/StarOfDavid';
import { formatDateEnglish, getLocationDisplay } from '@/lib/soldiers';
import { Box, Text, Inp, Btn, Select, Img } from '@/components/ui/primitives';

type SortKey = 'newest' | 'oldest' | 'az';

const activeBranchBtn =
  'px-3 py-1 rounded-full border font-mono text-[11px] cursor-pointer transition-all duration-150 text-gold border-gold/50 bg-gold/[0.08]';
const inactiveBranchBtn =
  'px-3 py-1 rounded-full border font-mono text-[11px] cursor-pointer transition-all duration-150 text-muted border-electric/20 bg-transparent hover:border-gold/30 hover:text-gold/70';

export const SoldiersPageClient = ({ soldiers }: { soldiers: Soldier[] }) => {
  const [query, setQuery] = useState('');
  const [activeBranches, setActiveBranches] = useState<Set<UnitBranch>>(new Set());
  const [sort, setSort] = useState<SortKey>('newest');

  const toggleBranch = (b: UnitBranch) =>
    setActiveBranches((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
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
        ? new Date(b.date_of_fall).getTime() - new Date(a.date_of_fall).getTime()
        : sort === 'oldest'
          ? new Date(a.date_of_fall).getTime() - new Date(b.date_of_fall).getTime()
          : a.name_en.localeCompare(b.name_en)
    );
  }, [soldiers, query, activeBranches, sort]);

  return (
    <Box className="min-h-screen bg-bg">
      {/* sticky toolbar */}
      <Box className="sticky top-0 z-10 bg-bg/95 backdrop-blur-sm border-b border-electric/15 px-6 py-4">
        <Box className="flex items-center gap-4 mb-4 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-electric no-underline font-mono text-[12px] border border-electric/20 px-3 py-1.5 rounded-md transition-all duration-150 hover:border-electric hover:bg-electric/[0.08]"
          >
            ← Map
          </Link>
          <Text
            as="h1"
            className="font-he text-[22px] font-bold text-hebrew [direction:rtl]"
          >
            לוחמים שנפלו
          </Text>
          <Text className="text-[14px] text-muted/80 font-light">
            Fallen Soldiers
          </Text>
          <Text className="font-mono text-[11px] text-muted ml-auto">
            {filtered.length} / {soldiers.length}
          </Text>
        </Box>

        <Box className="flex gap-3 flex-wrap items-center">
          <Inp
            type="text"
            className="bg-bg-card border border-electric/20 rounded-lg px-3.5 py-2 text-text text-[13px] outline-none w-[260px] [direction:ltr] focus:border-electric/50 focus:shadow-[0_0_0_2px_rgba(0,180,216,0.07)] placeholder:text-muted/60"
            placeholder="Search name, unit, city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Box className="flex gap-1.5 flex-wrap">
            {BRANCHES.map((b) => (
              <Btn
                key={b.id}
                className={activeBranches.has(b.id) ? activeBranchBtn : inactiveBranchBtn}
                onClick={() => toggleBranch(b.id)}
              >
                {b.label_en}
              </Btn>
            ))}
          </Box>
          <Select
            className="bg-bg-card border border-electric/20 rounded-lg px-2.5 py-2 text-text text-[12px] outline-none cursor-pointer focus:border-electric/50"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Name A–Z</option>
          </Select>
        </Box>
      </Box>

      {/* grid */}
      <Box className="p-6 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
        {filtered.map((soldier) => {
          const color = BRANCH_COLOR_MAP[soldier.unit_branch];
          return (
            <Link
              key={soldier.id}
              href={`/soldiers/${soldier.id}`}
              className="group relative overflow-hidden bg-bg-card border border-electric/15 rounded-xl p-4 no-underline flex flex-col gap-2 transition-all duration-200 animate-fade-in hover:border-gold/40 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)]"
            >
              {/* top color bar */}
              <Box
                className="absolute top-0 left-0 right-0 h-[2px] opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: color }}
              />

              {/* avatar */}
              {soldier.photo_url ? (
                <Img
                  src={soldier.photo_url}
                  alt={soldier.name_en}
                  className="w-12 h-12 rounded-full object-cover border border-electric/20"
                />
              ) : (
                <Box
                  className="w-12 h-12 rounded-full flex items-center justify-center border"
                  style={{ background: `${color}14`, borderColor: `${color}40` }}
                >
                  <StarOfDavid size={24} color={color} />
                </Box>
              )}

              <Box className="flex flex-col gap-1">
                <Text className="block font-he text-[15px] font-bold text-hebrew [direction:rtl] leading-[1.2]">
                  {soldier.name_he}
                </Text>
                <Text className="block text-[12px] text-text/80 font-medium leading-none truncate">
                  {soldier.name_en}
                </Text>
              </Box>

              {soldier.rank_en && (
                <Text className="font-mono text-[10px] text-electric uppercase tracking-[0.04em]">
                  {soldier.rank_en}
                </Text>
              )}
              <Text className="text-[11px] text-muted truncate">{soldier.unit}</Text>

              <Box className="mt-auto pt-2 border-t border-electric/10 flex flex-col gap-0.5">
                <Text className="font-mono text-[10px] text-muted">
                  {formatDateEnglish(soldier.date_of_fall)}
                </Text>
                <Text className="text-[10px] text-muted/70 truncate">
                  {getLocationDisplay(soldier)}
                </Text>
              </Box>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
};
