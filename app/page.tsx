import MapApp from '@/components/MapApp';
import { getLocalSoldiers } from '@/lib/soldiers';

async function getSoldiers() {
  if (process.env.DYNAMODB_SOLDIERS_TABLE) {
    try {
      const { getAllSoldiers } = await import('@/lib/dynamodb');
      return getAllSoldiers();
    } catch {
      // Fallback to local JSON if DynamoDB unavailable
    }
  }
  return getLocalSoldiers();
}

export default async function HomePage() {
  const soldiers = await getSoldiers();
  return <MapApp initialSoldiers={soldiers} />;
}
