'use client';

import { motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { EASE } from '@/lib/motion';
import { FollowCursorButton } from '@/components/fx/FollowCursorButton';
import { ParallaxBg } from './ParallaxBg';

const DOMAINS = ['Design', 'Video', 'Web', 'Automation', 'Branding', 'AI'];

export function Hero() {
  const loaded = useExperience((s) => s.loaded);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      <ParallaxBg video="/media/city.mp4" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
          transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
          className="mb-6 text-[11px] font-medium uppercase tracking-[0.42em] text-text-secondary"
        >
          Shivansh Verma, full-stack &amp; AI engineer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={loaded ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0 }}
          transition={{ delay: 0.32, duration: 1, ease: EASE }}
          className="max-w-5xl text-balance font-display text-[clamp(2.8rem,8.5vw,7rem)] font-bold leading-[0.9] tracking-tightest text-ink"
        >
          I build the{' '}
          <span className="italic text-accent">ambitious</span>
          <span className="text-accent">,</span> real.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 10 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
          className="mt-7 max-w-2xl text-balance text-base text-text-secondary md:text-lg"
        >
          I design and engineer production systems,{' '}
          <span className="font-medium text-ink">
            AI agents, SaaS, games, robotics and fintech
          </span>
         . A few of them are below, running live.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ delay: 0.62, duration: 0.7, ease: EASE }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {DOMAINS.map((d) => (
            <span
              key={d}
              className="rounded-full border border-black/15 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink backdrop-blur-md"
            >
              {d}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 16 }}
          transition={{ delay: 0.72, duration: 0.7, ease: EASE }}
          className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
        >
          <FollowCursorButton href="#work" cursorLabel="See the work ↓">
            See the work
          </FollowCursorButton>
          <FollowCursorButton href="#domains" variant="ghost" cursorLabel="What I do ↓">
            What I do
          </FollowCursorButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-text-secondary">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-9 w-px bg-gradient-to-b from-ink to-transparent"
        />
      </motion.div>
    </section>
  );
}
