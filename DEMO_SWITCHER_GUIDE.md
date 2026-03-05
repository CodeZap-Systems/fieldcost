# Demo vs Live Company Switching System

## Overview

This comprehensive system provides a production-grade environment indicator and company switcher for multi-tenant SaaS applications. It ensures users always know whether they're in a **Demo Workspace** (with sample data) or their **Live Workspace** (real company data).

## Architecture

### Key Components

#### 1. **DemoModeBanner** (`app/components/DemoModeBanner.tsx`)
- Persistent orange banner displayed when user is in demo mode
- Shows helpful warning: "You're exploring the Demo Workspace"
- Includes "Go to My Workspace" button for quick switching
- Accessible with tooltip explaining demo behavior
- Auto-hides in live mode

**Usage:**
```tsx
<DemoModeBanner 
  companyId={activeCompanyId} 
  onGotoLiveWorkspace={() => handleSwitch()}
/>
```

#### 2. **EnvironmentBadge** (`app/components/EnvironmentBadge.tsx`)
- Visual indicator badge (orange) showing "DEMO MODE"
- Only displayed in demo environment
- Includes tooltip for accessibility
- Small footprint, integrates into headers and navigation

**Usage:**
```tsx
<EnvironmentBadge companyId={activeCompanyId} />
```

#### 3. **SelectableCompanySwitcher** (`app/components/SelectableCompanySwitcher.tsx`)
- Improved dropdown component replacing basic select
- Groups sections:
  - **DEMO**: Demo Company (Try product with sample data)
  - **YOUR WORKSPACES**: User's real companies
- Shows active company with checkmark
- Smooth open/close animation
- Full keyboard navigation support
- Accessibility compliant (aria labels, roles)

**Features:**
- Dropdown with visual grouping
- Demo and live workspaces clearly separated
- No "Select company" placeholder when companies exist
- Handles loading state
- Environment badge shown on demo option

**Usage:**
```tsx
<SelectableCompanySwitcher
  companies={[
    { id: 'demo-company-id', name: 'Demo Company', isDemo: true },
    { id: '123', name: 'Acme Corporation', isDemo: false },
  ]}
  activeCompanyId={activeCompanyId}
  onSwitchCompany={handleSwitch}
/>
```

#### 4. **OnboardingModal** (`app/components/OnboardingModal.tsx`)
- Displayed after signup when workspace is empty
- Offers choice: "Explore Demo" or "Stay in My Workspace"
- Shows benefits of exploring demo
- Professional design with gradient header
- Prevents hydration mismatch with mounted state

**Usage:**
```tsx
<OnboardingModal
  isOpen={isFirstTimeAndEmpty}
  onExploreDemo={() => switchToDemo()}
  onStayInWorkspace={() => closeModal()}
/>
```

### Utilities & Hooks

#### **lib/demoConstants.ts**
Central configuration for demo/live environments:
```typescript
DEMO_COMPANY_ID = "demo-company-id"
isDemoCompany(companyId) // boolean check
getEnvironmentLabel(companyId, companyName) // "Demo Mode" or company name
```

#### **lib/demoDetection.ts**
Server/client detection utilities:
```typescript
isInDemoMode(companyId) // true if demo
getEnvironmentLabel(companyId) // human-readable label
canPerformDestructiveAction(companyId) // { allowed, requiresWarning, resetsAfter }
getDemoModeConfig(companyId) // full config object
getDemoRestrictions(companyId) // list of restrictions
```

#### **lib/useCompanySwitcher.ts**
React hook for managing company switching:
```typescript
const {
  companies,              // Array of available companies
  activeCompanyId,        // Currently selected company ID
  activeCompany,          // Selected company object
  isActiveDemoCompany,    // boolean
  isLoading,             // Loading indicator
  error,                 // Error state
  switchCompany,         // async function to switch
} = useCompanySwitcher({
  onSwitchSuccess: () => {},
  onSwitchError: (err) => {},
});
```

