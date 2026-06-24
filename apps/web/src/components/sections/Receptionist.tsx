'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  RECEPTION_SCRIPT,
  RECEPTION_STAGES,
  RECEPTION_SUMMARY,
} from '@/lib/receptionist';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VoiceDemo } from '@/components/sections/VoiceDemo';
import { EASE } from '@/lib/motion';
import { useExperience } from '@/lib/store';

export function Receptionist() {
  const [step, setStep] = useState(-1); // -1 = idle, length = finished
  const [playing, setPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toggleAssistant = useExperience((s) => s.toggleAssistant);

  const turns = step >= 0 ? RECEPTION_SCRIPT.slice(0, step + 1) : [];
  const finished = step >= RECEPTION_SCRIPT.length - 1;
  const activeStage =
    step >= 0
      ? RECEPTION_SCRIPT[Math.min(step, RECEPTION_SCRIPT.length - 1)]?.stage
      : undefined;
  const reachedStages = new Set(
    RECEPTION_SCRIPT.slice(0, step + 1)
      .map((t) => t.stage)
      .filter(Boolean) as string[]
  );
  if (finished) reachedStages.add('Summary');

  useEffect(() => {
    if (!playing) return;
    if (step >= RECEPTION_SCRIPT.length - 1) {
      setPlaying(false);
      return;
    }
    const next = RECEPTION_SCRIPT[step + 1];
    const delay = next?.role === 'bot' ? 1500 : 1100;
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [playing, step]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [step]);

  const start = () => {
    setStep(0);
    setPlaying(true);
  };
  const reset = () => {
    setStep(-1);
    setPlaying(false);
  };

  return (
    <section id="receptionist" className="relative py-section">
      <div className="shell">
        <SectionHeading
          eyebrow="AI Receptionist"
          title="A front desk that never sleeps."
          lede="Watch a real call play out — greeting, qualifying, booking and escalation — then see exactly what it captures and hands to your team."
          className="mb-16"
        />

        <VoiceDemo />

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* call transcript */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-surface/40">
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full ${
                      playing ? 'animate-ping bg-accent opacity-60' : 'bg-white/30'
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      playing ? 'bg-accent' : 'bg-white/40'
                    }`}
                  />
                </span>
                <span className="text-sm text-text-secondary">
                  {playing ? 'Live call' : finished ? 'Call ended' : 'Incoming call'}
                  {activeStage && (
                    <span className="ml-2 text-accent-soft">· {activeStage}</span>
                  )}
                </span>
              </div>
              <span className="font-display text-xs text-text-secondary">Brightsmile Dental</span>
            </div>

            <div
              ref={scrollRef}
              className="flex min-h-[360px] flex-1 flex-col gap-3 overflow-y-auto p-6"
            >
              {step === -1 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
                  <p className="max-w-xs text-sm text-text-secondary">
                    Press play to simulate an inbound call handled entirely by the AI receptionist.
                  </p>
                  <button
                    onClick={start}
                    className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-[0_0_40px_rgba(79,111,255,0.5)]"
                  >
                    ▶ Play the call
                  </button>
                </div>
              )}

              <AnimatePresence initial={false}>
                {turns.map((turn, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={`flex ${turn.role === 'caller' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        turn.role === 'caller'
                          ? 'bg-white/[0.06] text-text-primary'
                          : 'border border-accent/20 bg-accent/10 text-accent-soft'
                      }`}
                    >
                      {turn.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {step >= 0 && (
              <div className="flex items-center justify-between border-t border-white/8 px-6 py-3">
                <button
                  onClick={reset}
                  className="text-xs text-text-secondary transition-colors hover:text-text-primary"
                >
                  ↺ Replay
                </button>
                {finished && (
                  <button
                    onClick={() => toggleAssistant(true)}
                    className="text-xs text-accent transition-colors hover:text-accent-soft"
                  >
                    Want this for your business? →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* workflow + captured data */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/8 bg-surface/40 p-6">
              <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-text-secondary">
                Automation workflow
              </p>
              <ol className="space-y-2.5">
                {RECEPTION_STAGES.map((stage) => {
                  const done = reachedStages.has(stage);
                  const active = activeStage === stage;
                  return (
                    <li key={stage} className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] transition-all duration-500 ${
                          done
                            ? 'border-accent bg-accent/20 text-accent-soft'
                            : 'border-white/10 text-text-secondary'
                        } ${active ? 'ring-2 ring-accent/40' : ''}`}
                      >
                        {done ? '✓' : ''}
                      </span>
                      <span
                        className={`text-sm transition-colors duration-500 ${
                          done ? 'text-text-primary' : 'text-text-secondary'
                        }`}
                      >
                        {stage}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <AnimatePresence>
              {finished && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="rounded-3xl border border-accent/20 bg-accent/5 p-6"
                >
                  <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-accent-soft">
                    Generated summary
                  </p>
                  <dl className="space-y-2 text-sm">
                    {Object.entries(RECEPTION_SUMMARY).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="capitalize text-text-secondary">{k}</dt>
                        <dd className="text-right text-text-primary">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
