import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

console.log('Initializing Supabase client with URL:', environment.SUPABASE_URL);

if (!environment.SUPABASE_URL || !environment.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true, // Store the session in localStorage
      autoRefreshToken: false, // Automatically refresh the token
      detectSessionInUrl: true, // Handle OAuth redirects
      storage: localStorage // Use localStorage for session storage
    }
  }
);

// Optional: Log authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session state:', session ? 'Authenticated' : 'Not authenticated');
});

// // Test the connection
// (async () => {
//   try {
//     await supabase.from('hub_projects').select('count', { count: 'exact', head: true });
//     console.log('Supabase connection successful');
//   } catch (err) {
//     console.error('Supabase connection error:', err);
//   }
// })();
