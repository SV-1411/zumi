'use client';

import { useEffect } from 'react';
import { useExperience } from '@/lib/store';

/**
 * Tracks the global pointer and normalises it to [-1, 1] on each axis.
 * Shared via the experience store so 3D scenes react without prop drilling.
 */
export function PointerProvider() {
  const setPointer = useExperience((s) => s.setPointer);

  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -((e.clientY / window.innerHeight) * 2 - 1);
        setPointer(x, y);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [setPointer]);

  return null;
}
