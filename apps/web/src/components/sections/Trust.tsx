'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 38, suffix: '+', label: 'Systems shipped' },
  { value: 4, suffix: 'M+', label: 'Tasks automated' },
  { value: 99.9, suffix: '%', label: 'Uptime delivered', decimals: 1 },
  { value: 6, suffix: 'wk', label: 'Avg. to first launch' },
];

function Counter({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Trust() {
  return (
    <section className="relative border-y border-white/8 py-20">
      <div className="shell grid grid-cols-2 gap-10 md:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-tighter text-text-primary">
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <p className="mt-2 text-sm text-text-secondary">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
