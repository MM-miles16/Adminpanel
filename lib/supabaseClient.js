import { createClient } from "@supabase/supabase-js";

// On the browser, use the API proxy route to avoid ISP blocks on supabase.co
// On the server (SSR / API routes), use the real Supabase URL directly
// Note: createClient requires a full HTTP URL, so we prepend window.location.origin
const supabaseUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/api/sb`
  : process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: "supabase.auth.token",
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export { supabase };
