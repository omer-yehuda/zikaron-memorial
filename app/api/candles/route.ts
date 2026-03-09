import { NextRequest, NextResponse } from 'next/server';
import { getSoldierById } from '@/lib/soldiers';

const candleStore = new Map<string, number>();
const rateLimitStore = new Map<string, Set<string>>();

const getClientId = (req: NextRequest): string => {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
};

export const GET = (req: NextRequest): NextResponse => {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const count = candleStore.get(id) ?? 0;
  return NextResponse.json({ count });
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const body = (await req.json()) as { id?: string };
  const { id } = body;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  if (!getSoldierById(id)) {
    return NextResponse.json({ error: 'Soldier not found' }, { status: 404 });
  }

  const clientId = getClientId(req);
  const limitKey = `${clientId}:${id}`;
  const limitSet = rateLimitStore.get(limitKey) ?? new Set<string>();

  const today = new Date().toISOString().slice(0, 10);
  if (limitSet.has(today)) {
    const count = candleStore.get(id) ?? 0;
    return NextResponse.json({ count, limited: true });
  }

  limitSet.add(today);
  rateLimitStore.set(limitKey, limitSet);

  const current = candleStore.get(id) ?? 0;
  candleStore.set(id, current + 1);

  return NextResponse.json({ count: current + 1 });
};
