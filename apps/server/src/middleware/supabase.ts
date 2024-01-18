import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Context, MiddlewareHandler } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '@/utils/env';

export interface SupabaseMiddlewareVariable {
  supabase: SupabaseClient;
  [key: string]: unknown;
}

const authCookieName = process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME;

export const supabaseMiddleware: MiddlewareHandler<{
  Variables: SupabaseMiddlewareVariable;
}> = async (c, next) => {
  const client = createServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      get: (key) => {
        return getCookie(c as Context, key);
      },
      set: (key, value, options) => {
        setCookie(c, key, value, options);
      },
      remove: (key, options) => {
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
