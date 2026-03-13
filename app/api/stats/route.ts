import { NextResponse } from 'next/server';
import { fetchSoldiers, computeStats } from '@/lib/soldiers';

export async function GET() {
  const soldiers = await fetchSoldiers();
  const stats = computeStats(soldiers);
  return NextResponse.json(stats, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
