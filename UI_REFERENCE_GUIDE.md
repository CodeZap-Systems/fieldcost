# UI Reference Guide - Demo vs Live Company Switching

## Visual Mockups and Layout Reference

### 1. Demo Mode Banner (Sticky at Top)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ! You're exploring the Demo Workspace. Changes will not affect a real...     │
│   This is sample data to help you explore the product. No real companies     │
│                                                  [Go to My Workspace] [?]    │
└─────────────────────────────────────────────────────────────────────────────┘
   ↑                                                                            ↑
   Orange gradient background (from-orange-50 to-amber-50)
   Orange icon indicator
```

**Color Palette:**
- Background: `from-orange-50 to-amber-50`
- Border: `border-orange-200`
- Text: `text-gray-900` (primary), `text-gray-600` (secondary)
- Button: `bg-orange-600 hover:bg-orange-700` (text-white)

---

### 2. Sidebar Navigation Header

```
┌────────────────────────────────────────┐
│  FieldCost MVP         [DEMO MODE]     │ ← Environment badge (orange)
├────────────────────────────────────────┤
│ Workspace                              │ ← Label
│ [Demo Company ▼]                       │ ← Company switcher dropdown
├────────────────────────────────────────┤
│                                        │
│  Dashboard                             │
│  Projects                              │
│  Tasks                                 │
│  Invoices                              │
│  ...                                   │
```

**Demo Badge Style:**
```
┌─────────────────┐
│ DEMO MODE   ●  │ ← Orange pill badge
└─────────────────┘
bg-orange-500
text-white
text-xs font-semibold
rounded-full px-2.5 py-1
```

---

### 3. Company Switcher Dropdown (Closed)

```
┌────────────────────────────────────────┐
│ [Demo Company ▼] [DEMO MODE]          │  ← Button with badge
└────────────────────────────────────────┘
 
Desktop width: max-w-xs (320px)
Font: text-sm font-medium
Border: border-gray-300
Hover: bg-gray-50
```

---

### 4. Company Switcher Dropdown (Open)

```
┌────────────────────────────────────────┐
│ [Demo Company ▲]                       │  ← Button toggled
├────────────────────────────────────────┤
│ DEMO                                   │  ← Section header (gray-50)
├────────────────────────────────────────┤
│ ✓ Demo Company                         │  ← Active option (blue highlight)
│   Try product with sample data         │     blue-50 bg, blue-700 text
├────────────────────────────────────────┤
│ YOUR WORKSPACES                        │  ← Section header (gray-50)
├────────────────────────────────────────┤
│ • Acme Corporation                     │  ← Inactive option
├────────────────────────────────────────┤
│ • Smith & Associates                   │
├────────────────────────────────────────┤
│   Company X (with more...)             │
└────────────────────────────────────────┘

Active option styling:
- Background: bg-blue-50
- Text: text-blue-700
- Border left: border-l-2 border-blue-500
- Checkmark: text-blue-500

Inactive option styling:
- Background: transparent
- Text: text-gray-700
- Hover: bg-gray-50
- No checkmark
```

**Demo Company Option (More Detail):**
```
┌─────────────────────────────────────┐
│ Demo Company                         │ ← Primary text (font-medium)
│ Try product with sample data         │ ← Helper text (text-xs text-gray-500)
│                             ✓        │ ← Checkmark if active
└─────────────────────────────────────┘
```

---

### 5. Full Layout - Demo Mode Active

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [!] You're exploring the Demo Workspace. Changes don't affect real ones    │ ← Banner
│                                                       [Go to My Workspace] │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┬─────────────────────────────────────────────────────┐
│                      │                                                     │
│ FieldCost MVP        │                                                     │
│ [DEMO MODE]          │   Main Content Area                                 │
│                      │                                                     │
│ [Demo Company ▼]     │   Dashboard / Projects / etc.                      │
│                      │                                                     │
│ Workspace            │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ ├─ Dashboard         │   │ Card 1      │ │ Card 2      │ │ Card 3      │ │
│ ├─ Projects          │   │             │ │             │ │             │ │
│ ├─ Tasks             │   └─────────────┘ └─────────────┘ └─────────────┘ │
│ ├─ Invoices          │                                                     │
│ └─ Reports           │                                                     │
│                      │                                                     │
└──────────────────────┴─────────────────────────────────────────────────────┘
```

