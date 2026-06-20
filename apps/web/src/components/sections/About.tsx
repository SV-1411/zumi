'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

const PRINCIPLES = [
  {
    title: 'Systems, not deliverables',
    body: 'We hand over working software your team owns and operates — source, infrastructure and the knowledge to run it.',
  },
  {
    title: 'AI with a human in the loop',
    body: 'Every autonomous action that matters is supervised. We build for trust before we build for autonomy.',
  },
  {
    title: 'Senior hands only',
    body: 'No layers, no juniors learning on your budget. The people who scope your work are the people who ship it.',
  },
  {
    title: 'Ship in weeks',
    body: 'Our own tooling turns a brief into a typed, deployable foundation fast — so you see value in your first month.',
  },
];

export function About() {
  return (
    <section id="about" className="relative py-section">
      <div className="shell">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title={
                <>
                  A studio that builds the systems running the future of business.
                </>
              }
            />
            <Reveal delay={0.1} className="mt-6 space-y-4 text-text-secondary">
              <p>
                ZUMI is a senior team of engineers, designers and AI specialists.
                We partner with companies that need real software — AI agents,
                healthcare platforms, ERP and CRM systems, automation — built to
                production standard and handed over clean.
              </p>
              <p>
                We sit at the intersection of cutting-edge AI and serious
                engineering: ambitious enough to ship novel products, disciplined
                enough that Fortune 500 operations can run on what we deliver.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 grid grid-cols-3 gap-6">
              {[
                { v: '24+', l: 'Capabilities' },
                { v: '6 wk', l: 'To first launch' },
                { v: '99.9%', l: 'Uptime' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-semibold tracking-tighter">
                    {s.v}
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{s.l}</p>
                </div>
              ))}
            </Reveal>
          </div>

          {/* principles */}
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className="rounded-2xl border border-white/8 bg-surface/40 p-6 transition-colors duration-500 hover:border-accent/30"
              >
                <div className="mb-4 font-display text-sm text-accent">0{i + 1}</div>
                <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
