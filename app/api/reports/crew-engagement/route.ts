import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { resolveServerUserId } from "../../../../lib/serverUser";
import { getCompanyContext } from "../../../../lib/companyContext";

interface CrewStats {
  crewId: number;
  crewName: string;
  hourlyRate: number;
  tasksAssigned: number;
  tasksCompleted: number;
  totalHours: number;
  totalEarnings: number;
  projectsWorked: number;
}

interface TierData {
  crew: CrewStats[];
  totalTasks: number;
  totalHours: number;
  totalEarnings: number;
  avgHourlyRate: number;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get("user_id"));
    const companyId = searchParams.get("company_id");

    if (!companyId) {
      return NextResponse.json({ error: "company_id required" }, { status: 400 });
    }

    // Validate user has access to company
    await getCompanyContext(userId, companyId);

    // Fetch all crew members
    const { data: crewData } = await supabaseServer
      .from("crew_members")
      .select("id, name, hourly_rate")
      .eq("company_id", companyId)
      .order("name");

    const crewList = Array.isArray(crewData) ? crewData : [];

    // Fetch all tasks to see crew assignments
    const { data: tasksData } = await supabaseServer
      .from("tasks")
      .select("id, title, assigned_to, project_id, hours, status")
      .eq("company_id", companyId);

    const allTasks = Array.isArray(tasksData) ? tasksData : [];

    // Calculate crew statistics
    const crewStats: CrewStats[] = crewList.map((crew) => {
      // Find all tasks assigned to this crew member
      const crewTasks = allTasks.filter((task) => {
        // Check various possible field names for crew assignment
        const assignedTo = task.assigned_to || (task as any).crewId || (task as any).crew_id;
        return assignedTo === crew.id || assignedTo === String(crew.id);
      });

      const tasksCompleted = crewTasks.filter((t) => t.status === "completed" || t.status === "done").length;
      const totalHours = crewTasks.reduce((sum, t) => sum + (t.hours || 0), 0);
      const totalEarnings = totalHours * (crew.hourly_rate || 0);

      // Count unique projects
      const projectsWorked = new Set(crewTasks.map((t) => t.project_id)).size;

      return {
        crewId: crew.id,
        crewName: crew.name,
        hourlyRate: crew.hourly_rate || 0,
        tasksAssigned: crewTasks.length,
        tasksCompleted,
        totalHours,
        totalEarnings,
        projectsWorked,
      };
    });

    // Calculate totals
    const totalTasks = crewStats.reduce((sum, c) => sum + c.tasksAssigned, 0);
    const totalHours = crewStats.reduce((sum, c) => sum + c.totalHours, 0);
    const totalEarnings = crewStats.reduce((sum, c) => sum + c.totalEarnings, 0);
    const avgHourlyRate = crewList.length > 0 
      ? crewList.reduce((sum, c) => sum + (c.hourly_rate || 0), 0) / crewList.length 
      : 0;

    const response: TierData = {
      crew: crewStats.sort((a, b) => b.totalEarnings - a.totalEarnings),
      totalTasks,
      totalHours,
      totalEarnings,
      avgHourlyRate,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/reports/crew-engagement error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
