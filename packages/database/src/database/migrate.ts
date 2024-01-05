import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (connectionString === undefined) {
  throw new Error('DATABASE_URL is not defined');
}

const migrationsClient = postgres(connectionString, {
  max: 1,
});

const db = drizzle(migrationsClient);
await migrate(db, { migrationsFolder: './drizzle' });

process.exit(0);
