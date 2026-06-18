import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be set'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be set'),
  ACCESS_TOKEN_TTL: z.coerce.number().default(900),
  REFRESH_TOKEN_TTL: z.coerce.number().default(2_592_000),
  REDIS_URL: z.string().optional(),

  // Email notifications (optional — falls back to logging if unset)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('ZUMI <onboarding@resend.dev>'),
  LEAD_NOTIFY_TO: z.string().optional(), // comma-separated recipients

  // OpenRouter LLM (optional — assistant falls back to a scripted flow if unset)
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default('anthropic/claude-3.5-sonnet'),
  OPENROUTER_BASE: z.string().default('https://openrouter.ai/api/v1'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('✗ Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
