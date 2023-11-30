import { OpenAPIHono } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';

import { registerArticlesHandlers } from '@/handlers/articles';
import { registerDocsHandler } from '@/handlers/docs';
import { registerUsersHandlers } from '@/handlers/users';

export const app = new OpenAPIHono().basePath('/api');

const v1 = app.basePath('/v1');

registerUsersHandlers(v1);
registerArticlesHandlers(v1);
registerDocsHandler(v1);

export const handler = handle(app);
