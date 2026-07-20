'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PROJECTS } from '@/lib/projects';
import { InViewMount } from '@/components/fx/InViewMount';
import { EASE } from '@/lib/motion';

// projects without a live embed, shown as a moving showreel with stand-in footage
const CLIP: Record<string, string> = {
  'pokemon-india': '/media/creative.mp4',
  'autopilot-3d': '/media/world.mp4',
  'drone-safety': '/media/city.mp4',
  drishti: '/media/studio.mp4',
  'silent-verify': '/media/fashion.mp4',
  civicpulse: '/media/world.mp4',
};

const SLIDES = PROJECTS.filter((p) => CLIP[p.id]).map((p) => ({
  ...p,
  clip: CLIP[p.id],
}));

function Carousel() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  const s = SLIDES[i];
  if (!s) return null;

  return (
    <div className="relative">
      <div className="grid items-stretch gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-2">
        {/* moving footage half */}
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[420px]">
          <AnimatePresence mode="popLayout">
            <motion.video
              key={s.id}
              src={s.clip}
              autoPlay
              muted
              loop
              playsInline
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/30" />
          <span className="absolute left-5 top-5 rounded-full bg-black/50 px-3 py-1 text-[11px] uppercase tracking-wide text-white/80 backdrop-blur-md">
            Preview reel
          </span>
        </div>

        {/* info half */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent-soft">
                {s.category}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-tight text-white">
                {s.name}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                {s.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.stack.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* controls */}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              data-cursor="hover"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              data-cursor="hover"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink"
            >
              →
            </button>
            <div className="ml-2 flex gap-1.5">
              {SLIDES.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Go to ${k + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    k === i ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
            <span className="ml-auto text-xs tabular-nums text-white/40">
              {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NonDemoReel() {
  return (
    <section id="reel" className="relative bg-ink py-section">
      <div className="shell">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.42em] text-white/50">
              Also in the workshop
            </p>
            <h2 className="max-w-xl font-display text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-[1.04] tracking-tighter text-white">
              More builds, in motion.
            </h2>
          </div>
          <p className="max-w-xs text-sm text-white/50">
            Products where the demo isn&apos;t public yet, here&apos;s a look at
            what&apos;s cooking.
          </p>
        </div>

        <InViewMount margin="150px">
          <Carousel />
        </InViewMount>
      </div>
    </section>
  );
}
