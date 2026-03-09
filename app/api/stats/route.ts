import { NextResponse } from 'next/server';
import { getAllSoldiers, getStats } from '@/lib/soldiers';

export const GET = (): NextResponse => {
  const soldiers = getAllSoldiers();
  const stats = getStats(soldiers);
  return NextResponse.json(stats);
};
