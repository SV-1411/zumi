import type { Server as IOServer } from 'socket.io';

/**
 * Holds the Socket.IO instance once the HTTP server initialises it, so any
 * module can emit realtime events (new leads, project updates, notifications)
 * without circular imports.
 */
let io: IOServer | null = null;

export function setIO(instance: IOServer) {
  io = instance;
}

export function emitToAdmins(event: string, payload: unknown) {
  io?.to('admins').emit(event, payload);
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  io?.to(`user:${userId}`).emit(event, payload);
}
