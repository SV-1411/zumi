import type { AccessPayload } from '../lib/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: AccessPayload;
      permissions?: string[];
    }
  }
}

export {};
