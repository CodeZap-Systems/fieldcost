import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mukaeylwmzztycajibhy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
