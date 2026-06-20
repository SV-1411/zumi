'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A slim accent bar pinned to the top of the viewport that tracks read-through
 * progress. Spring-smoothed so it glides rather than snapping with each tick.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  return <motion.div className="zumi-progress" style={{ scaleX }} aria-hidden />;
}
