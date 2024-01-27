import type { WithSupabaseClient } from '@/middleware/supabase';

export const registerAuthHandlers = (app: WithSupabaseClient) => {
  app.get('/auth-callback', async (c) => {
    try {
      const { error } = await c.var.supabase.auth.exchangeCodeForSession(
        c.req.query('code') ?? '',
      );
      if (error) {
        console.error(error);
        return c.redirect('/');
      }
    } catch (error) {
      console.error(error);
      return c.redirect('/');
    }

    return c.redirect('/');
  });
};
