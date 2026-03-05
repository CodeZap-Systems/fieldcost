import { supabaseServer } from "../supabaseServer";

export async function createServerClient() {
  return supabaseServer;
}
