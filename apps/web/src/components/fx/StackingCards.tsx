'use client';

import { Children, useRef, type ReactNode } from 'react';

/**
 * StackingCards — sticky cards that pile up as you scroll. Each child pins to a
 * staggered top offset so the next card slides over the previous, which parks
 * behind it. Pure CSS sticky (buttery on all devices) — the visual "settle"
 * comes from a subtle scale set per index via the `--i` custom property.
 *
 * Wrap each item; the component supplies the sticky shell + spacing.
 */
export function StackingCards({
  children,
  className,
  topBase = 96, // px from top the first card pins at
  step = 22, // px each subsequent card is nudged down
}: {
  children: ReactNode;
  className?: string;
  topBase?: number;
  step?: number;
}) {
  const items = Children.toArray(children);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <div
          key={i}
          className="sticky"
          style={{
            top: topBase + i * step,
            // cards deeper in the stack shrink a touch so edges peek out
            zIndex: i + 1,
            marginBottom: i === items.length - 1 ? 0 : '8vh',
          }}
        >
          <div
            style={{
              transformOrigin: 'center top',
            }}
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}
