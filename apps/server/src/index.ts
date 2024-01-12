import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { handle } from 'hono/vercel';

import { registerArticlesHandlers } from '@/handlers/articles';
import { registerAuthHandlers } from '@/handlers/auth';
import { registerDocsHandler } from '@/handlers/docs';
import { registerUsersHandlers } from '@/handlers/users';
import type { SupabaseMiddlewareVariable } from '@/middleware/supabase';
import { supabaseMiddleware } from '@/middleware/supabase';

export const app = new OpenAPIHono().basePath('/api');

app.use('*', logger());

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Credentials', 'true');
  c.header('Access-Control-Max-Age', '86400');
  await next();
});

const v1 = app.basePath('/v1');

v1.use('*', supabaseMiddleware);

registerUsersHandlers(
  // うまくEnvに型を付けたい
  v1 as unknown as OpenAPIHono<{ Variables: SupabaseMiddlewareVariable }>,
);
registerArticlesHandlers(v1);
registerDocsHandler(v1);
registerAuthHandlers(
  v1 as unknown as OpenAPIHono<{ Variables: SupabaseMiddlewareVariable }>,
);

export const handler = handle(app);
