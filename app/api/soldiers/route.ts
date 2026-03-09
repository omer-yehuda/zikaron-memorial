import { NextRequest, NextResponse } from 'next/server';
import {
  getAllSoldiers,
  getSoldiersUpToDate,
  searchSoldiers,
  filterByBranch,
} from '@/lib/soldiers';
import type { UnitBranch } from '@/lib/types';

const VALID_BRANCHES = new Set<UnitBranch>(['ground', 'air', 'navy', 'special']);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_Q_LEN = 200;

const parseDate = (s: string): Date | null => {
  if (!ISO_DATE_RE.test(s)) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

export const GET = (req: NextRequest): NextResponse => {
  const { searchParams } = req.nextUrl;

  const q = (searchParams.get('q') ?? '').slice(0, MAX_Q_LEN);
  const branchParam = searchParams.get('branch') ?? '';
  const fromParam = searchParams.get('from') ?? '';
  const toParam = searchParams.get('to') ?? '';

  let soldiers = getAllSoldiers();

  if (toParam) {
    const to = parseDate(toParam);
    if (!to) return NextResponse.json({ error: 'Invalid to date' }, { status: 400 });
    soldiers = getSoldiersUpToDate(to);
  }

  if (fromParam) {
    const from = parseDate(fromParam);
    if (!from) return NextResponse.json({ error: 'Invalid from date' }, { status: 400 });
    soldiers = soldiers.filter((s) => new Date(s.date_of_fall) >= from);
  }

  if (q) {
    const searched = searchSoldiers(q);
    const ids = new Set(searched.map((s) => s.id));
    soldiers = soldiers.filter((s) => ids.has(s.id));
  }

  if (branchParam) {
    const branches = branchParam
      .split(',')
      .map((b) => b.trim())
      .filter((b): b is UnitBranch => VALID_BRANCHES.has(b as UnitBranch));
    if (branches.length > 0) soldiers = filterByBranch(soldiers, branches);
  }

  return NextResponse.json({ soldiers, total: soldiers.length });
};
