import { LeadComplexity } from '@zumi/db';

export interface LeadInput {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  projectType?: string;
  requirements?: string;
  budget?: string;
  timeline?: string;
}

export interface LeadEnrichment {
  score: number;
  complexity: LeadComplexity;
  recommendedSolution: string;
  projectScope: string[];
  technicalRequirements: string[];
  summary: string;
}

const SOLUTIONS = {
  ai: {
    solution: 'Custom AI agents + knowledge base with human-in-the-loop review',
    tech: ['LLM orchestration', 'Vector store / RAG', 'Tool calling', 'Eval harness'],
  },
  saas: {
    solution: 'Multi-tenant SaaS on Next.js + Postgres with billing & RBAC',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Stripe', 'RBAC'],
  },
  health: {
    solution: 'HMS/EHR module with appointment, records & analytics layers',
    tech: ['HL7/FHIR', 'PostgreSQL', 'Audit logging', 'Role-based access'],
  },
  crm: {
    solution: 'CRM with lead scoring, pipelines and automation workflows',
    tech: ['Next.js', 'PostgreSQL', 'Queue workers', 'Webhooks'],
  },
  erp: {
    solution: 'Modular ERP with finance, inventory and reporting',
    tech: ['Service modules', 'PostgreSQL', 'Reporting engine', 'SSO'],
  },
  automation: {
    solution: 'Workflow automation across your tools + WhatsApp/API',
    tech: ['Node workers', 'Redis queues', 'Third-party APIs', 'Webhooks'],
  },
} satisfies Record<string, { solution: string; tech: string[] }>;

export function parseBudget(input: string): number {
  const cleaned = input.toLowerCase().replace(/,/g, '');
  let max = 0;
  for (const m of cleaned.matchAll(/(\d+(?:\.\d+)?)\s*([km])?/g)) {
    let n = parseFloat(m[1]!);
    if (m[2] === 'k') n *= 1_000;
    else if (m[2] === 'm') n *= 1_000_000;
    if (n > max) max = n;
  }
  return max;
}

function classify(text: string): keyof typeof SOLUTIONS {
  const t = text.toLowerCase();
  if (/ai|agent|assistant|llm|chat|gpt/.test(t)) return 'ai';
  if (/health|clinic|hospital|patient|ehr|hms|medical/.test(t)) return 'health';
  if (/crm|lead|sales|pipeline/.test(t)) return 'crm';
  if (/erp|inventory|finance|procurement/.test(t)) return 'erp';
  if (/saas|platform|app|product/.test(t)) return 'saas';
  return 'automation';
}

/** Deterministic lead enrichment (seam for a model call to replace later). */
export function enrichLead(lead: LeadInput): LeadEnrichment {
  const text = `${lead.projectType ?? ''} ${lead.requirements ?? ''}`;
  let score = 40;

  const budgetNum = parseBudget(lead.budget ?? '');
  if (budgetNum >= 50_000) score += 30;
  else if (budgetNum >= 20_000) score += 20;
  else if (budgetNum >= 5_000) score += 10;

  if (lead.company) score += 8;
  if (/@(?!gmail|yahoo|hotmail|outlook)\S+\.\S+/.test(lead.email ?? '')) score += 12;
  if ((lead.requirements ?? '').length > 120) score += 10;
  score = Math.min(100, score);

  const complexity: LeadComplexity =
    score >= 85
      ? LeadComplexity.ENTERPRISE
      : score >= 65
        ? LeadComplexity.HIGH
        : score >= 45
          ? LeadComplexity.MEDIUM
          : LeadComplexity.LOW;

  const { solution, tech } = SOLUTIONS[classify(text)];

  return {
    score,
    complexity,
    recommendedSolution: solution,
    projectScope: [
      'Discovery & technical architecture',
      solution,
      'Integration, QA & security review',
      'Deployment, monitoring & handover',
    ],
    technicalRequirements: tech,
    summary: `${lead.name ?? 'A prospect'} from ${
      lead.company ?? 'an unknown company'
    } is exploring a ${lead.projectType ?? 'project'} (${complexity} complexity). Budget ${
      lead.budget ?? 'n/a'
    }, timeline ${lead.timeline ?? 'n/a'}. Recommended: ${solution}.`,
  };
}
