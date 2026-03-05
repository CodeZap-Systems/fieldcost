"use client";
import { useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem("demoSession");
    localStorage.removeItem("demoUserId");
    supabase.auth.signOut().finally(() => {
      router.push("/auth/login");
    });
  }, [router]);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-xl font-bold">Logging out...</div>
    </main>
  );
}
