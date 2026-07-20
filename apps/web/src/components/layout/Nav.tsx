'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { EASE } from '@/lib/motion';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const loaded = useExperience((s) => s.loaded);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -16 }}
      transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/8 bg-background/70 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="shell flex items-center justify-between py-4">
        <a
          href="#"
          className="group flex items-center gap-2 font-display text-lg font-semibold tracking-tightest"
          aria-label="Shivansh Verma — home"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 text-[13px] font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-white">
            SV
          </span>
          <span className="hidden sm:inline">
            Shivansh <span className="text-text-secondary">× ZUMI</span>
          </span>
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

        <a
          href="#contact"
          data-cursor-label="Let’s talk ↗"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-text-primary transition-colors duration-300 hover:border-accent/60 hover:bg-accent/10"
        >
          Book a call
        </a>
      </nav>
    </motion.header>
  );
}
