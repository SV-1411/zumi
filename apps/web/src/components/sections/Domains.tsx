'use client';

import { motion } from 'framer-motion';
import { RevealText } from '@/components/fx/RevealText';
import { EASE } from '@/lib/motion';

const DOMAINS = [
  {
    k: '01',
    title: 'Brand & Design',
    body: 'Identity, art direction and design systems that make a brand impossible to ignore.',
    tags: ['Identity', 'UI/UX', 'Design systems'],
  },
  {
    k: '02',
    title: 'Video & Motion',
    body: 'Editing, motion graphics and content that stops the scroll and sells the story.',
    tags: ['Editing', 'Motion', 'Reels & ads'],
  },
  {
    k: '03',
    title: 'Web & Product',
    body: 'Sites, storefronts and full products, fast, cinematic, engineered to convert.',
    tags: ['Next.js', 'E-commerce', 'Web apps'],
  },
  {
    k: '04',
    title: 'Automation',
    body: 'We turn manual, repetitive operations into systems that run themselves.',
    tags: ['Workflows', 'Integrations', 'Ops'],
  },
  {
    k: '05',
    title: 'Applied AI',
    body: 'Agents, assistants and knowledge systems wired into what you already do.',
    tags: ['Agents', 'RAG', 'Assistants'],
  },
  {
    k: '06',
    title: 'Growth',
    body: 'Outreach, funnels and the connective tissue that turns work into revenue.',
    tags: ['Funnels', 'Outreach', 'Analytics'],
  },
];

export function Domains() {
  return (
    <section id="domains" className="relative py-section">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] uppercase tracking-[0.42em] text-text-secondary">
              What we do
            </p>
            <RevealText
              text="One studio. Every discipline."
              className="text-balance font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] tracking-tighter text-gradient"
            />
          </div>
          <p className="max-w-sm text-sm text-text-secondary">
            Most teams hand you off between agencies. We keep design, engineering,
            motion and automation in one room, so the work actually ships.
          </p>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d, i) => (
            <motion.a
              key={d.k}
              href="#contact"
              data-cursor-label="Start a project ↗"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: EASE }}
              className="group relative block bg-background p-8 transition-colors duration-500 hover:bg-ink"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-sm text-text-secondary transition-colors group-hover:text-white/60">
                  {d.k}
                </span>
                <span className="text-text-secondary transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent-soft">
                  →
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-white">
                {d.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary transition-colors group-hover:text-white/70">
                {d.body}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {d.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] text-text-secondary transition-colors group-hover:border-white/20 group-hover:text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
