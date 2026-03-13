import { NextResponse } from 'next/server';

// In-memory store for local dev — DynamoDB used on Amplify
const candleStore: Record<string, number> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const soldierId = searchParams.get('id');
  if (!soldierId) return NextResponse.json({ error: 'id required' }, { status: 400 });

  if (process.env.DYNAMODB_CANDLES_TABLE) {
    const { getCandles } = await import('@/lib/dynamodb');
    const record = await getCandles(soldierId);
    return NextResponse.json({ count: record?.count ?? 0 });
  }

  return NextResponse.json({ count: candleStore[soldierId] ?? 0 });
}

export async function POST(request: Request) {
  const { soldierId } = (await request.json()) as { soldierId?: string };
  if (!soldierId) return NextResponse.json({ error: 'soldierId required' }, { status: 400 });

  if (process.env.DYNAMODB_CANDLES_TABLE) {
    const { incrementCandles } = await import('@/lib/dynamodb');
    const count = await incrementCandles(soldierId);
    return NextResponse.json({ count });
  }

  candleStore[soldierId] = (candleStore[soldierId] ?? 0) + 1;
  return NextResponse.json({ count: candleStore[soldierId] });
}
