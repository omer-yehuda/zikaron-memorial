import { NextRequest, NextResponse } from 'next/server';

const MAX_URL_LENGTH = 2048;
const MAX_QUERY_LENGTH = 1024;

/**
 * Edge middleware — runs before every API request.
 * Rejects malformed or oversized requests before they reach route handlers.
 */
export function middleware(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;

  // Reject oversized URLs
  if (pathname.length + search.length > MAX_URL_LENGTH) {
    return new NextResponse('URI Too Long', { status: 414 });
  }

  // Reject oversized query strings
  if (search.length > MAX_QUERY_LENGTH) {
    return new NextResponse('Request URI Too Long', { status: 414 });
  }

  return NextResponse.next();
}

// Only run on API routes
export const config = {
  matcher: '/api/:path*',
};
