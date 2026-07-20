'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { TextVideoMask } from '@/framer/Client';

const FILM = '/media/creative.mp4';

/**
 * CinemaBand — a full-bleed title card between acts: a single huge word cut out
 * of moving film. The site reads as a sequence of shots, not a scroll.
 */
export function CinemaBand({
  word,
  eyebrow,
  video = FILM,
  height = '70vh',
}: {
  word: string;
  eyebrow?: string;
  video?: string;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10%' });
  const [fontSize, setFontSize] = useState('220px');

  useEffect(() => {
    const compute = () =>
      setFontSize(
        `${Math.min((window.innerWidth * 0.9) / Math.max(word.length, 3) * 1.4, 360)}px`
      );
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [word.length]);

  return (
    <section
      ref={ref}
      className="relative flex select-none flex-col items-center justify-center overflow-hidden bg-ink"
      style={{ height }}
    >
      {eyebrow && (
        <p className="absolute top-[18%] z-10 text-[11px] uppercase tracking-[0.5em] text-white/40">
          {eyebrow}
        </p>
      )}
      {/* ghost letterforms so the word always reads over the footage */}
      <div
        aria-hidden
        className="pointer-events-none absolute select-none whitespace-nowrap font-display font-extrabold tracking-tightest text-white/[0.08]"
        style={{ fontSize }}
      >
        {word}
      </div>
      <div className="h-full w-full">
        {inView && (
          <TextVideoMask
            text={word}
            videoUrl={video}
            useVideoFile={false}
            backgroundColor="transparent"
            textColor="#FFFFFF"
            font={{
              fontSize,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              fontFamily: 'Satoshi, General Sans, Inter, sans-serif',
            }}
          />
        )}
      </div>
    </section>
  );
}
