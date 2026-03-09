import { getAllSoldiers } from '@/lib/soldiers';
import { SoldiersPageClient } from './SoldiersPageClient';

export const dynamic = 'force-static';

export default function SoldiersPage() {
  const soldiers = getAllSoldiers();
  return <SoldiersPageClient soldiers={soldiers} />;
}
