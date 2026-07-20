'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '@/lib/motion';

/**
 * RevealText — mask-and-rise typography.
 * Splits the string into words and lifts each from behind a clip mask on scroll.
 * `as` controls the tag; styling comes from className (keep font sizing there).
 */
export function RevealText({
  text,
  as = 'h2',
  className,
  delay = 0,
  stagger = 0.045,
  amount = 0.6,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
}) {
  const words = text.split(' ');
  const Tag = motion[as] as typeof motion.h2;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * FluidText — a headline whose optical weight & spacing breathe continuously,
 * plus a slow gradient drift. Pairs with a variable-ish display face.
 */
export function FluidText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      style={{
        background:
          'linear-gradient(110deg, #0b0b0b 8%, #3b40ff 45%, #0b0b0b 78%)',
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block',
      }}
      animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  );
}
