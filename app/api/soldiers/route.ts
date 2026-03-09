import { NextRequest, NextResponse } from 'next/server';
import {
  getAllSoldiers,
  getSoldiersUpToDate,
  searchSoldiers,
  filterByBranch,
} from '@/lib/soldiers';
import type { UnitBranch } from '@/lib/types';

export const GET = (req: NextRequest): NextResponse => {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q') ?? '';
  const branch = searchParams.get('branch') ?? '';
  const from = searchParams.get('from') ?? '';
  const to = searchParams.get('to') ?? '';

  let soldiers = getAllSoldiers();

  if (to) {
    soldiers = getSoldiersUpToDate(new Date(to));
  }

  if (from) {
    const fromDate = new Date(from);
    soldiers = soldiers.filter((s) => new Date(s.date_of_fall) >= fromDate);
  }

  if (q) {
    const searched = searchSoldiers(q);
    const searchIds = new Set(searched.map((s) => s.id));
    soldiers = soldiers.filter((s) => searchIds.has(s.id));
  }

  if (branch) {
    const branches = branch.split(',').filter(Boolean) as UnitBranch[];
    soldiers = filterByBranch(soldiers, branches);
  }

  return NextResponse.json({ soldiers, total: soldiers.length });
};
