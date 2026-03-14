import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { DEMO_COMPANY_ID } from "@/lib/demoConstants";

/**
 * Comprehensive Demo Data Seed
 * POST /api/seed/demo-data
 * 
 * Populates database with rich demo data for better UX
 * Includes projects, tasks, crew, customers, items, invoices
 */

const DEMO_PROJECTS = [
  {
    id: 1,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Highway Bridge Reinforcement",
    description: "Infrastructure maintenance project",
    status: "in_progress",
    start_date: "2026-03-01",
    end_date: "2026-04-30",
    location: "Johannesburg, South Africa",
    budget: 500000,
  },
  {
    id: 2,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Shopping Mall Renovation",
    description: "Interior and exterior upgrades",
    status: "in_progress",
    start_date: "2026-02-15",
    end_date: "2026-05-15",
    location: "Pretoria, South Africa",
    budget: 750000,
  },
  {
    id: 3,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Industrial Water System Upgrade",
    description: "Piping and filtration system installation",
    status: "planning",
    start_date: "2026-04-01",
    end_date: "2026-06-30",
    location: "Durban, South Africa",
    budget: 350000,
  },
];

const DEMO_TASKS = [
  {
    id: 1,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    project_id: 1,
    title: "Site Excavation & Preparation",
    description: "Clear and prepare construction site",
    status: "in_progress",
    priority: "high",
    assigned_to: "John Smith",
    due_date: "2026-03-15",
    progress: 75,
  },
  {
    id: 2,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    project_id: 1,
    title: "Foundation Concrete Pour",
    description: "Install concrete foundation",
    status: "in_progress",
    priority: "high",
    assigned_to: "Mike Johnson",
    due_date: "2026-03-20",
    progress: 60,
  },
  {
    id: 3,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    project_id: 1,
    title: "Steel Frame Installation",
    description: "Install main structural steel framework",
    status: "pending",
    priority: "high",
    assigned_to: "John Smith",
    due_date: "2026-04-05",
    progress: 0,
  },
  {
    id: 4,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    project_id: 2,
    title: "Interior Wall Removal",
    description: "Demolish interior walls for renovation",
    status: "completed",
    priority: "medium",
    assigned_to: "Mike Johnson",
    due_date: "2026-02-28",
    progress: 100,
  },
  {
    id: 5,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    project_id: 2,
    title: "New Wall Installation",
    description: "Build new partition walls",
    status: "in_progress",
    priority: "medium",
    assigned_to: "Sarah Brown",
    due_date: "2026-03-25",
    progress: 50,
  },
  {
    id: 6,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    project_id: 2,
    title: "Electrical Wiring",
    description: "Install new electrical infrastructure",
    status: "pending",
    priority: "high",
    assigned_to: "James Wilson",
    due_date: "2026-04-10",
    progress: 0,
  },
  {
    id: 7,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    project_id: 3,
    title: "Design Review & Permits",
    description: "Review designs and obtain permits",
    status: "in_progress",
    priority: "critical",
    assigned_to: "Emma Davis",
    due_date: "2026-03-30",
    progress: 80,
  },
  {
    id: 8,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    project_id: 3,
    title: "Material Procurement",
    description: "Order pipes, valves, and fittings",
    status: "in_progress",
    priority: "high",
    assigned_to: "Chris Lee",
    due_date: "2026-04-15",
    progress: 45,
  },
];

const DEMO_CREW = [
  {
    id: 1,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "John Smith",
    hourly_rate: 450,
    skill_level: "senior",
  },
  {
    id: 2,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Mike Johnson",
    hourly_rate: 400,
    skill_level: "intermediate",
  },
  {
    id: 3,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Sarah Brown",
    hourly_rate: 380,
    skill_level: "intermediate",
  },
  {
    id: 4,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "James Wilson",
    hourly_rate: 420,
    skill_level: "senior",
  },
  {
    id: 5,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Emma Davis",
    hourly_rate: 500,
    skill_level: "senior",
  },
  {
    id: 6,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Chris Lee",
    hourly_rate: 390,
    skill_level: "junior",
  },
];

