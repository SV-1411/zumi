'use client';

import { motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { Magnetic } from '@/components/ui/Magnetic';
import { EASE } from '@/lib/motion';

export function FinalCTA() {
  const toggle = useExperience((s) => s.toggleAssistant);

  return (
    <section className="relative overflow-hidden py-section">
      {/* accent halo + grain (brown/green ambience comes from the page glow layer) */}
      <div className="accent-glow pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2" />
      <div className="noise pointer-events-none absolute inset-0" />

      <div className="shell relative flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-6 text-[11px] uppercase tracking-[0.42em] text-text-secondary"
        >
          Build with ZUMI
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: EASE }}
          className="max-w-4xl text-balance font-display text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.95] tracking-tightest text-gradient"
        >
          Let&apos;s build what&apos;s next.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-7 max-w-xl text-balance text-text-secondary md:text-lg"
        >
          Tell our AI consultant what you&apos;re building. Get a recommended
          architecture, stack and timeline in minutes — no sales call required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic strength={0.5}>
            <button
              onClick={() => toggle(true)}
              className="group relative overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-medium text-white shadow-[0_0_50px_rgba(79,111,255,0.4)] transition-shadow duration-500 hover:shadow-[0_0_80px_rgba(79,111,255,0.65)]"
            >
              <span className="relative z-10">Start with ZUMI AI</span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 ease-zumi group-hover:translate-x-0" />
            </button>
          </Magnetic>

          <Magnetic strength={0.4}>
            <a
              href="#work"
              className="rounded-full border border-white/15 px-8 py-4 text-sm text-text-primary transition-colors duration-300 hover:border-accent/60 hover:bg-accent/10"
            >
              See our work
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
