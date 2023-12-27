import { findUserFromApiKey } from '@read-stack/database';
import type { Context } from 'hono';

import type { SupabaseMiddlewareVariable } from '@/middleware/supabase';

export const getUser = async (
  c: Context<{ Variables: SupabaseMiddlewareVariable }>,
) => {
  return (await getUserFromApiKey(c)) ?? (await getUserFromSupabase(c)) ?? null;
};

const getUserFromApiKey = async (
  c: Context<{ Variables: SupabaseMiddlewareVariable }>,
) => {
  const authHeader = c.req.header().authorization;
  const match = /Bearer (?<apiKey>.+)/.exec(authHeader);

  if (match === null) return null;

  const apiKey = match[1];
  // TODO: ここのBunへの依存をなくしたい (でrepositoryに入れたい)
  const hashedApiKey = await Bun.password.hash(apiKey);

  const user = await findUserFromApiKey(hashedApiKey);

  if (user === null) return null;

  return { authType: 'apiKey', ...user } as const;
};

const getUserFromSupabase = async (
  c: Context<{ Variables: SupabaseMiddlewareVariable }>,
) => {
  const {
    data: { user },
  } = await c.var.supabase.auth.getUser();

  if (user === null) return null;

  return { authType: 'supabase', ...user } as const;
};
