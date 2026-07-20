'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ScrollGallery — vertical scroll drives a horizontal track. The section pins
 * for its height while the row of children slides across. Give it enough
 * children that the track is wider than the viewport.
 */
export function ScrollGallery({
  children,
  heightVh = 300,
  className,
}: {
  children: ReactNode;
  heightVh?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // travel the track from 2% to -72% of its own width across the scroll
  const xRaw = useTransform(scrollYProgress, [0, 1], ['2%', '-72%']);
  const x = useSpring(xRaw, { stiffness: 90, damping: 24, mass: 0.6 });

  return (
    <div ref={ref} style={{ height: `${heightVh}vh` }} className={className}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 pl-6 md:gap-8 md:pl-[8vw]">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
