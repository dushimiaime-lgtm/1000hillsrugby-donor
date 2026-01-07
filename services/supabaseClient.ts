
import { createClient } from '@supabase/supabase-js';

// Configuration check
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const isValidUrl = (url: string) => {
  try {
    return url.startsWith('https://') && !url.includes('your-project-url');
  } catch {
    return false;
  }
};

const isConfigured = isValidUrl(SUPABASE_URL) && SUPABASE_ANON_KEY !== 'your-anon-key';

// Graceful fallback to prevent "null reference" or "invalid URL" crashes
// Using a zeroed-out UUID-style prefix for the fallback URL to ensure it's a valid URL format
export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createClient('https://00000000000000000000.supabase.co', 'placeholder-key');

export const SUPABASE_IS_CONFIGURED = isConfigured;
