import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,                 // no NEXT_PUBLIC
  process.env.SUPABASE_SERVICE_ROLE_KEY!     // secret key
);
