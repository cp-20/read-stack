import { supabase } from '@server/gateways/supabase';
import { SUPABASE_ID } from '@server/utils/env';
import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { z } from 'zod';
const authCookieSchema = z.tuple([
  z.string(),
  z.string(),
  z.string().nullable(),
  z.string().nullable(),
  z.unknown(),
]);

export const getUser = async (c: Context) => {
  const authCookie = getCookie(c, `sb-${SUPABASE_ID}-auth-token`);

  if (authCookie === undefined) return null;

  try {
    const authCookieParts = authCookieSchema.parse(JSON.parse(authCookie));
    const [accessToken, refreshToken, _providerToken, _providerRefreshToken] =
      authCookieParts;

    const result = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (result.error !== null) return null;

    return result.data.user;
  } catch (err) {
    return null;
  }
};
