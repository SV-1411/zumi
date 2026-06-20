'use client';

import { motion } from 'framer-motion';
import { STACK } from '@/lib/stack';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE } from '@/lib/motion';

export function Stack() {
  return (
    <section className="relative py-section">
      <div className="shell">
        <SectionHeading
          eyebrow="Engineering stack"
          title="Modern foundations, end to end."
          lede="A deliberately current stack — the same tools we'd choose for a Fortune 500 platform and a week-one prototype alike."
          className="mb-16"
        />

        <div className="grid gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((group, i) => (
            <motion.div
              key={group.layer}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="group bg-background p-7 transition-colors duration-500 hover:bg-surface/60"
            >
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
                  {group.layer}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {group.tools.map((t) => (
                  <li
                    key={t}
                    className="text-sm text-text-secondary transition-colors duration-300 group-hover:text-text-primary"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
