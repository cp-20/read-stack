import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { articles } from '@/models';

const connectionString = process.env.DATABASE_URL;
if (connectionString === undefined) {
  throw new Error('DATABASE_URL is not defined');
}

const migrationsClient = postgres(connectionString, {
  max: 1,
});

const db = drizzle(migrationsClient, { logger: true });
await migrate(db, { migrationsFolder: './drizzle' });

await db.execute(
  sql`CREATE INDEX IF NOT EXISTS idx_body_on_articles ON ${articles} USING pgroonga (body);`,
);

process.exit(0);
