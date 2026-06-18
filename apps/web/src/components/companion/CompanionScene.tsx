'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ContactShadows, AdaptiveDpr } from '@react-three/drei';
import { RobotModel } from './RobotModel';

/**
 * Canvas for the companion. Loads the space-maintenance-robot GLB and drives
 * its moods procedurally (see RobotModel). DPR-capped + adaptive for perf.
 */
export function CompanionScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.6], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <Suspense fallback={null}>
        <RobotModel />
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.4}
          scale={7}
          blur={2.8}
          far={3}
          color="#000000"
        />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
