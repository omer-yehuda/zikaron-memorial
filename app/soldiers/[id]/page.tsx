import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSoldiers, getSoldierById, formatDateEnglish } from '@/lib/soldiers';
import { SoldierHero } from '@/components/profile/SoldierHero';
import { CandleTribute } from '@/components/profile/CandleTribute';
import { ProfileMapClient } from '@/components/profile/ProfileMapClient';
import styles from './page.module.css';

interface PageProps {
  params: { id: string };
}

export const generateStaticParams = () =>
  getAllSoldiers().map((s) => ({ id: s.id }));

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const soldier = getSoldierById(params.id);
  if (!soldier) return { title: 'Soldier Not Found' };

  return {
    title: `${soldier.name_he} · ${soldier.name_en} — זיכרון`,
    description: `${soldier.rank_en} ${soldier.name_en} of the ${soldier.unit}. Fell on ${formatDateEnglish(soldier.date_of_fall)} at ${soldier.location_name}. ${soldier.bio_en ?? ''}`,
    openGraph: {
      title: `${soldier.name_he} — זיכרון Memorial`,
      description: `${soldier.rank_en} · ${soldier.unit} · ${formatDateEnglish(soldier.date_of_fall)}`,
      type: 'profile',
    },
  };
};

export default function SoldierProfilePage({ params }: PageProps) {
  const soldier = getSoldierById(params.id);
  if (!soldier) notFound();

  const bioHe =
    soldier.bio_he ??
    `${soldier.name_he}, ${soldier.rank_he} ב${soldier.unit}, נפל/ה ב${soldier.location_name} בתאריך ${new Date(soldier.date_of_fall).toLocaleDateString('he-IL')}. זכרם יהיה ברוך לעד.`;

  const bioEn =
    soldier.bio_en ??
    `${soldier.rank_en} ${soldier.name_en} served in the ${soldier.unit}. Fell on ${formatDateEnglish(soldier.date_of_fall)} at ${soldier.location_name}, at the age of ${soldier.age_at_fall}. May their memory be a blessing.`;

  return (
    <div className={styles.page}>
      <Link href="/soldiers" className={styles.backLink}>
        ← Back to Soldiers
      </Link>

      <SoldierHero soldier={soldier} />

      <div className={styles.bioSection}>
        <div className={styles.bioTitle}>Biography · ביוגרפיה</div>
        <div className={styles.bioHe}>{bioHe}</div>
        <div className={styles.bioEn}>{bioEn}</div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.mapSection}>
          <div className={styles.mapTitle}>Location of Falling</div>
          <ProfileMapClient soldier={soldier} />
        </div>
        <CandleTribute soldierId={soldier.id} />
      </div>
    </div>
  );
}
