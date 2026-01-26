// lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../models/database.types";

// Determine which keys to use
const isServer = typeof window === "undefined";

const supabaseUrl = isServer
  ? process.env.SUPABASE_URL
  : process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey = isServer
  ? process.env.SUPABASE_SERVICE_ROLE_KEY // server-only
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // client-safe anon key

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Missing Supabase environment variables. 
    Server: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
    Client: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY`
  );
}

// Export a typed client
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseKey
);
