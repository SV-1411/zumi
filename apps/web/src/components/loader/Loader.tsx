'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LoaderScene } from './LoaderScene';
import { useExperience } from '@/lib/store';
import { EASE } from '@/lib/motion';

const WORD = 'ZUMI'.split('');

/**
 * Cinematic entry sequence:
 *   particles assemble -> structure forms -> "ZUMI" reveals letter by letter
 *   -> core morphs (flash) -> world is revealed.
 * The percentage drives the 3D assembly via a shared ref (no re-render churn).
 */
export function Loader() {
  const progressRef = useRef(0);
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);
  const [morphing, setMorphing] = useState(false);
  const setLoaded = useExperience((s) => s.setLoaded);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const DURATION = 3200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-in-out for a deliberate, cinematic climb
      const eased =
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      progressRef.current = eased;
      setDisplay(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // morph beat, then hand off to the world
        setMorphing(true);
        setTimeout(() => {
          setDone(true);
          setTimeout(() => setLoaded(true), 900);
        }, 650);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* 3D assembly */}
          <motion.div
            className="absolute inset-0"
            animate={
              morphing
                ? { scale: 1.35, filter: 'blur(6px)', opacity: 0.6 }
                : { scale: 1, filter: 'blur(0px)', opacity: 1 }
            }
            transition={{ duration: 0.65, ease: EASE }}
          >
            <Canvas
              camera={{ position: [0, 0, 7], fov: 45 }}
              dpr={[1, 1.6]}
              gl={{ alpha: true, antialias: true }}
            >
              <LoaderScene progressRef={progressRef} />
            </Canvas>
          </motion.div>

          {/* morph flash */}
          <AnimatePresence>
            {morphing && (
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(79,111,255,0.35), transparent 55%)',
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 0], scale: 1.6 }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            )}
          </AnimatePresence>

          {/* wordmark */}
          <div className="relative z-10 flex select-none gap-[0.12em] text-[clamp(3rem,12vw,9rem)] font-display font-semibold tracking-tightest">
            {WORD.map((ch, i) => (
              <motion.span
                key={ch + i}
                initial={{ opacity: 0, y: '0.5em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
                transition={{
                  delay: 0.5 + i * 0.18,
                  duration: 0.7,
                  ease: EASE,
                }}
                className="text-text-primary"
                style={{ textShadow: '0 0 40px rgba(79,111,255,0.45)' }}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          {/* percentage + progress line */}
          <div className="absolute bottom-12 left-0 right-0 z-10 flex flex-col items-center gap-4">
            <div className="font-display text-sm tabular-nums text-text-secondary">
              {String(display).padStart(3, '0')}
              <span className="text-accent">%</span>
            </div>
            <div className="h-px w-[min(38vw,360px)] overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-accent"
                style={{ width: `${display}%` }}
              />
            </div>
            <div className="text-[10px] uppercase tracking-[0.42em] text-text-secondary/70">
              Initialising experience
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
