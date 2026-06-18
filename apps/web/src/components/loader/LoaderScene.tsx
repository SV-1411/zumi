'use client';

import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT_SOFT = new THREE.Color('#DDE4FF');
const ACCENT = new THREE.Color('#4F6FFF');

/**
 * Particles begin scattered across the void and converge onto a spherical
 * shell as `progressRef` climbs 0 -> 1. A wireframe structure fades in as they
 * lock into place — the "glowing geometric structure forms" beat.
 */
export function LoaderScene({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const points = useRef<THREE.Points>(null);
  const shell = useRef<THREE.Mesh>(null);
  const shellMat = useRef<THREE.MeshBasicMaterial>(null);
  const count = 1800;

  // precompute scattered (start) and shell (target) positions
  const { scattered, target } = useMemo(() => {
    const scattered = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      scattered[i * 3] = (Math.random() - 0.5) * 22;
      scattered[i * 3 + 1] = (Math.random() - 0.5) * 22;
      scattered[i * 3 + 2] = (Math.random() - 0.5) * 22;

      const r = 2.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      target[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      target[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      target[i * 3 + 2] = r * Math.cos(phi);
    }
    return { scattered, target };
  }, []);

  const live = useMemo(() => scattered.slice(), [scattered]);

  useFrame((state) => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    // ease the assembly so the last few percent feel like a "snap into place"
    const e = 1 - Math.pow(1 - p, 3);

    if (points.current) {
      const geo = points.current.geometry;
      const attr = geo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < count * 3; i++) {
        live[i] = THREE.MathUtils.lerp(scattered[i]!, target[i]!, e);
      }
      attr.array = live;
      attr.needsUpdate = true;
      points.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    if (shell.current && shellMat.current) {
      shell.current.rotation.y = state.clock.elapsedTime * 0.2;
      shell.current.rotation.x = state.clock.elapsedTime * 0.08;
      shellMat.current.opacity = Math.max(0, (e - 0.45) / 0.55) * 0.5;
      const s = 0.6 + e * 0.5;
      shell.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[live, 3]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT_SOFT}
          size={0.03}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh ref={shell}>
        <icosahedronGeometry args={[2.1, 1]} />
        <meshBasicMaterial
          ref={shellMat}
          color={ACCENT}
          wireframe
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}
