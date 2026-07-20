'use client';

import { motion } from 'framer-motion';
import { PROJECTS, type Project } from '@/lib/projects';
import { ScrollGallery } from '@/components/fx/ScrollGallery';
import { RevealText } from '@/components/fx/RevealText';
import { EASE } from '@/lib/motion';

const MEDIUM_LABEL: Record<Project['medium'], string> = {
  web: 'Web',
  mobile: 'Mobile',
  game: 'Game / 3D',
  hardware: 'Hardware',
  api: 'API',
};

function Card({ project }: { project: Project }) {
  const href = project.liveUrl ?? project.repoUrl;
  return (
    <a
      href={href ?? undefined}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      data-cursor-label="See more →"
      className="group relative block w-[78vw] shrink-0 sm:w-[440px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 bg-surface">
        {/* CSS-only mystery reveal, GPU-cheap (no per-card SVG turbulence) */}
        <img
          src={project.poster}
          alt={project.name}
          loading="lazy"
          className="h-full w-full scale-110 object-cover blur-[2px] brightness-[0.38] grayscale transition-all duration-700 ease-zumi group-hover:scale-100 group-hover:blur-0 group-hover:brightness-100 group-hover:grayscale-0"
          draggable={false}
          style={{ willChange: 'transform, filter' }}
        />

        {/* mystery veil, dark, lifts on hover for the reveal */}
        <div className="pointer-events-none absolute inset-0 bg-ink/45 transition-opacity duration-700 group-hover:opacity-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

        {/* reveal hint, centered, fades as the work resolves */}
        <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-[10px] uppercase tracking-[0.4em] text-white/45 transition-opacity duration-500 group-hover:opacity-0">
          Hover to reveal
        </span>

        {/* top row */}
        <div className="absolute inset-x-5 top-5 flex items-center justify-between">
          <span className="rounded-full border border-black/15 bg-background/40 px-3 py-1 text-[11px] text-text-secondary backdrop-blur-md">
            {MEDIUM_LABEL[project.medium]}
          </span>
          <span className="text-[11px] tabular-nums text-white/60">
            {project.year}
          </span>
        </div>

        {/* caption, light, since it sits over the dark reveal veil */}
        <div className="absolute inset-x-5 bottom-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent-soft">
            {project.category}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">
            {project.name}
          </h3>
          <p className="mt-1.5 max-w-[92%] translate-y-1 text-sm text-white/70 opacity-0 transition-all duration-500 ease-zumi group-hover:translate-y-0 group-hover:opacity-100">
            {project.tagline}
          </p>
        </div>
      </div>
    </a>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative">
      {/* heading */}
      <div className="shell pt-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] uppercase tracking-[0.42em] text-text-secondary">
              The full shelf
            </p>
            <RevealText
              text="Everything we’ve made."
              className="text-balance font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] tracking-tighter text-gradient"
            />
          </div>
          <p className="hidden text-sm text-text-secondary md:block">
            Scroll → to browse
          </p>
        </motion.div>
      </div>

      {/* horizontal scroll gallery */}
      <ScrollGallery heightVh={320} className="mt-14">
        {PROJECTS.map((p) => (
          <Card key={p.id} project={p} />
        ))}
        {/* tail spacer card, a soft CTA at the end of the reel */}
        <a
          href="#contact"
          data-cursor-label="Let’s talk ↗"
          className="group flex w-[70vw] shrink-0 flex-col justify-center rounded-2xl border border-black/15 bg-surface/30 p-10 sm:w-[380px]"
        >
          <p className="font-display text-3xl font-semibold leading-tight tracking-tight">
            Your project, next?
          </p>
          <p className="mt-3 text-sm text-text-secondary">
            We take on a handful of builds at a time. Let&apos;s make yours the
            one people screenshot.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm text-accent">
            Start a conversation
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </a>
      </ScrollGallery>
    </section>
  );
}
