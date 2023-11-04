import type { Hono } from 'hono';
import { getMe } from '@/server/handlers/users/me/get';

export const registerRoutes = (app: Hono) => {
  app.get('/users/me', getMe);
};
