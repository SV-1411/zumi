'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

/**
 * VideoSlideshow — an auto-advancing crossfade reel of media (images or short
 * videos). Used to give non-embeddable projects a living, cinematic preview.
 */
export function VideoSlideshow({
  slides,
  interval = 3200,
  className,
}: {
  slides: { src: string; type?: 'image' | 'video'; alt?: string }[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [slides.length, interval]);

  const active = slides[i];
  if (!active) return null;

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1, ease: EASE }}
          className="absolute inset-0"
        >
          {active.type === 'video' ? (
            <video
              src={active.src}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={active.src}
              alt={active.alt ?? ''}
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* progress ticks */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, k) => (
            <span
              key={k}
              className={`h-1 rounded-full transition-all duration-500 ${
                k === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
