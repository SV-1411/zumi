import type { RequestHandler } from 'express';
import { prisma } from '@zumi/db';
import { verifyAccessToken } from '../lib/jwt.js';
import { unauthorized, forbidden } from '../lib/http.js';
import { cacheGet, cacheSet } from '../lib/redis.js';

/** Require a valid access token; attaches the payload to req.user. */
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return next(unauthorized('Missing access token'));
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
};

/** Restrict to one of the given role names. */
export const requireRole =
  (...roles: string[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden('Insufficient role'));
    next();
  };

/** Resolve the permission keys granted to a role (cached). */
async function permissionsForRole(roleName: string): Promise<string[]> {
  const cacheKey = `perms:${roleName}`;
  const cached = await cacheGet<string[]>(cacheKey);
  if (cached) return cached;

  const role = await prisma.role.findUnique({
    where: { name: roleName },
    include: { permissions: { include: { permission: true } } },
  });
  const keys = role?.permissions.map((rp) => rp.permission.key) ?? [];
  await cacheSet(cacheKey, keys, 300);
  return keys;
}

/** Require a specific permission key (RBAC). */
export const requirePermission =
  (permission: string): RequestHandler =>
  async (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    try {
      const keys = await permissionsForRole(req.user.role);
      req.permissions = keys;
      if (!keys.includes(permission)) return next(forbidden(`Missing permission: ${permission}`));
      next();
    } catch (err) {
      next(err);
    }
  };
