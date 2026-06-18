import { prisma, LeadStatus, MessageRole, NotificationType } from '@zumi/db';
import { enrichLead, type LeadInput } from '../../lib/ai.js';
import { emitToAdmins } from '../../lib/realtime.js';
import { sendLeadNotification } from '../../lib/email.js';
import { notFound } from '../../lib/http.js';

interface CreateLeadArgs extends LeadInput {
  source?: string;
  messages?: { role: 'SYSTEM' | 'USER' | 'ASSISTANT'; content: string }[];
}

/**
 * Persists a lead, its conversation transcript and an AI summary in one
 * transaction, then notifies admins in realtime.
 */
export async function createLead(args: CreateLeadArgs) {
  const enrichment = enrichLead(args);

  const lead = await prisma.$transaction(async (tx) => {
    const created = await tx.lead.create({
      data: {
        name: args.name ?? 'Unknown',
        email: args.email ?? 'unknown@example.com',
        company: args.company,
        phone: args.phone,
        projectType: args.projectType,
        requirements: args.requirements,
        budget: args.budget,
        timeline: args.timeline,
        source: args.source ?? 'assistant',
        score: enrichment.score,
        complexity: enrichment.complexity,
        status: enrichment.score >= 65 ? LeadStatus.QUALIFIED : LeadStatus.NEW,
        summary: {
          create: {
            summary: enrichment.summary,
            recommendedSolution: enrichment.recommendedSolution,
            projectScope: enrichment.projectScope,
            technicalRequirements: enrichment.technicalRequirements,
            estimatedComplexity: enrichment.complexity,
            leadScore: enrichment.score,
          },
        },
        ...(args.messages?.length
          ? {
              conversation: {
                create: {
                  messages: {
                    create: args.messages.map((m) => ({
                      role: m.role as MessageRole,
                      content: m.content,
                    })),
                  },
                },
              },
            }
          : {}),
      },
      include: { summary: true },
    });

    // notify every admin
    const admins = await tx.user.findMany({
      where: { role: { name: 'ADMIN' } },
      select: { id: true },
    });
    if (admins.length) {
      await tx.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id,
          type: NotificationType.LEAD,
          title: `New lead · score ${enrichment.score}`,
          body: `${created.name} — ${created.projectType ?? 'project'}`,
          link: `/admin/leads/${created.id}`,
        })),
      });
    }

    return created;
  });

  emitToAdmins('lead:new', {
    id: lead.id,
    name: lead.name,
    score: lead.score,
    complexity: lead.complexity,
    projectType: lead.projectType,
  });

  // fire-and-forget email notification (never blocks the response)
  void sendLeadNotification(
    {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      projectType: lead.projectType,
      requirements: lead.requirements,
      budget: lead.budget,
      timeline: lead.timeline,
    },
    enrichment
  );

  return lead;
}

export async function listLeads(params: { status?: LeadStatus; take: number; skip: number }) {
  const where = params.status ? { status: params.status } : {};
  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { summary: true },
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
      take: params.take,
      skip: params.skip,
    }),
    prisma.lead.count({ where }),
  ]);
  return { items, total, take: params.take, skip: params.skip };
}

export async function getLead(id: string) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { summary: true, conversation: { include: { messages: true } } },
  });
  if (!lead) throw notFound('Lead not found');
  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await getLead(id);
  return prisma.lead.update({ where: { id }, data: { status } });
}
