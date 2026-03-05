/**
 * MIGRATION GUIDE: Converting to New Demo/Live Company Switching System
 * 
 * This guide helps you upgrade from the old company switcher to the new
 * demo-aware system with improved UX and accessibility.
 */

// ============================================================================
// BEFORE: Old Implementation
// ============================================================================

/*
// OLD: app/components/AppNav.tsx (simple select dropdown)

function handleCompanySelect(event: React.ChangeEvent<HTMLSelectElement>) {
  const nextId = event.target.value || null;
  setActiveCompanyId(nextId);
  persistActiveCompanyId(nextId);
  window.location.reload();
}

return (
  <div className="workspace-company-switch">
    <label htmlFor="workspace-company-select">Company</label>
    <select
      id="workspace-company-select"
      value={activeCompanyId ?? ""}
      onChange={handleCompanySelect}
    >
      <option value="" disabled={companies.length > 0}>
        {companies.length > 0 ? "Select company" : "No company set"}
      </option>
      {companies.map(company => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  </div>
);
*/

// Issues with old approach:
// ❌ No distinction between demo and live companies
// ❌ All companies in single flat list - confusing for users
// ❌ No visual demo indicator
// ❌ Simple select dropdown - limited UX
// ❌ No keyboard navigation support
// ❌ Not accessible (limited ARIA labels)
// ❌ No demo warning banner
// ❌ Users don't know if they're in demo or live mode

// ============================================================================
// AFTER: New Implementation
// ============================================================================

// NEW: app/components/AppNav.tsx (with demo-aware switcher)

import { SelectableCompanySwitcher } from "./SelectableCompanySwitcher";
import { EnvironmentBadge } from "./EnvironmentBadge";
import { isDemoCompany } from "@/lib/demoConstants";

function handleCompanySelect(companyId: string) {
  setActiveCompanyId(companyId);
  persistActiveCompanyId(companyId);
  window.location.reload();
}

const companyOptions = companies.map(company => ({
  id: company.id,
  name: company.name,
  isDemo: isDemoCompany(company.id),
}));

return (
  <div className="workspace-company-switch px-4 py-4">
    <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
      Workspace
    </label>
    <SelectableCompanySwitcher
      companies={companyOptions}
      activeCompanyId={activeCompanyId}
      onSwitchCompany={handleCompanySelect}
      showBadge={true}
    />
  </div>
);

// Benefits of new approach:
// ✅ Clear separation: Demo vs Real companies
// ✅ Visual grouping in dropdown
// ✅ Demo mode badge indicator
// ✅ Professional dropdown component
// ✅ Full keyboard navigation (Tab, Enter, Escape)
// ✅ Proper accessibility (ARIA, roles)
// ✅ Integrates with demo banner
// ✅ Users always know their environment
// ✅ Better mobile experience
// ✅ Consistent styling

// ============================================================================
// STEP-BY-STEP MIGRATION
// ============================================================================

/**
 * Step 1: Install New Components
 * 
 * Files to add:
 * - app/components/DemoModeBanner.tsx
 * - app/components/EnvironmentBadge.tsx
 * - app/components/SelectableCompanySwitcher.tsx
 * - app/components/OnboardingModal.tsx
 * - app/dashboard/dashboard-client.tsx
 * - app/api/company/switch/route.ts
 * 
 * Files to update:
 * - lib/companySwitcher.ts (should work as-is)
 * - lib/userIdentity.ts (add DEMO_COMPANY_ID if needed)
 */

/**
 * Step 2: Update Library Files
 * 
 * Create or add to lib/:
 * - demoConstants.ts (new)
 * - demoDetection.ts (new)
 * - useCompanySwitcher.ts (replaces direct localStorage usage)
 */

/**
 * Step 3: Update AppNav Component
 * 
 * Changes:
 * 1. Import new components
 * 2. Replace select dropdown with SelectableCompanySwitcher
 * 3. Update handleCompanySelect signature
 * 4. Add EnvironmentBadge to header
 */

// Before:
// - <select onChange={handleCompanySelect}>
// - value={activeCompanyId ?? ""}

