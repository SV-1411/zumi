'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CASE_STUDIES, type CaseStudy } from '@/lib/work';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE } from '@/lib/motion';

function Card({ study, index }: { study: CaseStudy; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.08, ease: EASE }}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        backgroundImage: `radial-gradient(120% 120% at 80% 0%, ${study.accent}, transparent 60%)`,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/8 bg-surface/40 p-8 transition-[border-color] duration-500 hover:border-accent/30 md:p-10"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.3em] text-text-secondary">
          {study.sector}
        </span>
        <span className="font-display text-sm text-text-secondary">
          {study.client}
        </span>
      </div>

      <h3 className="mt-8 max-w-md text-balance font-display text-2xl font-semibold leading-tight tracking-tight md:text-[1.7rem]">
        {study.title}
      </h3>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
        {study.summary}
      </p>

      <div className="mt-8 flex items-end gap-8">
        <div>
          <div className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-semibold leading-none tracking-tighter text-text-primary">
            {study.metric.value}
          </div>
          <p className="mt-2 text-xs text-text-secondary">{study.metric.label}</p>
        </div>
        <div className="mb-1 space-y-1.5">
          {study.secondary.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="font-display text-sm font-semibold text-accent-soft">
                {s.value}
              </span>
              <span className="text-xs text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-t border-white/8 pt-6">
        {study.stack.map((t) => (
          <span
            key={t}
            className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-text-secondary"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-accent/5 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
    </motion.article>
  );
}

export function Work() {
  return (
    <section id="work" className="relative py-section">
      <div className="shell">
        <SectionHeading
          eyebrow="Selected work"
          title="Outcomes, in production."
          lede="We don't ship slideware. Every engagement below is a live system measured by the one number the business cares about."
          className="mb-16"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {CASE_STUDIES.map((s, i) => (
            <Card key={s.id} study={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
