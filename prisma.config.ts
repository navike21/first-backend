import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use the direct Postgres connection for Prisma Migrate.
    // (Pooler/pgbouncer URLs often fail for migrations.)
    url: env('DIRECT_URL'),
  },
});
