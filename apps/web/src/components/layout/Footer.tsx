'use client';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-black/10 py-16">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-bold tracking-tightest">
              ZUMI<span className="text-accent">.</span>
            </p>
            <p className="mt-4 max-w-sm text-text-secondary">
              A multidisciplinary studio. Design, video, web, automation and AI,
              made in one room, shipped live.
            </p>
            <a
              href="#contact"
              data-cursor-label="Let’s talk ↗"
              className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              Start a project
            </a>
          </div>

          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-text-secondary">
              Explore
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                { label: 'What we do', href: '#domains' },
                { label: 'Selected work', href: '#work' },
                { label: 'All projects', href: '#projects' },
                { label: 'The studio', href: '#about' },
                { label: 'Contact', href: '#contact' },
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
              Elsewhere
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                { label: 'GitHub', href: 'https://github.com/SV-1411' },
                { label: 'Email', href: 'mailto:atharvalepse0129@gmail.com' },
              ].map((x) => (
                <li key={x.label}>
                  <a
                    href={x.href}
                    target={x.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="hover:text-text-primary"
                  >
                    {x.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 text-xs text-text-secondary md:flex-row md:items-center">
          <span>© {year} ZUMI. A multidisciplinary studio.</span>
          <span className="font-display font-bold tracking-tightest">ZUMI.</span>
        </div>
      </div>
    </footer>
  );
}
