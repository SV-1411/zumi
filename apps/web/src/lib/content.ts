import type { Intent } from './store';

/** Hero copy reacts to the chosen intent — the site adapts to the visitor. */
export const INTENT_COPY: Record<
  Exclude<Intent, null> | 'default',
  { eyebrow: string; line: string }
> = {
  default: {
    eyebrow: 'Technology & AI transformation studio',
    line: 'We build the systems that run the future of business.',
  },
  saas: {
    eyebrow: 'SaaS engineering',
    line: 'From zero to a production SaaS your customers trust.',
  },
  automate: {
    eyebrow: 'Workflow automation',
    line: 'We turn manual operations into autonomous systems.',
  },
  ai: {
    eyebrow: 'Applied AI',
    line: 'AI agents, assistants and knowledge systems that actually ship.',
  },
  scale: {
    eyebrow: 'Operations at scale',
    line: 'Infrastructure and tooling engineered to grow without breaking.',
  },
  healthcare: {
    eyebrow: 'Healthcare technology',
    line: 'HMS, EHR and clinical AI built for the realities of care.',
  },
};
