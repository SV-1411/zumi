'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useExperience } from '@/lib/store';
import { useCompanion, STATE_CONFIG } from '@/lib/companionStore';

const MODEL_URL = '/models/robot.glb';
const TARGET_HEIGHT = 2.2;

/**
 * Loads the space-maintenance-robot GLB (a static mesh — no rig/morphs) and
 * gives it personality entirely procedurally: motion character per mood, a
 * colour-shifting aura light, and floating glyph indicators. Reads the shared
 * companion state machine so it mirrors the AI (thinking while AI thinks, etc).
 */
export function RobotModel() {
  const outer = useRef<THREE.Group>(null);
  const aura = useRef<THREE.PointLight>(null);
  const thinkDots = useRef<THREE.Group>(null);
  const confuse = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.Group>(null);

  const pointer = useExperience((s) => s.pointer);
  const state = useCompanion((s) => s.state);
  const target = useMemo(() => new THREE.Color(), []);

  const { scene } = useGLTF(MODEL_URL);

  // clone + normalise (center at origin, scale to a consistent height)
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = TARGET_HEIGHT / (size.y || 1);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    clone.scale.setScalar(scale);
    clone.traverse((o) => {
      o.castShadow = true;
      o.receiveShadow = true;
    });
    return clone;
  }, [scene]);

  const topY = TARGET_HEIGHT / 2 + 0.25;

  useFrame((s) => {
    const cfg = STATE_CONFIG[state];
    const t = s.clock.elapsedTime;

    if (outer.current) {
      const hop = state === 'celebrate' || state === 'happy' ? Math.abs(Math.sin(t * 5)) * 0.14 : 0;
      outer.current.position.y = -0.2 + Math.sin(t * cfg.bobSpeed) * cfg.bobAmp + hop;

      // base look-at pointer
      const yawTarget = pointer.x * 0.5 + (state === 'confused' ? Math.sin(t * 3.4) * 0.18 : 0);
      outer.current.rotation.y = THREE.MathUtils.lerp(outer.current.rotation.y, yawTarget, 0.06);
      outer.current.rotation.x = THREE.MathUtils.lerp(outer.current.rotation.x, -pointer.y * 0.12 + cfg.tilt, 0.05);
      // confused = head wobble on z; thinking = slight constant tilt
      const zTarget = state === 'confused' ? Math.sin(t * 4) * 0.14 : state === 'thinking' ? 0.1 : 0;
      outer.current.rotation.z = THREE.MathUtils.lerp(outer.current.rotation.z, zTarget, 0.07);
    }

    // aura colour eases toward the mood; speaking = rhythmic intensity pulse
    target.set(cfg.color);
    if (aura.current) {
      aura.current.color.lerp(target, 0.08);
      const base = 22;
      aura.current.intensity = state === 'speaking' ? base + Math.abs(Math.sin(t * 11)) * 16 : base;
    }

    // thinking dots
    if (thinkDots.current) {
      const show = state === 'thinking';
      thinkDots.current.visible = show;
      if (show) {
        thinkDots.current.rotation.y = t * 1.6;
        thinkDots.current.children.forEach((c, i) => {
          const mat = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
          mat.opacity = 0.35 + Math.sin(t * 4 - i) * 0.45;
        });
      }
    }

    // confused indicator (a little bobbing mark)
    if (confuse.current) {
      confuse.current.visible = state === 'confused';
      if (confuse.current.visible) {
        confuse.current.position.y = topY + 0.15 + Math.sin(t * 5) * 0.06;
        confuse.current.rotation.z = Math.sin(t * 3) * 0.3;
      }
    }

    // happy sparks rising
    if (sparks.current) {
      const show = state === 'happy' || state === 'celebrate';
      sparks.current.visible = show;
      if (show) {
        sparks.current.children.forEach((c, i) => {
          const m = c as THREE.Mesh;
          const phase = (t * 1.4 + i * 0.5) % 1;
          m.position.y = topY - 0.2 + phase * 0.9;
          ((m.material as THREE.MeshBasicMaterial).opacity = 1 - phase);
        });
      }
    }
  });

  return (
    <group>
      <group ref={outer}>
        <primitive object={model} />
      </group>

      {/* thinking: orbiting dots */}
      <group ref={thinkDots} position={[0.5, topY, 0]} visible={false}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 0.16, i * 0.07, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#E5A24B" transparent opacity={0.6} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* confused: a tilted exclaimer made of a bar + dot */}
      <group ref={confuse} position={[0, topY + 0.15, 0]} visible={false}>
        <mesh position={[0, 0.12, 0]}>
          <capsuleGeometry args={[0.035, 0.16, 4, 8]} />
          <meshBasicMaterial color="#E07B53" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#E07B53" toneMapped={false} />
        </mesh>
      </group>

      {/* happy: rising sparks */}
      <group ref={sparks} visible={false}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[(i - 2) * 0.22, topY, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#3FC489" transparent opacity={0.8} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* lights */}
      <pointLight ref={aura} position={[1.6, 1.8, 2.2]} intensity={22} color="#4F6FFF" />
      <pointLight position={[-2.2, 0.5, -1.5]} intensity={8} color="#DDE4FF" />
      <directionalLight position={[0, 3, 2]} intensity={1.2} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
