'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { INTENT_COPY } from '@/lib/content';
import { IntentSelector } from './IntentSelector';
import { EASE } from '@/lib/motion';

// 3D is client-only and lazy — keeps it out of the critical render path.
const CoreScene = dynamic(
  () => import('@/components/three/CoreScene').then((m) => m.CoreScene),
  { ssr: false }
);

export function Hero() {
  const loaded = useExperience((s) => s.loaded);
  const intent = useExperience((s) => s.intent);
  const copy = INTENT_COPY[intent ?? 'default'];

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      {/* faint engineered grid */}
      <div className="grid-veil pointer-events-none absolute inset-0" />

      {/* hero keeps a single restrained blue accent — no brown/green here */}
      <div className="glow-blue pointer-events-none absolute -left-32 top-10 h-[420px] w-[520px] blur-3xl opacity-60" />

      {/* Phase 1 — floating energy core */}
      <div className="absolute inset-0">
        {loaded && <CoreScene intensity={intent ? 1.25 : 1} />}
      </div>

      {/* vignette to seat the type over the 3D */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 30%, rgba(11,11,11,0.72) 100%)',
        }}
      />

      {/* Phase 2 — the question + intent */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={copy.eyebrow}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-6 text-[11px] uppercase tracking-[0.42em] text-text-secondary"
          >
            {copy.eyebrow}
          </motion.p>
        </AnimatePresence>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={
            loaded
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0 }
          }
          transition={{ delay: 0.2, duration: 1, ease: EASE }}
          className="max-w-4xl text-balance font-display text-[clamp(2.4rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-tightest"
        >
          What are you trying to build?
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={copy.line}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-6 max-w-xl text-balance text-base text-text-secondary md:text-lg"
          >
            {copy.line}
          </motion.p>
        </AnimatePresence>

        <div className="mt-10">
          <IntentSelector />
        </div>
      </div>

      {/* Phase 3 — scroll cue into the unfolding story */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-text-secondary/70">
          Scroll to begin
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-9 w-px bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
}
