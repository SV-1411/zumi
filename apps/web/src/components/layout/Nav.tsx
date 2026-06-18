'use client';

import { motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { EASE } from '@/lib/motion';

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Healthcare', href: '#healthcare' },
  { label: 'Labs', href: '#labs' },
  { label: 'About', href: '#about' },
];

export function Nav() {
  const loaded = useExperience((s) => s.loaded);
  const toggle = useExperience((s) => s.toggleAssistant);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -16 }}
      transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <nav className="shell flex items-center justify-between py-5">
        <a href="#" className="font-display text-lg font-semibold tracking-tightest">
          ZUMI
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 ease-zumi group-hover:w-full" />
            </a>
          ))}
        </div>

        <button
          onClick={() => toggle(true)}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-primary transition-colors hover:border-accent/60 hover:bg-accent/10"
        >
          Build with ZUMI
        </button>
      </nav>
    </motion.header>
  );
}
