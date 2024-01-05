import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const connectionString = process.env.DATABASE_URL;
if (connectionString === undefined) {
  throw new Error('DATABASE_URL is not defined');
}

// eslint-disable-next-line import/no-default-export -- for drizzle
export default {
  schema: './src/models/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString,
  },
  verbose: true,
  strict: true,
} satisfies Config;
