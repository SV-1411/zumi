'use client';

import { motion } from 'framer-motion';
import { useExperience, type Intent } from '@/lib/store';
import { cn } from '@/lib/utils';
import { EASE } from '@/lib/motion';

const OPTIONS: { id: Exclude<Intent, null>; label: string }[] = [
  { id: 'saas', label: 'Launch a SaaS' },
  { id: 'automate', label: 'Automate my business' },
  { id: 'ai', label: 'Build AI systems' },
  { id: 'scale', label: 'Scale operations' },
  { id: 'healthcare', label: 'Transform healthcare' },
];

export function IntentSelector() {
  const intent = useExperience((s) => s.intent);
  const setIntent = useExperience((s) => s.setIntent);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {OPTIONS.map((opt, i) => {
        const active = intent === opt.id;
        return (
          <motion.button
            key={opt.id}
            onClick={() => setIntent(active ? null : opt.id)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.09, duration: 0.6, ease: EASE }}
            whileHover={{ y: -2 }}
            className={cn(
              'group relative overflow-hidden rounded-full border px-5 py-2.5 text-sm transition-colors duration-300',
              active
                ? 'border-accent/60 text-text-primary'
                : 'border-white/10 text-text-secondary hover:text-text-primary'
            )}
          >
            {/* fill sweep on hover/active */}
            <span
              className={cn(
                'absolute inset-0 -z-0 origin-left scale-x-0 bg-gradient-to-r from-accent/25 to-accent/5 transition-transform duration-500 ease-zumi group-hover:scale-x-100',
                active && 'scale-x-100'
              )}
            />
            <span className="relative z-10 flex items-center gap-2">
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                  active ? 'bg-accent' : 'bg-white/20 group-hover:bg-accent/60'
                )}
              />
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
