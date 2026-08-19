import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return (
    Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-anon-key'
  );
};
