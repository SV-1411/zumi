'use client';

import { motion } from 'framer-motion';
import { LAB_PROJECTS, type LabProject } from '@/lib/labs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE } from '@/lib/motion';

const STATUS_TINT: Record<LabProject['status'], string> = {
  Research: 'text-[#9fb0ff] border-[#4F6FFF]/30',
  Prototype: 'text-[#7fe3b8] border-[#3FC489]/30',
  Internal: 'text-[#e6c98a] border-[#E5A24B]/30',
  Incubating: 'text-[#e7a98f] border-[#E07B53]/30',
};

function FloatCard({ project, index }: { project: LabProject; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: EASE }}
      className="group relative"
    >
      {/* idle float */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5 + (index % 3),
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.3,
        }}
        className="relative h-full overflow-hidden rounded-3xl border border-white/8 bg-surface/40 p-7 transition-all duration-500 hover:border-accent/30 hover:bg-surface/70"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold tracking-tight">
            {project.name}
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_TINT[project.status]}`}
          >
            {project.status}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-text-secondary">
          {project.kind}
        </p>
        <p className="mt-5 text-sm leading-relaxed text-text-secondary">
          {project.blurb}
        </p>

        {/* hover halo */}
        <div className="pointer-events-none absolute -bottom-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      </motion.div>
    </motion.article>
  );
}

export function Labs() {
  return (
    <section id="labs" className="relative overflow-hidden py-section">
      <div className="accent-glow pointer-events-none absolute left-1/2 top-0 h-[480px] w-[860px] -translate-x-1/2 opacity-40" />
      <div className="shell relative">
        <SectionHeading
          eyebrow="ZUMI Labs"
          title="Where we explore what's next."
          lede="Experiments, prototypes and internal tools that signal where the studio is heading — and that quietly power the work we ship."
          align="center"
          className="mb-16"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LAB_PROJECTS.map((p, i) => (
            <FloatCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
