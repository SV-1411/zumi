import { Router } from 'express';
import { asyncHandler } from '../../lib/http.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { rateLimit } from 'express-rate-limit';
import {
  createLeadSchema,
  listLeadsSchema,
  updateLeadSchema,
  leadIdSchema,
} from './leads.schema.js';
import * as leads from './leads.service.js';

export const leadsRouter = Router();

// public capture endpoint (assistant / wizard) — rate limited to deter abuse
const captureLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

leadsRouter.post(
  '/',
  captureLimiter,
  validate({ body: createLeadSchema }),
  asyncHandler(async (req, res) => {
    // accept either { lead: {...}, messages } or a flat body
    const b = req.body as Record<string, unknown> & { lead?: Record<string, unknown> };
    const flat = b.lead ?? b;
    const lead = await leads.createLead({
      ...(flat as object),
      source: b.source as string | undefined,
      messages: b.messages as never,
    });
    res.status(201).json({ id: lead.id, score: lead.score, status: lead.status });
  })
);

// admin/staff management
leadsRouter.get(
  '/',
  authenticate,
  requirePermission('lead:read'),
  validate({ query: listLeadsSchema }),
  asyncHandler(async (req, res) => {
    res.json(
      await leads.listLeads({
        status: req.query.status as never,
        take: Number(req.query.take),
        skip: Number(req.query.skip),
      })
    );
  })
);

leadsRouter.get(
  '/:id',
  authenticate,
  requirePermission('lead:read'),
  validate({ params: leadIdSchema }),
  asyncHandler(async (req, res) => {
    res.json(await leads.getLead(req.params.id as string));
  })
);

leadsRouter.patch(
  '/:id/status',
  authenticate,
  requirePermission('lead:write'),
  validate({ params: leadIdSchema, body: updateLeadSchema }),
  asyncHandler(async (req, res) => {
    res.json(await leads.updateLeadStatus(req.params.id as string, req.body.status));
  })
);
