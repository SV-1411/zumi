import { NextResponse } from 'next/server';
import { refresh, AuthError } from '@/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) return NextResponse.json({ error: 'Missing refresh token' }, { status: 400 });
    const result = await refresh(refreshToken, {
      userAgent: req.headers.get('user-agent') ?? undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
