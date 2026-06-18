/* Server-only environment access for Next.js route handlers.
   No hard validation/crash here — Vercel injects these at runtime. */

export const env = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-me',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-me',
  ACCESS_TOKEN_TTL: Number(process.env.ACCESS_TOKEN_TTL ?? 900),
  REFRESH_TOKEN_TTL: Number(process.env.REFRESH_TOKEN_TTL ?? 2_592_000),

  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini',
  OPENROUTER_BASE: process.env.OPENROUTER_BASE ?? 'https://openrouter.ai/api/v1',

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM ?? 'ZUMI <onboarding@resend.dev>',
  LEAD_NOTIFY_TO: process.env.LEAD_NOTIFY_TO,
};
