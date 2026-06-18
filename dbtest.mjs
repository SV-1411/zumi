import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const n = await p.user.count();
  console.log('OK users=', n);
} catch (e) {
  console.log('FAIL', e.message.split('\n').slice(0,3).join(' | '));
} finally { await p.$disconnect(); }
