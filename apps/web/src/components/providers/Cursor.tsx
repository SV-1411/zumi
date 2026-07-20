'use client';

import { useEffect, useRef } from 'react';

/**
 * A living, three-layer cursor:
 *   • glow  — a soft accent halo that trails the slowest (comet tail)
 *   • ring  — a rotating gradient stroke that eases behind the pointer AND
 *             stretches elastically in the direction of motion based on speed,
 *             relaxing back to a perfect circle when you stop
 *   • dot   — a crisp center point that tracks fastest
 *
 * All three are integrated each frame, so movement reads as one smooth, weighted,
 * animated organism. Disabled on touch / coarse pointers and under reduced-motion.
 */
const HOVER_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [data-cursor="hover"]';

export function Cursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use `any-pointer` (not `pointer`) so a mouse on a touchscreen laptop —
    // where the *primary* pointer is touch — still gets the custom cursor.
    const hasFinePointer =
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(any-pointer: fine)').matches ||
      !window.matchMedia('(any-pointer: coarse)').matches;
    if (!hasFinePointer) return;

    const glow = glowRef.current!;
    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const label = labelRef.current!;
    document.documentElement.classList.add('has-cursor');

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const target = { x: cx, y: cy };
    const dotPos = { x: cx, y: cy };
    const ringPos = { x: cx, y: cy };
    const glowPos = { x: cx, y: cy };
    const labelPos = { x: cx, y: cy };
    let stretch = 0; // eased velocity magnitude → elongation
    let angle = 0; // direction of travel (radians)
    let raf = 0;
    let visible = false;

    const layers = [glow, ring, dot, label];
    const show = () => {
      if (visible) return;
      visible = true;
      layers.forEach((l) => l.classList.remove('is-hidden'));
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      show();
    };
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest?.(HOVER_SELECTOR);
      const hovering = !!el;
      layers.forEach((l) => l.classList.toggle('is-hover', hovering));

      // contextual label — any element carrying data-cursor-label turns the
      // cursor into a "See more ↗" style pill.
      const labelled = (e.target as Element)?.closest?.('[data-cursor-label]');
      const text = labelled?.getAttribute('data-cursor-label');
      if (text) {
        label.textContent = text;
        label.classList.add('is-on');
        ring.classList.add('is-labeled');
        glow.classList.add('is-labeled');
      } else {
        label.classList.remove('is-on');
        ring.classList.remove('is-labeled');
        glow.classList.remove('is-labeled');
      }
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => {
      visible = false;
      layers.forEach((l) => l.classList.add('is-hidden'));
    };

    const loop = () => {
      // fast crisp dot
      dotPos.x += (target.x - dotPos.x) * 0.4;
      dotPos.y += (target.y - dotPos.y) * 0.4;
      dot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px)`;

      // ring — ease toward target, then derive velocity for the elastic stretch
      const prevX = ringPos.x;
      const prevY = ringPos.y;
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      const dx = ringPos.x - prevX;
      const dy = ringPos.y - prevY;
      const speed = Math.hypot(dx, dy);
      if (speed > 0.1) angle = Math.atan2(dy, dx);
      // ease the stretch so it springs back smoothly when motion stops
      const targetStretch = Math.min(speed * 0.04, 0.55);
      stretch += (targetStretch - stretch) * 0.18;
      const sx = 1 + stretch;
      const sy = 1 - stretch * 0.62;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) rotate(${angle}rad) scale(${sx}, ${sy})`;

      // slow trailing glow → comet tail
      glowPos.x += (target.x - glowPos.x) * 0.1;
      glowPos.y += (target.y - glowPos.y) * 0.1;
      glow.style.transform = `translate(${glowPos.x}px, ${glowPos.y}px)`;

      // label pill — eases behind the dot, offset below-right of the pointer
      labelPos.x += (target.x - labelPos.x) * 0.22;
      labelPos.y += (target.y - labelPos.y) * 0.22;
      label.style.transform = `translate(${labelPos.x}px, ${labelPos.y}px)`;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    // reveal straight away (native cursor is hidden) — it'll glide to the
    // pointer on the first movement rather than leaving a gap.
    show();

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="zumi-cursor__glow is-hidden" aria-hidden />
      <div ref={ringRef} className="zumi-cursor__ring is-hidden" aria-hidden>
        <div className="zumi-cursor__spin" />
      </div>
      <div ref={dotRef} className="zumi-cursor__dot is-hidden" aria-hidden />
      <div ref={labelRef} className="zumi-cursor__label" aria-hidden />
    </>
  );
}
