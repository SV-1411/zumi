import { z } from 'zod';

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(40),
  fields: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      company: z.string().optional(),
      projectType: z.string().optional(),
      requirements: z.string().optional(),
      budget: z.string().optional(),
      timeline: z.string().optional(),
    })
    .optional(),
});
