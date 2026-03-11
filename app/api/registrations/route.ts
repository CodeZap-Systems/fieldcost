import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { markRegistrationConfirmed, recordRegistration } from "../../../lib/registrationStore";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const sanitize = (value?: unknown) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

function createAnonClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing");
  }
  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
}

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = sanitize(body?.email).toLowerCase();
    const password = sanitize(body?.password);
    const role = body?.role === "subcontractor" ? "subcontractor" : "admin";
    const companyName = sanitize(body?.companyName);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    // Validate password minimum length (Supabase requires at least 6 characters)
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // Validate email format
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const client = createAnonClient();
    const registrationEntry = {
      email,
      companyName,
      role,
      status: "pending" as const,
      registeredAt: new Date().toISOString(),
    };

    console.log("Attempting to sign up user:", { email, companyName, role });

    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { role, companyName, companyOnboarded: false },
        emailRedirectTo: `${siteUrl}/auth/login?verified=1`,
      },
    });

    if (error) {
      console.error("Supabase auth error:", error);
      const message = error.message?.toLowerCase() ?? "";
      if (message.includes("rate limit")) {
        await recordRegistration(registrationEntry);
        return NextResponse.json(
          {
            success: true,
            message: "We already sent a confirmation email recently. Please check your inbox or wait a minute before trying again.",
          },
          { status: 200 },
        );
      }
      if (message.includes("already registered") || message.includes("user already exists")) {
        return NextResponse.json({ error: "This email is already registered. Please log in instead." }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || "Registration failed." }, { status: 400 });
    }

    console.log("Supabase sign up successful for:", email);
    await recordRegistration(registrationEntry);

    return NextResponse.json({ success: true, message: "Registration email sent. Please confirm to continue." });
  } catch (error) {
    console.error("POST /api/registrations error:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Full error details:", { error });
    return NextResponse.json({ error: `Unable to process registration: ${errorMsg}` }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const email = sanitize(body?.email).toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    await markRegistrationConfirmed(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/registrations", error);
    return NextResponse.json({ error: "Unable to update registration." }, { status: 500 });
  }
}
