'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompanion } from '@/lib/companionStore';
import {
  pickContextualThought,
  pickIdleThought,
  pickStateThought,
} from '@/lib/thoughts';
import { EASE } from '@/lib/motion';

type Bubble = { id: number; text: string };
let idSeq = 0;

/**
 * Floating "inner monologue" bubbles over the robot — the things it thinks but
 * doesn't say. Reacts to the companion state machine (thinking/confused/happy),
 * to what the visitor just typed (contextual snark), and drifts with idle
 * thoughts when nothing's happening. Comic thought-cloud styling, auto-dismiss.
 */
export function ThoughtBubbles({
  active,
  userText,
  nonce,
}: {
  active: boolean;
  userText: string;
  nonce: number; // increments on each visitor message
}) {
  const state = useCompanion((s) => s.state);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const push = useCallback((text: string | null, ttl = 4200) => {
    if (!text || !mounted.current) return;
    const id = ++idSeq;
    // keep at most two on screen at once
    setBubbles((b) => [...b.slice(-1), { id, text }]);
    window.setTimeout(() => {
      if (mounted.current) setBubbles((b) => b.filter((x) => x.id !== id));
    }, ttl);
  }, []);

  // contextual reaction whenever the visitor sends a message
  useEffect(() => {
    if (!active || nonce === 0) return;
    const t = window.setTimeout(() => push(pickContextualThought(userText)), 650);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  // state-machine reactions
  useEffect(() => {
    if (!active) return;
    if (state === 'thinking') push(pickStateThought('thinking'), 3200);
    else if (state === 'confused') push(pickStateThought('confused'));
    else if (state === 'happy' || state === 'celebrate') push(pickStateThought('happy'));
    else if (state === 'listening' && Math.random() > 0.5)
      push(pickStateThought('listening'), 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, active]);

  // idle drift
  useEffect(() => {
    if (!active) return;
    const iv = window.setInterval(() => {
      if (useCompanion.getState().state === 'idle' && Math.random() > 0.4) {
        push(pickIdleThought(), 4600);
      }
    }, 6500);
    return () => window.clearInterval(iv);
  }, [active, push]);

  // clear everything when the modal closes
  useEffect(() => {
    if (!active) setBubbles([]);
  }, [active]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-[8%] z-20 flex w-[min(78%,360px)] -translate-x-1/2 flex-col items-center gap-3">
      <AnimatePresence>
        {bubbles.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 14, scale: 0.85 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.45, ease: EASE },
            }}
            exit={{ opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.35 } }}
            style={{ rotate: i % 2 === 0 ? -1.5 : 1.5 }}
            className="relative"
          >
            {/* gentle bob while visible */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative rounded-[18px] border border-white/15 bg-white/[0.08] px-4 py-2 text-center text-[13px] italic leading-snug text-text-primary/90 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md"
            >
              {b.text}
              {/* comic thought-cloud trail pointing down toward the robot */}
              <span className="absolute -bottom-2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-md" />
              <span className="absolute -bottom-[18px] left-[calc(50%-9px)] h-1.5 w-1.5 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-md" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
