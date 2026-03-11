/**
 * ADMIN CMS API - Admin Users Endpoint
 * 
 * Create, list, and update admin user accounts with role-based permissions
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";

const ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
  superadmin: {
    can_manage_plans: true,
    can_manage_subscriptions: true,
    can_manage_billing: true,
    can_manage_payments: true,
    can_manage_users: true,
    can_manage_settings: true,
    can_view_analytics: true,
  },
  admin: {
    can_manage_plans: true,
    can_manage_subscriptions: true,
    can_manage_billing: false,
    can_manage_payments: false,
    can_manage_users: true,
    can_manage_settings: false,
    can_view_analytics: true,
  },
  billing_admin: {
    can_manage_plans: false,
    can_manage_subscriptions: false,
    can_manage_billing: true,
    can_manage_payments: true,
    can_manage_users: false,
    can_manage_settings: false,
    can_view_analytics: true,
  },
  support: {
    can_manage_plans: false,
    can_manage_subscriptions: false,
    can_manage_billing: false,
    can_manage_payments: false,
    can_manage_users: false,
    can_manage_settings: false,
    can_view_analytics: false,
  },
  analyst: {
    can_manage_plans: false,
    can_manage_subscriptions: false,
    can_manage_billing: false,
    can_manage_payments: false,
    can_manage_users: false,
    can_manage_settings: false,
    can_view_analytics: true,
  },
};

export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions
    const { data: currentAdmin } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!currentAdmin || !currentAdmin.can_manage_users) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all admin users
    const { data: users, error } = await supabaseServer
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users: users || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Get admin users error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions
    const { data: currentAdmin } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!currentAdmin || !currentAdmin.can_manage_users) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { email, role } = body;

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!ROLE_PERMISSIONS[role]) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Get permissions for role
    const permissions = ROLE_PERMISSIONS[role];

    // Create new admin user
    const { data: newUser, error } = await supabaseServer
      .from("admin_users")
      .insert([
        {
          email,
          role,
          ...permissions,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer
      .from("admin_audit_logs")
      .insert([
        {
          admin_id: userId,
          action: "create_admin_user",
          resource_type: "admin_user",
          resource_id: newUser.id,
          changes: { email, role },
          timestamp: new Date().toISOString(),
        },
      ]);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("Create admin user error:", error);
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
    const adminId = searchParams.get("id");

    if (!adminId) {
      return NextResponse.json({ error: "Admin ID required" }, { status: 400 });
    }

    // Check permissions
    const { data: currentAdmin } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!currentAdmin || !currentAdmin.can_manage_users) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { role, is_active } = body;

    let updates: Record<string, any> = {};

    if (role) {
      if (!ROLE_PERMISSIONS[role]) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updates = { role, ...ROLE_PERMISSIONS[role] };
    }

    if (is_active !== undefined) {
      updates.is_active = is_active;
    }

    // Update admin user
    const { data: updated, error } = await supabaseServer
      .from("admin_users")
      .update(updates)
      .eq("id", adminId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer
      .from("admin_audit_logs")
      .insert([
        {
          admin_id: userId,
          action: "update_admin_user",
          resource_type: "admin_user",
          resource_id: adminId,
          changes: updates,
          timestamp: new Date().toISOString(),
        },
      ]);

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Update admin user error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
