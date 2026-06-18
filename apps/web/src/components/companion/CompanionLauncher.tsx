'use client';

import { motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { CompanionModal } from './CompanionModal';
import { EASE } from '@/lib/motion';

export function CompanionLauncher() {
  const toggle = useExperience((s) => s.toggleAssistant);

  return (
    <>
      <motion.button
        onClick={() => toggle(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.6, ease: EASE }}
        whileHover={{ scale: 1.05 }}
        className="glass fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full px-5 py-3 text-sm text-text-primary shadow-[0_0_40px_rgba(79,111,255,0.25)] transition-shadow hover:shadow-[0_0_60px_rgba(79,111,255,0.45)]"
        aria-label="Talk to ZUMI's AI consultant"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
        Ask ZUMI AI
      </motion.button>

      <CompanionModal />
    </>
  );
}
