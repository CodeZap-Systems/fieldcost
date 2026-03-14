"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          // User is logged in, send to dashboard
          router.push("/dashboard");
        } else {
          // Not logged in, send to login
          router.push("/auth/login");
        }
      } catch (err) {
        // Default to login on any error
        router.push("/auth/login");
      } finally {
        setIsChecking(false);
      }
    };
    
    checkSession();
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-blue-700">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </main>
  );
}
