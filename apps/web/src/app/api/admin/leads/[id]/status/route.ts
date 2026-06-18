import { NextResponse } from 'next/server';
import { LeadStatus } from '@zumi/db';
import { requireAdmin, AuthError } from '@/server/auth';
import { updateLeadStatus } from '@/server/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const { status } = await req.json();
    if (!status || !(status in LeadStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    return NextResponse.json(await updateLeadStatus(id, status as LeadStatus));
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
