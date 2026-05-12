import { env } from './src/config/env';

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env.DATABASE_URL,
  },
};
