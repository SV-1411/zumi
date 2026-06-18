import { prisma } from '@zumi/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from './env';

export interface AccessPayload {
  sub: string;
  role: string;
  email: string;
}

export interface TokenCtx {
  userAgent?: string;
  ip?: string;
}

export class AuthError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

function signAccess(p: AccessPayload) {
  return jwt.sign(p, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
}
export function verifyAccess(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}
const hashToken = (t: string) => crypto.createHash('sha256').update(t).digest('hex');

async function issue(user: { id: string; email: string; role: { name: string } }, ctx: TokenCtx) {
  const accessToken = signAccess({ sub: user.id, email: user.email, role: user.role.name });
  const refreshToken = crypto.randomBytes(48).toString('hex');
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL * 1000),
      userAgent: ctx.userAgent,
      ip: ctx.ip,
    },
  });
  return { accessToken, refreshToken };
}

function publicUser(u: {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: { name: string };
}) {
  return { id: u.id, name: u.name, email: u.email, avatarUrl: u.avatarUrl ?? null, role: u.role.name };
}

export async function login(email: string, password: string, ctx: TokenCtx) {
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  if (!user || !user.passwordHash) throw new AuthError(401, 'Invalid credentials');
  if (!(await bcrypt.compare(password, user.passwordHash))) throw new AuthError(401, 'Invalid credentials');
  if (!user.isActive) throw new AuthError(401, 'Account disabled');
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const tokens = await issue(user, ctx);
  return { user: publicUser(user), ...tokens };
}

export async function refresh(rawToken: string, ctx: TokenCtx) {
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { user: { include: { role: true } } },
  });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new AuthError(401, 'Invalid refresh token');
  }
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
  const tokens = await issue(stored.user, ctx);
  return { user: publicUser(stored.user), ...tokens };
}

export async function logout(rawToken: string) {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function meUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
  if (!user) throw new AuthError(401, 'Unauthorized');
  return publicUser(user);
}

/** Extract & verify the bearer token from a request. Returns null if absent/invalid. */
export function getAuthUser(req: Request): AccessPayload | null {
  const header = req.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return null;
  try {
    return verifyAccess(token);
  } catch {
    return null;
  }
}

/** Throws AuthError(403) unless the user has an admin/staff role. */
export function requireAdmin(req: Request): AccessPayload {
  const user = getAuthUser(req);
  if (!user) throw new AuthError(401, 'Unauthorized');
  if (user.role !== 'ADMIN' && user.role !== 'STAFF') throw new AuthError(403, 'Forbidden');
  return user;
}