---

### 6. Full Layout - Live Mode Active

```
(No Banner)

┌──────────────────────┬─────────────────────────────────────────────────────┐
│                      │                                                     │
│ FieldCost MVP        │                                                     │
│ (No badge)           │   Main Content Area                                 │
│                      │                                                     │
│ [Acme Corp ▼]        │   Dashboard / Projects / etc.                      │
│                      │                                                     │
│ Workspace            │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ ├─ Dashboard         │   │ Card 1      │ │ Card 2      │ │ Card 3      │ │
│ ├─ Projects          │   │             │ │             │ │             │ │
│ ├─ Tasks             │   └─────────────┘ └─────────────┘ └─────────────┘ │
│ ├─ Invoices          │                                                     │
│ └─ Reports           │   (User data, not demo)                            │
│                      │                                                     │
└──────────────────────┴─────────────────────────────────────────────────────┘
```

---

### 7. Onboarding Modal (Post-Signup)

```
                    ┌─────────────────────────────┐
                    │  Welcome to FieldCost!      │ ← Blue gradient header
                    │  Your workspace is ready.   │
                    │  Let's explore how...       │
                    ├─────────────────────────────┤
                    │                             │
                    │          [Lightning icon]   │ ← ⚡ in blue circle
                    │                             │
                    │ Want to see how it works    │
                    │ with sample data?           │
                    │                             │
                    │ Try the Demo Workspace:     │
                    │ ✓ See projects, tasks...   │
                    │ ✓ Explore all features...  │
                    │ ✓ Switch to your...        │
                    │                             │
                    │ [EXPLORE DEMO]              │ ← Blue button (primary CTA)
                    │ [STAY IN MY WORKSPACE]      │ ← White button with border
                    │                             │
                    │ You can switch between...   │ ← Small footer note
                    │ demo and your workspace     │
                    │ anytime from the sidebar.   │
                    │                             │
                    └─────────────────────────────┘

Colors:
- Header: bg-gradient-to-r from-blue-600 to-blue-700
- Icon circle: bg-blue-100
- Primary button: bg-blue-600 hover:bg-blue-700
- Secondary button: border border-gray-300 bg-white
- Benefits: text-orange-50 border-orange-100
```

---

### 8. Mobile View - Company Switcher

```
Small Screen (375px):

┌─────────────────────┐
│ FieldCost  [DEMO]   │
│                     │
│ [Demo Company ▼]    │  ← Full width dropdown
│                     │
│ When open:          │
│                     │
│ ┌─────────────────┐ │
│ │ DEMO            │ │
│ ├─────────────────┤ │
│ │ ✓ Demo Company  │ │
│ │   Sample data   │ │
│ ├─────────────────┤ │
│ │ YOUR WORKSPACES │ │
│ ├─────────────────┤ │
│ │ Acme Corp       │ │
│ ├─────────────────┤ │
│ │ Smith Assoc.    │ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```

---

### 9. Environment Badge - Variations

```
Style 1: In Sidebar
─────────────────
[FieldCost MVP] [DEMO MODE]
                (orange pill smaller)

Style 2: In Dropdown
─────────────────
[Demo Company ▼] [DEMO MODE]
(shown in button area)

Style 3: In Header Navigation
─────────────────
Company: Demo Company
Status: [DEMO MODE]

All variations:
- Orange background (orange-500)
- White text
- Small font (text-xs)
- Rounded pill shape (rounded-full)
- Centered dot indicator
```

---

### 10. Color Reference

**Primary Palette:**
```
Demo Mode Colors:
├─ Orange-500:      #f97316 (Badge background)
├─ Orange-50:       #fff7ed (Banner background starts)
├─ Amber-50:        #fffbeb (Banner background ends - gradient)
├─ Orange-100:      #ffedd5 (Light background)
├─ Orange-200:      #fed7aa (Border)
├─ Orange-400:      #fb923c (Hover states)
├─ Orange-600:      #ea580c (Darker for buttons)
└─ Orange-700:      #c2410c (Darkest for hover)

Live Mode Colors:
├─ Blue-500:        #3b82f6 (Active indicators)
├─ Blue-50:         #eff6ff (Active option background)
├─ Blue-600:        #2563eb (Button backgrounds)
├─ Blue-700:        #1d4ed8 (Button hover)
├─ Gray-50:         #f9fafb (Section headers)
├─ Gray-300:        #d1d5db (Borders)
├─ Gray-600:        #4b5563 (Labels)
└─ Gray-900:        #111827 (Primary text)
```

