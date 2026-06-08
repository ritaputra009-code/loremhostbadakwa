import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || "https://example.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-role-key";

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
