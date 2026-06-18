import { NextResponse } from 'next/server';
import { LeadStatus } from '@zumi/db';
import { requireAdmin, AuthError } from '@/server/auth';
import { listLeads } from '@/server/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    requireAdmin(req);
    const url = new URL(req.url);
    const statusParam = url.searchParams.get('status');
    const status =
      statusParam && statusParam in LeadStatus ? (statusParam as LeadStatus) : undefined;
    const take = Math.min(100, Number(url.searchParams.get('take') ?? 100));
    const skip = Number(url.searchParams.get('skip') ?? 0);
    return NextResponse.json(await listLeads({ status, take, skip }));
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 });
  }
}
