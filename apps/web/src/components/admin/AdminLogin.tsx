'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { login } from '@/lib/adminApi';
import { EASE } from '@/lib/motion';

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="grid-veil pointer-events-none absolute inset-0" />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="glass relative z-10 w-full max-w-sm rounded-2xl p-8"
      >
        <p className="mb-1 font-display text-lg font-semibold tracking-tightest">ZUMI</p>
        <h1 className="mb-1 text-xl font-medium">Team sign in</h1>
        <p className="mb-6 text-sm text-text-secondary">Internal lead console.</p>

        <label className="mb-1 block text-xs text-text-secondary">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm outline-none ring-1 ring-white/10 focus:ring-accent/50"
          placeholder="you@zumi.studio"
        />

        <label className="mb-1 block text-xs text-text-secondary">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-5 w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm outline-none ring-1 ring-white/10 focus:ring-accent/50"
          placeholder="••••••••"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </motion.form>
    </div>
  );
}
