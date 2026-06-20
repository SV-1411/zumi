'use client';

import { MARQUEE_ITEMS } from '@/lib/stack';

/**
 * Infinite capability ticker — two rows drifting in opposite directions. Pure
 * CSS animation (GPU-cheap), pauses on hover. Communicates breadth at a glance.
 */
function Row({
  items,
  reverse = false,
  dur = '42s',
}: {
  items: string[];
  reverse?: boolean;
  dur?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee flex overflow-hidden">
      <div
        className="marquee-track"
        style={{
          ['--marquee-dur' as string]: dur,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span className="px-6 font-display text-[clamp(1.1rem,2.2vw,1.6rem)] font-medium tracking-tight text-text-secondary/70 transition-colors hover:text-text-primary">
              {item}
            </span>
            <span className="text-accent/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  const half = Math.ceil(MARQUEE_ITEMS.length / 2);
  return (
    <section
      aria-hidden
      className="relative space-y-4 overflow-hidden border-y border-white/8 py-12"
      style={{
        maskImage:
          'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <Row items={MARQUEE_ITEMS.slice(0, half)} dur="46s" />
      <Row items={MARQUEE_ITEMS.slice(half)} reverse dur="52s" />
    </section>
  );
}
