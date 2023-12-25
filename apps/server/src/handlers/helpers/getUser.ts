import type { Context } from 'hono';

import type { SupabaseMiddlewareVariable } from '@/middleware/supabase';

export const getUser = async (
  c: Context<{ Variables: SupabaseMiddlewareVariable }>,
) => {
  const {
    data: { user },
  } = await c.var.supabase.auth.getUser();

  return user;
};
