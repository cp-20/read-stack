import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as models from '@database/models';
import ws from 'ws';

neonConfig.fetchConnectionCache = true;
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (connectionString === undefined) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema: models, logger: true });
