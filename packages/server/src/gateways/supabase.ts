import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@server/utils/env';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
