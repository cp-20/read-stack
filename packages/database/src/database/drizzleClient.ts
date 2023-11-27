import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as models from '@database/models';

const connectionString = process.env.DATABASE_URL;
if (connectionString === undefined) {
  throw new Error('DATABASE_URL is not defined');
}

const client = postgres(connectionString);

export const db = drizzle(client, { schema: models });
