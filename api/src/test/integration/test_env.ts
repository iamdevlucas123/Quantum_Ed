const unsafeDatabasePatterns = [
  'neon.tech',
  'render.com',
  'amazonaws.com',
  'supabase.co',
  'production',
  'prod',
];

export const ensureIntegrationTestEnv = (): void => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Integration tests must run with NODE_ENV=test');
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL must be set for integration tests');
  }

  const normalizedDatabaseUrl = databaseUrl.toLowerCase();

  if (!normalizedDatabaseUrl.includes('test')) {
    throw new Error('DATABASE_URL must point to a test database');
  }

  if (unsafeDatabasePatterns.some((pattern) => normalizedDatabaseUrl.includes(pattern))) {
    throw new Error('DATABASE_URL appears to point to a non-local or production database');
  }
};
