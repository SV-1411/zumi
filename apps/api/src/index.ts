import { createServer } from 'node:http';
import { createApp } from './app.js';
import { initSockets } from './sockets/index.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from '@zumi/db';

async function bootstrap() {
  const app = createApp();
  const server = createServer(app);
  initSockets(server);

  server.listen(env.PORT, () => {
    logger.info(`ZUMI API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'failed to start API');
  process.exit(1);
});
