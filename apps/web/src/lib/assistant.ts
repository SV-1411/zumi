/* ----------------------------------------------------------------------------
   ZUMI AI assistant — conversational lead-capture flow.
   A deterministic, well-designed script that collects the requirement fields
   and derives a lead score + project scope client-side. The same payload is
   POSTed to the API, where a real model can enrich it server-side.
---------------------------------------------------------------------------- */

export type LeadField =
  | 'name'
  | 'email'
  | 'company'
  | 'projectType'
  | 'requirements'
  | 'budget'
  | 'timeline';

export interface LeadDraft {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  requirements?: string;
  budget?: string;
  timeline?: string;
}

export interface Step {
  field: LeadField;
  prompt: string;
  placeholder: string;
  validate?: (v: string) => string | null; // returns error or null
}

export const STEPS: Step[] = [
  {
    field: 'name',
    prompt: "Hi — I'm ZUMI's assistant. Let's scope what you want to build. First, what's your name?",
    placeholder: 'Your name',
  },
  {
    field: 'email',
    prompt: 'Nice to meet you, {name}. What email should we use to send your project scope?',
    placeholder: 'you@company.com',
    validate: (v) =>
      /.+@.+\..+/.test(v) ? null : 'That doesn’t look like a valid email.',
  },
  {
    field: 'company',
    prompt: 'Which company or team are you with?',
    placeholder: 'Company name',
  },
  {
    field: 'projectType',
    prompt: 'What are we building? (e.g. AI agent, SaaS, healthcare platform, CRM, automation)',
    placeholder: 'Project type',
  },
  {
    field: 'requirements',
    prompt: 'Describe the core problem and what success looks like.',
    placeholder: 'A few sentences…',
  },
  {
    field: 'budget',
    prompt: 'Roughly what budget range are you working with?',
    placeholder: 'e.g. $25k–$50k',
  },
  {
    field: 'timeline',
    prompt: 'And your ideal timeline?',
    placeholder: 'e.g. 8–12 weeks',
  },
];

export interface LeadAnalysis {
  score: number; // 0-100
  complexity: 'Low' | 'Medium' | 'High' | 'Enterprise';
  recommended: string;
  scope: string[];
  summary: string;
}

const PROJECT_SOLUTIONS: Record<string, string> = {
  ai: 'Custom AI agents + knowledge base with human-in-the-loop review',
  saas: 'Multi-tenant SaaS on Next.js + Postgres with billing & RBAC',
  health: 'HMS/EHR module with appointment, records & analytics layers',
  crm: 'CRM with lead scoring, pipelines and automation workflows',
  erp: 'Modular ERP with finance, inventory and reporting',
  automation: 'Workflow automation across your existing tools + WhatsApp/API',
};

/**
 * Parse a free-text budget into a number, honouring "k"/"m" shorthand and
 * ranges (e.g. "$40k–$60k" -> 60000). Kept in sync with the server's parser.
 */
function parseBudget(input: string): number {
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

/** Lightweight heuristic scoring — replaced/augmented by the model server-side. */
export function analyzeLead(lead: LeadDraft): LeadAnalysis {
  const text = `${lead.projectType} ${lead.requirements}`.toLowerCase();
  let score = 40;

  // budget signal
  const budgetNum = parseBudget(lead.budget ?? '');
  if (budgetNum >= 50000) score += 30;
  else if (budgetNum >= 20000) score += 20;
  else if (budgetNum >= 5000) score += 10;

  // company + email completeness
  if (lead.company) score += 8;
  if (/@(?!gmail|yahoo|hotmail|outlook)/.test(lead.email ?? '')) score += 12;

  // intent richness
  if ((lead.requirements ?? '').length > 120) score += 10;

  score = Math.min(100, score);

  let solutionKey = 'automation';
  if (/ai|agent|assistant|llm|chat/.test(text)) solutionKey = 'ai';
  else if (/saas|platform|app/.test(text)) solutionKey = 'saas';
  else if (/health|clinic|hospital|patient|ehr|hms/.test(text)) solutionKey = 'health';
  else if (/crm|lead|sales/.test(text)) solutionKey = 'crm';
  else if (/erp|inventory|finance/.test(text)) solutionKey = 'erp';

  const complexity: LeadAnalysis['complexity'] =
    score >= 85 ? 'Enterprise' : score >= 65 ? 'High' : score >= 45 ? 'Medium' : 'Low';

  const scope = [
    'Discovery & technical architecture',
    PROJECT_SOLUTIONS[solutionKey] ?? 'Custom engineering',
    'Integration, QA & security review',
    'Deployment, monitoring & handover',
  ];

  return {
    score,
    complexity,
    recommended: PROJECT_SOLUTIONS[solutionKey] ?? 'Custom software engineering',
    scope,
    summary: `${lead.name ?? 'A prospect'} from ${
      lead.company ?? 'an unknown company'
    } is exploring a ${lead.projectType ?? 'project'} (${complexity} complexity). Budget ${
      lead.budget ?? 'n/a'
    }, timeline ${lead.timeline ?? 'n/a'}. Recommended: ${
      PROJECT_SOLUTIONS[solutionKey]
    }.`,
  };
}
