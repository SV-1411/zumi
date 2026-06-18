# @zumi/api

ZUMI backend — Node + Express + Socket.IO + JWT, backed by PostgreSQL (Prisma) and optional Redis.

## Run

```bash
# from repo root — installs all workspaces
npm install

# generate the Prisma client
npm run db:generate

# create schema (first time) and seed roles/permissions/admin
npm run db:migrate            # prisma migrate dev
npm run --workspace @zumi/db seed

# start the API (http://localhost:4000)
npm run dev:api
```

Copy `apps/api/.env.example` → `apps/api/.env` and set `DATABASE_URL`, the two JWT secrets, and (optionally) `REDIS_URL`. Redis is optional — caching and rate-limit state degrade gracefully when it's absent.

## Auth model

- **Access token** — short-lived JWT (`ACCESS_TOKEN_TTL`, default 15 min), sent as `Authorization: Bearer <token>`.
- **Refresh token** — opaque random string; only its SHA-256 hash is stored (`RefreshToken` table). Delivered as an httpOnly cookie (`zumi_rt`) and rotated on every `/refresh`.
- **RBAC** — `Role` → `Permission` (many-to-many). Middleware: `authenticate`, `requireRole(...)`, `requirePermission('lead:read')`.

## Endpoints

| Method | Path                       | Auth                     | Purpose                                  |
| ------ | -------------------------- | ------------------------ | ---------------------------------------- |
| GET    | `/api/health`              | public                   | Liveness + DB/Redis checks               |
| POST   | `/api/auth/register`       | public                   | Create client account, issue tokens      |
| POST   | `/api/auth/login`          | public                   | Email/password login                     |
| POST   | `/api/auth/refresh`        | cookie/body              | Rotate refresh, new access token         |
| POST   | `/api/auth/logout`         | cookie/body              | Revoke refresh token                     |
| GET    | `/api/auth/me`             | access token             | Current user                             |
| POST   | `/api/leads`               | public (rate-limited)    | Capture lead + AI enrichment + summary   |
| GET    | `/api/leads`               | `lead:read`              | List/paginate/filter leads               |
| GET    | `/api/leads/:id`           | `lead:read`              | Lead detail + summary + conversation     |
| PATCH  | `/api/leads/:id/status`    | `lead:write`             | Update lead status                       |
| GET    | `/api/projects`            | `project:read`           | List (clients see only their own)        |
| GET    | `/api/projects/:id`        | `project:read`           | Project detail (access-checked)          |
| POST   | `/api/projects`            | `project:write`          | Create project                           |
| PATCH  | `/api/projects/:id`        | `project:write`          | Update project                           |
| GET    | `/api/analytics/overview`  | `analytics:read`         | Admin KPI snapshot (cached)              |

## Realtime (Socket.IO)

Authenticated handshake (`auth.token` = access token). Admins/staff join the `admins` room; everyone joins `user:<id>`.
Events emitted: `lead:new` (to admins). Helpers in `lib/realtime.ts`.

## Lead AI enrichment

`lib/ai.ts` derives `score`, `complexity`, `recommendedSolution`, `projectScope`, `technicalRequirements`, and a `summary` from the captured fields. It's deterministic today and is the single seam where a model call (Claude) can be dropped in to generate the scope server-side.
