import type { Variants, Transition } from 'framer-motion';

/* ----------------------------------------------------------------------------
   ZUMI Global Motion System
   Reusable motion primitives. Motion communicates hierarchy, never decoration.
   One easing language, three durations. Compose — don't reinvent per component.
---------------------------------------------------------------------------- */

export const EASE = [0.16, 1, 0.3, 1] as const; // signature "zumi" ease-out
export const EASE_IN = [0.7, 0, 0.84, 0] as const;

export const DUR = {
  fast: 0.24,
  base: 0.5,
  slow: 0.9,
  cinematic: 1.4,
} as const;

export const spring: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 0.9,
};

/** Fade + rise. The default entrance for any block of content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE },
  },
};

/** Container that staggers its children into view. */
export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

/** Subtle scale-in for media / 3D-adjacent surfaces. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE } },
};

/** Per-character reveal (used by the loader & headline treatments). */
export const charReveal: Variants = {
  hidden: { opacity: 0, y: '0.4em', filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: DUR.base, ease: EASE },
  },
};

/** Standard viewport config so reveals trigger consistently across the site. */
export const inView = { once: true, amount: 0.3 } as const;
