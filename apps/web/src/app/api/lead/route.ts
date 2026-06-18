import { NextResponse } from 'next/server';
import { createLead } from '@/server/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Public inquiry capture → AI enrichment + Neon + team email. */
export async function POST(req: Request) {
  let body: Record<string, unknown> & { lead?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const flat = (body.lead ?? body) as Record<string, unknown>;
  if (!flat.email && !flat.name) {
    return NextResponse.json({ error: 'Missing lead details' }, { status: 400 });
  }

  try {
    const lead = await createLead({
      ...(flat as object),
      source: (body.source as string) ?? 'assistant',
      messages: body.messages as never,
    });
    return NextResponse.json({ id: lead.id, score: lead.score, status: lead.status }, { status: 201 });
  } catch (err) {
    console.error('[ZUMI lead] create failed', err);
    return NextResponse.json({ error: 'Failed to store lead' }, { status: 500 });
  }
}
