"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID, normalizeUserId } from "../../lib/userIdentity";
import { persistActiveCompanyId, readActiveCompanyId } from "../../lib/companySwitcher";
import { SelectableCompanySwitcher, type CompanyOption } from "./SelectableCompanySwitcher";
import { EnvironmentBadge } from "./EnvironmentBadge";
import { isDemoCompany } from "@/lib/demoConstants";
import { useRouter } from "next/navigation";

const MANAGEMENT_SECTIONS = [
  {
    label: "Projects",
    links: [
      { href: "/dashboard/projects", text: "View Projects" },
      { href: "/dashboard/projects?page=add", text: "Add Project" },
      { href: "/dashboard/projects?page=reports", text: "Project Reports" },
    ],
  },
  {
    label: "Customers",
    links: [
      { href: "/dashboard/customers", text: "View Customers" },
      { href: "/dashboard/customers?page=add", text: "Add Customer" },
      { href: "/dashboard/customers?page=reports", text: "Customer Reports" },
    ],
  },
  {
    label: "Vendors",
    links: [
      { href: "/dashboard/vendors", text: "View Vendors" },
      { href: "/dashboard/vendors?page=add", text: "Add Vendor" },
    ],
  },
  {
    label: "Items",
    links: [
      { href: "/dashboard/items", text: "View Items" },
      { href: "/dashboard/items?page=add", text: "Add Item" },
      { href: "/dashboard/items?page=reports", text: "Item Reports" },
    ],
  },
  {
    label: "Tasks",
    links: [
      { href: "/dashboard/tasks", text: "View Tasks" },
      { href: "/dashboard/tasks?page=add", text: "Add Task" },
      { href: "/dashboard/tasks?page=reports", text: "Task Reports" },
    ],
  },
  {
    label: "Invoices",
    links: [
      { href: "/dashboard/invoices", text: "View Invoices" },
      { href: "/dashboard/invoices?page=add", text: "Add Invoice" },
      { href: "/dashboard/invoices?page=reports", text: "Invoice Reports" },
    ],
  },
  {
    label: "Reports",
    links: [
      { href: "/dashboard/projects/reports/pandl", text: "Project P&L" },
      { href: "/dashboard/items/reports/margin", text: "Item Margins" },
      { href: "/dashboard/tasks/reports/crew-engagement", text: "Crew Engagement" },
      { href: "/dashboard/test-data", text: "Test Data & Reports" },
    ],
  },
];

const FIELD_SECTIONS = [
  {
    label: "Projects",
    links: [{ href: "/dashboard/projects", text: "Projects" }],
  },
  {
    label: "Tasks",
    links: [{ href: "/dashboard/tasks", text: "Tasks" }],
  },
];

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

const AUTH_LINKS = [
  { href: "/auth/register", label: "Register" },
  { href: "/auth/login", label: "Login" },
  { href: "/dashboard/setup-company", label: "Setup Company" },
];

const DEMO_SWITCHES = [
  { id: DEMO_ADMIN_USER_ID, label: "Demo admin view", helper: "Operations" },
  { id: DEMO_SUBCONTRACTOR_USER_ID, label: "Demo crew view", helper: "Field" },
];