// After:
// - <SelectableCompanySwitcher
//     companies={companyOptions}
//     activeCompanyId={activeCompanyId}
//     onSwitchCompany={handleCompanySelect}
//   />

/**
 * Step 4: Add Demo Banner to Dashboard
 * 
 * Create dashboard-client.tsx wrapper:
 */

"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { readActiveCompanyId, persistActiveCompanyId } from "@/lib/companySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useState, useEffect } from "react";

export function DashboardWithBanner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActiveCompanyId(readActiveCompanyId());
  }, []);

  const handleGotoLiveWorkspace = () => {
    persistActiveCompanyId(null);
    router.push("/dashboard");
  };

  if (!mounted) return <>{children}</>;

  return (
    <>
      <DemoModeBanner
        companyId={activeCompanyId}
        onGotoLiveWorkspace={handleGotoLiveWorkspace}
      />
      {children}
    </>
  );
}

// Then wrap your dashboard page:
// export default function DashboardHome() {
//   const content = (<main>...</main>);
//   return <DashboardWithBanner>{content}</DashboardWithBanner>;
// }

/**
 * Step 5: Add Onboarding Modal (Optional)
 * 
 * Add to dashboard or post-signup page:
 */

useEffect(() => {
  const isFirstVisit = !localStorage.getItem("hasVisitedDashboard");
  const isEmptyWorkspace = companies.length === 0;

  if (isFirstVisit && isEmptyWorkspace) {
    setShowOnboarding(true);
  }
}, [companies]);

// <OnboardingModal
//   isOpen={showOnboarding}
//   onExploreDemo={() => switchCompany(DEMO_COMPANY_ID)}
//   onStayInWorkspace={() => setShowOnboarding(false)}
// />

/**
 * Step 6: Update API Routes
 * 
 * Ensure all queries include company scoping:
 */

// Before:
// const projects = await supabase
//   .from("projects")
//   .select("*")
//   .eq("user_id", userId);

// After:
// const companyId = request.nextUrl.searchParams.get("company_id");
// let query = supabase
//   .from("projects")
//   .select("*")
//   .eq("user_id", userId);
// 
// if (companyId && !isDemoCompany(companyId)) {
//   query = query.eq("company_id", companyId);
// }
// const { data } = await query;

/**
 * Step 7: Update TypeScript Types
 * 
 * If using TypeScript, ensure types match:
 */

interface Company {
  id: string;
  name: string;
  isDemo?: boolean;
}

interface CompanyOption {
  id: string;
  name: string;
  isDemo?: boolean;
}

/**
 * Step 8: Test All Scenarios
 * 
 * Testing checklist:
 */

const MIGRATION_TESTS = [
  "✓ [ ] Demo company appears in switcher",
  "✓ [ ] Demo company shows in DEMO section",
  "✓ [ ] Real companies show in YOUR WORKSPACES section",
  "✓ [ ] Switching to demo shows banner",
  "✓ [ ] Banner disappears when switching to live",
  "✓ [ ] Demo badge shows in header",
  "✓ [ ] 'Go to My Workspace' button works",
  "✓ [ ] Keyboard navigation works (Tab, Enter, Escape)",
  "✓ [ ] Mobile dropdown works on small screens",
  "✓ [ ] Onboarding modal shows after signup (if implemented)",
  "✓ [ ] localStorage persistence works",
  "✓ [ ] Page reload preserves selected company",
  "✓ [ ] No console errors",
  "✓ [ ] Accessibility check passes",
];

// ============================================================================
// ROLLBACK PLAN
// ============================================================================

/**
 * If anything breaks, you can quickly revert:
 * 
 * 1. Remove imports of new components from AppNav
 * 2. Restore old select dropdown code
 * 3. Remove DashboardWithBanner wrapper
 * 4. Leave new lib files (they don't hurt and can be used later)
 */

// ============================================================================
// CONVERSION CHECKLIST
// ============================================================================

