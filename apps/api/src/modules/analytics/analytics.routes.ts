import { Router } from 'express';
import { prisma, LeadStatus, ProjectStatus, InvoiceStatus } from '@zumi/db';
import { asyncHandler } from '../../lib/http.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { cacheGet, cacheSet } from '../../lib/redis.js';

export const analyticsRouter = Router();

analyticsRouter.get(
  '/overview',
  authenticate,
  requirePermission('analytics:read'),
  asyncHandler(async (_req, res) => {
    const cached = await cacheGet('analytics:overview');
    if (cached) {
      res.json(cached);
      return;
    }

    const [
      totalLeads,
      qualifiedLeads,
      wonLeads,
      activeProjects,
      paidInvoices,
      avgScore,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: LeadStatus.QUALIFIED } }),
      prisma.lead.count({ where: { status: LeadStatus.WON } }),
      prisma.project.count({ where: { status: ProjectStatus.IN_PROGRESS } }),
      prisma.invoice.aggregate({
        where: { status: InvoiceStatus.PAID },
        _sum: { amount: true },
      }),
      prisma.lead.aggregate({ _avg: { score: true } }),
    ]);

    const payload = {
      totalLeads,
      qualifiedLeads,
      wonLeads,
      conversionRate: totalLeads ? +((wonLeads / totalLeads) * 100).toFixed(1) : 0,
      activeProjects,
      revenuePaid: Number(paidInvoices._sum.amount ?? 0),
      avgLeadScore: Math.round(avgScore._avg.score ?? 0),
    };
    await cacheSet('analytics:overview', payload, 30);
    res.json(payload);
  })
);
