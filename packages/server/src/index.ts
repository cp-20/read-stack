import { OpenAPIHono } from '@hono/zod-openapi';
import { registerArticlesHandlers } from '@server/handlers/articles';
import { registerDocsHandler } from '@server/handlers/docs';
import { registerUsersHandlers } from '@server/handlers/users';
import { handle } from 'hono/vercel';

const app = new OpenAPIHono().basePath('/api');

const v1 = app.basePath('/v1');

registerUsersHandlers(v1);
registerArticlesHandlers(v1);
registerDocsHandler(v1);

export const handler = handle(app);
