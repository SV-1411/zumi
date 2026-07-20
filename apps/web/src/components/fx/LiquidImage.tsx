'use client';

import { useId, useRef, type ReactNode } from 'react';

/**
 * LiquidBackground — a slow, organic fluid field used behind hero / sections.
 * SVG turbulence + displacement, animated via <animate> so it costs almost
 * nothing on the main thread. Blended very low so it reads as ambient motion.
 */
export function LiquidBackground({
  className,
  colorA = 'rgba(79,111,255,0.5)',
  colorB = 'rgba(63,196,137,0.35)',
  opacity = 0.5,
}: {
  className?: string;
  colorA?: string;
  colorB?: string;
  opacity?: number;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden>
      <svg className="h-full w-full" style={{ opacity }}>
        <defs>
          <filter id={`liquid-${id}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves={2}
              seed={7}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="26s"
                values="0.008 0.012;0.014 0.008;0.008 0.012"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="70" />
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorA} />
            <stop offset="100%" stopColor={colorB} />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#grad-${id})`}
          filter={`url(#liquid-${id})`}
        />
      </svg>
    </div>
  );
}

/**
 * LiquidHover — wraps media and applies a gentle liquid displacement that
 * intensifies on hover (via CSS var on scale). Great for project thumbnails.
 */
export function LiquidHover({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  const ref = useRef<SVGFEDisplacementMapElement>(null);

  return (
    <div
      className={`group relative overflow-hidden ${className ?? ''}`}
      onMouseEnter={() => ref.current?.setAttribute('scale', '26')}
      onMouseLeave={() => ref.current?.setAttribute('scale', '0')}
    >
      <svg className="absolute h-0 w-0">
        <filter id={`lh-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves={2} result="n">
            <animate
              attributeName="baseFrequency"
              dur="14s"
              values="0.015;0.022;0.015"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            ref={ref}
            in="SourceGraphic"
            in2="n"
            scale="0"
            style={{ transition: 'all 0.4s ease' }}
          />
        </filter>
      </svg>
      <div style={{ filter: `url(#lh-${id})` }} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
