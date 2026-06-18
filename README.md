# ZUMI

> Premium technology & AI transformation studio platform — built as an Awwwards-grade experience with a serious enterprise backend.

ZUMI builds AI agents, custom software, healthcare systems, ERP/CRM, and automation. This repository is the company platform: a cinematic marketing experience, a conversational AI lead-capture system, and (in progress) client/admin dashboards backed by an Express + Postgres API.

---

## Monorepo layout

```
zumi/
├─ apps/
│  ├─ web/                 # Next.js 15 · React 19 · R3F · GSAP · Lenis (the experience)
│  │  └─ src/
│  │     ├─ app/           # routes, layout, globals, /api/lead route
│  │     ├─ components/
│  │     │  ├─ loader/     # cinematic particle-assembly loader
│  │     │  ├─ hero/       # narrative hero + intent selector
│  │     │  ├─ three/      # EnergyCore + CoreScene (R3F)
│  │     │  ├─ assistant/  # 3D companion + lead-capture chat
│  │     │  ├─ sections/   # Services, Trust, holograms
│  │     │  ├─ layout/     # Nav, Footer
│  │     │  └─ providers/  # SmoothScroll (Lenis+GSAP), PointerProvider
│  │     └─ lib/           # design tokens, motion system, store, content
│  └─ api/                 # Express + Socket.IO + JWT  (roadmap)
├─ packages/
│  ├─ db/                  # Prisma schema + client  (roadmap)
│  └─ ui/                  # shared design system     (roadmap)
└─ docs/                   # architecture & roadmap
```

## Design language

| Token            | Value     |
| ---------------- | --------- |
| Background       | `#0B0B0B` |
| Surface          | `#151515` |
| Primary text     | `#F7F7F7` |
| Secondary text   | `#A0A0A0` |
| Accent           | `#4F6FFF` |
| Accent soft      | `#DDE4FF` |

Elegant · sophisticated · premium. No neon, no random gradients, luxury spacing.
Typography: Inter (loaded) with General Sans / Satoshi as display fallbacks.

One motion language lives in `src/lib/motion.ts` — a single ease (`cubic-bezier(0.16,1,0.3,1)`), three durations, reusable variants. Motion communicates hierarchy, never decoration.

## What runs today

- **Cinematic loader** — particles assemble onto a shell, a wireframe structure forms, `ZUMI` reveals letter-by-letter, the core flashes/morphs, then the world is revealed. Live `%` drives the 3D assembly.
- **Narrative hero** — black void with an interactive WebGL energy core (distorting icosahedron + particle halo that leans toward the cursor), the question *"What are you trying to build?"*, and an intent selector that re-skins the hero copy.
- **3D AI assistant** — a minimal glass companion whose iris tracks the cursor, fronting a conversational flow that collects requirement fields, scores the lead, and generates a recommended scope. POSTs to `/api/lead` (forwards to the backend when `ZUMI_API_URL` is set).
- **Services / Trust** — animated SVG "holographic objects" per service, scroll-revealed; animated impact counters.

## Getting started

```bash
npm install          # installs all workspaces
npm run dev          # starts the web app on http://localhost:3000
npm run build        # production build (Lighthouse-oriented: lazy 3D, code-split)
```

> First dev boot can be slow on Windows/spinning disks (heavy three.js graph). The production build is the source of truth.

### Environment

Copy `apps/web/.env.example` → `apps/web/.env.local`:

```
ZUMI_API_URL=http://localhost:4000   # when set, leads persist to the backend
```

## Roadmap

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the full delivery plan.
