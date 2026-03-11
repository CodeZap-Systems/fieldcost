/**
 * ADMIN CMS API - System Settings Endpoint
 * 
 * Get and update system configuration settings
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";

export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions - at least view analytics to see settings
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser || !adminUser.can_manage_settings) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all system settings
    const { data: settings, error } = await supabaseServer
      .from("system_settings")
      .select("*")
      .order("key", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ settings: settings || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Setting key required" }, { status: 400 });
    }

    // Check permissions
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser || !adminUser.can_manage_settings) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { value } = body;

    if (value === undefined) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 });
    }

    // Update setting
    const { data: updated, error } = await supabaseServer
      .from("system_settings")
      .update({ value: String(value) })
      .eq("key", key)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer
      .from("admin_audit_logs")
      .insert([
        {
          admin_id: userId,
          action: "update_setting",
          resource_type: "system_settings",
          resource_id: key,
          changes: { key, value },
          timestamp: new Date().toISOString(),
        },
      ]);

    return NextResponse.json({ setting: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Update setting error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

