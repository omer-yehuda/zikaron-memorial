import { NextRequest, NextResponse } from 'next/server';
import { getSoldierById } from '@/lib/soldiers';
import { hashClient, getCount, hasVotedToday, recordVote } from '@/lib/candleStore';

// Only allow well-formed soldier IDs (e.g. IDF-001)
const SOLDIER_ID_RE = /^[A-Z]+-\d{1,6}$/;

// Max POST body accepted (prevents large-payload abuse)
const MAX_BODY_BYTES = 512;

/** Extract the first IP from x-forwarded-for, reject obvious spoofs. */
const getClientIp = (req: NextRequest): string => {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (/^[\d.a-fA-F:]+$/.test(first)) return first;
  }
  return 'unknown';
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const id = req.nextUrl.searchParams.get('id');
  if (!id || !SOLDIER_ID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const count = await getCount(id);
  return NextResponse.json({ count });
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  // Content-Type guard
  const ct = req.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
  }

  // Body size guard
  const cl = req.headers.get('content-length');
  if (cl && parseInt(cl, 10) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { id } = body as Record<string, unknown>;
  if (typeof id !== 'string' || !SOLDIER_ID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  if (!getSoldierById(id)) {
    return NextResponse.json({ error: 'Soldier not found' }, { status: 404 });
  }

  const clientHash = hashClient(getClientIp(req));

  if (await hasVotedToday(id, clientHash)) {
    const count = await getCount(id);
    return NextResponse.json({ count, limited: true });
  }

  const count = await recordVote(id, clientHash);
  return NextResponse.json({ count });
};
