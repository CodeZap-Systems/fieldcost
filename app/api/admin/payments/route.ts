/**
 * ADMIN CMS API - Payments Endpoint
 * 
 * Create, list, and update payment methods and process charges
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";

export async function GET(req: NextRequest) {
  try {
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const { searchParams } = new URL(req.url);

    // Check permissions
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser || !adminUser.can_manage_payments) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get filter parameters
    const companyId = searchParams.get("company_id");
    const paymentType = searchParams.get("payment_type");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Build query for payment methods
    let query = supabaseServer
      .from("payment_methods")
      .select("*")
      .order("created_at", { ascending: false });

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    if (paymentType) {
      query = query.eq("payment_type", paymentType);
    }

    query = query.limit(limit);

    const { data: paymentMethods, error } = await query;

    if (error) throw error;

    return NextResponse.json({ payment_methods: paymentMethods || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Get payments error:", error);
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
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser || !adminUser.can_manage_payments) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { company_id, payment_type, payment_details } = body;

    // Validate input
    if (!company_id || !payment_type) {
      return NextResponse.json(
        { error: "Company ID and payment type are required" },
        { status: 400 }
      );
    }

    // Create payment method (in production, payment details would be encrypted)
    const { data: newPayment, error } = await supabaseServer
      .from("payment_methods")
      .insert([
        {
          company_id,
          payment_type,
          payment_details: payment_details || {},
          is_default: false,
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
          action: "create_payment_method",
          resource_type: "payment_method",
          resource_id: newPayment.id,
          changes: { company_id, payment_type },
          timestamp: new Date().toISOString(),
        },
      ]);

    return NextResponse.json({ payment_method: newPayment }, { status: 201 });
  } catch (error: any) {
    console.error("Create payment error:", error);
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
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID required" },
        { status: 400 }
      );
    }

    // Check permissions
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser || !adminUser.can_manage_payments) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { is_default, is_active } = body;

    const updates: Record<string, any> = {};

    if (is_default !== undefined) {
      updates.is_default = is_default;
    }

    if (is_active !== undefined) {
      updates.is_active = is_active;
    }

    // Update payment method
    const { data: updated, error } = await supabaseServer
      .from("payment_methods")
      .update(updates)
      .eq("id", paymentId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer
      .from("admin_audit_logs")
      .insert([
        {
          admin_id: userId,
          action: "update_payment_method",
          resource_type: "payment_method",
          resource_id: paymentId,
          changes: updates,
          timestamp: new Date().toISOString(),
        },
      ]);

    return NextResponse.json({ payment_method: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Update payment error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID required" },
        { status: 400 }
      );
    }

    // Check permissions
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser || !adminUser.can_manage_payments) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete (mark as inactive)
    const { error } = await supabaseServer
      .from("payment_methods")
      .update({ is_active: false })
      .eq("id", paymentId);

    if (error) throw error;

    // Log audit
    await supabaseServer
      .from("admin_audit_logs")
      .insert([
        {
          admin_id: userId,
          action: "delete_payment_method",
          resource_type: "payment_method",
          resource_id: paymentId,
          changes: { is_active: false },
          timestamp: new Date().toISOString(),
        },
      ]);

    return NextResponse.json({ status: "deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete payment error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

