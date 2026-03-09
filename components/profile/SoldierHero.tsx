import type { Soldier } from '@/lib/types';
import { BRANCH_COLOR_MAP } from '@/lib/constants';
import { StarOfDavid } from '@/components/ui/StarOfDavid';
import { formatDateEnglish } from '@/lib/soldiers';
import { Box, Text, Img } from '@/components/ui/primitives';

interface SoldierHeroProps {
  soldier: Soldier;
}

export const SoldierHero = ({ soldier }: SoldierHeroProps) => {
  const branchColor = BRANCH_COLOR_MAP[soldier.unit_branch];

  return (
    <Box className="bg-bg-card border border-electric/20 rounded-xl p-8 flex gap-7 items-start animate-fade-in">
      <Box className="shrink-0">
        {soldier.photo_url ? (
          <Img
            src={soldier.photo_url}
            alt={soldier.name_en}
            className="w-[120px] h-[120px] rounded-full border-2 border-gold object-cover shadow-[0_0_20px_rgba(244,162,97,0.3)]"
          />
        ) : (
          <Box className="w-[120px] h-[120px] rounded-full border-2 border-gold bg-gold/[0.08] flex items-center justify-center shadow-[0_0_20px_rgba(244,162,97,0.2)]">
            <StarOfDavid size={56} color="#f4a261" />
          </Box>
        )}
      </Box>

      <Box className="flex-1 flex flex-col gap-2">
        <Text className="block font-he text-[32px] font-black text-hebrew [direction:rtl] leading-[1.1] [text-shadow:0_0_16px_rgba(255,215,0,0.3)]">
          {soldier.name_he}
        </Text>
        <Text className="block text-[18px] text-muted font-normal">
          {soldier.name_en}
        </Text>

        <Box className="flex gap-2 flex-wrap mt-1">
          {soldier.rank_en && (
            <Text className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border border-electric/50 text-electric bg-electric/[0.08]">
              {soldier.rank_en}
            </Text>
          )}
          <Text className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border border-gold/40 text-gold bg-gold/[0.08]">
            {soldier.unit}
          </Text>
          <Text
            className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border uppercase tracking-[0.1em]"
            style={{
              borderColor: `${branchColor}60`,
              color: branchColor,
              background: `${branchColor}12`,
            }}
          >
            {soldier.unit_branch}
          </Text>
        </Box>

        <Box className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
          {(
            [
              ['Born', formatDateEnglish(soldier.date_of_birth)],
              [
                'Fell',
                `${formatDateEnglish(soldier.date_of_fall)} · Age ${soldier.age_at_fall}`,
              ],
              ['Location', soldier.location_name],
              ['City of Origin', soldier.city_of_origin],
              ['War', soldier.conflict],
            ] as const
          ).map(([label, val]) => (
            <Box key={label} className="flex flex-col gap-0.5">
              <Text className="font-mono text-[9px] text-muted uppercase tracking-[0.15em]">
                {label}
              </Text>
              <Text className="text-[13px] text-text">{val}</Text>
            </Box>
          ))}
        </Box>

        <Box className="mt-3 flex items-center gap-2.5 text-muted font-he text-[14px] [direction:rtl]">
          <Box className="flex-1 h-px bg-gradient-to-r from-gold to-transparent opacity-40" />
          <Text>הנצחה לעולם ועד</Text>
        </Box>
      </Box>
    </Box>
  );
};
