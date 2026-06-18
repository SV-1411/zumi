import Redis from 'ioredis';
import { env } from '../config/env.js';
import { logger } from './logger.js';

/**
 * Redis is optional. If REDIS_URL is unset or the server is unreachable we run
 * without it — caching/rate-limit helpers degrade gracefully rather than crash.
 */
let client: Redis | null = null;

if (env.REDIS_URL) {
  client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    lazyConnect: true,
    retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
  });
  client.on('error', (err) => logger.warn({ err: err.message }, 'redis error'));
  client.connect().catch(() => {
    logger.warn('redis unavailable — continuing without cache');
    client = null;
  });
}

export const redis = client;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSec = 60): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSec);
  } catch {
    /* non-fatal */
  }
}