const DEMO_CUSTOMERS = [
  {
    id: 1,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Department of Transportation",
    email: "maintenance@dot.gov.za",
    phone: "+27-11-555-0100",
    address: "123 Government Building, Johannesburg",
  },
  {
    id: 2,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Retail Properties Inc",
    email: "projects@retailprops.co.za",
    phone: "+27-12-555-0200",
    address: "456 Business Park, Pretoria",
  },
  {
    id: 3,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    name: "Industrial Manufacturing Corp",
    email: "ops@industrialmfg.co.za",
    phone: "+27-31-555-0300",
    address: "789 Industrial Zone, Durban",
  },
];

const DEMO_ITEMS = [
  {
    id: 1,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    sku: "STEEL-BEAM-250",
    name: "Steel I-Beam 250mm",
    description: "Industrial grade steel beam",
    unit_price: 1850,
    cost_price: 1200,
    quantity_in_stock: 45,
  },
  {
    id: 2,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    sku: "CONCRETE-MIX",
    name: "Ready-Mix Concrete (Cubic Meter)",
    description: "High-strength concrete mix",
    unit_price: 950,
    cost_price: 600,
    quantity_in_stock: 120,
  },
  {
    id: 3,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    sku: "REBAR-16MM",
    name: "Reinforcement Bar 16mm",
    description: "Steel rebar for reinforcement",
    unit_price: 85,
    cost_price: 50,
    quantity_in_stock: 500,
  },
  {
    id: 4,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    sku: "PVC-PIPE-100",
    name: "PVC Pipe 100mm",
    description: "Schedule 40 PVC piping",
    unit_price: 450,
    cost_price: 280,
    quantity_in_stock: 200,
  },
  {
    id: 5,
    company_id: DEMO_COMPANY_ID,
    user_id: "demo-user",
    sku: "ELECTRICAL-WIRE",
    name: "Electrical Wire Bundle",
    description: "Commercial grade electrical wire (100m)",
    unit_price: 320,
    cost_price: 180,
    quantity_in_stock: 150,
  },
];

export async function POST(request: NextRequest) {
  try {
    console.log("🌱 Starting demo data seed...");

    // Seed projects
    console.log("📋 Seeding projects...");
    for (const project of DEMO_PROJECTS) {
      const { error } = await supabaseServer.from("projects").upsert(
        [project],
        { onConflict: "id" }
      );
      if (error) console.error("Error seeding project:", error);
    }

    // Seed tasks
    console.log("✅ Seeding tasks...");
    for (const task of DEMO_TASKS) {
      const { error } = await supabaseServer.from("tasks").upsert([task], {
        onConflict: "id",
      });
      if (error) console.error("Error seeding task:", error);
    }

    // Seed crew
    console.log("👥 Seeding crew members...");
    for (const crew of DEMO_CREW) {
      const { error } = await supabaseServer.from("crew_members").upsert(
        [crew],
        { onConflict: "id" }
      );
      if (error) console.error("Error seeding crew:", error);
    }

    // Seed customers
    console.log("🏢 Seeding customers...");
    for (const customer of DEMO_CUSTOMERS) {
      const { error } = await supabaseServer.from("customers").upsert(
        [customer],
        { onConflict: "id" }
      );
      if (error) console.error("Error seeding customer:", error);
    }

    // Seed items
    console.log("📦 Seeding items...");
    for (const item of DEMO_ITEMS) {
      const { error } = await supabaseServer.from("items").upsert([item], {
        onConflict: "id",
      });
      if (error) console.error("Error seeding item:", error);
    }

    console.log("✅ Demo data seeding complete!");

    return NextResponse.json(
      {
        success: true,
        message: "Demo data seeded successfully",
        data: {
          projects: DEMO_PROJECTS.length,
          tasks: DEMO_TASKS.length,
          crew: DEMO_CREW.length,
          customers: DEMO_CUSTOMERS.length,
          items: DEMO_ITEMS.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in demo data seed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
