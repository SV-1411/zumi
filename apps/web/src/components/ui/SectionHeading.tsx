'use client';

import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Consistent section header block — eyebrow + title + optional lede — with a
 * staggered reveal. Keeps every section's altitude and rhythm identical.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={stagger(0.07)}
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      <motion.p
        variants={fadeUp}
        className="mb-4 text-[11px] uppercase tracking-[0.42em] text-text-secondary"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="text-balance font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] tracking-tighter text-gradient"
      >
        {title}
      </motion.h2>
      {lede && (
        <motion.p
          variants={fadeUp}
          className={cn(
            'mt-5 text-text-secondary',
            align === 'center' && 'mx-auto max-w-xl'
          )}
        >
          {lede}
        </motion.p>
      )}
    </motion.div>
  );
}
