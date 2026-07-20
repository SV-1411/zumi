'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { EASE } from '@/lib/motion';
import { TextVideoMask } from '@/framer/Client';

/**
 * Title-card entry, light edition. ZUMI is cut out of moving footage of the
 * world; a hairline fills, then the wordmark rushes forward and dissolves into
 * the site, it opens like a film, not a spinner.
 */
const FILM = '/media/world.mp4';

export function Loader() {
  const setLoaded = useExperience((s) => s.setLoaded);
  const [done, setDone] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState('220px');

  useEffect(() => {
    if (window.location.search.includes('skipintro')) {
      setDone(true);
      setLoaded(true);
      return;
    }
    setFontSize(`${Math.min(window.innerWidth * 0.26, 340)}px`);

    // timer-driven (NOT rAF) so it always completes, rAF is throttled/paused
    // when the tab is hidden or under heavy load; the intro must never hang.
    const DUR = 2400;
    const start = Date.now();
    const iv = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / DUR) * 100);
      setProgress(Math.round(p));
      if (p >= 100) clearInterval(iv);
    }, 40);
    const tReveal = setTimeout(() => setReveal(true), DUR);
    const tDone = setTimeout(() => setDone(true), DUR + 900);
    const tLoaded = setTimeout(() => setLoaded(true), DUR + 1500);

    return () => {
      clearInterval(iv);
      clearTimeout(tReveal);
      clearTimeout(tDone);
      clearTimeout(tLoaded);
    };
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* ghost letterforms so ZUMI always reads even over bright footage */}
          <div
            className="pointer-events-none absolute select-none font-display font-extrabold tracking-tightest text-black/[0.06]"
            style={{ fontSize }}
          >
            ZUMI
          </div>

          <motion.div
            className="relative flex items-center justify-center"
            style={{ width: '100%', height: '46vh' }}
            initial={{ scale: 1.03, opacity: 0 }}
            animate={
              reveal
                ? { scale: 8, opacity: 0, filter: 'blur(6px)' }
                : { scale: 1, opacity: 1, filter: 'blur(0px)' }
            }
            transition={{
              duration: reveal ? 1.0 : 0.9,
              ease: reveal ? [0.7, 0, 0.3, 1] : EASE,
            }}
          >
            <TextVideoMask
              text="ZUMI"
              videoUrl={FILM}
              useVideoFile={false}
              backgroundColor="transparent"
              textColor="#0B0B0B"
              font={{
                fontSize,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                fontFamily: 'Satoshi, General Sans, Inter, sans-serif',
              }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-14 left-0 right-0 flex flex-col items-center gap-4"
            animate={{ opacity: reveal ? 0 : 1, y: reveal ? 10 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="text-[10px] uppercase tracking-[0.5em] text-text-secondary">
              A multidisciplinary studio
            </div>
            <div className="h-px w-[min(40vw,360px)] overflow-hidden bg-black/10">
              <div
                className="h-full bg-ink transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
