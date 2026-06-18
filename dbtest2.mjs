import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const n = await p.user.count();
  console.log('OK users=', n);
} catch (e) {
  console.log('CODE', e.errorCode);
  console.log('MSG', e.message);
} finally { await p.$disconnect(); }
