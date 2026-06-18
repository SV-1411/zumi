import { z } from 'zod';
import { LeadStatus } from '@zumi/db';

const messageSchema = z.object({
  role: z.enum(['SYSTEM', 'USER', 'ASSISTANT']),
  content: z.string().min(1),
});

export const createLeadSchema = z.object({
  // accepts the web assistant payload shape: { lead, analysis }, or a flat lead
  lead: z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      company: z.string().optional(),
      phone: z.string().optional(),
      projectType: z.string().optional(),
      requirements: z.string().optional(),
      budget: z.string().optional(),
      timeline: z.string().optional(),
    })
    .optional(),
  // flat fallback
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  requirements: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  source: z.enum(['assistant', 'wizard', 'roi', 'contact']).default('assistant'),
  messages: z.array(messageSchema).optional(),
});

export const listLeadsSchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  take: z.coerce.number().min(1).max(100).default(25),
  skip: z.coerce.number().min(0).default(0),
});

export const updateLeadSchema = z.object({
  status: z.nativeEnum(LeadStatus),
});

export const leadIdSchema = z.object({ id: z.string().min(1) });
