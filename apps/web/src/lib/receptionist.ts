export interface DemoTurn {
  role: 'bot' | 'caller';
  text: string;
  /** stage label surfaced in the workflow diagram as the convo progresses */
  stage?: string;
}

/** Scripted AI-receptionist call — greeting → qualify → book → summarise. */
export const RECEPTION_SCRIPT: DemoTurn[] = [
  { role: 'bot', text: 'Good afternoon — thanks for calling Brightsmile Dental. This is Aria, how can I help?', stage: 'Greeting' },
  { role: 'caller', text: 'Hi, I think I cracked a tooth and it really hurts.' },
  { role: 'bot', text: "I'm sorry to hear that — let's get you seen quickly. Is this your first visit with us?", stage: 'Lead qualification' },
  { role: 'caller', text: 'Yes, first time. My name is Daniel Cole.' },
  { role: 'bot', text: 'Thanks, Daniel. What number and email are best for your confirmation?', stage: 'Information collection' },
  { role: 'caller', text: '07700 900145, daniel.cole@email.com.' },
  { role: 'bot', text: 'Got it. We have an emergency slot today at 4:30pm or tomorrow at 9:00am. Which works?', stage: 'Appointment booking' },
  { role: 'caller', text: 'Today at 4:30 please.' },
  { role: 'bot', text: "Booked. You'll get a text and email confirmation shortly. Do you have dental insurance on file?", stage: 'FAQ responses' },
  { role: 'caller', text: 'Not yet — can I bring it on the day?' },
  { role: 'bot', text: "Absolutely. I'll flag this as urgent for the duty dentist. You're all set, Daniel — see you at 4:30.", stage: 'Escalation' },
];

export const RECEPTION_STAGES = [
  'Greeting',
  'Lead qualification',
  'Information collection',
  'Appointment booking',
  'FAQ responses',
  'Escalation',
  'Summary',
];

export const RECEPTION_SUMMARY = {
  caller: 'Daniel Cole',
  phone: '07700 900145',
  email: 'daniel.cole@email.com',
  reason: 'Cracked tooth — in pain (emergency)',
  booked: 'Today, 4:30pm',
  priority: 'Urgent — flagged to duty dentist',
  insurance: 'To verify on arrival',
};
