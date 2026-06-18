import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

/**
 * Prisma backed by the Neon serverless driver. It connects over HTTPS/WSS (443)
 * instead of raw Postgres TCP (5432), which:
 *   - avoids IPv6/TCP connectivity issues on some networks, and
 *   - is the recommended setup for serverless hosts (Vercel) — no connection
 *     pool exhaustion.
 * In Node we must supply a WebSocket implementation; on edge it's built in.
 */
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['warn', 'error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';
