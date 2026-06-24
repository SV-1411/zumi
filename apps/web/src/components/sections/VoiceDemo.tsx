'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

// Public key is safe to expose in the browser (that's its purpose). Env var on Vercel
// overrides this fallback. The PRIVATE key must NEVER appear in client code.
const PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '523cefc3-de25-425b-862b-afb0a1b625e9';
const BOOKING_LINK = 'https://cal.com/shivansh-verma-12pm8j';

const SYSTEM_PROMPT = `You are the friendly, professional front-desk AI receptionist demo for Zumi.
You are showing a business owner what their own 24/7 receptionist would feel like.
Be warm, concise and human — short sentences, never robotic. Mirror the caller's language
(English / Hindi / Hinglish). You can: answer common questions, book a (pretend) appointment by
collecting name, phone, service and preferred time then reading it back to confirm, and capture a
message if you can't fully help. If asked, happily admit you're an AI built by Zumi. Never invent
specific prices or staff availability — offer to have the team confirm. Always end by confirming
the next step out loud. Keep it efficient and kind, one question at a time.`;

// Inline assistant — no pre-created assistant needed; the public key authorizes this.
const ASSISTANT = {
  name: 'Zumi Receptionist Demo',
  firstMessage:
    "Hi! You've reached the Zumi AI receptionist demo. I answer calls and book appointments just like I would for your business — go ahead, ask me anything.",
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }],
  },
  // If the voice errors on your Vapi plan, swap to { provider: 'vapi', voiceId: 'Elliot' }.
  voice: { provider: 'playht', voiceId: 'jennifer' },
  transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
};

type Line = { role: 'user' | 'assistant'; text: string };
type Status = 'idle' | 'connecting' | 'live' | 'ended';

export function VoiceDemo() {
  const [status, setStatus] = useState<Status>('idle');
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);
  const vapiRef = useRef<{ stop?: () => void } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  // Clean up any live call if the component unmounts.
  useEffect(() => () => vapiRef.current?.stop?.(), []);

  async function start() {
    setError(null);
    setLines([]);
    setStatus('connecting');
    try {
      const { default: Vapi } = await import('@vapi-ai/web');
      const vapi: any = new Vapi(PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on('call-start', () => setStatus('live'));
      vapi.on('call-end', () => setStatus('ended'));
      vapi.on('error', () => {
        setError('Connection issue — allow microphone access and try again.');
        setStatus('idle');
      });
      vapi.on('message', (m: any) => {
        if (m?.type === 'transcript' && m?.transcriptType === 'final') {
          setLines((l) => [
            ...l,
            { role: m.role === 'assistant' ? 'assistant' : 'user', text: m.transcript },
          ]);
        }
      });

      await vapi.start(ASSISTANT as any);
    } catch {
      setError('Could not start the demo. Make sure microphone access is allowed in your browser.');
      setStatus('idle');
    }
  }

  function stop() {
    vapiRef.current?.stop?.();
    setStatus('ended');
  }

  const live = status === 'live';
  const busy = status === 'connecting';

  return (
    <div className="mb-12 rounded-3xl border border-accent/25 bg-accent/[0.04] p-6 sm:p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent-soft">Live demo</p>
        <h3 className="font-display text-xl text-text-primary sm:text-2xl">
          Don&apos;t take our word for it — talk to it.
        </h3>
        <p className="max-w-md text-sm text-text-secondary">
          Tap below and speak. This is the exact AI that would answer your phone, 24/7, in your
          customer&apos;s language.
        </p>

        {status !== 'live' && status !== 'connecting' && (
          <button
            onClick={start}
            className="mt-1 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-shadow hover:shadow-[0_0_40px_rgba(79,111,255,0.5)]"
          >
            🎙️ {status === 'ended' ? 'Talk again' : 'Talk to the receptionist'}
          </button>
        )}

        {busy && <p className="text-sm text-accent-soft">Connecting… allow your mic when asked.</p>}

        {live && (
          <button
            onClick={stop}
            className="mt-1 flex items-center gap-2.5 rounded-full border border-red-400/40 bg-red-500/10 px-7 py-3.5 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/20"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
            </span>
            End call
          </button>
        )}

        {error && <p className="text-sm text-red-300">{error}</p>}
      </div>

      <AnimatePresence>
        {lines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-6 overflow-hidden"
          >
            <div
              ref={scrollRef}
              className="flex max-h-64 flex-col gap-2.5 overflow-y-auto rounded-2xl border border-white/8 bg-surface/40 p-4"
            >
              {lines.map((l, i) => (
                <div key={i} className={`flex ${l.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      l.role === 'user'
                        ? 'bg-white/[0.06] text-text-primary'
                        : 'border border-accent/20 bg-accent/10 text-accent-soft'
                    }`}
                  >
                    {l.text}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {status === 'ended' && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-sm text-text-secondary">Want this answering your real number?</p>
          <a
            href={BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-accent/40 px-6 py-2.5 text-sm text-accent transition-colors hover:bg-accent/10"
          >
            Book a 15-min setup call →
          </a>
        </div>
      )}
    </div>
  );
}
