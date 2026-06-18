'use client';

import { useEffect, useState } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { LeadsDashboard } from '@/components/admin/LeadsDashboard';
import { isAuthed, me } from '@/lib/adminApi';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  // verify any stored token is still valid on mount
  useEffect(() => {
    (async () => {
      if (isAuthed()) {
        try {
          await me();
          setAuthed(true);
        } catch {
          setAuthed(false);
        }
      }
      setChecked(true);
    })();
  }, []);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center text-text-secondary">
        Loading…
      </div>
    );
  }

  return authed ? (
    <LeadsDashboard onSignOut={() => setAuthed(false)} />
  ) : (
    <AdminLogin onSuccess={() => setAuthed(true)} />
  );
}
