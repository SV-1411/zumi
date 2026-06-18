'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { EnergyCore } from './EnergyCore';

/**
 * Canvas wrapper for the hero energy core. Kept lean and GPU-friendly:
 * capped DPR, adaptive resolution, lazy-friendly Suspense boundary.
 */
export function CoreScene({ intensity = 1 }: { intensity?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <EnergyCore intensity={intensity} />
        <Preload all />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
