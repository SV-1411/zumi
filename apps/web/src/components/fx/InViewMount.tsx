'use client';

import { useRef, type ReactNode } from 'react';
import { useInView } from 'framer-motion';

/**
 * InViewMount — mounts its children only while near the viewport and unmounts
 * them when they leave. Keeps heavy WebGL/canvas/video components (Fluid/Liquid
 * image, ParticleText, VideoCarousel) from ever running off-screen, so only one
 * such effect is ever alive at a time → the page stays butter-smooth.
 */
export function InViewMount({
  children,
  className,
  style,
  margin = '150px',
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // framer-motion's margin type is a template-literal union; keep it loose here
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    margin: margin as `${number}px`,
  });
  return (
    <div ref={ref} className={className} style={style}>
      {inView ? children : null}
    </div>
  );
}
