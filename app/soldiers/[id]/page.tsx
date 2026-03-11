import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllSoldiers,
  getSoldierById,
  formatDateEnglish,
} from '@/lib/soldiers';
import { SoldierHero } from '@/components/profile/SoldierHero';
import { CandleTribute } from '@/components/profile/CandleTribute';
import { ProfileMapClient } from '@/components/profile/ProfileMapClient';
import { Box, Text, Anchor } from '@/components/ui/primitives';

// Next.js 15+: params is a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateStaticParams = () =>
  getAllSoldiers().map((s) => ({ id: s.id }));

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { id } = await params;
  const soldier = getSoldierById(id);
  if (!soldier) return { title: 'Soldier Not Found' };

  return {
    title: `${soldier.name_he} · ${soldier.name_en} — זיכרון`,
    description: `${soldier.rank_en} ${soldier.name_en} of the ${soldier.unit}. Fell on ${formatDateEnglish(soldier.date_of_fall)} at ${soldier.location_name}.`,
    openGraph: {
      title: `${soldier.name_he} — זיכרון Memorial`,
      description: `${soldier.rank_en} · ${soldier.unit} · ${formatDateEnglish(soldier.date_of_fall)}`,
      type: 'profile',
    },
  };
};

export default async function SoldierProfilePage({ params }: PageProps) {
  const { id } = await params;
  const soldier = getSoldierById(id);
  if (!soldier) notFound();

  const bioHe =
    soldier.bio_he ??
    `${soldier.name_he}, ${soldier.rank_he} ב${soldier.unit}, נפל/ה ב${soldier.location_name} בתאריך ${new Date(soldier.date_of_fall).toLocaleDateString('he-IL')}. זכרם יהיה ברוך לעד.`;

  const bioEn =
    soldier.bio_en ??
    `${soldier.rank_en} ${soldier.name_en} served in the ${soldier.unit}. Fell on ${formatDateEnglish(soldier.date_of_fall)} at ${soldier.location_name}, at the age of ${soldier.age_at_fall}. May their memory be a blessing.`;

  return (
    <Box className="min-h-screen bg-bg p-6 max-w-[900px] mx-auto">
      <Box className="flex items-center justify-between gap-4 mb-5">
        <Link
          href="/soldiers"
          className="inline-flex items-center gap-1.5 text-electric no-underline font-mono text-[12px] border border-electric/20 px-3 py-1.5 rounded transition-all duration-150 hover:border-electric hover:bg-electric/[0.08]"
        >
          ← Back to Soldiers
        </Link>
        {soldier.source_url && (
          <Anchor
            href={soldier.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gold no-underline font-mono text-[12px] border border-gold/30 px-3 py-1.5 rounded transition-all duration-150 hover:border-gold hover:bg-gold/[0.08]"
          >
            View Original Profile ↗
          </Anchor>
        )}
      </Box>

      <SoldierHero soldier={soldier} />

      <Box className="bg-bg-card border border-electric/20 rounded-xl p-6 mt-4">
        <Text className="block font-mono text-[9px] text-electric tracking-[0.2em] uppercase mb-3">
          Biography · ביוגרפיה
        </Text>
        <Text className="block font-he text-[16px] text-hebrew [direction:rtl] leading-[1.7] mb-3">
          {bioHe}
        </Text>
        <Text className="block text-[14px] text-muted leading-[1.7]">
          {bioEn}
        </Text>
      </Box>

      <Box className="grid grid-cols-2 gap-4 mt-4">
        <Box className="bg-bg-card border border-electric/20 rounded-xl p-4">
          <Text className="block font-mono text-[9px] text-electric tracking-[0.2em] uppercase mb-2">
            Location of Falling
          </Text>
          <ProfileMapClient soldier={soldier} />
        </Box>
        <CandleTribute soldierId={soldier.id} />
      </Box>
    </Box>
  );
}
