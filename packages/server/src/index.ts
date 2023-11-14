import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono().basePath('/api');

const v1 = app.basePath('/v1');

v1.get('/', (c) => c.text('Hello Hono!'));
v1.all('*', (c) => c.text(`${c.req.method} ${c.req.path}`));

export const handler = handle(app);
