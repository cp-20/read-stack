import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { registerRoutes } from '@/server/handlers';

export const config = {
  runtime: 'edge',
};

const app = new Hono().basePath('/api/v1');

registerRoutes(app);

export default handle(app);
