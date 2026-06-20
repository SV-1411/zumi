'use client';

import { useExperience } from '@/lib/store';

export function Footer() {
  const toggle = useExperience((s) => s.toggleAssistant);

  return (
    <footer className="relative border-t border-white/8 py-section">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-semibold tracking-tightest">
              Let’s build what’s next.
            </p>
            <p className="mt-4 max-w-sm text-text-secondary">
              Tell our assistant what you’re building and get a technical scope
              in minutes.
            </p>
            <button
              onClick={() => toggle(true)}
              className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-[0_0_40px_rgba(79,111,255,0.5)]"
            >
              Start with ZUMI
            </button>
          </div>

          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-text-secondary">
              Platform
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                { label: 'AI Agents', href: '#services' },
                { label: 'Healthcare', href: '#healthcare' },
                { label: 'AI Receptionist', href: '#receptionist' },
                { label: 'Selected Work', href: '#work' },
                { label: 'ZUMI Labs', href: '#labs' },
              ].map((x) => (
                <li key={x.label}>
                  <a href={x.href} className="hover:text-text-primary">
                    {x.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-text-secondary">
              Company
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                { label: 'About', href: '#about' },
                { label: 'Work', href: '#work' },
                { label: 'Team console', href: '/admin' },
                { label: 'Contact', href: '#' },
              ].map((x) => (
                <li key={x.label}>
                  <a href={x.href} className="hover:text-text-primary">
                    {x.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 text-xs text-text-secondary md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} ZUMI. Engineering the future of business operations.</span>
          <span className="font-display tracking-tightest">ZUMI</span>
        </div>
      </div>
    </footer>
  );
}
