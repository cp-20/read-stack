if (!process.env.SUPABASE_ID && !process.env.NEXT_PUBLIC_SUPABASE_ID) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ID / SUPABASE_ID');
}

export const SUPABASE_ID = (process.env.SUPABASE_ID ??
  process.env.NEXT_PUBLIC_SUPABASE_ID) as string;

if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL');
}

export const SUPABASE_URL = (process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL) as string;

if (
  !process.env.SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY');
}

export const SUPABASE_ANON_KEY = (process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;
