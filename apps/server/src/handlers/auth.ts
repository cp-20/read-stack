import type { OpenAPIHono } from '@hono/zod-openapi';

import type { SupabaseMiddlewareVariable } from '@/middleware/supabase';

export const registerAuthHandlers = (
  c: OpenAPIHono<{ Variables: SupabaseMiddlewareVariable }>,
) => {
  c.get('/auth-callback', async (ctx) => {
    try {
      const { error } = await ctx.var.supabase.auth.exchangeCodeForSession(
        ctx.req.query('code') ?? '',
      );
      if (error) {
        console.error(error);
        return ctx.redirect('/');
      }
    } catch (error) {
      console.error(error);
      return ctx.redirect('/');
    }

    return ctx.redirect('/');
  });
};
