# ZUMI

> Premium technology & AI transformation studio platform — an Awwwards-grade web experience with a serious full-stack backend.

ZUMI builds AI agents, AI receptionists, custom software, healthcare systems, ERP/CRM, and office automation. This repository is the company platform: a cinematic marketing experience, a conversational AI lead-capture assistant, and an authenticated admin console for managing inquiries — all in **one self-contained Next.js app** backed by Neon serverless Postgres.

**Live:** https://zumi-ashen.vercel.app

---

## Stack

- **Next.js 15** (App Router) · **React 19**
- **react-three-fiber / drei / three** — WebGL energy core, loader, 3D companion
- **Framer Motion · GSAP · Lenis** — one motion language, smooth scroll, scroll-driven reveals
- **Tailwind CSS** — design tokens in `globals.css` + `lib/motion.ts`
- **Prisma + Neon serverless Postgres** — leads, users, sessions (HTTP driver, Vercel-native)
- **JWT auth** (access + refresh) · **bcryptjs**
- **OpenRouter** — live LLM for the AI consultant (scripted fallback if unset)
- **Zod** — request validation · **Zustand** — client state

## Monorepo layout

```
zumi/
├─ apps/
│  ├─ web/                       # the product — full-stack Next.js app
│  │  └─ src/
│  │     ├─ app/
│  │     │  ├─ page.tsx          # landing experience (all sections)
│  │     │  ├─ admin/            # authenticated leads dashboard
│  │     │  └─ api/              # route handlers (see API below)
│  │     ├─ components/
│  │     │  ├─ loader/           # cinematic particle-assembly loader
│  │     │  ├─ hero/             # narrative hero + intent selector
│  │     │  ├─ three/            # EnergyCore + CoreScene (R3F)
│  │     │  ├─ companion/        # 3D robot companion + thought bubbles
│  │     │  ├─ assistant/        # conversational lead-capture chat
│  │     │  ├─ sections/         # Marquee, Work, Process, Healthcare,
│  │     │  │                    #   Receptionist, Stack, Labs, About, CTA…
│  │     │  ├─ admin/            # AdminLogin, LeadsDashboard
│  │     │  ├─ layout/           # Nav, Footer
│  │     │  ├─ providers/        # SmoothScroll, Cursor, ScrollProgress, Pointer
│  │     │  └─ ui/               # Reveal, Magnetic, SectionHeading
│  │     ├─ lib/                 # design tokens, motion, content, stores
│  │     └─ server/              # auth, leads, ai/openrouter, email, env
│  └─ api/                       # legacy Express + Socket.IO (local only — not deployed)
├─ packages/
│  └─ db/                        # Prisma schema, client, seed
└─ docs/                         # ROADMAP
```

> The production deployment runs **`apps/web` alone**. `apps/api` remains only for
> local realtime/Socket.IO experiments and is not part of the Vercel build.

## Design language

| Token          | Value     |
| -------------- | --------- |
| Background     | `#0B0B0B` |
| Surface        | `#151515` |
| Primary text   | `#F7F7F7` |
| Secondary text | `#A0A0A0` |
| Accent         | `#4F6FFF` |
| Accent soft    | `#DDE4FF` |

Elegant · sophisticated · premium. No neon, no random gradients, luxury spacing.
One motion language lives in `src/lib/motion.ts` — a single ease (`cubic-bezier(0.16,1,0.3,1)`), three durations, reusable variants. Motion communicates hierarchy, never decoration. A custom cursor, slim accent scrollbar, scroll-progress bar, and page-wide ambient glow tie the experience together.

## What's built

- **Cinematic loader** — particles assemble onto a shell, a wireframe forms, `ZUMI` reveals letter-by-letter, then the world is revealed. Live `%` drives the 3D assembly.
- **Narrative hero** — interactive WebGL energy core that leans toward the cursor, with an intent selector that re-skins the hero copy.
- **Full landing experience** — Marquee → Trust → Services → Work (case studies w/ 3D tilt) → Process → Healthcare → AI Receptionist (interactive simulated call) → Stack → Labs → About → Final CTA → Footer, all scroll-choreographed.
- **3D AI companion + assistant** — a minimal glass robot whose iris tracks the cursor, fronting a conversational flow that collects requirements, scores the lead, generates a recommended scope, and persists it via `/api/lead`. Uses OpenRouter when configured, scripted otherwise.
- **Admin console** (`/admin`) — JWT-authenticated leads dashboard: KPI cards, lead list sorted by score, per-lead AI summary/scope, and status workflow (New → Qualified → Contacted → Proposal → Won/Lost).

## API routes

| Route | Purpose |
| --- | --- |
| `POST /api/lead` | Capture an inquiry/lead |
| `POST /api/assistant` | Conversational AI consultant turn |
| `POST /api/auth/login` · `logout` · `refresh` · `GET /api/auth/me` | JWT auth |
| `GET /api/admin/leads` · `PATCH /api/admin/leads/[id]/status` | Admin (auth required) |
| `GET /api/analytics` | Dashboard KPIs |

## Getting started

```bash
npm install          # installs all workspaces (also generates the Prisma client)
cp .env.example apps/web/.env.local   # then fill in real values
npm run db:push      # create tables on your Neon database
npm run db:seed      # create the seeded admin account
npm run dev          # http://localhost:3000
```

> First dev boot can be slow on Windows (heavy three.js graph). The production
> build is the source of truth: `npm run build`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the web app (`apps/web`) |
| `npm run build` | Production build of `apps/web` |
| `npm run lint` | ESLint over `apps/web` |
| `npm run db:push` / `db:seed` / `db:studio` | Prisma schema push / seed / studio |

## Environment

See [`.env.example`](.env.example) for the full list. Minimum to run the
backend: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`. The AI
assistant needs `OPENROUTER_API_KEY` (falls back to a scripted flow otherwise).

## Deployment

Deployed on **Vercel** as a single project from `apps/web` (monorepo workspace
resolved at the repo root). See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the full
walkthrough (CLI and GitHub auto-deploy), env-var table, and post-deploy checks.
Every push to `main` redeploys automatically.

## Roadmap

See [`docs/ROADMAP.md`](docs/ROADMAP.md).
