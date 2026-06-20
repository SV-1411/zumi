import type { CSSProperties } from 'react';

/**
 * Page-wide ambient colour. A single layer of soft, blurred brown + green
 * patches distributed down the full height of the post-hero landing page, so
 * the whole scroll carries warm/cool ambience. Sits behind all content (parent
 * uses `isolate` + this layer is -z-10); purely decorative.
 */
const PATCHES: { cls: string; style: CSSProperties }[] = [
  { cls: 'glow-green', style: { top: '1%', left: '-6%', width: 720, height: 600, opacity: 0.85 } },
  { cls: 'glow-brown', style: { top: '8%', right: '-6%', width: 760, height: 640, opacity: 0.85 } },
  { cls: 'glow-brown', style: { top: '20%', left: '-4%', width: 700, height: 600, opacity: 0.8 } },
  { cls: 'glow-green', style: { top: '32%', right: '-4%', width: 760, height: 640, opacity: 0.85 } },
  { cls: 'glow-green', style: { top: '44%', left: '-6%', width: 720, height: 620, opacity: 0.8 } },
  { cls: 'glow-brown', style: { top: '56%', right: '-6%', width: 760, height: 640, opacity: 0.85 } },
  { cls: 'glow-brown', style: { top: '68%', left: '-4%', width: 700, height: 600, opacity: 0.8 } },
  { cls: 'glow-green', style: { top: '80%', right: '-4%', width: 760, height: 640, opacity: 0.85 } },
  { cls: 'glow-brown', style: { top: '92%', left: '-6%', width: 720, height: 600, opacity: 0.8 } },
];

export function PageGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {PATCHES.map((p, i) => (
        <div key={i} className={`${p.cls} absolute blur-[80px]`} style={p.style} />
      ))}
    </div>
  );
}
