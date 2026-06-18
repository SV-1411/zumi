import 'dotenv/config';
import { prisma } from './src/index';
try {
  const n = await prisma.user.count();
  console.log('OK via Neon HTTPS driver — users =', n);
} catch (e) {
  console.log('FAIL', (e as Error).message.split('\n').slice(0,3).join(' | '));
} finally { await prisma.$disconnect(); }
