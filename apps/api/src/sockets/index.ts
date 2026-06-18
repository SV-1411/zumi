import { Server as IOServer } from 'socket.io';
import type { Server as HttpServer } from 'node:http';
import { env } from '../config/env.js';
import { verifyAccessToken } from '../lib/jwt.js';
import { setIO } from '../lib/realtime.js';
import { logger } from '../lib/logger.js';

/**
 * Authenticated Socket.IO layer. Clients pass their access token in the
 * handshake; admins join the "admins" room (new-lead pings), everyone joins
 * their personal room (notifications).
 */
export function initSockets(server: HttpServer) {
  const io = new IOServer(server, {
    cors: { origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()), credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('unauthorized'));
    try {
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user as { sub: string; role: string };
    socket.join(`user:${user.sub}`);
    if (user.role === 'ADMIN' || user.role === 'STAFF') socket.join('admins');
    logger.debug({ userId: user.sub }, 'socket connected');
  });

  setIO(io);
  return io;
}
