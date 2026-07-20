'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { EASE } from '@/lib/motion';

/* — tiny inline line-icons (no dependency) — */
const I = {
  home: (
    <path d="M3 10.5 12 4l9 6.5M5 9.5V20h14V9.5" />
  ),
  work: <path d="M4 7h16v12H4zM9 7V5h6v2" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  studio: <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5L21 12M3 16.5 12 21l9-4.5" />,
  mail: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  github: (
    <path d="M9 19c-4 1.5-4-2.5-5-3m10 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C5.3 2.8 4.3 3.1 4.3 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 3 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  arrowUp: <path d="M12 20V5M6 11l6-6 6 6" />,
};

function Icon({ d, size = 20 }: { d: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d}
    </svg>
  );
}

function Rail({
  side,
  items,
}: {
  side: 'left' | 'right';
  items: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void }[];
}) {
  const loaded = useExperience((s) => s.loaded);
  return (
    <motion.nav
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : side === 'left' ? -20 : 20 }}
      transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
      className={`fixed top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 md:flex ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      {items.map((it) => {
        const inner = (
          <span className="group relative flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors duration-300 hover:bg-ink hover:text-white">
            {it.icon}
            <span
              className={`pointer-events-none absolute whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-all duration-300 group-hover:opacity-100 ${
                side === 'left'
                  ? 'left-[120%] -translate-x-1 group-hover:translate-x-0'
                  : 'right-[120%] translate-x-1 group-hover:translate-x-0'
              }`}
            >
              {it.label}
            </span>
          </span>
        );
        return it.href ? (
          <a key={it.label} href={it.href} aria-label={it.label} data-cursor="hover">
            {inner}
          </a>
        ) : (
          <button key={it.label} onClick={it.onClick} aria-label={it.label} data-cursor="hover">
            {inner}
          </button>
        );
      })}
    </motion.nav>
  );
}

export function SideNav() {
  const loaded = useExperience((s) => s.loaded);
  const [top, setTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* wordmark — top, centered on mobile / left on desktop */}
      <motion.a
        href="#"
        aria-label="ZUMI — home"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -12 }}
        transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
        className="fixed left-1/2 top-5 z-40 -translate-x-1/2 font-display text-lg font-bold tracking-tightest md:left-6 md:translate-x-0"
      >
        ZUMI<span className="text-accent">.</span>
      </motion.a>

      <Rail
        side="left"
        items={[
          { icon: <Icon d={I.home} />, label: 'Home', href: '#' },
          { icon: <Icon d={I.work} />, label: 'Work', href: '#work' },
          { icon: <Icon d={I.grid} />, label: 'Projects', href: '#projects' },
          { icon: <Icon d={I.studio} />, label: 'What we do', href: '#domains' },
        ]}
      />
      <Rail
        side="right"
        items={[
          { icon: <Icon d={I.studio} />, label: 'Studio', href: '#about' },
          { icon: <Icon d={I.mail} />, label: 'Contact', href: '#contact' },
          { icon: <Icon d={I.github} />, label: 'GitHub', href: 'https://github.com/SV-1411' },
          ...(top
            ? [
                {
                  icon: <Icon d={I.arrowUp} />,
                  label: 'Top',
                  onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
                },
              ]
            : []),
        ]}
      />
    </>
  );
}
