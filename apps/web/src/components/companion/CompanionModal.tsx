'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { useCompanion } from '@/lib/companionStore';
import { ThoughtBubbles } from './ThoughtBubbles';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

const CompanionScene = dynamic(
  () => import('./CompanionScene').then((m) => m.CompanionScene),
  { ssr: false }
);

type Msg = { role: 'user' | 'assistant'; content: string };
type Fields = Record<string, string>;

const GREETING =
  "Hi — I'm ZUMI's AI consultant. Tell me what you're trying to build, and I'll figure out the best way we can help.";

export function CompanionModal() {
  const open = useExperience((s) => s.assistantOpen);
  const toggle = useExperience((s) => s.toggleAssistant);
  const setCompanion = useCompanion((s) => s.setState);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [fields, setFields] = useState<Fields>({});
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [recommended, setRecommended] = useState<string | null>(null);
  const [lastUser, setLastUser] = useState('');
  const [thoughtNonce, setThoughtNonce] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  // seed greeting on first open
  useEffect(() => {
    if (open && !seeded.current) {
      seeded.current = true;
      setMessages([{ role: 'assistant', content: GREETING }]);
      setCompanion('speaking');
      const t = setTimeout(() => setCompanion('idle'), 1800);
      return () => clearTimeout(t);
    }
    return;
  }, [open, setCompanion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, recommended]);

  // lock body scroll while open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || busy || done) return;

    const history = [...messages, { role: 'user' as const, content: text }];
    setMessages(history);
    setInput('');
    setBusy(true);
    setCompanion('thinking');
    // feed the robot's inner-monologue with what was just said
    setLastUser(text);
    setThoughtNonce((n) => n + 1);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, fields }),
      });
      const turn = await res.json();

      setFields((f) => ({ ...f, ...(turn.fields ?? {}) }));
      setMessages((m) => [...m, { role: 'assistant', content: turn.reply }]);

      if (turn.recommended) setRecommended(turn.recommended);
      if (turn.done) {
        setDone(true);
        setCompanion('celebrate');
        setTimeout(() => setCompanion('happy'), 2600);
      } else {
        // honour the AI's emotion, then settle back to idle
        const emo = turn.emotion as 'neutral' | 'happy' | 'thinking' | 'confused';
        const mapped =
          emo === 'happy' ? 'happy' : emo === 'confused' ? 'confused' : 'speaking';
        setCompanion(mapped);
        const dur = Math.min(3200, 800 + (turn.reply?.length ?? 0) * 22);
        setTimeout(() => setCompanion('idle'), dur);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'I had trouble reaching the server — please try again.' },
      ]);
      setCompanion('idle');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-xl"
        >
          <div className="grid-veil pointer-events-none absolute inset-0 opacity-60" />

          {/* close */}
          <button
            onClick={() => toggle(false)}
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-text-secondary transition-colors hover:text-text-primary"
            aria-label="Close assistant"
          >
            ✕
          </button>

          <div className="relative z-10 grid h-full grid-rows-[40vh_1fr] md:grid-cols-2 md:grid-rows-1">
            {/* astronaut */}
            <div className="relative">
              <CompanionScene />
              <ThoughtBubbles active={open} userText={lastUser} nonce={thoughtNonce} />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
                className="absolute bottom-6 left-0 right-0 text-center md:bottom-12"
              >
                <p className="text-[11px] uppercase tracking-[0.4em] text-text-secondary">
                  ZUMI · AI consultant
                </p>
              </motion.div>
            </div>

            {/* chat */}
            <div className="flex min-h-0 flex-col border-t border-white/8 md:border-l md:border-t-0">
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-8 md:px-10">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={cn(
                      'max-w-[88%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed',
                      m.role === 'assistant'
                        ? 'bg-white/[0.05] text-text-primary'
                        : 'ml-auto bg-accent/20 text-text-primary'
                    )}
                  >
                    {m.content}
                  </motion.div>
                ))}

                {busy && (
                  <div className="flex items-center gap-1.5 px-2 text-text-secondary">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-accent"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                  </div>
                )}

                {recommended && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-4"
                  >
                    <p className="mb-1 text-xs uppercase tracking-wider text-text-secondary">
                      Recommended for you
                    </p>
                    <p className="text-[15px] font-medium">{recommended}</p>
                  </motion.div>
                )}
              </div>

              {/* input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-3 border-t border-white/8 p-4 md:px-10"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => useCompanion.getState().state === 'idle' && setCompanion('listening')}
                  onBlur={() => useCompanion.getState().state === 'listening' && setCompanion('idle')}
                  placeholder={done ? 'Thanks — the team will be in touch.' : 'Type your message…'}
                  disabled={busy || done}
                  className="flex-1 rounded-xl bg-white/[0.04] px-4 py-3 text-[15px] outline-none ring-1 ring-white/10 placeholder:text-text-secondary/60 focus:ring-accent/50 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy || done || !input.trim()}
                  className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
