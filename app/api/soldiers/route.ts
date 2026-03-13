import { NextResponse } from 'next/server';
import { fetchSoldiers } from '@/lib/soldiers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get('branch');
  const before = searchParams.get('before'); // ISO date filter
  const q = searchParams.get('q')?.toLowerCase();

  let soldiers = await fetchSoldiers();

  if (branch) soldiers = soldiers.filter((s) => s.branch === branch);
  if (before) soldiers = soldiers.filter((s) => s.date_of_death <= before);
  if (q) {
    soldiers = soldiers.filter(
      (s) =>
        s.name_en.toLowerCase().includes(q) ||
        s.name_he.includes(q) ||
        s.unit_en.toLowerCase().includes(q)
    );
  }

  soldiers.sort((a, b) => a.date_of_death.localeCompare(b.date_of_death));

  return NextResponse.json(soldiers, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
