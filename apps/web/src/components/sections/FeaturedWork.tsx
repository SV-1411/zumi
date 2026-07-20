'use client';

import { motion } from 'framer-motion';
import { FEATURED, type Project } from '@/lib/projects';
import { LiveFrame } from '@/components/fx/LiveFrame';
import { RevealText } from '@/components/fx/RevealText';
import { TextReveal } from '@/framer/Client';
import { Reveal } from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

function Row({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {/* live surface */}
      <div className={flip ? 'lg:order-2' : ''}>
        <LiveFrame project={project} />
      </div>

      {/* narrative */}
      <div className={flip ? 'lg:order-1' : ''}>
        <Reveal className="mb-5 flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.35em] text-accent">
            {project.category}
          </span>
          {project.status === 'live' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#28c840]/30 bg-[#28c840]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#7ee2a0]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#28c840]" />
              Live now
            </span>
          )}
        </Reveal>

        <RevealText
          text={project.name}
          as="h3"
          className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.02] tracking-tighter"
        />

        <Reveal delay={0.1} className="mt-4 max-w-md text-lg text-text-primary/90">
          {project.tagline}
        </Reveal>
        <Reveal delay={0.15} className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
          {project.summary}
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-2xl font-semibold tracking-tight text-accent-soft">
                {m.value}
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">{m.label}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-text-secondary"
            >
              {t}
            </span>
          ))}
        </Reveal>

        {project.liveUrl && (
          <Reveal delay={0.3}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label={project.embeddable ? 'Explore live ↗' : 'Open live ↗'}
              className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-text-primary"
            >
              <span className="relative">
                {project.embeddable ? 'Explore it live' : 'Open the live site'}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-zumi group-hover:scale-x-100" />
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export function FeaturedWork() {
  return (
    <section id="work" className="relative py-section">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-20 max-w-2xl"
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.42em] text-text-secondary">
            Selected work
          </p>
          <RevealText
            text="Real systems. Running live. Not slideware."
            className="text-balance font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] tracking-tighter text-gradient"
          />
          <div className="mt-5 text-lg text-text-secondary">
            <TextReveal text="Hover any surface below, you're looking at the actual product, not a screenshot. Click through to use it yourself." />
          </div>
        </motion.div>

        <div className="space-y-28 md:space-y-40">
          {FEATURED.map((p, i) => (
            <Row key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
