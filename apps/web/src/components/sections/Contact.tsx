'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RevealText } from '@/components/fx/RevealText';
import { FollowCursorButton } from '@/components/fx/FollowCursorButton';
import { FluidImage } from '@/framer/Client';
import { InViewMount } from '@/components/fx/InViewMount';
import { EASE } from '@/lib/motion';

const EMAIL = 'shivansh1411@gmail.com';

type Status = 'idle' | 'sending' | 'done' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `Project inquiry from ${form.name || 'someone'}`
  )}&body=${encodeURIComponent(
    `${form.message || ''}\n\n— ${form.name}${
      form.company ? ` (${form.company})` : ''
    }\n${form.email}`
  )}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setStatus('sending');
    try {
      // FormSubmit delivers straight to the inbox — no backend, no API key
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || '—',
          message: form.message,
          _subject: `Portfolio inquiry from ${form.name}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: form.email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== 'true')
        throw new Error(data.message || 'not delivered');
      setStatus('done');
      setForm({ name: '', email: '', company: '', message: '' });
    } catch {
      // never lose a message — fall back to the visitor's mail client
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-section">
      {/* gated fluid backdrop, one WebGL instance, only while Contact is on screen */}
      <InViewMount
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.05] blur-[2px]"
        margin="100px"
      >
        <FluidImage
          image="/projects/serotoninn.svg"
          objectFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </InViewMount>
      <div className="accent-glow pointer-events-none absolute left-1/2 top-1/3 h-[560px] w-[840px] -translate-x-1/2 -translate-y-1/2" />
      <div className="noise pointer-events-none absolute inset-0" />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          {/* pitch */}
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[0.42em] text-text-secondary">
              Let&apos;s build
            </p>
            <RevealText
              text="Got something worth building?"
              className="text-balance font-display text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-tightest text-gradient"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-7 max-w-md text-text-secondary md:text-lg"
            >
              Tell me what you&apos;re making. If it&apos;s a fit, you&apos;ll hear
              back within a day, usually with a first idea already attached.
            </motion.p>

            <div className="mt-10 space-y-2 text-sm">
              <a
                href={`mailto:${EMAIL}`}
                data-cursor-label="Copy? Just click ✉"
                className="group flex items-center gap-3 text-text-primary"
              >
                <span className="text-text-secondary">Email</span>
                <span className="relative">
                  {EMAIL}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-zumi group-hover:scale-x-100" />
                </span>
              </a>
              <div className="flex items-center gap-3">
                <span className="text-text-secondary">GitHub</span>
                <a
                  href="https://github.com/SV-1411"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  github.com/SV-1411
                </a>
              </div>
            </div>

          </div>

          {/* form / states */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="glass rounded-3xl p-7 md:p-9"
          >
            {status === 'done' ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#28c840]/15 text-2xl text-[#7ee2a0]">
                  ✓
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  Message sent.
                </h3>
                <p className="mt-3 max-w-xs text-sm text-text-secondary">
                  Thanks, {form.name.split(' ')[0] || 'friend'}, it&apos;s in my
                  inbox. I&apos;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <Field label="Your name" required>
                  <input
                    value={form.name}
                    onChange={set('name')}
                    required
                    placeholder="Jane Doe"
                    className="zin"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    required
                    placeholder="jane@company.com"
                    className="zin"
                  />
                </Field>
                <Field label="Company (optional)">
                  <input
                    value={form.company}
                    onChange={set('company')}
                    placeholder="Acme Inc."
                    className="zin"
                  />
                </Field>
                <Field label="What do you want to build?" required>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    required
                    rows={4}
                    placeholder="A quick idea of the product, timeline and budget…"
                    className="zin resize-none"
                  />
                </Field>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <FollowCursorButton
                    type="submit"
                    cursorLabel={status === 'sending' ? undefined : 'Send it ↗'}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </FollowCursorButton>

                  {status === 'error' && (
                    <a
                      href={mailto}
                      className="text-sm text-text-secondary underline decoration-black/20 underline-offset-4 hover:text-text-primary"
                    >
                      Couldn&apos;t send here, email me directly →
                    </a>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      {children}
    </label>
  );
}
