import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';

import { registerArticlesHandlers } from '@/handlers/articles';
import { registerDocsHandler } from '@/handlers/docs';
import { registerUsersHandlers } from '@/handlers/users';
import type { SupabaseMiddlewareVariable } from '@/middleware/supabase';
import { supabaseMiddleware } from '@/middleware/supabase';

export const app = new OpenAPIHono().basePath('/api');

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

export const handler = handle(app);
