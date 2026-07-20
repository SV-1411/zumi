'use client';

import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';

/**
 * FollowCursorButton — a magnetic CTA. The whole button eases toward the
 * pointer, an inner spotlight tracks the local cursor position, and the label
 * lifts on hover. Renders as <a> when href is set, else <button>.
 */
export function FollowCursorButton({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'solid',
  className,
  cursorLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'solid' | 'ghost';
  className?: string;
  cursorLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    setPos({ x: (mx - r.width / 2) * 0.3, y: (my - r.height / 2) * 0.4 });
    setSpot({ x: (mx / r.width) * 100, y: (my / r.height) * 100 });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const solid = variant === 'solid';
  const inner = (
    <>
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120px circle at ${spot.x}% ${spot.y}%, ${
            solid ? 'rgba(255,255,255,0.35)' : 'rgba(79,111,255,0.25)'
          }, transparent 60%)`,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  const cls = `group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300 ${
    solid
      ? 'bg-ink text-white hover:bg-black'
      : 'border border-black/15 text-text-primary hover:border-accent/60'
  } ${className ?? ''}`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={spring}
      className="inline-block"
      data-cursor-label={cursorLabel}
    >
      {href ? (
        <a href={href} className={cls} onClick={onClick}>
          {inner}
        </a>
      ) : (
        <button type={type} className={cls} onClick={onClick}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