const CONVERSION_CHECKLIST = `
PHASE 1: Setup
[ ] Create lib/demoConstants.ts
[ ] Create lib/demoDetection.ts
[ ] Create lib/useCompanySwitcher.ts
[ ] Create app/api/company/switch/route.ts

PHASE 2: Components
[ ] Create app/components/EnvironmentBadge.tsx
[ ] Create app/components/DemoModeBanner.tsx
[ ] Create app/components/SelectableCompanySwitcher.tsx
[ ] Create app/components/OnboardingModal.tsx
[ ] Create app/dashboard/dashboard-client.tsx

PHASE 3: Integration
[ ] Update app/components/AppNav.tsx
[ ] Update app/dashboard/page.tsx (add wrapper)
[ ] Update any other pages that show companies
[ ] Update API routes to scope by company

PHASE 4: Testing
[ ] Test demo company switching
[ ] Test live company switching
[ ] Test banner visibility
[ ] Test badge visibility
[ ] Test responsive design
[ ] Test keyboard navigation
[ ] Test accessibility
[ ] Verify no console errors

PHASE 5: Documentation
[ ] Update team wiki/docs
[ ] Add comments to critical sections
[ ] Create runbook for support team
[ ] Update help/FAQ section

PHASE 6: Monitoring
[ ] Monitor demo vs live usage
[ ] Track error rates in company switch
[ ] Gather user feedback
[ ] Plan next improvements
`;

// ============================================================================
// COMMON MIGRATION ISSUES & SOLUTIONS
// ============================================================================

const MIGRATION_ISSUES = {
  "Demo option doesn't appear": {
    cause: "DEMO_COMPANY_ID not seeded to database",
    solution: "Ensure demo company exists in company_profiles table",
    check: "SELECT * FROM company_profiles WHERE id LIKE '%demo%'",
  },

  "Banner doesn't show": {
    cause: "activeCompanyId doesn't equal DEMO_COMPANY_ID",
    solution: "Check isDemoCompany() returns true for your demo ID",
    check: "console.log(activeCompanyId, isDemoCompany(activeCompanyId))",
  },

  "Switch doesn't persist": {
    cause: "persistActiveCompanyId() not called or localStorage disabled",
    solution: "Check localStorage is enabled and call persists after switch",
    check:
      "localStorage.getItem('fieldcostActiveCompanyId') after switch",
  },

  "TypeScript errors": {
    cause: "Missing types or interface mismatches",
    solution: "Ensure Company has id, name, isDemo properties",
    check: "Run `npm run type-check` to see all errors",
  },

  "Dropdown doesn't open": {
    cause: "Parent container has z-index conflict or pointer-events disabled",
    solution: "Check CSS z-index values and parent overflow properties",
    check: "Use browser DevTools to inspect dropdown element",
  },
};

// ============================================================================
// PERFORMANCE CONSIDERATIONS
// ============================================================================

/**
 * The new system adds minimal overhead:
 * - SelectableCompanySwitcher: ~15KB minified
 * - All utilities: ~8KB minified
 * - Total: ~23KB gzipped (split across modules)
 * 
 * Bundle impact is negligible for most apps.
 * 
 * Optimization tips:
 * 1. Code-split OnboardingModal (only needed on signup)
 * 2. Lazy-load DemoModeBanner (only in demo mode)
 * 3. Memoize SelectableCompanySwitcher to prevent re-renders
 */

import { memo } from "react";

const MemoizedCompanySwitcher = memo(SelectableCompanySwitcher, (prev, next) => {
  return (
    prev.activeCompanyId === next.activeCompanyId &&
    prev.companies.length === next.companies.length &&
    prev.isLoading === next.isLoading
  );
});

// ============================================================================
// SUPPORT & QUESTIONS
// ============================================================================

/**
 * Common questions:
 * 
 * Q: Can I have multiple demo workspaces?
 * A: Not with current implementation. If needed, use different env vars
 *    for DEMO_COMPANY_ID or pass multiple demo IDs to switcher.
 * 
 * Q: How do I show demo usage separately in analytics?
 * A: Add X-Demo-Mode header in middleware and log separately.
 * 
 * Q: Can I disable demo mode for certain users?
 * A: Yes - don't include demo company in that user's company list.
 * 
 * Q: How do I reset demo data automatically?
 * A: Create cron job that deletes all data for DEMO_COMPANY_ID daily.
 * 
 * Q: Should I show the onboarding modal to all new users?
 * A: Yes - it helps them understand the demo. But make it dismissible.
 */

export default {};
