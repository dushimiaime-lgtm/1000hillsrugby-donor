
import { createClient } from '@supabase/supabase-js';

// Configuration check
// NOTE: Replace these with your actual Supabase credentials for production
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const isValidUrl = (url: string) => {
  try {
    return url && url.startsWith('https://') && !url.includes('your-project-url');
  } catch {
    return false;
  }
};

const isConfigured = isValidUrl(SUPABASE_URL) && SUPABASE_ANON_KEY !== 'your-anon-key' && !!SUPABASE_ANON_KEY;

/**
 * We create the client regardless to satisfy TypeScript, 
 * but we use the SUPABASE_IS_CONFIGURED flag in the services 
 * to prevent unnecessary network requests that could stall the UI.
 */
export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createClient('https://00000000000000000000.supabase.co', 'placeholder-key');

export const SUPABASE_IS_CONFIGURED = isConfigured;
