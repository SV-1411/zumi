/** Capability marquee + tech stack groups. */

export const MARQUEE_ITEMS = [
  'AI Agents',
  'AI Receptionists',
  'Office Automation',
  'Custom Software',
  'SaaS Development',
  'Web Applications',
  'Mobile Applications',
  'Enterprise Dashboards',
  'Healthcare HMS',
  'EHR Systems',
  'CRM Development',
  'ERP Development',
  'Workflow Automation',
  'AI Chat Systems',
  'AI Knowledge Bases',
  'Cloud Solutions',
  'DevOps',
  'API Integrations',
  'WhatsApp Automation',
  'Business Intelligence',
  'Analytics Systems',
  'Digital Transformation',
];

export interface StackGroup {
  layer: string;
  tools: string[];
}

export const STACK: StackGroup[] = [
  {
    layer: 'Frontend',
    tools: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind', 'Three.js / R3F', 'GSAP'],
  },
  {
    layer: 'Backend',
    tools: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'Socket.IO'],
  },
  {
    layer: 'Applied AI',
    tools: ['LLM orchestration', 'RAG / vector stores', 'Tool calling', 'Eval harnesses'],
  },
  {
    layer: 'Cloud & DevOps',
    tools: ['Docker', 'NGINX', 'GitHub Actions', 'Vercel', 'Observability'],
  },
];
