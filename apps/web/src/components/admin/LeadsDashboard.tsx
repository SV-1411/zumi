'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getLeads,
  getAnalytics,
  updateLeadStatus,
  logout,
  type Lead,
  type Analytics,
} from '@/lib/adminApi';
import { cn } from '@/lib/utils';
import { EASE } from '@/lib/motion';

const STATUSES = ['NEW', 'QUALIFIED', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST'] as const;

const STATUS_STYLE: Record<string, string> = {
  NEW: 'text-accent-soft border-accent/40',
  QUALIFIED: 'text-emerald-300 border-emerald-500/40',
  CONTACTED: 'text-amber-200 border-amber-500/40',
  PROPOSAL_SENT: 'text-violet-200 border-violet-500/40',
  WON: 'text-emerald-400 border-emerald-400/50',
  LOST: 'text-text-secondary border-white/15',
};

function scoreColor(score: number) {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-accent';
  return 'text-text-secondary';
}

export function LeadsDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Analytics | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [l, a] = await Promise.all([getLeads(filter || undefined), getAnalytics()]);
      setLeads(l.items);
      setStats(a);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function changeStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await updateLeadStatus(id, status);
    } catch {
      void load(); // revert via reload on failure
    }
  }

  const statCards = stats
    ? [
        { label: 'Total leads', value: stats.totalLeads },
        { label: 'Qualified', value: stats.qualifiedLeads },
        { label: 'Won', value: stats.wonLeads },
        { label: 'Avg score', value: stats.avgLeadScore },
      ]
    : [];

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-white/8 bg-background/80 backdrop-blur">
        <div className="shell flex items-center justify-between py-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-lg font-semibold tracking-tightest">ZUMI</span>
            <span className="text-sm text-text-secondary">Lead console</span>
          </div>
          <button
            onClick={async () => {
              await logout();
              onSignOut();
            }}
            className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-text-secondary hover:text-text-primary"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="shell py-10">
        {/* stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="font-display text-3xl font-semibold tracking-tighter">{s.value}</div>
              <div className="mt-1 text-sm text-text-secondary">{s.label}</div>
            </div>
          ))}
        </div>

        {/* filter */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('')}
            className={cn(
              'rounded-full border px-3 py-1 text-xs',
              !filter ? 'border-accent/50 text-text-primary' : 'border-white/10 text-text-secondary'
            )}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs',
                filter === s ? 'border-accent/50 text-text-primary' : 'border-white/10 text-text-secondary'
              )}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
          <button
            onClick={load}
            className="ml-auto rounded-full border border-white/10 px-3 py-1 text-xs text-text-secondary hover:text-text-primary"
          >
            ↻ Refresh
          </button>
        </div>

        {/* leads list */}
        {loading ? (
          <p className="py-20 text-center text-text-secondary">Loading…</p>
        ) : leads.length === 0 ? (
          <p className="py-20 text-center text-text-secondary">No inquiries yet.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/8">
            {leads.map((lead) => (
              <div key={lead.id} className="border-b border-white/6 last:border-0">
                <button
                  onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                  className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <div className={cn('w-12 font-display text-xl font-semibold', scoreColor(lead.score))}>
                    {lead.score}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{lead.name}</span>
                      {lead.company && (
                        <span className="truncate text-sm text-text-secondary">· {lead.company}</span>
                      )}
                    </div>
                    <div className="truncate text-sm text-text-secondary">
                      {lead.projectType ?? 'General inquiry'} · {lead.budget ?? 'budget n/a'}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-[11px]',
                      STATUS_STYLE[lead.status] ?? 'text-text-secondary border-white/15'
                    )}
                  >
                    {lead.status.replace('_', ' ')}
                  </span>
                </button>

                <AnimatePresence>
                  {expanded === lead.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 px-5 pb-6 pt-1 md:grid-cols-[1fr_280px]">
                        <div className="space-y-4 text-sm">
                          <div>
                            <p className="mb-1 text-xs uppercase tracking-wider text-text-secondary">Contact</p>
                            <p>{lead.email}</p>
                          </div>
                          {lead.requirements && (
                            <div>
                              <p className="mb-1 text-xs uppercase tracking-wider text-text-secondary">Requirements</p>
                              <p className="text-text-primary/90">{lead.requirements}</p>
                            </div>
                          )}
                          {lead.summary && (
                            <>
                              <div>
                                <p className="mb-1 text-xs uppercase tracking-wider text-text-secondary">AI summary</p>
                                <p className="text-text-primary/90">{lead.summary.summary}</p>
                              </div>
                              <div>
                                <p className="mb-1 text-xs uppercase tracking-wider text-text-secondary">Recommended</p>
                                <p className="text-text-primary/90">{lead.summary.recommendedSolution}</p>
                              </div>
                              <div>
                                <p className="mb-1 text-xs uppercase tracking-wider text-text-secondary">Proposed scope</p>
                                <ul className="list-inside list-disc space-y-1 text-text-primary/90">
                                  {lead.summary.projectScope.map((s) => (
                                    <li key={s}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-wider text-text-secondary">Update status</p>
                          <div className="flex flex-wrap gap-2">
                            {STATUSES.map((s) => (
                              <button
                                key={s}
                                onClick={() => changeStatus(lead.id, s)}
                                className={cn(
                                  'rounded-full border px-3 py-1 text-xs transition-colors',
                                  lead.status === s
                                    ? STATUS_STYLE[s]
                                    : 'border-white/10 text-text-secondary hover:text-text-primary'
                                )}
                              >
                                {s.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                          {lead.summary && (
                            <div className="mt-4 rounded-xl bg-white/[0.03] p-3 text-xs text-text-secondary">
                              Complexity: <span className="text-text-primary">{lead.summary.estimatedComplexity}</span>
                              <br />
                              Stack:{' '}
                              <span className="text-text-primary">
                                {lead.summary.technicalRequirements.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
