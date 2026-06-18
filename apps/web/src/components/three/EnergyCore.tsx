'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Icosahedron,
  MeshDistortMaterial,
  Points,
  PointMaterial,
  Float,
} from '@react-three/drei';
import * as THREE from 'three';
import { useExperience } from '@/lib/store';

const ACCENT = new THREE.Color('#4F6FFF');
const ACCENT_SOFT = new THREE.Color('#DDE4FF');

/**
 * A halo of particles orbiting the core. They drift continuously and gently
 * push away from the pointer — the "particle reaction" called for in Phase 1.
 */
function ParticleHalo({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const pointer = useExperience((s) => s.pointer);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute on a fuzzy spherical shell
      const r = 2.4 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.012;
    // ease the whole halo toward the pointer for a parallax "lean"
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      pointer.x * 0.5,
      0.04
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      pointer.y * 0.5,
      0.04
    );
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={ACCENT_SOFT}
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/**
 * The glowing geometric structure / energy core. A distorting icosahedron
 * wrapped in a wireframe shell. Reacts to the pointer and pulses subtly.
 */
export function EnergyCore({ intensity = 1 }: { intensity?: number }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const pointer = useExperience((s) => s.pointer);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      // tilt toward pointer
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -pointer.y * 0.35,
        0.05
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        pointer.x * 0.2,
        0.05
      );
    }
    if (inner.current) {
      const t = state.clock.elapsedTime;
      const s = 1 + Math.sin(t * 1.4) * 0.04 * intensity;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        {/* molten inner core */}
        <Icosahedron ref={inner} args={[1.15, 6]}>
          <MeshDistortMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0.6 * intensity}
            roughness={0.15}
            metalness={0.9}
            distort={0.38}
            speed={1.6}
          />
        </Icosahedron>

        {/* engineered wireframe shell */}
        <Icosahedron args={[1.7, 2]}>
          <meshBasicMaterial
            color={ACCENT_SOFT}
            wireframe
            transparent
            opacity={0.18}
          />
        </Icosahedron>
      </Float>

      <ParticleHalo />

      <pointLight position={[3, 2, 4]} intensity={28} color={ACCENT} />
      <pointLight position={[-4, -2, -3]} intensity={12} color={ACCENT_SOFT} />
      <ambientLight intensity={0.25} />
    </group>
  );
}
