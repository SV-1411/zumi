'use client';

import { motion } from 'framer-motion';
import { SERVICES } from '@/lib/services';
import { Hologram } from './Hologram';
import { fadeUp, stagger, inView } from '@/lib/motion';

export function Services() {
  return (
    <section id="services" className="relative py-section">
      <div className="shell">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={stagger(0.06)}
          className="mb-20 max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-[11px] uppercase tracking-[0.42em] text-text-secondary"
          >
            What we build
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-balance font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] tracking-tighter"
          >
            Systems, not deliverables.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-text-secondary"
          >
            Each engagement is a working system your team owns — engineered,
            integrated and deployed.
          </motion.p>
        </motion.div>

        <div className="space-y-4">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-1 items-center gap-8 rounded-2xl border border-white/8 bg-surface/40 p-8 transition-colors duration-500 hover:border-accent/30 hover:bg-surface/70 md:grid-cols-[160px_1fr_auto]"
            >
              <div className="flex justify-center md:justify-start">
                <Hologram shape={s.shape} />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {s.name}
                  </h3>
                  <span className="rounded-full border border-accent/30 px-2.5 py-0.5 text-[11px] text-accent-soft">
                    {s.object}
                  </span>
                </div>
                <p className="max-w-xl text-text-secondary">{s.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-text-secondary"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden md:block">
                <span className="font-display text-sm text-text-secondary transition-colors group-hover:text-accent">
                  0{i + 1}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
