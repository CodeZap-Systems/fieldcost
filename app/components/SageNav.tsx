"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID, normalizeUserId } from "../../lib/userIdentity";
import { persistActiveCompanyId, readActiveCompanyId } from "../../lib/companySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";

// Menu icons as components
const MenuIcon = () => <span className="text-lg">☰</span>;
const CloseIcon = () => <span className="text-lg">✕</span>;
const LogoutIcon = () => <span className="text-lg">⎚</span>;
const ChevronRightIcon = () => <span className="text-sm">›</span>;

// Navigation sections with icons
const NAV_SECTIONS = [
  {
    label: "Workspace",
    icon: "🏠",
    links: [
      { href: "/", text: "Home", icon: "🏠" },
      { href: "/dashboard", text: "Dashboard", icon: "📊" },
    ],
  },
  {
    label: "Operations",
    icon: "📋",
    links: [
      { href: "/dashboard/projects", text: "Projects", icon: "📁" },
      { href: "/dashboard/customers", text: "Customers", icon: "👥" },
      { href: "/dashboard/items", text: "Inventory", icon: "📦" },
      { href: "/dashboard/quotes", text: "Quotes", icon: "💬" },
      { href: "/dashboard/orders", text: "Orders", icon: "📦" },
      { href: "/dashboard/invoices", text: "Invoices", icon: "💰" },
    ],
  },
  {
    label: "Tasks",
    icon: "✓",
    links: [
      { href: "/dashboard/tasks", text: "View Tasks", icon: "✓" },
    ],
  },
  {
    label: "Demo",
    icon: "🎬",
    links: [
      { href: "/auth/demo-login", text: "Try Demo", icon: "🎬" },
    ],
  },
  {
    label: "Account",
    icon: "👤",
    links: [
      { href: "/auth/login", text: "Login", icon: "🔓" },
      { href: "/auth/register", text: "Register", icon: "📝" },
      { href: "/dashboard/setup-company", text: "Setup Company", icon: "⚙️" },
    ],
  },
];

export default function SageNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoUserId, setDemoUserId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Workspace": true,
    "Operations": true,
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user);
          setRole(data.session.user.user_metadata?.role || null);
        }
      } catch (err) {
        console.warn("Failed to check session:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Load demo user state
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("demoUserId");
    setDemoUserId(stored ? normalizeUserId(stored) : null);
  }, []);

  // Load companies
  useEffect(() => {
    if (typeof window === "undefined") return;
    setActiveCompanyId(readActiveCompanyId());
  }, []);

  // Fetch companies data
  useEffect(() => {
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
          .map((entry: any) => ({
            id: entry?.id ? String(entry.id) : "",
            name: entry?.name || "Untitled company",
          }))
          .filter(entry => entry.id);
        setCompanies(normalized);
        const resolvedId = payload?.company?.id ? String(payload.company.id) : normalized[0]?.id ?? null;
        if (resolvedId && resolvedId !== activeCompanyId) {
          setActiveCompanyId(resolvedId);
          persistActiveCompanyId(resolvedId);
        }
      })
      .catch(err => {
        console.warn("Failed to load companies:", err);
      });
    return () => {
      ignore = true;
    };
  }, [activeCompanyId]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("demoSession");
      localStorage.removeItem("demoUserId");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleCompanySelect = (companyId: string) => {
    setActiveCompanyId(companyId);
    persistActiveCompanyId(companyId);
  };

  // Filter sections based on auth state
  const visibleSections = NAV_SECTIONS.filter(section => {
    // Account & Demo sections only for non-authenticated users (demo mode)
    if (section.label === "Account" && user) {
      return false; // Hide Account if logged in
    }
    if (section.label === "Demo" && user) {
      return false; // Hide Demo if logged in
    }
    // Operations, Tasks, Workspace should show for BOTH authenticated AND demo users
    // Only filter them based on other conditions
    return true;
  });

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center gap-2 ${!sidebarOpen && "hidden"}`}>
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">
              FC
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-sm">FieldCost</span>
              <span className="text-xs text-gray-500">MVP</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Company Selector */}
        {user && companies.length > 0 && sidebarOpen && (
          <div className="p-4 border-b border-gray-200">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Active Workspace
            </label>
            <select
              value={activeCompanyId || ""}
              onChange={e => handleCompanySelect(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-50"
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                  {isDemoCompany(company.id) ? " [DEMO]" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleSections.map(section => (
            <div key={section.label} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded transition-colors ${
                  !sidebarOpen && "justify-center"
                }`}
                title={!sidebarOpen ? section.label : undefined}
              >
                <span className="text-lg">{section.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{section.label}</span>
                    {section.links.length > 0 && (
                      <span
                        className={`text-gray-400 transform transition-transform ${
                          expandedSections[section.label] ? "rotate-90" : ""
                        }`}
                      >
                        <ChevronRightIcon />
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Section Links */}
              {expandedSections[section.label] && sidebarOpen && (
                <div className="space-y-1 ml-8">
                  {section.links.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2 text-sm rounded transition-colors ${
                        pathname === link.href
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.text}
                    </Link>
                  ))}
                </div>
              )}

              {/* Collapsed icon-only display */}
              {expandedSections[section.label] && !sidebarOpen && section.links.length > 0 && (
                <div className="space-y-1 flex flex-col items-center">
                  {section.links.slice(0, 2).map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`p-2 rounded text-lg transition-colors ${
                        pathname === link.href ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      title={link.text}
                    >
                      {link.icon}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="border-t border-gray-200 p-4 space-y-2">
            {user && (
              <>
                <div className="px-3 py-2 text-xs">
                  <div className="text-gray-600 truncate">Signed in as</div>
                  <div className="font-medium text-gray-900 truncate">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded transition-colors"
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </>
            )}
            {!user && !isLoading && (
              <Link
                href="/auth/login"
                className="block px-3 py-2 text-sm text-center bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            )}
            {isLoading && (
              <div className="px-3 py-2 text-xs text-gray-500 text-center">Loading...</div>
            )}
          </div>
        )}
      </aside>
    );
  }
