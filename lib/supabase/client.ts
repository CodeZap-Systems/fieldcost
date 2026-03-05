"use client";

import { supabase } from "../supabaseClient";

export function createClient() {
  return supabase;
}
