import prisma from './prisma.js';

try {
  console.info('🔌 Testing database connection...');

  await prisma.$connect();
  console.info('✅ Database connected successfully!');

  const userCount = await prisma.user.count();
  console.info(`📊 Users in database: ${userCount}`);
} catch (error) {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
  console.info('👋 Disconnected from database');
}
