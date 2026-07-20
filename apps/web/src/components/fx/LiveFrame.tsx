'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE } from '@/lib/motion';
import type { Project } from '@/lib/projects';

/**
 * LiveFrame — the "show, don't tell" surface.
 *
 * Priority ladder for what a visitor sees inside the browser chrome:
 *   1. embeddable live site  → a real, scaled, non-interactive <iframe> of the
 *      actual deployment (mounted only once in view, for perf)
 *   2. video reel            → autoplay/muted/loop screen recording
 *   3. generated poster      → branded SVG fallback (always present)
 *
 * The whole surface links to the live site (new tab) when one exists and drives
 * the custom cursor label ("Explore live ↗" / "Watch the reel").
 */

const DESIGN_WIDTH = 1440; // width we render the live site at, then scale to fit

export function LiveFrame({
  project,
  className,
  aspect = 16 / 10,
}: {
  project: Project;
  className?: string;
  aspect?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // NOT once — the iframe mounts only while near the viewport and unmounts when
  // it leaves, so we never keep 4 live sites decoding at the same time.
  const inView = useInView(wrapRef, { margin: '300px' });
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0.25);

  const canEmbed = !!project.liveUrl && project.embeddable;
  const href = project.liveUrl;
  const label = canEmbed
    ? 'Explore live ↗'
    : href
      ? 'Open live ↗'
      : project.video
        ? 'Watch the reel'
        : 'View project';

  // when the frame leaves the viewport it unmounts; reset loaded so the poster
  // covers the reload next time it comes back (no white flash)
  useEffect(() => {
    if (!inView) setLoaded(false);
  }, [inView]);

  // keep the iframe (rendered at DESIGN_WIDTH) scaled to the card's real width
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !canEmbed) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setScale(entry.contentRect.width / DESIGN_WIDTH);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [canEmbed]);

  return (
    <a
      href={href ?? undefined}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      data-cursor-label={label}
      className="block"
    >
      <motion.div
        ref={wrapRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: EASE }}
        className={`group relative block w-full overflow-hidden rounded-2xl border border-black/10 bg-surface/60 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] transition-[border-color] duration-500 hover:border-accent/40 ${className ?? ''}`}
        style={{ aspectRatio: String(aspect) }}
      >
        {/* browser chrome */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-9 items-center gap-2 border-b border-black/8 bg-background/70 px-4 backdrop-blur-md">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
          <div className="mx-auto flex max-w-[70%] items-center gap-1.5 truncate rounded-md bg-black/[0.05] px-3 py-1 text-[11px] text-text-secondary">
            {project.status === 'live' && (
              <span className="mr-1 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#28c840]" />
            )}
            <span className="truncate">
              {href
                ? href.replace(/^https?:\/\//, '')
                : `${project.id}.zumi.studio`}
            </span>
          </div>
        </div>

        {/* media stack */}
        <div className="absolute inset-x-0 bottom-0 top-9 overflow-hidden">
          <img
            src={project.poster}
            alt={`${project.name} preview`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />

          {project.video && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={project.video}
              poster={project.poster}
              autoPlay
              muted
              loop
              playsInline
            />
          )}

          {canEmbed && inView && (
            <div
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: DESIGN_WIDTH,
                height: DESIGN_WIDTH / aspect,
                transform: `scale(${scale})`,
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.7s ease',
              }}
            >
              <iframe
                src={project.liveUrl}
                title={`${project.name} — live`}
                className="h-full w-full border-0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
                scrolling="no"
                tabIndex={-1}
                onLoad={() => setLoaded(true)}
              />
            </div>
          )}
        </div>

        {/* pointer shield — the visitor interacts with the card, not the embed */}
        <span className="absolute inset-0 z-30" aria-hidden />

        {/* hover sheen + ambient tint */}
        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div
          className="pointer-events-none absolute -inset-40 z-0 opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
          style={{ background: project.accent }}
        />
      </motion.div>
    </a>
  );
}
