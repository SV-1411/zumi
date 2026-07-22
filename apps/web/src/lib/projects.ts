/* ----------------------------------------------------------------------------
   PROJECTS, the real work.
   Every entry is a system Shivansh actually designed & shipped. The showcase
   prefers a *live, running* demo (embeddable iframe) and falls back to a looping
   reel, then a generated poster. Drop real recordings into /public/projects/ and
   the UI upgrades automatically, no code change needed.
---------------------------------------------------------------------------- */

export type Medium = 'web' | 'mobile' | 'game' | 'hardware' | 'api';

export interface Project {
  id: string;
  name: string;
  tagline: string; // one punchy line
  category: string; // shown as eyebrow / filter
  medium: Medium;
  year: string;
  role: string;
  summary: string; // 1–2 sentences, the "what & why"
  stack: string[];
  metrics: { value: string; label: string }[];

  liveUrl?: string; // the real deployment
  repoUrl?: string;
  /** true only if the live site allows being framed (verified: no X-Frame-Options/CSP). */
  embeddable?: boolean;

  poster: string; // /projects/<id>.svg fallback, always present
  video?: string; // /projects/<id>.mp4 reel, swap in later

  accent: string; // per-project ambient tint (rgba)
  featured?: boolean; // surfaces in the live-demo showcase
  status?: 'live' | 'shipped' | 'beta' | 'wip';
}

