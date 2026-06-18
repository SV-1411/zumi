'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useExperience } from '@/lib/store';

/**
 * Minimal futuristic companion: a glass shell with a glowing iris that looks
 * toward the pointer and breathes when idle. Not a robot, not a cartoon.
 */
function Companion() {
  const iris = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const pointer = useExperience((s) => s.pointer);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (iris.current) {
      // eye tracks pointer within a small range
      iris.current.position.x = THREE.MathUtils.lerp(
        iris.current.position.x,
        pointer.x * 0.22,
        0.08
      );
      iris.current.position.y = THREE.MathUtils.lerp(
        iris.current.position.y,
        pointer.y * 0.22,
        0.08
      );
      iris.current.position.z = 0.55;
    }
    if (shell.current) {
      const breathe = 1 + Math.sin(t * 1.5) * 0.02;
      shell.current.scale.setScalar(breathe);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
      <Sphere ref={shell} args={[1, 64, 64]}>
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.08}
          transmission={1}
          ior={1.3}
          chromaticAberration={0.04}
          backside
          color="#DDE4FF"
        />
      </Sphere>
      <mesh ref={iris}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color="#4F6FFF"
          emissive="#4F6FFF"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[2, 2, 3]} intensity={14} color="#DDE4FF" />
      <ambientLight intensity={0.4} />
    </Float>
  );
}

export function Companion3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
    >
      <Companion />
    </Canvas>
  );
}
