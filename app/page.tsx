import MapApp from '@/components/MapApp';
import { fetchSoldiers } from '@/lib/soldiers';

export default async function HomePage() {
  const soldiers = await fetchSoldiers();
  return <MapApp initialSoldiers={soldiers} />;
}