export default function AppNav() {
  const pathname = usePathname();
  const [role, setRole] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [demoUserId, setDemoUserId] = React.useState<string | null>(null);
  const [companies, setCompanies] = React.useState<Array<{ id: string; name: string; is_demo?: boolean }>>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setRole(data.user.user_metadata?.role || null);
        setEmail(data.user.email || null);
        setIsAuthenticated(true);
        // CRITICAL: Clear demo user ID when user authenticates
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("demoUserId");
        }
        setDemoUserId(null);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  React.useEffect(() => {
    // CRITICAL: Only use demoUserId if NOT authenticated
    if (typeof window === "undefined" || isAuthenticated) return;
    const stored = window.localStorage.getItem("demoUserId");
    setDemoUserId(stored ? normalizeUserId(stored) : null);
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setActiveCompanyId(readActiveCompanyId());
  }, []);

  React.useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    const targetId = activeCompanyId ?? (typeof window !== "undefined" ? readActiveCompanyId() : null);
    if (targetId) params.set("company_id", targetId);
    const query = params.toString();
    fetch(`/api/company${query ? `?${query}` : ""}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error("Failed to load companies"))))
      .then(payload => {
        if (ignore) return;
        const list = Array.isArray(payload?.companies)
          ? payload.companies
          : payload?.company
            ? [payload.company]
            : [];
        const normalized = list
          .map((entry: { id?: string | number; name?: string; is_demo?: boolean }) => ({
            id: entry?.id ? String(entry.id) : "",
            name: entry?.name || "Untitled company",
            is_demo: entry?.is_demo === true,
          }))
          .filter(entry => entry.id);
        setCompanies(normalized);
        // CRITICAL: Always prefer owned (non-demo) companies as default
        const ownedCompanies = normalized.filter(c => !c.is_demo);
        const resolvedId = payload?.company?.id ? String(payload.company.id) : (ownedCompanies[0]?.id ?? normalized[0]?.id ?? null);
        if (resolvedId && resolvedId !== activeCompanyId) {
          setActiveCompanyId(resolvedId);
          persistActiveCompanyId(resolvedId);
        } else if (!resolvedId && activeCompanyId) {
          setActiveCompanyId(null);
          persistActiveCompanyId(null);
        }
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, [activeCompanyId]);

  function handleDemoSwitch(targetId: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("demoUserId", targetId);
    setDemoUserId(normalizeUserId(targetId));
    window.location.reload();
  }

  function handleCompanySelect(companyId: string) {
    if (typeof window === "undefined") return;
    setActiveCompanyId(companyId);
    persistActiveCompanyId(companyId);
    window.location.reload();
  }

  const sections = role === "subcontractor" ? FIELD_SECTIONS : MANAGEMENT_SECTIONS;

  // Convert to company options format
  // NOTE: isDemo would be passed from API if company has is_demo=true flag
  // For now, use isDemoCompany() for DEMO_COMPANY_ID format
  const companyOptions: CompanyOption[] = companies.map(company => ({
    id: company.id,
    name: company.name,
    isDemo: isDemoCompany(company.id) || (company as any).is_demo === true,
  }));

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">FieldCost MVP</h2>
          {activeCompanyId && isDemoCompany(activeCompanyId) && (
            <EnvironmentBadge companyId={activeCompanyId} className="text-xs" />
          )}
        </div>

        {/* New improved company switcher */}
        <div className="workspace-company-switch px-4 py-4">
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">
            Workspace
          </label>
          <SelectableCompanySwitcher
            companies={companyOptions}
            activeCompanyId={activeCompanyId}
            onSwitchCompany={handleCompanySelect}
            showBadge={true}
          />
        </div>
        <div className="space-y-6 w-full">
          <div className="workspace-nav-section">
            <span>Workspace</span>
            <div className="workspace-nav-links">
              {PRIMARY_LINKS.map(link => (
                <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {sections.map(section => (
            <div key={section.label} className="workspace-nav-section">
              <span>{section.label}</span>
              <div className="workspace-nav-links">
                {section.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {/* Company Settings - only show if authenticated */}
          {isAuthenticated && activeCompanyId && (
            <div className="workspace-nav-section">
              <span>Settings</span>
              <div className="workspace-nav-links">
                <Link href="/dashboard/company-settings" aria-current={pathname === "/dashboard/company-settings" ? "page" : undefined}>
                  Company Settings
                </Link>
              </div>
            </div>
          )}
          {/* Demo section - only show if NOT authenticated */}
          {!isAuthenticated && (
            <div className="workspace-nav-section">
              <span>Demo</span>
              <div className="workspace-nav-links">
                {DEMO_SWITCHES.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleDemoSwitch(option.id)}
                    className={demoUserId === normalizeUserId(option.id) ? "active" : undefined}
                    aria-pressed={demoUserId === normalizeUserId(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
                <Link href="/auth/demo-login" aria-current={pathname === "/auth/demo-login" ? "page" : undefined}>
                  Demo login
                </Link>
                <Link href="/demo-signup" aria-current={pathname === "/demo-signup" ? "page" : undefined}>
                  Demo signup
                </Link>
              </div>
            </div>
          )}
          <div className="workspace-nav-section">
            <span>Account</span>
            {isAuthenticated ? (
              <div className="workspace-nav-links">
                <div className="px-3 py-2 text-xs text-gray-600 border-b border-gray-200">
                  <div className="font-semibold truncate">{email}</div>
                </div>
                <Link href="/dashboard/company-settings" aria-current={pathname === "/dashboard/company-settings" ? "page" : undefined}>
                  Company Settings
                </Link>
                <Link href="/auth/logout" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Logout
                </Link>
              </div>
            ) : (
              <div className="workspace-nav-links">
                {AUTH_LINKS.map(link => (
                  <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
