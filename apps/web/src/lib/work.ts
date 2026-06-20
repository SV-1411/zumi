export interface CaseStudy {
  id: string;
  client: string;
  sector: string;
  title: string;
  summary: string;
  metric: { value: string; label: string };
  secondary: { value: string; label: string }[];
  stack: string[];
  accent: string; // subtle per-card tint
}

/** Outcome-led case studies — the Trust Engine. Real business impact, no fluff. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'meridian-health',
    client: 'Meridian Health',
    sector: 'Healthcare',
    title: 'A unified HMS that cut admission time by two-thirds',
    summary:
      'Replaced four disconnected tools with a single HMS + EHR. Triage, beds, billing and labs now share one source of truth, with a clinical copilot summarising every chart.',
    metric: { value: '68%', label: 'faster patient admission' },
    secondary: [
      { value: '3.2k', label: 'staff hours saved / month' },
      { value: '0', label: 'data silos remaining' },
    ],
    stack: ['Next.js', 'Postgres', 'FHIR', 'RAG copilot'],
    accent: 'rgba(79,111,255,0.10)',
  },
  {
    id: 'northwind-ops',
    client: 'Northwind Logistics',
    sector: 'Operations',
    title: 'An AI dispatch layer that runs the night shift on its own',
    summary:
      'An agentic automation system that reads orders, assigns fleets, negotiates ETAs over WhatsApp and escalates only the edge cases to a human.',
    metric: { value: '4.1M', label: 'tasks automated / year' },
    secondary: [
      { value: '24/7', label: 'autonomous coverage' },
      { value: '19%', label: 'lower cost per delivery' },
    ],
    stack: ['Agents', 'Redis queues', 'WhatsApp API', 'Webhooks'],
    accent: 'rgba(63,196,137,0.10)',
  },
  {
    id: 'lumen-saas',
    client: 'Lumen',
    sector: 'SaaS',
    title: 'From pitch deck to a production SaaS in six weeks',
    summary:
      'Full product build — multi-tenant auth, billing, dashboards and a usage-metered API — shipped to first paying customers in a single quarter.',
    metric: { value: '6 wk', label: 'to first revenue' },
    secondary: [
      { value: '99.9%', label: 'uptime since launch' },
      { value: '12k', label: 'active seats' },
    ],
    stack: ['Next.js', 'Stripe', 'Prisma', 'Vercel'],
    accent: 'rgba(166,119,77,0.12)',
  },
  {
    id: 'atlas-crm',
    client: 'Atlas Capital',
    sector: 'Finance',
    title: 'A CRM that scores and routes every lead before sales wakes up',
    summary:
      'Custom CRM with an AI qualification engine — enrichment, intent scoring and instant routing — wired into the firm’s existing pipeline and BI stack.',
    metric: { value: '2.4×', label: 'qualified-lead conversion' },
    secondary: [
      { value: '<60s', label: 'lead response time' },
      { value: '100%', label: 'pipeline visibility' },
    ],
    stack: ['CRM', 'Lead scoring', 'BI', 'API integrations'],
    accent: 'rgba(63,196,137,0.10)',
  },
];
