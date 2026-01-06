
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials from the Supabase Dashboard
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
