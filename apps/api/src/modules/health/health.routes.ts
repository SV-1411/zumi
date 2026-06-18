import { Router } from 'express';
import { prisma } from '@zumi/db';
import { asyncHandler } from '../../lib/http.js';
import { redis } from '../../lib/redis.js';

export const healthRouter = Router();

healthRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const checks: Record<string, 'up' | 'down'> = { api: 'up', db: 'down', redis: 'down' };
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.db = 'up';
    } catch {
      /* db down */
    }
    if (redis) {
      try {
        await redis.ping();
        checks.redis = 'up';
      } catch {
        /* redis down */
      }
    }
    const healthy = checks.db === 'up';
    res.status(healthy ? 200 : 503).json({ status: healthy ? 'ok' : 'degraded', checks });
  })
);