---

### 11. State Variations

**Dropdown Button States:**
```
Normal (closed):
┌─────────────────────┐
│ Demo Company    ▼   │ Gray border, text-gray-900
└─────────────────────┘

Hover (closed):
┌─────────────────────┐
│ Demo Company    ▼   │ Light gray background (bg-gray-50)
└─────────────────────┘

Focus (closed):
┌─────────────────────┐
│ Demo Company    ▼   │ Blue ring (ring-2 ring-blue-500)
└─────────────────────┘

Open:
┌─────────────────────┐
│ Demo Company    ▲   │ Chevron rotated 180°
├─────────────────────┤
│ (dropdown list)     │
└─────────────────────┘

Loading:
┌─────────────────────┐
│ Loading...      ▼   │ Reduced opacity, disabled
└─────────────────────┘
```

---

### 12. Responsive Breakpoints

```
─────────────────────────────────────────────

Mobile (320px - 639px):
├─ Full width dropdown
├─ Stacked layout
├─ Banner text truncated
├─ Touchable tap targets (48px min)
└─ Single column grid

─────────────────────────────────────────────

Tablet (640px - 1023px):
├─ Sidebar visible (~260px)
├─ Grid 2 columns
├─ Full banner text visible
├─ Modal centered with padding
└─ Dropdown full width switcher

─────────────────────────────────────────────

Desktop (1024px+):
├─ Full sidebar layout
├─ Grid 3-4 columns
├─ Full spacing and padding
├─ Hover effects active
├─ Tooltips visible
└─ All features visible

─────────────────────────────────────────────
```

---

### 13. Accessibility Focus Indicators

```
When using keyboard navigation:

Button:
────────
[Demo Company ▼]
├─ Blue outline (focus:ring-2 focus:ring-blue-500)
├─ 2px offset (focus:ring-offset-2)
└─ Visible in light/dark mode

Dropdown Option:
────────
│ ✓ Demo Company │
├─ Highlighted background
├─ Text clearly visible
└─ Checkmark shows selection

All focus indicators:
├─ Minimum 2px contrast ratio 3:1
├─ Clear outline, not hidden
└─ Remains visible against all backgrounds
```

---

### 14. Demo Banner - Message Variations

**Full Message:**
```
You're exploring the Demo Workspace. Changes will not affect a real company.
This is sample data to help you explore the product.
```

**Mobile Shortened:**
```
Demo Workspace. Changes won't affect real companies.
Sample data to explore the product.
```

**With Icon:**
```
[!] You're exploring...
    This is sample data...
```

---

### 15. Animation & Transitions

```
Company Switcher:
├─ Dropdown open: 150ms ease-in
├─ Chevron rotate: 180° in 150ms
├─ Hover states: 200ms color transition
└─ Option selection: Instant highlight

Banner:
├─ Slide in from top: 300ms ease-out
├─ Button hover: Color 150ms ease
└─ Focus ring: Immediate

Modal:
├─ Fade in: 200ms ease-out
├─ Scale from 95%: 200ms ease-out
└─ Slide buttons: Staggered 100ms each
```

---

## Implementation Checklist

Use this guide to verify your implementation:

- [ ] Demo banner appears at top in orange gradient
- [ ] Banner text matches exactly (or close)
- [ ] "Go to My Workspace" button is orange-600
- [ ] Environment badge is small orange pill in sidebar
- [ ] Company switcher drops down with sections
- [ ] DEMO section shows "Demo Company"
- [ ] YOUR WORKSPACES section shows real companies
- [ ] Active company has blue highlight + checkmark
- [ ] Colors match the palette exactly
- [ ] Spacing and padding consistent with brand
- [ ] Mobile layout responds correctly
- [ ] Focus indicators visible for keyboard nav
- [ ] Hover states work smoothly
- [ ] No layout shifts when banner appears/disappears
- [ ] Modal centers correctly on all screen sizes

---

**Last Updated:** March 5, 2025
