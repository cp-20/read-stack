if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL');
}

export const SUPABASE_URL = process.env.SUPABASE_URL;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
