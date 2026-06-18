import { prisma, LeadStatus, MessageRole, NotificationType, type Prisma } from '@zumi/db';
import { enrichLead, type LeadInput } from './ai';
import { sendLeadNotification } from './email';

interface CreateLeadArgs extends LeadInput {
  source?: string;
  messages?: { role: 'SYSTEM' | 'USER' | 'ASSISTANT'; content: string }[];
}

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
                    create: args.messages.map((m) => ({ role: m.role as MessageRole, content: m.content })),
                  },
                },
              },
            }
          : {}),
      },
      include: { summary: true },
    });

    const admins = await tx.user.findMany({ where: { role: { name: 'ADMIN' } }, select: { id: true } });
    if (admins.length) {
      await tx.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id,
          type: NotificationType.LEAD,
          title: `New lead · score ${enrichment.score}`,
          body: `${created.name} — ${created.projectType ?? 'project'}`,
          link: `/admin`,
        })),
      });
    }
    return created;
  });

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
  const where: Prisma.LeadWhereInput = params.status ? { status: params.status } : {};
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
  return { items, total };
}

export function getLead(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: { summary: true, conversation: { include: { messages: true } } },
  });
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  return prisma.lead.update({ where: { id }, data: { status } });
}
