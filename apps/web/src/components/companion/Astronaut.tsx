'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/lib/store';
import { useCompanion, STATE_CONFIG } from '@/lib/companionStore';

/**
 * A stylised procedural astronaut. Reads the companion state machine so its
 * pose, motion and visor expression mirror what the AI is doing. Designed so a
 * real GLB can replace it later with no other changes (see CompanionScene).
 */
export function Astronaut() {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const visorMat = useRef<THREE.MeshStandardMaterial>(null);
  const thinkDots = useRef<THREE.Group>(null);
  const rimLight = useRef<THREE.PointLight>(null);

  const pointer = useExperience((s) => s.pointer);
  const state = useCompanion((s) => s.state);
  const target = new THREE.Color();

  useFrame((s) => {
    const cfg = STATE_CONFIG[state];
    const t = s.clock.elapsedTime;

    if (root.current) {
      const hop = state === 'celebrate' ? Math.abs(Math.sin(t * 6)) * 0.18 : 0;
      root.current.position.y = Math.sin(t * cfg.bobSpeed) * cfg.bobAmp + hop;
      // lean toward the pointer
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * 0.45, 0.05);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.18, 0.05);
    }

    if (head.current) {
      const lookX = state === 'thinking' ? -0.18 : pointer.y * 0.15;
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, cfg.tilt + lookX, 0.07);
      head.current.rotation.z = THREE.MathUtils.lerp(
        head.current.rotation.z,
        state === 'thinking' ? 0.12 : 0,
        0.07
      );
    }

    // visor / rim colour eases toward the state colour
    target.set(cfg.color);
    if (visorMat.current) {
      visorMat.current.emissive.lerp(target, 0.08);
    }
    if (rimLight.current) {
      rimLight.current.color.lerp(target, 0.08);
    }

    // blink + expression
    const blink = Math.sin(t * 2.2) > 0.96 ? 0.15 : 1;
    const eyeUp = state === 'thinking' ? 0.05 : 0;
    for (const eye of [leftEye.current, rightEye.current]) {
      if (!eye) continue;
      eye.scale.y = THREE.MathUtils.lerp(eye.scale.y, blink, 0.4);
      eye.position.y = THREE.MathUtils.lerp(eye.position.y, 0.06 + eyeUp, 0.1);
    }

    if (mouth.current) {
      // talking = oscillating mouth; happy = wider; else neutral
      const talk = state === 'speaking' ? 0.5 + Math.abs(Math.sin(t * 12)) * 0.9 : 0.35;
      const wide = state === 'happy' || state === 'celebrate' ? 1.7 : 1;
      mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, talk, 0.3);
      mouth.current.scale.x = THREE.MathUtils.lerp(mouth.current.scale.x, wide, 0.2);
    }

    // thinking dots float + pulse above the helmet
    if (thinkDots.current) {
      const show = state === 'thinking';
      thinkDots.current.visible = show;
      if (show) {
        thinkDots.current.rotation.y = t * 1.5;
        thinkDots.current.children.forEach((c, i) => {
          const m = c as THREE.Mesh;
          const mat = m.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.4 + Math.sin(t * 4 - i) * 0.4;
        });
      }
    }
  });

  const suit = '#EDEFF5';
  const suitDark = '#C7CCDA';

  return (
    <group ref={root} position={[0, 0, 0]} scale={1}>
      {/* head / helmet */}
      <group ref={head} position={[0, 0.95, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.62, 48, 48]} />
          <meshStandardMaterial color={suit} roughness={0.35} metalness={0.1} />
        </mesh>
        {/* dark glass visor */}
        <mesh position={[0, -0.02, 0.18]}>
          <sphereGeometry args={[0.5, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial
            ref={visorMat}
            color="#0B0E1A"
            emissive="#4F6FFF"
            emissiveIntensity={0.5}
            roughness={0.08}
            metalness={0.9}
          />
        </mesh>
        {/* eyes (on the visor) */}
        <mesh ref={leftEye} position={[-0.16, 0.06, 0.56]}>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshBasicMaterial color="#DDE4FF" toneMapped={false} />
        </mesh>
        <mesh ref={rightEye} position={[0.16, 0.06, 0.56]}>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshBasicMaterial color="#DDE4FF" toneMapped={false} />
        </mesh>
        {/* mouth */}
        <mesh ref={mouth} position={[0, -0.12, 0.55]}>
          <boxGeometry args={[0.16, 0.025, 0.02]} />
          <meshBasicMaterial color="#DDE4FF" toneMapped={false} />
        </mesh>

        {/* thinking indicator */}
        <group ref={thinkDots} position={[0.45, 0.6, 0.2]} visible={false}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[i * 0.14, i * 0.06, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#E5A24B" transparent opacity={0.6} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>

      {/* body */}
      <mesh position={[0, 0.05, 0]}>
        <capsuleGeometry args={[0.5, 0.5, 12, 24]} />
        <meshStandardMaterial color={suit} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* chest accent */}
      <mesh position={[0, 0.12, 0.46]}>
        <boxGeometry args={[0.26, 0.18, 0.04]} />
        <meshStandardMaterial color={suitDark} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* backpack */}
      <mesh position={[0, 0.1, -0.42]}>
        <boxGeometry args={[0.5, 0.6, 0.28]} />
        <meshStandardMaterial color={suitDark} roughness={0.5} />
      </mesh>
      {/* arms */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.62, 0.1, 0]} rotation={[0, 0, side * 0.35]}>
          <capsuleGeometry args={[0.16, 0.5, 8, 16]} />
          <meshStandardMaterial color={suit} roughness={0.4} />
        </mesh>
      ))}

      <pointLight ref={rimLight} position={[1.5, 1.5, 2]} intensity={18} color="#4F6FFF" />
      <pointLight position={[-2, 0, -1]} intensity={6} color="#DDE4FF" />
    </group>
  );
}
