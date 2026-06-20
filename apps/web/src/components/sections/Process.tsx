'use client';

import { motion } from 'framer-motion';
import { PROCESS } from '@/lib/process';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE } from '@/lib/motion';

export function Process() {
  return (
    <section className="relative py-section">
      <div className="shell grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* sticky intro — stays in view while the steps scroll past */}
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <SectionHeading
            eyebrow="How we work"
            title={<>From a brief to a system you own.</>}
            lede="Four phases, weekly visibility, zero black boxes. You see the real thing growing in your own environment the whole way through."
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            className="mt-10 h-px origin-left bg-gradient-to-r from-accent to-transparent"
          />
        </div>

        {/* the steps */}
        <ol className="relative space-y-4">
          {/* connecting spine */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-white/8" />
          {PROCESS.map((step, i) => (
            <motion.li
              key={step.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className="group relative flex gap-6 rounded-2xl border border-transparent p-4 transition-colors duration-500 hover:border-white/8 hover:bg-surface/40"
            >
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-background font-display text-sm text-text-secondary transition-colors duration-500 group-hover:border-accent/50 group-hover:text-accent">
                {step.no}
              </div>
              <div className="pt-2">
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
                  {step.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {step.outputs.map((o) => (
                    <span
                      key={o}
                      className="rounded-full border border-white/8 px-3 py-1 text-xs text-text-secondary"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
