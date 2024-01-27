import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';

import { registerArticlesHandlers } from '@/handlers/articles';
import { registerAuthHandlers } from '@/handlers/auth';
import { registerDocsHandler } from '@/handlers/docs';
import { registerUsersHandlers } from '@/handlers/users';
import { loggerMiddleware } from '@/middleware/logger';
import type { SupabaseMiddlewareVariable } from '@/middleware/supabase';
import { supabaseMiddleware } from '@/middleware/supabase';
import { corsMiddleware } from '@/middleware/cors';

export const app = new OpenAPIHono().basePath('/api');

app.use('*', loggerMiddleware);
app.use('*', corsMiddleware);

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
