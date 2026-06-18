import { PrismaClient, ProjectStatus, MilestoneStatus, LeadStatus, LeadComplexity } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PERMISSIONS = [
  'lead:read', 'lead:write',
  'project:read', 'project:write',
  'client:read', 'client:write',
  'invoice:read', 'invoice:write',
  'quotation:read', 'quotation:write',
  'meeting:read', 'meeting:write',
  'user:read', 'user:write',
  'analytics:read',
];

const ROLES: Record<string, string[]> = {
  ADMIN: PERMISSIONS,
  STAFF: ['lead:read', 'project:read', 'project:write', 'client:read', 'meeting:read', 'meeting:write'],
  CLIENT: ['project:read', 'invoice:read', 'meeting:read', 'meeting:write'],
};

async function main() {
  // permissions
  const permIds = new Map<string, string>();
  for (const key of PERMISSIONS) {
    const p = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key.replace(':', ' ') },
    });
    permIds.set(key, p.id);
  }

  // roles + role-permission links
  const roleIds = new Map<string, string>();
  for (const [name, keys] of Object.entries(ROLES)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
    roleIds.set(name, role.id);
    for (const key of keys) {
      const permissionId = permIds.get(key)!;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId } },
        update: {},
        create: { roleId: role.id, permissionId },
      });
    }
  }

  // admin user
  const adminHash = await bcrypt.hash('ChangeMe!2026', 10);
  await prisma.user.upsert({
    where: { email: 'admin@zumi.studio' },
    update: {},
    create: {
      email: 'admin@zumi.studio',
      name: 'ZUMI Admin',
      passwordHash: adminHash,
      roleId: roleIds.get('ADMIN')!,
    },
  });

  // sample client + login
  const clientHash = await bcrypt.hash('ClientDemo!2026', 10);
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@northwind.io' },
    update: {},
    create: {
      email: 'client@northwind.io',
      name: 'Dana Cole',
      passwordHash: clientHash,
      roleId: roleIds.get('CLIENT')!,
    },
  });

  const client = await prisma.client.upsert({
    where: { ownerUserId: clientUser.id },
    update: {},
    create: {
      company: 'Northwind Health',
      industry: 'Healthcare',
      ownerUserId: clientUser.id,
    },
  });

  // sample project + milestones
  const existing = await prisma.project.findFirst({ where: { clientId: client.id } });
  if (!existing) {
    await prisma.project.create({
      data: {
        name: 'Northwind HMS Platform',
        summary: 'Hospital management system with EHR and analytics.',
        status: ProjectStatus.IN_PROGRESS,
        progress: 45,
        stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma'],
        clientId: client.id,
        milestones: {
          create: [
            { title: 'Discovery & architecture', status: MilestoneStatus.COMPLETED, order: 1 },
            { title: 'EHR module', status: MilestoneStatus.ACTIVE, order: 2 },
            { title: 'Analytics & billing', status: MilestoneStatus.PENDING, order: 3 },
            { title: 'Launch & handover', status: MilestoneStatus.PENDING, order: 4 },
          ],
        },
      },
    });
  }

  // sample lead
  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    await prisma.lead.create({
      data: {
        name: 'Priya Nair',
        email: 'priya@medfirst.com',
        company: 'MedFirst Clinics',
        projectType: 'AI Receptionist',
        requirements: 'Automate front-desk calls, booking and FAQ across 12 clinics.',
        budget: '$40k–$60k',
        timeline: '10 weeks',
        score: 82,
        complexity: LeadComplexity.HIGH,
        status: LeadStatus.QUALIFIED,
      },
    });
  }

  console.log('✓ Seed complete. Admin: admin@zumi.studio / ChangeMe!2026');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
