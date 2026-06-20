'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE, DUR } from '@/lib/motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

/**
 * Scroll-reveal wrapper. One consistent entrance language across the whole
 * site — fade + directional rise with the signature ZUMI ease, triggered once
 * when ~25% of the element enters the viewport. Use `delay` to choreograph.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = DUR.slow,
  amount = 0.25,
  className,
  as = 'div',
  blur = true,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
  as?: 'div' | 'section' | 'span' | 'li' | 'article';
  blur?: boolean;
}) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...OFFSET[direction],
      ...(blur ? { filter: 'blur(8px)' } : {}),
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: 'blur(0px)' } : {}),
      transition: { duration, ease: EASE, delay },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}
