'use client';

import { motion } from 'framer-motion';
import { useExperience } from '@/lib/store';
import { EyeFollowButton } from '@/framer/Client';
import { EASE } from '@/lib/motion';

/**
 * FloatingCTA — a persistent "Get in touch" that never leaves the screen.
 * Uses the Framer Eye-Follow button (eyes track the cursor) and smooth-scrolls
 * to the contact section on click. Sits above content, below the custom cursor.
 */
export function FloatingCTA() {
  const loaded = useExperience((s) => s.loaded);

  const toContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 24 }}
      transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
      className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2"
    >
      <div
        onClick={toContact}
        data-cursor-label="Let’s talk ↗"
        className="cursor-pointer drop-shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
      >
        <EyeFollowButton
          text="Get in touch"
          buttonColor="#0B0B0B"
          textColor="#FFFFFF"
          eyeColor="#FFFFFF"
          pupilColor="#0B0B0B"
        />
      </div>
    </motion.div>
  );
}
