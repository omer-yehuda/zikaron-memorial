import type { Soldier } from '@/lib/types';
import { BRANCH_COLOR_MAP } from '@/lib/constants';
import { StarOfDavid } from '@/components/ui/StarOfDavid';
import { formatDateEnglish } from '@/lib/soldiers';
import { Box, Text, Img } from '@/components/ui/primitives';

interface SoldierHeroProps {
  soldier: Soldier;
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <Box className="flex flex-col gap-1">
    <Text className="font-mono text-[8px] text-electric/60 uppercase tracking-[0.2em]">
      {label}
    </Text>
    <Text className="text-[13px] text-text leading-tight">{value}</Text>
  </Box>
);

export const SoldierHero = ({ soldier }: SoldierHeroProps) => {
  const branchColor = BRANCH_COLOR_MAP[soldier.unit_branch];

  return (
    <Box className="bg-bg-card border border-electric/20 rounded-xl p-7 flex gap-7 items-start animate-fade-in relative overflow-hidden">
      {/* subtle top accent */}
      <Box
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${branchColor}80, transparent)` }}
      />

      {/* photo */}
      <Box className="shrink-0 flex flex-col items-center gap-2">
        {soldier.photo_url ? (
          <Img
            src={soldier.photo_url}
            alt={soldier.name_en}
            className="w-[110px] h-[110px] rounded-full border-2 border-gold/60 object-cover shadow-[0_0_24px_rgba(244,162,97,0.25)]"
          />
        ) : (
          <Box className="w-[110px] h-[110px] rounded-full border-2 border-gold/50 bg-gold/[0.06] flex items-center justify-center shadow-[0_0_24px_rgba(244,162,97,0.15)]">
            <StarOfDavid size={52} color="#f4a261" />
          </Box>
        )}
        <Text
          className="font-mono text-[9px] uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full border"
          style={{
            color: branchColor,
            borderColor: `${branchColor}50`,
            background: `${branchColor}10`,
          }}
        >
          {soldier.unit_branch}
        </Text>
      </Box>

      {/* main info */}
      <Box className="flex-1 flex flex-col gap-3 min-w-0">
        <Box className="flex flex-col gap-1">
          <Text className="block font-he text-[30px] font-black text-hebrew [direction:rtl] leading-[1.1] [text-shadow:0_0_18px_rgba(255,215,0,0.25)]">
            {soldier.name_he}
          </Text>
          <Text className="block text-[17px] text-text/70 font-light tracking-wide">
            {soldier.name_en}
          </Text>
        </Box>

        {/* badges */}
        <Box className="flex gap-2 flex-wrap">
          {soldier.rank_en && (
            <Text className="px-3 py-1 rounded-full font-mono text-[11px] font-semibold border border-electric/40 text-electric bg-electric/[0.07]">
              {soldier.rank_en}
            </Text>
          )}
          <Text className="px-3 py-1 rounded-full font-mono text-[11px] font-semibold border border-gold/40 text-gold bg-gold/[0.07]">
            {soldier.unit}
          </Text>
        </Box>

        {/* details grid */}
        <Box className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1 border-t border-electric/10">
          <DetailItem label="Born" value={formatDateEnglish(soldier.date_of_birth)} />
          <DetailItem
            label="Fell"
            value={`${formatDateEnglish(soldier.date_of_fall)} · Age ${soldier.age_at_fall}`}
          />
          <DetailItem label="Location" value={soldier.location_name} />
          <DetailItem label="City of Origin" value={soldier.city_of_origin} />
          <DetailItem label="Conflict" value={soldier.conflict} />
        </Box>

        <Box className="flex items-center gap-3 pt-1">
          <Box className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
          <Text className="font-he text-[13px] text-muted/70 [direction:rtl]">
            הנצחה לעולם ועד
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
