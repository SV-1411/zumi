import bcrypt from 'bcryptjs';
import { prisma } from '@zumi/db';
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
} from '../../lib/jwt.js';
import { badRequest, unauthorized } from '../../lib/http.js';
import { env } from '../../config/env.js';

interface TokenContext {
  userAgent?: string;
  ip?: string;
}

async function issueTokens(
  user: { id: string; email: string; role: { name: string } },
  ctx: TokenContext
) {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role.name,
  });

  const { token: refreshToken, hash } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL * 1000),
      userAgent: ctx.userAgent,
      ip: ctx.ip,
    },
  });

  return { accessToken, refreshToken };
}

export async function register(
  input: { name: string; email: string; password: string; company?: string },
  ctx: TokenContext
) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw badRequest('An account with that email already exists');

  const clientRole = await prisma.role.findUnique({ where: { name: 'CLIENT' } });
  if (!clientRole) throw badRequest('CLIENT role missing — run the seed first');

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      roleId: clientRole.id,
      ...(input.company
        ? { client: { create: { company: input.company } } }
        : {}),
    },
    include: { role: true },
  });

  const tokens = await issueTokens(user, ctx);
  return { user: publicUser(user), ...tokens };
}

export async function login(
  input: { email: string; password: string },
  ctx: TokenContext
) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { role: true },
  });
  if (!user || !user.passwordHash) throw unauthorized('Invalid credentials');

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw unauthorized('Invalid credentials');
  if (!user.isActive) throw unauthorized('Account disabled');

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = await issueTokens(user, ctx);
  return { user: publicUser(user), ...tokens };
}

export async function refresh(rawToken: string, ctx: TokenContext) {
  const hash = hashToken(rawToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hash },
    include: { user: { include: { role: true } } },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw unauthorized('Invalid refresh token');
  }

  // rotate: revoke the used token, issue a fresh pair
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await issueTokens(stored.user, ctx);
  return { user: publicUser(stored.user), ...tokens };
}

export async function logout(rawToken: string) {
  const hash = hashToken(rawToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true, client: true },
  });
  if (!user) throw unauthorized();
  return publicUser(user);
}

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: { name: string };
  client?: { id: string; company: string } | null;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? null,
    role: user.role.name,
    client: user.client ? { id: user.client.id, company: user.client.company } : null,
  };
}
