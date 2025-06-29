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
      persistSession: false, // Don't store or refresh tokens
      autoRefreshToken: false, // Don't attempt to auto-refresh
    }
  }
//   {
//     auth: {
//     //   // Custom lock handler that resolves immediately
//     //   lock: () => Promise.resolve(null),
//     //   // Persist session in localStorage
//       persistSession: false,
//     //   // Detect session from URL
//     //   detectSessionInUrl: true,
//     //   // Storage configuration
//     //   storage: localStorage
//     }
//   }
);

// // Test the connection
// (async () => {
//   try {
//     await supabase.from('hub_projects').select('count', { count: 'exact', head: true });
//     console.log('Supabase connection successful');
//   } catch (err) {
//     console.error('Supabase connection error:', err);
//   }
// })();
