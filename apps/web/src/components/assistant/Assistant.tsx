'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import {
  STEPS,
  analyzeLead,
  type LeadDraft,
  type LeadAnalysis,
} from '@/lib/assistant';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

const Companion3D = dynamic(
  () => import('./Companion3D').then((m) => m.Companion3D),
  { ssr: false }
);

type Msg = { role: 'bot' | 'user'; text: string };

const fill = (tpl: string, lead: LeadDraft) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => (lead as Record<string, string>)[k] ?? '');

export function Assistant() {
  const open = useExperience((s) => s.assistantOpen);
  const toggle = useExperience((s) => s.toggleAssistant);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [lead, setLead] = useState<LeadDraft>({});
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  // seed the first prompt once the panel opens
  useEffect(() => {
    if (open && !started.current) {
      started.current = true;
      setMessages([{ role: 'bot', text: STEPS[0]!.prompt }]);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, analysis]);

  const step = STEPS[stepIndex];

  async function submit() {
    const value = input.trim();
    if (!value || !step) return;

    const error = step.validate?.(value);
    if (error) {
      setMessages((m) => [...m, { role: 'user', text: value }, { role: 'bot', text: error }]);
      setInput('');
      return;
    }

    const nextLead = { ...lead, [step.field]: value };
    setLead(nextLead);
    setInput('');

    const userMsg: Msg = { role: 'user', text: value };
    const isLast = stepIndex === STEPS.length - 1;

    if (!isLast) {
      const next = STEPS[stepIndex + 1]!;
      setMessages((m) => [...m, userMsg, { role: 'bot', text: fill(next.prompt, nextLead) }]);
      setStepIndex((i) => i + 1);
      return;
    }

    // final step -> analyse + persist
    setMessages((m) => [
      ...m,
      userMsg,
      { role: 'bot', text: 'Analysing your requirements and generating a scope…' },
    ]);
    setSending(true);
    const result = analyzeLead(nextLead);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: nextLead, analysis: result }),
      });
    } catch {
      /* non-blocking — the scope still shows; API wiring is environment-dependent */
    }

    setAnalysis(result);
    setSending(false);
  }

  return (
    <>
      {/* floating launcher */}
      <motion.button
        onClick={() => toggle()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.6, ease: EASE }}
        className="glass fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-text-primary shadow-[0_0_40px_rgba(79,111,255,0.25)] hover:shadow-[0_0_60px_rgba(79,111,255,0.45)] transition-shadow"
        aria-label="Open ZUMI assistant"
      >
        <span className="absolute inset-0 rounded-full ring-1 ring-accent/40" />
        <span className="relative h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass fixed bottom-24 right-6 z-50 flex h-[min(34rem,72vh)] w-[min(24rem,92vw)] flex-col overflow-hidden rounded-2xl"
          >
            {/* header with the 3D companion */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="h-10 w-10 shrink-0">
                <Companion3D />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">ZUMI Assistant</p>
                <p className="text-[11px] text-text-secondary">
                  Scoping your project
                </p>
              </div>
              <button
                onClick={() => toggle(false)}
                className="text-text-secondary hover:text-text-primary"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                    m.role === 'bot'
                      ? 'bg-white/[0.04] text-text-primary'
                      : 'ml-auto bg-accent/20 text-text-primary'
                  )}
                >
                  {m.text}
                </div>
              ))}

              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-4 text-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-text-secondary">Lead score</span>
                    <span className="font-display text-lg text-accent">
                      {analysis.score}/100
                    </span>
                  </div>
                  <p className="mb-1 text-text-secondary">Complexity</p>
                  <p className="mb-3 font-medium">{analysis.complexity}</p>
                  <p className="mb-1 text-text-secondary">Recommended</p>
                  <p className="mb-3 font-medium">{analysis.recommended}</p>
                  <p className="mb-1 text-text-secondary">Proposed scope</p>
                  <ul className="list-inside list-disc space-y-1 text-text-primary/90">
                    {analysis.scope.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[12px] text-text-secondary">
                    A ZUMI strategist will follow up at {lead.email}.
                  </p>
                </motion.div>
              )}
            </div>

            {/* input */}
            {!analysis && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="flex items-center gap-2 border-t border-white/10 p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={step?.placeholder ?? ''}
                  disabled={sending}
                  className="flex-1 rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-text-primary outline-none ring-1 ring-white/10 placeholder:text-text-secondary/60 focus:ring-accent/50"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
