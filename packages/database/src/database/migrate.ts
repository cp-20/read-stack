import 'dotenv/config';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';

const connectionString = process.env.DATABASE_URL;
if (connectionString === undefined) {
  throw new Error('DATABASE_URL is not defined');
}

const migrationsClient = postgres(connectionString, {
  max: 1,
});

const db = drizzle(migrationsClient);
await migrate(db, { migrationsFolder: './drizzle' });
