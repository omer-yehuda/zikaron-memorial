import { NextResponse } from 'next/server';
import { getLocalSoldiers, computeStats } from '@/lib/soldiers';
import type { Soldier } from '@/lib/types';

async function fetchSoldiers(): Promise<Soldier[]> {
  if (process.env.DYNAMODB_SOLDIERS_TABLE) {
    const { getAllSoldiers } = await import('@/lib/dynamodb');
    return getAllSoldiers();
  }
  return getLocalSoldiers();
}

export async function GET() {
  const soldiers = await fetchSoldiers();
  const stats = computeStats(soldiers);
  return NextResponse.json(stats, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
