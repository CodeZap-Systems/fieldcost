/**
 * Example: Complete Demo/Live Company Switching Implementation
 * 
 * This file demonstrates production-ready patterns for integrating
 * the demo vs live company switcher system in your app.
 */

// ============================================================================
// EXAMPLE 1: Full Dashboard Layout with Demo Mode
// ============================================================================

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { SelectableCompanySwitcher } from "@/app/components/SelectableCompanySwitcher";
import { EnvironmentBadge } from "@/app/components/EnvironmentBadge";
import { OnboardingModal } from "@/app/components/OnboardingModal";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany, DEMO_COMPANY_ID } from "@/lib/demoConstants";
import { persistActiveCompanyId } from "@/lib/companySwitcher";

export function DashboardLayoutWithDemoMode() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const {
    companies,
    activeCompanyId,
    activeCompany,
    isActiveDemoCompany,
    switchCompany,
    isLoading,
  } = useCompanySwitcher({
    onSwitchSuccess: () => {
      // Refresh page with new company scope
      window.location.reload();
    },
    onSwitchError: (error) => {
      console.error("Failed to switch company:", error);
      alert("Failed to switch workspace. Please try again.");
    },
  });

  // Show onboarding if user just signed up
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem("hasVisitedDashboard");
    const isEmptyWorkspace = companies.length === 0;

    if (isFirstVisit && isEmptyWorkspace) {
      setShowOnboarding(true);
    }

    if (companies.length > 0) {
      localStorage.setItem("hasVisitedDashboard", "true");
    }
  }, [companies]);

  const handleExploreDemo = async () => {
    try {
      await switchCompany(DEMO_COMPANY_ID);
      setShowOnboarding(false);
    } catch (err) {
      console.error("Failed to explore demo:", err);
    }
  };

  const handleGotoLiveWorkspace = () => {
    // Find first non-demo company or clear active
    const liveCompany = companies.find((c) => !isDemoCompany(c.id));
    if (liveCompany) {
      switchCompany(liveCompany.id);
    } else {
      persistActiveCompanyId(null);
      router.refresh();
    }
  };

  return (
    <>
      {/* Demo Mode Banner - sticky at top */}
      <DemoModeBanner
        companyId={activeCompanyId}
        onGotoLiveWorkspace={handleGotoLiveWorkspace}
      />

      {/* Main Layout */}
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">FieldCost</h1>
              {isActiveDemoCompany && (
                <EnvironmentBadge companyId={activeCompanyId} className="text-xs" />
              )}
            </div>

            {/* Company Switcher */}
            <SelectableCompanySwitcher
              companies={companies}
              activeCompanyId={activeCompanyId}
              onSwitchCompany={switchCompany}
              isLoading={isLoading}
            />
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
              Dashboard
            </a>
            <a href="/dashboard/projects" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
              Projects
            </a>
            <a href="/dashboard/tasks" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
              Tasks
            </a>
            <a href="/dashboard/invoices" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
              Invoices
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              {activeCompany?.name || "Select workspace"}
            </h2>

            {/* Show demo warning info card */}
            {isActiveDemoCompany && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  💡 <strong>Tip:</strong> This demo includes realistic sample data 
                  (projects, tasks, invoices). Feel free to make changes—they won't 
                  affect real workspaces.
                </p>
              </div>
            )}

            {/* Dashboard content */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Active Projects</p>
                <p className="text-3xl font-bold mt-2">3</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Open Tasks</p>
                <p className="text-3xl font-bold mt-2">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Outstanding Invoices</p>
                <p className="text-3xl font-bold mt-2">R82,500</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onExploreDemo={handleExploreDemo}
        onStayInWorkspace={() => setShowOnboarding(false)}
        isLoading={isLoading}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 2: Protected Route with Demo Detection
// ============================================================================

import { ReactNode } from "react";
import { isInDemoMode, canPerformDestructiveAction } from "@/lib/demoDetection";

interface ProtectedActionProps {
  children: ReactNode;
  companyId?: string | null;
  isDangerous?: boolean;
  onConfirm?: () => void;
}

export function ProtectedAction({
  children,
  companyId,
  isDangerous = false,
  onConfirm,
}: ProtectedActionProps) {
  const isDemo = isInDemoMode(companyId);
  const { requiresWarning } = canPerformDestructiveAction(companyId);

  const handleAction = () => {
    if (isDangerous && isDemo && requiresWarning) {
      const confirmed = confirm(
        "⚠️ Warning!\n\n" +
        "You're in the Demo Workspace. This action will demonstrate the feature " +
        "but won't affect a real company.\n\n" +
        "Continue?"
      );

      if (confirmed) {
        onConfirm?.();
      }
    } else {
      onConfirm?.();
    }
  };

  return (
    <button onClick={handleAction} className="px-4 py-2 bg-red-500 text-white rounded-lg">
      {children}
    </button>
  );
}

// ============================================================================
// EXAMPLE 3: API Route with Company Scoping
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { resolveServerUserId } from "@/lib/serverUser";
import { supabaseServer } from "@/lib/supabaseServer";
import { isDemoCompany } from "@/lib/demoConstants";

/**
 * GET /api/projects
 * Scope queries to active company
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await resolveServerUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get companyId from query params
    const companyId = request.nextUrl.searchParams.get("company_id");

    // Build query
    let query = supabaseServer
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // If specific company requested, validate access
    if (companyId && !isDemoCompany(companyId)) {
      // Verify user has access to this company
      const { error: accessError } = await supabaseServer
        .from("company_profiles")
        .select("id")
        .eq("id", companyId)
        .eq("user_id", userId)
        .single();

      if (accessError) {
        return NextResponse.json(
          { error: "You don't have access to this company" },
          { status: 403 }
        );
      }

      // Scope to company
      query = query.eq("company_id", companyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      projects: data || [],
      isDemo: isDemoCompany(companyId),
      companyId,
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// EXAMPLE 4: Client-Side Query with Demo Data Fallback
// ============================================================================

import { useState, useEffect } from "react";
import { canUseDemoFixtures } from "@/lib/userIdentity";
import { getDemoProjects } from "@/lib/demoMockData";

interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "archived";
}

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);

        // Try to fetch real data
        const res = await fetch(
          `/api/projects?company_id=${activeCompanyId || ""}`
        );
        const data = await res.json();

        let finalProjects = data.projects || [];

        // If no real data and demo enabled, use mock data
        if (finalProjects.length === 0 && canUseDemoFixtures()) {
          finalProjects = getDemoProjects();
        }

        setProjects(finalProjects);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [activeCompanyId]);

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Create one to get started.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-600">Status: {project.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Middleware for Route Protection
// ============================================================================

import type { Request } from "next/server";
import { middleware } from "next/server";

/**
 * Middleware to detect and track demo mode sessions
 * Could be used to:
 * - Block certain routes in demo
 * - Add demo headers to responses
 * - Log demo usage separately
 */
export function demoModeMiddleware(request: Request) {
  const companyId = request.cookies.get("activeCompanyId")?.value;
  const isDemo = isDemoCompany(companyId);

  // Add header for downstream services
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-Demo-Mode", isDemo ? "true" : "false");
  requestHeaders.set("X-Company-ID", companyId || "");

  // Could block certain routes
  if (isDemo && request.nextUrl.pathname.includes("/billing")) {
    return new Response("Billing not available in demo mode", { status: 403 });
  }

  return requestHeaders;
}

// ============================================================================
// EXAMPLE 6: Destructive Action Safety Pattern
// ============================================================================

interface SafeDeleteProps {
  id: number;
  itemName: string;
  companyId?: string | null;
  onDelete: (id: number) => Promise<void>;
}

export function SafeDeleteButton({
  id,
  itemName,
  companyId,
  onDelete,
}: SafeDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isDemo = isInDemoMode(companyId);

  const handleDelete = async () => {
    let confirmMessage = `Delete ${itemName}?`;

    if (isDemo) {
      confirmMessage =
        `Delete ${itemName}?\n\n` +
        "⚠️ Demo Mode: This change will be immediately reflected in your demo " +
        "workspace but won't affect any real company data.\n\n" +
        "Continue?";
    }

    if (!confirm(confirmMessage)) return;

    try {
      setIsDeleting(true);
      await onDelete(id);

      if (isDemo) {
        console.log(`[DEMO] Deleted item: ${itemName}`);
      }
    } catch (err) {
      alert("Failed to delete. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`px-3 py-1 rounded text-sm font-medium text-white ${
        isDeleting
          ? "bg-gray-400 cursor-not-allowed"
          : isDemo
            ? "bg-orange-600 hover:bg-orange-700"
            : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}

// ============================================================================
// USAGE IN PAGE COMPONENT
// ============================================================================

/**
 * In your page.tsx or component:
 */
export default function ExamplePage() {
  return (
    <div>
      {/* Use the full dashboard layout */}
      <DashboardLayoutWithDemoMode />

      {/* Or individual components */}
      <ProtectedAction
        isDangerous={true}
        onConfirm={() => console.log("Action confirmed")}
      >
        Delete Project
      </ProtectedAction>

      {/* Or the projects list with demo fallback */}
      <ProjectsList />
    </div>
  );
}
