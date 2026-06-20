'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

const MODULES = [
  { name: 'HMS', desc: 'Admissions, beds, OT scheduling and billing in one operational core.' },
  { name: 'EHR', desc: 'Longitudinal records, FHIR-native, with audit trails clinicians trust.' },
  { name: 'Telemedicine', desc: 'Secure video, e-prescriptions and remote monitoring built in.' },
  { name: 'Clinical AI', desc: 'Chart summaries, interaction checks and drafting — clinician-supervised.' },
  { name: 'Patient portal', desc: 'Bookings, results and reminders that patients actually use.' },
  { name: 'Analytics', desc: 'Occupancy, outcomes and revenue intelligence in real time.' },
];

const FLOW = ['Intake', 'Triage', 'Diagnosis', 'Treatment', 'Billing', 'Follow-up'];

export function Healthcare() {
  return (
    <section id="healthcare" className="relative overflow-hidden py-section">
      {/* clinical grid wash (ambient colour comes from the page-wide glow layer) */}
      <div className="grid-veil pointer-events-none absolute inset-0 opacity-60" />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Healthcare technology"
          title="Systems built for the realities of care."
          lede="HMS, EHR, telemedicine and clinical AI — engineered to be compliant, interoperable and genuinely usable on the ward, not just in the demo."
          className="mb-16"
        />

        {/* care pathway */}
        <Reveal className="mb-16 rounded-3xl border border-white/8 bg-surface/40 p-6 md:p-8">
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-text-secondary">
            One pathway, one source of truth
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {FLOW.map((stage, i) => (
              <motion.div
                key={stage}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                className="flex items-center gap-3"
              >
                <span className="rounded-full border border-accent/30 bg-accent/5 px-4 py-2 text-sm text-accent-soft">
                  {stage}
                </span>
                {i < FLOW.length - 1 && (
                  <span className="text-text-secondary/50">→</span>
                )}
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* modules */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
              className="group rounded-2xl border border-white/8 bg-surface/40 p-6 transition-all duration-500 hover:border-accent/30 hover:bg-surface/70"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-accent transition-colors group-hover:border-accent/40">
                <span className="h-2 w-2 rounded-full bg-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {m.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* compliance strip */}
        <Reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-text-secondary">
          <span className="uppercase tracking-[0.3em]">Engineered for</span>
          {['HIPAA-ready', 'FHIR / HL7', 'Role-based access', 'Full audit trails', 'Data residency'].map(
            (c) => (
              <span key={c} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {c}
              </span>
            )
          )}
        </Reveal>
      </div>
    </section>
  );
}
