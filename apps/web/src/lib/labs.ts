export interface LabProject {
  id: string;
  name: string;
  kind: string;
  status: 'Research' | 'Prototype' | 'Internal' | 'Incubating';
  blurb: string;
}

/** ZUMI Labs — experiments that signal where we're heading. Authority, not ads. */
export const LAB_PROJECTS: LabProject[] = [
  {
    id: 'orchestra',
    name: 'Orchestra',
    kind: 'Multi-agent runtime',
    status: 'Prototype',
    blurb:
      'A supervisor that plans, delegates and verifies across a fleet of specialist agents — with a human checkpoint on every irreversible action.',
  },
  {
    id: 'ledger-sense',
    name: 'LedgerSense',
    kind: 'Financial reasoning',
    status: 'Research',
    blurb:
      'An LLM that reconciles messy financial documents into structured truth and flags anomalies before they reach the books.',
  },
  {
    id: 'triage',
    name: 'Triage',
    kind: 'Clinical copilot',
    status: 'Incubating',
    blurb:
      'A bedside assistant that summarises charts, surfaces drug interactions and drafts notes — always deferring the call to the clinician.',
  },
  {
    id: 'forge',
    name: 'Forge',
    kind: 'Internal tooling',
    status: 'Internal',
    blurb:
      'Our own scaffolding engine — turns a scoped brief into a typed, deployable foundation in minutes. It’s how we ship in weeks.',
  },
  {
    id: 'echo',
    name: 'Echo',
    kind: 'Voice reception',
    status: 'Prototype',
    blurb:
      'Real-time voice front desk: greets, qualifies and books over the phone with sub-second latency and a warm, on-brand voice.',
  },
  {
    id: 'atlas-bi',
    name: 'Atlas BI',
    kind: 'Conversational analytics',
    status: 'Research',
    blurb:
      'Ask your business a question in plain language; get a governed, sourced answer drawn straight from your warehouse.',
  },
];
