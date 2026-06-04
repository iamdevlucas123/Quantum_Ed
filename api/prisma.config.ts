import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({ path: 'src/config/.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
