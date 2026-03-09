'use client';

import dynamic from 'next/dynamic';
import type { Soldier } from '@/lib/types';

const ProfileMap = dynamic(
  () => import('./ProfileMap').then((m) => ({ default: m.ProfileMap })),
  { ssr: false }
);

interface ProfileMapClientProps {
  soldier: Soldier;
}

export const ProfileMapClient = ({ soldier }: ProfileMapClientProps) => (
  <ProfileMap soldier={soldier} />
);
