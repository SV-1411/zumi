'use client';

import { motion } from 'framer-motion';
import type { ServiceModule } from '@/lib/services';

/**
 * Lightweight SVG "holographic objects" — one motif per service. Pure SVG +
 * transform animation keeps this GPU-cheap (no extra WebGL contexts) while
 * still reading as a rotating hologram. Reacts on hover via the parent group.
 */
export function Hologram({ shape }: { shape: ServiceModule['shape'] }) {
  const stroke = '#4F6FFF';
  const soft = '#DDE4FF';

  return (
    <div className="relative h-32 w-32">
      {/* halo */}
      <div className="absolute inset-0 rounded-full bg-accent/10 blur-2xl transition-all duration-500 group-hover:bg-accent/25" />

      <motion.svg
        viewBox="-60 -60 120 120"
        className="relative h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        style={{ overflow: 'visible' }}
      >
        {shape === 'core' && (
          <>
            {[40, 28, 16].map((r, i) => (
              <circle
                key={r}
                r={r}
                fill="none"
                stroke={i === 2 ? soft : stroke}
                strokeWidth="0.8"
                strokeDasharray={i === 1 ? '4 6' : undefined}
                opacity={0.8 - i * 0.15}
              />
            ))}
            <circle r="6" fill={stroke} opacity="0.9" />
          </>
        )}

        {shape === 'grid' && (
          <g stroke={stroke} strokeWidth="0.7" opacity="0.85" fill="none">
            {[-30, -10, 10, 30].map((x) => (
              <line key={`v${x}`} x1={x} y1={-36} x2={x} y2={36} />
            ))}
            {[-30, -10, 10, 30].map((y) => (
              <line key={`h${y}`} x1={-36} y1={y} x2={36} y2={y} />
            ))}
            <rect x="-10" y="-10" width="20" height="20" fill={stroke} opacity="0.4" />
          </g>
        )}

        {shape === 'sphere' && (
          <g fill="none" stroke={stroke} strokeWidth="0.7" opacity="0.85">
            <circle r="40" />
            {[10, 22, 34].map((rx) => (
              <ellipse key={rx} rx={rx} ry="40" />
            ))}
            {[10, 22, 34].map((ry) => (
              <ellipse key={`y${ry}`} rx="40" ry={ry} stroke={soft} opacity="0.5" />
            ))}
          </g>
        )}

        {shape === 'cube' && (
          <g stroke={stroke} strokeWidth="0.9" fill="none" opacity="0.9">
            <rect x="-26" y="-26" width="44" height="44" />
            <rect x="-10" y="-10" width="44" height="44" stroke={soft} opacity="0.6" />
            <line x1="-26" y1="-26" x2="-10" y2="-10" />
            <line x1="18" y1="-26" x2="34" y2="-10" />
            <line x1="-26" y1="18" x2="-10" y2="34" />
            <line x1="18" y1="18" x2="34" y2="34" />
          </g>
        )}

        {shape === 'cluster' && (
          <g fill={stroke} stroke={stroke} strokeWidth="0.6">
            {Array.from({ length: 7 }).map((_, i) => {
              const a = (i / 7) * Math.PI * 2;
              const x = Math.cos(a) * 34;
              const y = Math.sin(a) * 34;
              return (
                <g key={i}>
                  <line x1="0" y1="0" x2={x} y2={y} opacity="0.4" />
                  <circle cx={x} cy={y} r="4" opacity="0.9" />
                </g>
              );
            })}
            <circle r="6" fill={soft} />
          </g>
        )}
      </motion.svg>
    </div>
  );
}
