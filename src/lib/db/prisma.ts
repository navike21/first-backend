import 'dotenv/config';

import * as PrismaClientPkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const { PrismaClient } = PrismaClientPkg;

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
  prismaPgPool: Pool | undefined;
};

// Prefer direct DB connection for the driver adapter.
// (Supabase pooler/pgbouncer URLs can behave differently with direct drivers.)
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'Missing database connection string. Set DATABASE_URL (recommended) or DIRECT_URL in your environment.'
  );
}

const pool =
  globalForPrisma.prismaPgPool ??
  new Pool({
    connectionString,
    ssl: /\.supabase\.co(:\d+)?\b/.test(connectionString)
      ? { rejectUnauthorized: false }
      : undefined,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPgPool = pool;
}

export default prisma;
