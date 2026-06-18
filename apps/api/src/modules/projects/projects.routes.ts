import { Router } from 'express';
import { z } from 'zod';
import { prisma, ProjectStatus } from '@zumi/db';
import { asyncHandler, notFound, forbidden } from '../../lib/http.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import type { AccessPayload } from '../../lib/jwt.js';

export const projectsRouter = Router();

const createSchema = z.object({
  name: z.string().min(2),
  summary: z.string().optional(),
  clientId: z.string().min(1),
  stack: z.array(z.string()).default([]),
  status: z.nativeEnum(ProjectStatus).optional(),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  summary: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  progress: z.number().min(0).max(100).optional(),
  stack: z.array(z.string()).optional(),
});

/** Returns the Client owned by a CLIENT user, or null for staff/admin. */
async function ownedClientId(user: AccessPayload): Promise<string | null> {
  if (user.role !== 'CLIENT') return null;
  const client = await prisma.client.findUnique({
    where: { ownerUserId: user.sub },
    select: { id: true },
  });
  return client?.id ?? null;
}

projectsRouter.use(authenticate, requirePermission('project:read'));

// list — clients see only their own projects
projectsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const user = req.user!;
    const where = user.role === 'CLIENT' ? { clientId: (await ownedClientId(user)) ?? '__none__' } : {};
    const projects = await prisma.project.findMany({
      where,
      include: { milestones: { orderBy: { order: 'asc' } }, client: { select: { company: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ items: projects });
  })
);

projectsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id as string },
      include: { milestones: { orderBy: { order: 'asc' } }, files: true, invoices: true },
    });
    if (!project) throw notFound('Project not found');

    const user = req.user!;
    if (user.role === 'CLIENT' && project.clientId !== (await ownedClientId(user))) {
      throw forbidden();
    }
    res.json(project);
  })
);

projectsRouter.post(
  '/',
  requirePermission('project:write'),
  validate({ body: createSchema }),
  asyncHandler(async (req, res) => {
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json(project);
  })
);

projectsRouter.patch(
  '/:id',
  requirePermission('project:write'),
  validate({ body: updateSchema }),
  asyncHandler(async (req, res) => {
    const project = await prisma.project.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json(project);
  })
);
