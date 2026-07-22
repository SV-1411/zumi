'use client';

import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/fx/RevealText';
import { InViewMount } from '@/components/fx/InViewMount';
import { Silk } from '@/reactbits/Client';
import { EASE } from '@/lib/motion';

const PRINCIPLES = [
  {
    title: 'One head, every craft',
    body: 'Design, motion, engineering and automation live in one place. No hand-offs, no telephone game, just the work.',
  },
  {
    title: 'Ship, then sharpen',
    body: 'I get a real, working version live fast, then refine it in the open. Momentum beats perfection stuck in a folder.',
  },
  {
    title: 'Taste + systems',
    body: 'I care about the pixel and the pipeline. It should feel beautiful and run like clockwork.',
  },
  {
    title: 'Range on purpose',
    body: 'Brands, storefronts, products, AI, ops. Different disciplines sharpen the same instinct: make ambitious things real.',
  },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-section">
      {/* React Bits Silk — flowing shader backdrop, mounts only while in view */}
      <InViewMount
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.4] mix-blend-multiply"
        margin="100px"
      >
        <Silk speed={4} scale={1} color="#C7CAF0" noiseIntensity={1.4} rotation={0} />
      </InViewMount>

      <div className="shell relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.42em] text-text-secondary">
              About me
            </p>
            <RevealText
              text="One engineer, an unfair range."
              className="text-balance font-display text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-[1.04] tracking-tighter text-gradient"
            />

            <Reveal delay={0.1} className="mt-6 space-y-4 text-text-secondary">
              <p>
                I&apos;m Shivansh Verma. I design and build across the whole stack,
                brands and interfaces, products and APIs, games, robotics and the AI
                that runs behind them, the work most teams split across four people.
              </p>
              <p>
                I like it done properly and fast:{' '}
                <span className="text-text-primary">real, shipped, measurable</span>.
                If I take it on, it goes live.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 grid grid-cols-3 gap-6">
              {[
                { v: '12+', l: 'shipped projects' },
                { v: 'End to end', l: 'design to infra' },
                { v: 'Live', l: 'not slideware' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-semibold tracking-tighter md:text-3xl">
                    {s.v}
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{s.l}</p>
                </div>
              ))}
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className="rounded-2xl border border-black/10 bg-surface/70 p-6 transition-colors duration-500 hover:border-accent/40"
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
