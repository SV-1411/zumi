'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Aurora } from '@/reactbits/Client';
import { useExperience } from '@/lib/store';

/**
 * ParallaxBg — layered hero backdrop reacting to the cursor.
 *   • React Bits Aurora (WebGL) — the colour flourish, tinted to our palette
 *   • a real muted clip, washed into the paper
 *   • a dotted grid + a clean centre light-pool so the type stays crisp
 * Each layer travels a different amount with the pointer for depth.
 */
export function ParallaxBg({ video = '/media/city.mp4' }: { video?: string }) {
  // only spin up the WebGL Aurora AFTER the loader is gone, so its render loop
  // never competes with the intro animation.
  const loaded = useExperience((s) => s.loaded);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  const vX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const vY = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const aX = useTransform(sx, [-0.5, 0.5], [30, -30]);
  const aY = useTransform(sy, [-0.5, 0.5], [20, -20]);
  const gridX = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const gridY = useTransform(sy, [-0.5, 0.5], [10, -10]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* real footage, washed into the paper (bottom layer) */}
      <motion.div style={{ x: vX, y: vY, scale: 1.12 }} className="absolute inset-0">
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-[0.10] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </motion.div>

      {/* React Bits Aurora — the colour flourish, above the footage wash */}
      <motion.div
        style={{ x: aX, y: aY }}
        className="absolute -inset-x-24 -top-28 h-[95%] opacity-90 mix-blend-multiply"
      >
        {loaded && (
          <Aurora colorStops={['#3B40FF', '#7C5CFF', '#FF7A45']} amplitude={1.2} blend={0.55} />
        )}
      </motion.div>

      {/* clean light pool behind the headline so type always pops */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 40% 34% at 50% 50%, rgba(241,240,236,0.82), transparent 72%)',
        }}
      />

      {/* faint dotted parallax grid */}
      <motion.div
        style={{
          x: gridX,
          y: gridY,
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 75%)',
        }}
        className="absolute inset-[-40px] opacity-40"
      />
    </div>
  );
}
