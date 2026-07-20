'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { ParticleText } from '@/framer/Client';

/**
 * Statement — a full-bleed, cursor-reactive particle headline. The letters are
 * built from particles that scatter away from the pointer and ease back. An
 * interactive "touch the work" beat between the gallery and the about act.
 */
export function Statement({
  text = 'BUILT TO SHIP',
}: {
  text?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15%' });
  const [fontSize, setFontSize] = useState(150);

  useEffect(() => {
    const compute = () =>
      setFontSize(
        Math.max(56, Math.min((window.innerWidth * 0.82) / text.length, 190))
      );
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [text.length]);

  return (
    <section
      id="statement"
      ref={ref}
      className="relative flex h-[70vh] w-full select-none items-center justify-center overflow-hidden bg-ink"
    >
      <p className="absolute top-[16%] z-10 text-[11px] uppercase tracking-[0.5em] text-white/40">
        Interlude
      </p>
      <div className="h-full w-full">
        {inView && (
          <ParticleText
            text={text}
            particleColor="#FFFFFF"
            backgroundColor="#0B0B0B"
            particleSize={2}
            particleDensity={3}
            mouseRadius={130}
            returnSpeed={0.06}
            font={{
              fontSize,
              fontWeight: 800,
              fontFamily: 'Satoshi, General Sans, Inter, sans-serif',
            }}
          />
        )}
      </div>
    </section>
  );
}
