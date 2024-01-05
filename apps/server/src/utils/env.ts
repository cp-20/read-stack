if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL');
}

export const SUPABASE_URL = process.env.SUPABASE_URL;

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY');
}

export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