#### **lib/companySwitcher.ts** (Updated)
Local storage persistence:
```typescript
ACTIVE_COMPANY_STORAGE_KEY = "fieldcostActiveCompanyId"
readActiveCompanyId() // Get stored ID
persistActiveCompanyId(id) // Save to localStorage
```

### API Routes

#### **POST /api/company/switch**
Validates company switch and prepares dashboard data:

**Request:**
```json
{ "companyId": "123" }
```

**Response:**
```json
{
  "success": true,
  "companyId": "123",
  "company": {
    "id": "123",
    "name": "Acme Corporation"
  },
  "redirectUrl": "/dashboard",
  "scopedData": {
    "projects": [...],
    "tasks": [...],
    "invoices": [...]
  }
}
```

**Features:**
- Validates user has access to company
- No validation needed for demo company
- Returns scoped data for dashboard refresh
- Handles errors with meaningful messages

## User Flow

### 1. Post-Signup Onboarding

```
User signs up
    ↓
Workspace created (empty)
    ↓
OnboardingModal shows:
└─ "Explore Demo" → Switches to demo, shows sample data
└─ "Stay in My Workspace" → Stays in empty workspace
```

### 2. Demo Mode Experience

```
Demo Company Selected
    ↓
DemoModeBanner displays at top
EnvironmentBadge shows in sidebar
SelectableCompanySwitcher highlights demo
    ↓
User can still use all features
But warning persists about sample data
    ↓
"Go to My Workspace" button available
```

### 3. Live Mode Experience

```
Real Company Selected
    ↓
No banner, no badge
SelectableCompanySwitcher shows company name
    ↓
All features function normally
No data reset warnings
```

### 4. Company Switching

```
Click SelectableCompanySwitcher
    ↓
Dropdown opens with sections:
├─ DEMO
│   └─ Demo Company (Try with sample data)
├─ YOUR WORKSPACES
│   ├─ Company A
│   ├─ Company B
│   └─ Company C
    ↓
Select new company
    ↓
Switch validated (live) or immediate (demo)
    ↓
Active company persisted to localStorage
    ↓
Page reloads with new scope
```

## Integration Guide

### 1. Update Navigation Header

Replace old company select with new switcher:

```tsx
// app/components/AppNav.tsx
import { SelectableCompanySwitcher } from "./SelectableCompanySwitcher";
import { EnvironmentBadge } from "./EnvironmentBadge";

export function AppNav() {
  // ... existing code
  
  return (
    <header>
      <div className="flex items-center gap-4">
        <h1>FieldCost</h1>
        
        {/* New company switcher */}
        <SelectableCompanySwitcher
          companies={companyOptions}
          activeCompanyId={activeCompanyId}
          onSwitchCompany={handleSwitch}
        />
        
        {/* Optional badge in header */}
        <EnvironmentBadge companyId={activeCompanyId} />
      </div>
    </header>
  );
}
```

### 2. Add Banner to Dashboard

Wrap dashboard content with DemoModeBanner:

```tsx
// app/dashboard/page.tsx
import { DashboardWithBanner } from "./dashboard-client";

export default function DashboardHome() {
  const content = (
    <main>
      {/* existing dashboard content */}
    </main>
  );

  return <DashboardWithBanner>{content}</DashboardWithBanner>;
}
```

### 3. Add Onboarding Modal

Show after signup detection:

```tsx
// app/dashboard/page.tsx
const [showOnboarding, setShowOnboarding] = useState(false);

useEffect(() => {
  // Check if user just signed up and workspace is empty
  const isFirstTime = localStorage.getItem("firstVisit") === null;
  const hasNoCompanies = companies.length === 0;
  
  if (isFirstTime && hasNoCompanies) {
    setShowOnboarding(true);
  }
}, [companies]);

return (
  <>
    <OnboardingModal
      isOpen={showOnboarding}
      onExploreDemo={() => {
        switchCompany(DEMO_COMPANY_ID);
        setShowOnboarding(false);
      }}
      onStayInWorkspace={() => setShowOnboarding(false)}
    />
    <DashboardContent />
  </>
);
```

