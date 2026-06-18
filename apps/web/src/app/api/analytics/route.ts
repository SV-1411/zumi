import { NextResponse } from 'next/server';
import { prisma, LeadStatus, ProjectStatus, InvoiceStatus } from '@zumi/db';
import { requireAdmin, AuthError } from '@/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    requireAdmin(req);
    const [totalLeads, qualifiedLeads, wonLeads, activeProjects, paidInvoices, avgScore] =
      await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: LeadStatus.QUALIFIED } }),
        prisma.lead.count({ where: { status: LeadStatus.WON } }),
        prisma.project.count({ where: { status: ProjectStatus.IN_PROGRESS } }),
        prisma.invoice.aggregate({ where: { status: InvoiceStatus.PAID }, _sum: { amount: true } }),
        prisma.lead.aggregate({ _avg: { score: true } }),
      ]);

    return NextResponse.json({
      totalLeads,
      qualifiedLeads,
      wonLeads,
      conversionRate: totalLeads ? +((wonLeads / totalLeads) * 100).toFixed(1) : 0,
      activeProjects,
      revenuePaid: Number(paidInvoices._sum.amount ?? 0),
      avgLeadScore: Math.round(avgScore._avg.score ?? 0),
    });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
