import { Router } from 'express';
import { asyncHandler, badRequest } from '../../lib/http.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { isProd } from '../../config/env.js';
import { loginSchema, refreshSchema } from './auth.schema.js';
import * as auth from './auth.service.js';

export const authRouter = Router();

const REFRESH_COOKIE = 'zumi_rt';
const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function ctxFrom(req: import('express').Request) {
  return { userAgent: req.headers['user-agent'], ip: req.ip };
}

// NOTE: no public /register. ZUMI is a marketing + lead-gen site — visitors
// never authenticate. Team accounts are provisioned via the seed/admin only.

authRouter.post(
  '/login',
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const result = await auth.login(req.body, ctxFrom(req));
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOpts);
    // refreshToken also returned in-body for the admin SPA (no BFF in front)
    res.json({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  })
);

authRouter.post(
  '/refresh',
  validate({ body: refreshSchema }),
  asyncHandler(async (req, res) => {
    const token = (req.body.refreshToken as string | undefined) ?? req.cookies?.[REFRESH_COOKIE];
    if (!token) throw badRequest('Missing refresh token');
    const result = await auth.refresh(token, ctxFrom(req));
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOpts);
    res.json({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  })
);

authRouter.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE] ?? req.body?.refreshToken;
    if (token) await auth.logout(token);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    res.json({ ok: true });
  })
);

authRouter.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({ user: await auth.me(req.user!.sub) });
  })
);
