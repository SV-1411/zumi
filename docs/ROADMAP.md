# ZUMI — Development Roadmap

A phased plan from the current foundation to the full enterprise platform described in the brief. Each phase is independently shippable.

## ✅ Phase 0 — Foundation & signature experience (DONE)

- Monorepo (npm workspaces), Next.js 15 + React 19 + strict TypeScript.
- Tailwind design tokens, motion system (`lib/motion.ts`), Lenis + GSAP smooth scroll, global pointer store (Zustand).
- Cinematic loader (particle assembly → structure → wordmark → morph).
- Narrative hero with interactive R3F energy core + intent selector.
- 3D AI assistant with cursor-tracking companion + lead-capture flow + scoring/scope generation.
- Services (holographic SVG objects) + Trust counters + Nav + Footer.
- `/api/lead` route (forwards to backend when configured).
- Clean production build verified.

## Phase 1 — Backend & data layer

- `packages/db`: complete **Prisma schema** — Users, Roles, Permissions, Clients, Projects, Milestones, Leads, AIConversations, AISummaries, Quotations, Invoices, Meetings, Files, Notifications.
- `apps/api`: Express + TypeScript, Postgres + Redis, Socket.IO, JWT auth (access/refresh), RBAC middleware.
- Real lead persistence + server-side AI enrichment (model-generated scope/score/summary).
- Zod-validated REST endpoints; OpenAPI doc.

## Phase 2 — Auth & dashboards

- Split-layout **login** (glass torus-knot WebGL left, glassmorphism card right, OAuth Google/GitHub) with the torus→particles→dashboard transition.
- **Client dashboard** (Linear-grade): projects, milestones, files, invoices, meetings, AI chat, downloads, progress.
- **Admin dashboard**: leads + AI summaries, projects, quotations, users, invoices, meetings, analytics, conversation logs.

## Phase 3 — Experience sections

- **Portfolio / case studies** as immersive per-project 3D environments (healthcare, receptionist, ERP) with challenge→solution→stack→results→KPIs→before/after→timeline→testimonial.
- **Services** upgraded to full R3F holographic objects (Neural Core, Medical Grid, Communication Sphere, Data Cube, Network Cluster).
- **About** interactive animated timeline.

## Phase 4 — Product experiences

- **AI ROI Calculator** with animated visualisations + downloadable PDF stored on the client account.
- **Healthcare** standalone section: patient journey, doctor workflow, appointment/data/billing/analytics flows.
- **AI Receptionist live demo** (selectable business type, simulated greet→qualify→book→summarise + workflow diagram).
- **Build with ZUMI wizard** (8-step product-style intake → technical scope, architecture, stack, timeline, risk, downloadable proposal → admin lead).
- **ZUMI Labs** innovation showcase.

## Phase 5 — Hardening & deploy

- Docker (web, api, postgres, redis) + `docker-compose`, NGINX reverse proxy, GitHub Actions CI/CD.
- Lighthouse ≥ 95 pass (lazy-load, code-split, Suspense, RSC, image optimisation, GPU-friendly motion).
- E2E (Playwright) + unit tests, error monitoring, rate limiting, security review.

## Architecture (target)

```
Browser ──► Next.js 15 (RSC + edge) ──► /api/* route handlers
                                         │
                                         ▼
                         Express API (JWT, RBAC, Socket.IO)
                              │            │
                              ▼            ▼
                       PostgreSQL       Redis (cache, queues, sessions)
                         (Prisma)
                              │
                              ▼
                     AI enrichment (lead scoring, scope, summaries)
```
