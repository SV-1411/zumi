# Deploying ZUMI to Vercel

ZUMI is now a **single full-stack Next.js app** (`apps/web`) — the marketing site, the
AI assistant, lead capture, the admin console, and all API routes live in one project.
The database is Neon (cloud Postgres) over the serverless driver (HTTPS), so it works on
Vercel with no separate server.

## Prerequisites

- A [Vercel](https://vercel.com) account (free Hobby tier is fine).
- Your Neon database (already set up). Tables are already created + seeded.
- Your env values (below).

## Option A — Deploy with the Vercel CLI (fastest)

From the repo root (`D:\zumi`):

```bash
npx vercel login           # opens browser; sign in to YOUR account
npx vercel link            # create/link a project
# When asked for the root directory, enter:  apps/web
npx vercel --prod          # build + deploy
```

Then add the environment variables (once), and redeploy:

```bash
npx vercel env add DATABASE_URL production
npx vercel env add JWT_ACCESS_SECRET production
npx vercel env add JWT_REFRESH_SECRET production
npx vercel env add OPENROUTER_API_KEY production
npx vercel env add OPENROUTER_MODEL production
# optional email:
npx vercel env add RESEND_API_KEY production
npx vercel env add LEAD_NOTIFY_TO production
npx vercel --prod
```

## Option B — Deploy via GitHub (auto-deploy on push)

1. Push this repo to GitHub (`git remote add origin … && git push -u origin main`).
2. On vercel.com → **Add New → Project → Import** your repo.
3. Set **Root Directory = `apps/web`** (Vercel auto-detects Next.js + the npm workspace).
4. Add the environment variables (below) under **Settings → Environment Variables**.
5. **Deploy.** Every push to `main` redeploys.

## Environment variables (set these in Vercel)

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Your Neon **pooled** connection string (the `-pooler` host) with `?sslmode=require` |
| `JWT_ACCESS_SECRET` | A long random string (`openssl rand -hex 32`) |
| `JWT_REFRESH_SECRET` | A different long random string |
| `ACCESS_TOKEN_TTL` | `900` (optional, default) |
| `REFRESH_TOKEN_TTL` | `2592000` (optional, default) |
| `OPENROUTER_API_KEY` | Your OpenRouter key |
| `OPENROUTER_MODEL` | `openai/gpt-4o-mini` |
| `RESEND_API_KEY` | (optional) for inquiry emails |
| `LEAD_NOTIFY_TO` | (optional) team email(s), comma-separated |

> Use the **pooled** Neon endpoint on Vercel. The Prisma client is generated automatically
> during install (`@zumi/db` `postinstall`) with the Linux build target.

## After deploy

- Site: `https://<your-project>.vercel.app`
- Admin: `https://<your-project>.vercel.app/admin` (seeded login `admin@zumi.studio` / `ChangeMe!2026` — change it!)
- Health check: submit an inquiry, then confirm it appears in the admin console.

## Notes

- The legacy Express API (`apps/api`) is **no longer needed for production** — it remains in
  the repo for local realtime/Socket.IO experiments only. Vercel runs `apps/web` alone.
- Change the seeded admin password after first login (or reseed with a new one).
