export interface ServiceModule {
  id: string;
  name: string;
  object: string; // the holographic object metaphor
  description: string;
  shape: 'core' | 'grid' | 'sphere' | 'cube' | 'cluster';
  items: string[];
}

export const SERVICES: ServiceModule[] = [
  {
    id: 'ai-agents',
    name: 'AI Agents',
    object: 'Neural Core',
    shape: 'core',
    description:
      'Autonomous agents that reason over your data, take action across tools, and stay supervised.',
    items: ['AI agents', 'AI chat systems', 'Lead qualification', 'Knowledge bases'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare Systems',
    object: 'Medical Grid',
    shape: 'grid',
    description:
      'HMS, EHR, telemedicine and clinical analytics engineered for the realities of care.',
    items: ['HMS', 'EHR', 'Patient portals', 'Medical analytics'],
  },
  {
    id: 'receptionist',
    name: 'AI Receptionist',
    object: 'Communication Sphere',
    shape: 'sphere',
    description:
      'A front desk that never sleeps — greets, qualifies, books and routes, then summarises.',
    items: ['Reception', 'Booking', 'WhatsApp automation', 'Customer support'],
  },
  {
    id: 'erp',
    name: 'ERP Platforms',
    object: 'Data Cube',
    shape: 'cube',
    description:
      'Modular ERP unifying finance, inventory, operations and reporting in one source of truth.',
    items: ['ERP', 'Internal tools', 'BI platforms', 'Analytics'],
  },
  {
    id: 'crm',
    name: 'CRM & Automation',
    object: 'Network Cluster',
    shape: 'cluster',
    description:
      'Pipelines, lead scoring and workflow automation that compound your revenue motion.',
    items: ['CRM', 'Workflow automation', 'API integrations', 'Cloud & DevOps'],
  },
];
