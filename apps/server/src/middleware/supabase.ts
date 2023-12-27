import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Context, MiddlewareHandler } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/utils/env';

export interface SupabaseMiddlewareVariable {
  supabase: SupabaseClient;
  [key: string]: unknown;
}

const authCookieName = process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME;

export const supabaseMiddleware: MiddlewareHandler<{
  Variables: SupabaseMiddlewareVariable;
}> = async (c, next) => {
  const client = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => {
        return getCookie(c as Context, key);
      },
      set: (key, value, options) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- 知らんけど
        setCookie(c, key, value, options);
      },
      remove: (key, options) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- 知らんけど
        deleteCookie(c, key, options);
      },
    },
    ...(authCookieName ? { auth: { storageKey: authCookieName } } : undefined),
    cookieOptions: {
      secure: true,
    },
  });
  c.set('supabase', client);
  await next();
};