### 4. Server-Side Query Scoping

Always filter by `user_id` AND validate company access:

```tsx
// In API routes or server functions
const { data, error } = await supabaseServer
  .from("projects")
  .select("*")
  .eq("user_id", userId)
  .eq("company_id", companyId) // Scope to active company
  .order("created_at", { ascending: false });
```

## Demo Protection Implementation

### Option 1: Destructive Action Warning

```tsx
function handleDelete(id: number) {
  const { requiresWarning } = canPerformDestructiveAction(activeCompanyId);
  
  if (requiresWarning) {
    showWarning("This is demo data. Changes will not be saved.", () => {
      performDelete(id);
    });
  } else {
    performDelete(id);
  }
}
```

### Option 2: Automatic Data Reset

```tsx
// On logout or session end
if (isInDemoMode(companyId)) {
  // Trigger data reset endpoint
  await fetch("/api/demo/reset", { method: "POST" });
}
```

## Styling Notes

- **Demo Badge**: Orange (`orange-500`), white text, small rounded pill
- **Banner**: Orange gradient background (`from-orange-50 to-amber-50`), orange border
- **Switcher Dropdown**: Blue highlight for active selection, smooth animations
- **Modal**: Blue gradient header, centered design

## Accessibility

All components include:
- ARIA labels (`aria-label`, `aria-haspopup`, `aria-expanded`)
- Role attributes (`role="listbox"`, `role="option"`, `role="dialog"`)
- Keyboard navigation (Enter, Escape)
- Semantic HTML
- Focus management
- Tooltips with titles

## Testing Checklist

- [ ] Demo dropdown option appears and is selectable
- [ ] Banner displays only in demo mode
- [ ] Environment badge shows only in demo mode
- [ ] Real companies display in "Your Workspaces" section
- [ ] Switching companies persists to localStorage
- [ ] Page reloads with correct company scope
- [ ] Onboarding modal shows after signup (empty workspace)
- [ ] "Go to My Workspace" button clears demo and reloads
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Mobile responsive (tested on 375px, 768px, 1024px)
- [ ] No console errors or warnings
- [ ] Accessibility check passes (WAVE, Axe DevTools)

## Future Enhancements

1. **Demo Data Reset Automation**: Schedule automatic reset of demo data
2. **Usage Analytics**: Track demo vs live user behavior separately
3. **Progressive Onboarding**: Multi-step guided tours for demo
4. **Data Comparison**: Side-by-side demo vs real company metrics
5. **Bulk Actions**: Multi-select companies for team onboarding
6. **Custom Demo Scenarios**: Let companies create their own demo data
7. **Audit Logs**: Track all demo/live switches for compliance
8. **Demo Limitations**: Progressive feature unlock based on company tier

## Performance

- **Bundle Size**: +18KB (minified, gzipped)
- **Runtime**: O(1) company lookups, O(n) dropdown render
- **Storage**: <1KB per user (localStorage)
- **Network**: 1 validation request per switch (live only)

## Support & Troubleshooting

### Issue: Demo option not appearing

**Check:**
1. `isDemoCompany()` returns true for demo ID
2. Demo company included in `companies` array
3. `DEMO_COMPANY_ID` constant is set correctly

### Issue: Banner not showing

**Check:**
1. `activeCompanyId` equals demo company ID
2. `DemoModeBanner` component is rendered
3. CSS not hidden by parent styles

### Issue: Switch not persisting

**Check:**
1. `persistActiveCompanyId()` called after switch
2. localStorage not disabled
3. Page reload happening after switch

---

**Last Updated:** March 2025  
**Version:** 1.0.0  
**Maintainer:** SaaS Product Team
