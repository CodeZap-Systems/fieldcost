"use client";
import { useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { persistActiveCompanyId } from "../../../lib/companySwitcher";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    // CRITICAL: Clear all demo and company state on logout
    localStorage.removeItem("demoSession");
    localStorage.removeItem("demoUserId");
    localStorage.removeItem("fieldcostActiveCompanyId"); // Also remove active company
    
    // Clear company ID in our system
    persistActiveCompanyId(null);
    
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
