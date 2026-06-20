export interface ProcessStep {
  no: string;
  title: string;
  body: string;
  outputs: string[];
}

/** How an engagement actually runs — discovery to ownership. */
export const PROCESS: ProcessStep[] = [
  {
    no: '01',
    title: 'Discover',
    body: 'We map your operation, the constraints, and the one outcome that matters. No discovery theatre — a sharp scope you can sign off on.',
    outputs: ['Technical scope', 'Architecture sketch', 'Success metric'],
  },
  {
    no: '02',
    title: 'Design',
    body: 'Systems and interfaces designed together. You see the real thing — interactive prototypes, data model, integration map — before a line ships.',
    outputs: ['Interactive prototype', 'Data model', 'Integration map'],
  },
  {
    no: '03',
    title: 'Engineer',
    body: 'Production code in weekly increments. Tested, observable, deployed. You watch it grow in your own environment, not a demo sandbox.',
    outputs: ['Weekly releases', 'CI/CD pipeline', 'Observability'],
  },
  {
    no: '04',
    title: 'Operate',
    body: 'We harden, document and hand over — or stay on as your platform team. Either way, you own the system and the source.',
    outputs: ['Runbooks', 'Handover & training', 'Ongoing SLAs'],
  },
];