export const PROJECTS: Project[] = [
  {
    id: 'serotoninn',
    name: 'Serotoninn',
    tagline: 'Glam meets grunge, a Berlin fashion house, online.',
    category: 'E-commerce · Fashion',
    medium: 'web',
    year: '2026',
    role: 'Design & build',
    summary:
      'A luxury fashion storefront, brutalist, high-contrast, editorial. Full commerce under an avant-garde art direction that sells the attitude, not just the garment.',
    stack: ['WordPress', 'WooCommerce', 'Custom theme', 'WebP', 'i18n'],
    metrics: [
      { value: 'Live', label: 'storefront' },
      { value: 'Multi-lang', label: 'EU-ready' },
      { value: '100%', label: 'custom art direction' },
    ],
    liveUrl: 'https://serotoninn.com',
    embeddable: true,
    poster: '/projects/serotoninn.png',
    accent: 'rgba(214,120,170,0.16)',
    featured: true,
    status: 'live',
  },
  {
    id: 'abvtek',
    name: 'AbvTek',
    tagline: 'Designing the spaces of tomorrow, from Dubai.',
    category: 'Corporate · Architecture',
    medium: 'web',
    year: '2026',
    role: 'Design & build',
    summary:
      'A Dubai design-and-build firm blending architecture, interiors and technology. A minimal, image-led Next.js site that makes the built work feel as premium as it is.',
    stack: ['Next.js', 'React', 'Headless CMS', 'Vercel'],
    metrics: [
      { value: 'Live', label: 'corporate site' },
      { value: 'Next.js', label: 'image-optimized' },
    ],
    liveUrl: 'https://abvtek.com',
    embeddable: true,
    poster: '/projects/abvtek.svg',
    accent: 'rgba(120,140,255,0.14)',
    featured: true,
    status: 'live',
  },
  {
    id: 'tecnoarreda',
    name: 'Tecnoarreda',
    tagline: 'Italian interior design, concept to completion.',
    category: 'Studio · Interior Design',
    medium: 'web',
    year: '2026',
    role: 'Design & build',
    summary:
      'An Italian architecture and interior-design studio, luxury residential and commercial spaces, presented with the craft and restraint the work deserves.',
    stack: ['WordPress', 'HTML5 video', 'Responsive', 'SEO'],
    metrics: [
      { value: 'Live', label: 'studio site' },
      { value: 'IT', label: 'bespoke build' },
    ],
    liveUrl: 'https://www.tecnoarreda.it',
    embeddable: true,
    poster: '/projects/tecnoarreda.png',
    accent: 'rgba(166,119,77,0.15)',
    featured: true,
    status: 'live',
  },
  {
    id: 'brightsmile',
    name: 'BrightSmile Dental AI',
    tagline: 'An AI receptionist that books real appointments while you sleep.',
    category: 'AI Agent · SaaS',
    medium: 'web',
    year: '2026',
    role: 'Design & full-stack',
    summary:
      'A WhatsApp + web AI receptionist for clinics. It qualifies patients, answers questions, and writes real bookings straight into Google Calendar and Sheets, no human in the loop.',
    stack: ['Next.js', 'OpenRouter', 'Google Calendar API', 'Sheets API', 'Vercel'],
    metrics: [
      { value: '24/7', label: 'live booking' },
      { value: '<30s', label: 'to a confirmed slot' },
      { value: '$0', label: 'model cost (free tier)' },
    ],
    liveUrl: 'https://brightsmile-dental-ai.vercel.app',
    embeddable: true,
    poster: '/projects/brightsmile.png',
    accent: 'rgba(79,111,255,0.14)',
    featured: true,
    status: 'live',
  },
  {
    id: 'akhrot',
    name: 'Akhrot',
    tagline: 'Long-term memory for every AI you use.',
    category: 'AI SaaS · RAG',
    medium: 'web',
    year: '2026',
    role: 'Founder · full-stack + infra',
    summary:
      'A memory layer that gives any AI assistant persistent, personal recall. A browser extension auto-captures your chats; a GPU-served RAG pipeline turns them into searchable memory you own.',
    stack: ['AWS EC2', 'Qwen · Ollama', 'RAG', 'Postgres', 'Browser Extension'],
    metrics: [
      { value: '∞', label: 'recall across chats' },
      { value: 'GPU', label: 'served (T4)' },
      { value: 'GDPR', label: 'self-service data rights' },
    ],
    liveUrl: 'https://akhrots.com',
    repoUrl: 'https://github.com/SV-1411/akhrot',
    embeddable: false, // X-Frame-Options: DENY, reel/poster only
    poster: '/projects/akhrot.svg',
    accent: 'rgba(63,196,137,0.14)',
    featured: true,
    status: 'live',
  },
  {
    id: 'nextignition',
    name: 'NextIgnition',
    tagline: 'The network for founders, in your pocket.',
    category: 'iOS App',
    medium: 'mobile',
    year: '2026',
    role: 'Full-stack + iOS',
    summary:
      'A startup-networking app that matches founders, operators and investors. Native iOS via Capacitor with real StoreKit in-app purchases, submitted to the App Store.',
    stack: ['Capacitor', 'iOS', 'RevenueCat', 'StoreKit', 'Node'],
    metrics: [
      { value: 'App Store', label: 'in review' },
      { value: 'IAP', label: 'real subscriptions' },
      { value: '1', label: 'premium tier' },
    ],
    liveUrl: 'https://nextignition.com',
    embeddable: true,
    poster: '/projects/nextignition.png',
    accent: 'rgba(166,119,77,0.16)',
    featured: true,
    status: 'live',
  },
  {
    id: 'arqiv',
    name: 'Arqiv',
    tagline: 'Archive and search the research that matters.',
    category: 'AI · Web App',
    medium: 'web',
    year: '2026',
    role: 'Full-stack',
    summary:
      'A platform to archive, organise and search academic papers and research — a fast, modern reading & retrieval layer built on a Supabase backend.',
    stack: ['TypeScript', 'Vite', 'Tailwind', 'Supabase'],
    metrics: [
      { value: 'search', label: 'across papers' },
      { value: 'Supabase', label: 'backend' },
    ],
    liveUrl: 'https://arqiv.kesug.com',
    repoUrl: 'https://github.com/SV-1411/arqiv.ai',
    embeddable: false,
    poster: '/projects/arqiv.svg',
    accent: 'rgba(79,111,255,0.13)',
    status: 'live',
  },
  {
    id: 'civicpulse',
    name: 'CivicPulse',
    tagline: 'Social-media intelligence for public figures.',
    category: 'Analytics Dashboard',
    medium: 'web',
    year: '2026',
    role: 'Full-stack',
    summary:
      'A politician-facing intelligence dashboard: it ingests social feeds, scores sentiment and surfaces the narratives moving around a public figure in near real time.',
    stack: ['React', 'Data pipeline', 'Sentiment', 'Charts', 'Node'],
    metrics: [
      { value: 'real-time', label: 'sentiment' },
      { value: 'multi-source', label: 'ingestion' },
    ],
    repoUrl: 'https://github.com/SV-1411',
    poster: '/projects/civicpulse.svg',
    accent: 'rgba(79,111,255,0.12)',
    status: 'wip',
  },
  {
    id: 'pokemon-india',
    name: 'Pokémon India',
    tagline: 'An open-world 3D creature-collector, built in the browser.',
    category: '3D Game',
    medium: 'game',
    year: '2026',
    role: 'Game dev',
    summary:
      'An original open-world 3D game, explorable overworld, battles, and a multiplayer layer next. A love letter to the genre, engineered from scratch.',
    stack: ['Three.js', 'WebGL', 'Physics', 'Multiplayer (next)'],
    metrics: [
      { value: '898', label: 'creatures' },
      { value: '3D', label: 'open world' },
    ],
    liveUrl: 'https://pokemon-battle-shivanshs-projects-279e2c7d.vercel.app',
    repoUrl: 'https://github.com/SV-1411/pokemon',
    embeddable: false,
    poster: '/projects/pokemon-india.png',
    accent: 'rgba(63,196,137,0.13)',
    featured: true,
    status: 'live',
  },
  {
    id: 'autopilot-3d',
    name: 'Auto-pilot 3D',
    tagline: 'Guidance & navigation for spacecraft, simulated.',
    category: 'Simulation',
    medium: 'game',
    year: '2026',
    role: 'Systems + sim',
    summary:
      'A spacecraft guidance simulation in Godot 4.5, autonomous navigation and control, rendered as a real-time 3D flight you can watch fly itself.',
    stack: ['Godot 4.5', 'GDScript', 'GNC', 'Physics'],
    metrics: [
      { value: 'autonomous', label: 'guidance' },
      { value: 'real-time', label: '3D sim' },
    ],
    repoUrl: 'https://github.com/SV-1411/autopilot',
    poster: '/projects/autopilot-3d.svg',
    accent: 'rgba(120,140,255,0.13)',
    status: 'shipped',
  },
  {
    id: 'drone-safety',
    name: 'Drone Safety System',
    tagline: 'Autonomous navigation that refuses to crash.',
    category: 'Robotics · CV',
    medium: 'hardware',
    year: '2026',
    role: 'Autonomy + CV',
    summary:
      'An autonomous drone-navigation stack validated in ArduPilot SITL, perception, path-planning and safety envelopes that keep the vehicle out of trouble on its own.',
    stack: ['Python', 'ArduPilot SITL', 'Computer Vision', 'Path planning'],
    metrics: [
      { value: 'SITL', label: 'validated' },
      { value: 'autonomous', label: 'navigation' },
    ],
    repoUrl: 'https://github.com/SV-1411',
    poster: '/projects/drone-safety.svg',
    accent: 'rgba(63,196,137,0.12)',
    status: 'shipped',
  },
  {
    id: 'drishti',
    name: 'DRISHTI',
    tagline: 'A cap that lets the blind “see”.',
    category: 'Assistive Hardware',
    medium: 'hardware',
    year: '2026',
    role: 'Embedded + CV',
    summary:
      'A wearable visual-assist cap on Raspberry Pi: on-device vision narrates the world, obstacles, text and scenes, into audio, in real time, hands-free.',
    stack: ['Raspberry Pi 4/5', 'Computer Vision', 'TTS', 'Edge inference'],
    metrics: [
      { value: 'on-device', label: 'vision' },
      { value: 'hands-free', label: 'audio guidance' },
    ],
    repoUrl: 'https://github.com/SV-1411',
    poster: '/projects/drishti.svg',
    accent: 'rgba(166,119,77,0.14)',
    status: 'shipped',
  },
  {
    id: 'silent-verify',
    name: 'silent-verify',
    tagline: 'Compliant KYC in a single API call.',
    category: 'Fintech API',
    medium: 'api',
    year: '2026',
    role: 'Backend',
    summary:
      'A compliant KYC verification API for an NBFC, PAN, bank and Aadhaar OKYC behind one clean JSON interface, brokered through a regulated aggregator.',
    stack: ['Node', 'REST', 'Sandbox.co.in', 'KYC / OKYC'],
    metrics: [
      { value: '3-in-1', label: 'PAN · bank · Aadhaar' },
      { value: 'compliant', label: 'by design' },
    ],
    repoUrl: 'https://github.com/SV-1411',
    poster: '/projects/silent-verify.svg',
    accent: 'rgba(120,120,140,0.12)',
    status: 'shipped',
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);

export function projectById(id: string) {
  return PROJECTS.find((p) => p.id === id);
}
