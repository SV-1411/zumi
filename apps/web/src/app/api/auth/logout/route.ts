import { NextResponse } from 'next/server';
import { logout } from '@/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json().catch(() => ({}));
    if (refreshToken) await logout(refreshToken);
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true });
}
