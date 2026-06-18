import { NextResponse } from 'next/server';
import { respond } from '@/server/assistant';
import type { ChatMessage } from '@/server/openrouter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Conversational AI consultant — OpenRouter brain, persists the lead on finalize. */
export async function POST(req: Request) {
  let body: { messages?: ChatMessage[]; fields?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 });
  }

  try {
    const turn = await respond(body.messages, body.fields ?? {});
    return NextResponse.json(turn);
  } catch (err) {
    console.error('[ZUMI assistant] failed', err);
    return NextResponse.json(
      { reply: 'I had trouble responding — please try again.', fields: {}, recommended: null, emotion: 'confused', done: false, aiEnabled: false },
      { status: 200 }
    );
  }
}
