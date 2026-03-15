# FieldCost Tier 2 Demo Checklist

## Pre-Demo Setup (5 minutes)

### 1. Run Demo Data Seeding
```bash
node scripts/seed-demo-data.mjs
```

This creates:
- 3 Sample Customers (Acme Construction, BuildMaster, Urban Development)
- 3 Sample Suppliers (BuildCo, Premium Materials, Equipment Rentals)
- 3 Sample Projects (Sandton Mall, Waterfront Office, Residential Estate)
- 8 Sample Items/Materials
- 3 Sample Quotes (various statuses)
- 3 Sample Purchase Orders (various statuses)
- 2 Sample GRNs (Goods Received Notes)

### 2. Start the Dev Server
```bash
npm run dev
```

Then navigate to: **http://localhost:3000**

---

## Demo Flow (50 minutes)

### Phase 1: Authentication & Navigation (5 minutes)

**URL:** `http://localhost:3000/auth/demo-login`

**Demo Points:**
- Show demo login feature
- Explain role-based access control (Admin, User, Subcontractor)
- Navigate to Tier 2 Dashboard

---

### Phase 2: Quotations Module (15 minutes)

**Navigation:** Dashboard → Quotes

#### Demo These Features:

1. **Quote List View**
   - Show list of all quotes created (3 total)
   - Filter by status: Draft, Sent, Accepted
   - Status indicators with colors
   - Created date and valid until dates

2. **Create New Quote**
   - Click "New Quote"
   - Select customer (Acme Construction Ltd)
   - Select project (Sandton Shopping Mall)
   - Add line items (steel beams, labor, etc.)
   - Current pricing calculated automatically
   - **Highlight:** Auto-calculation of totals

3. **Quote Status Workflow**
   - Draft Quote → Click "Send to Customer" → Status changes to Sent
   - Show sent date tracked automatically
   - Show that sent quotes can't be edited

4. **Quote Details**
   - Click on sent quote to view details
   - Show line items breakdown
   - Show total amount clearly
   - Show customer contact info and project details

---

### Phase 3: Suppliers Management (10 minutes)

**Navigation:** Dashboard → Suppliers

#### Demo These Features:

1. **Supplier Master Database**
   - Show 3 suppliers in list
   - **Display Fields:**
     - Supplier name
     - Contact person
     - Email & Phone
     - City/Location
     - Rating (1-5 stars)
     - Payment terms

2. **Supplier Details**
   - Click on "BuildCo Supply Chain"
   - Show complete supplier profile:
     - Full address information
     - Tax ID
     - Contact details
     - Payment terms
     - Rating history

3. **Add New Supplier**
   - Click "Add Supplier"
   - Fill in supplier details
   - **Highlight:** Multi-field form with validation
   - **Highlight:** Auto-save and company isolation

---

### Phase 4: Purchase Orders (20 minutes)

**Navigation:** Dashboard → Purchase Orders

#### Demo These Features:

1. **PO List View**
   - Show all 3 purchase orders
   - Filter by status:
     - Draft
     - Sent to Supplier
     - Confirmed
     - Fully Received
     - Invoiced
   - **Highlight:** PO Status Workflow

2. **Create PO from Scratch**
   - Click "New PO"
   - Select supplier (Premium Materials Ltd)
   - Select project (Waterfront Office)
   - Add line items (copper wiring, electrical panels)
   - Set delivery dates
   - **Highlight:** Amount auto-calculation
   - Save as Draft

3. **PO Lifecycle Demo**
   - Open the newly created PO
   - Show Edit button (draft only)
   - Click "Send to Supplier"
   - Show status change to "Sent"
   - Show sent date logged
   - **Highlight:** Audit trail of status changes

4. **Completed PO Example**
   - Open a "Fully Received" PO
   - Show:
     - PO reference number
     - Supplier details
     - Line items with quantities ordered
     - Delivery date
     - Status journey (Draft → Sent → Confirmed → Received)
   - **Highlight:** Complete audit trail with dates

---

### Phase 5: Goods Received Notes (GRN) (10 minutes)

**Navigation:** Dashboard → Purchase Orders → Select Completed PO → View GRNs

#### Demo These Features:

1. **GRN Creation from PO**
   - Show a PO with status "Fully Received"
   - Click "View GRNs" or "Add GRN"
   - Show GRN form fields:
     - GRN Reference (auto-generated)
     - Received Date
     - Received By (person name)
     - Delivery Reference
     - Checked By (person name)

2. **GRN Details**
   - Show GRN linked to PO
   - Display items received and quantities
   - Show receipt confirmation
   - **Highlight:** Track what was actually received vs ordered

3. **Multi-GRN Support**
   - Show 2 GRNs for same PO
   - Explain partial deliveries
   - Show accumulation of received quantities

---

### Phase 6: Data Isolation & Multi-Tenancy (5 minutes)

**Concept Demo (no UI needed, explain verbally):**

- Explain that system supports multiple companies
- Each company sees only their own data
- Demo user belongs to company ID 8
- All demo data is scoped to this company
- **Security Feature:** User cannot access data from other companies
- **Production Readiness:** System enforces strict company_id checks

---

## Key Features to Highlight

### ✨ **New Tier 2 Capabilities:**

1. **Document Management**
   - Quote workflow: Draft → Sent → Accepted
   - PO workflow: Draft → Sent → Confirmed → Received → Invoiced
   - Complete audit trails with timestamps

2. **Multi-tier Approval**
   - Quotes require customer acceptance
   - Purchase orders track supplier confirmation
   - GRNs verify actual receipt

3. **Financial Tracking**
   - Quote amounts automatically calculated
   - PO amounts tracked
   - GRN quantities matched against orders

4. **Supplier Management**
   - Complete vendor database
   - Rating system
   - Payment term tracking
   - Contact information

5. **Project Integration**
   - Quotes linked to projects
   - POs linked to projects
   - Full traceability of project costs

6. **Real-time Calculations**
   - Line item totals (Qty × Rate)
   - Document totals
   - Received vs ordered amounts

---

## Demo Tips & Tricks

### Before Demo Starts:
- [ ] Ensure server is running on localhost:3000
- [ ] Demo data is seeded (run script)
- [ ] Browser is logged in as demo user
- [ ] Practice the flow above

### During Demo:
- **Pace:** Allow 5-7 seconds for screen transitions
- **Focus:** Keep cursor moving to key fields/buttons
- **Narrate:** Explain what's happening as you click
- **Pause at Statuses:** Emphasize the workflow and status tracking
- **Ask Questions:** Engage client by asking if they want to see details

### Key Talking Points:
1. "This system prevents manual spreadsheets and errors"
2. "Complete audit trail for compliance and accountability"
3. "Automatic calculations eliminate math errors"
4. "Multi-level workflow with status tracking"
5. "Your suppliers can receive updates about orders"
6. "Full financial tracking from quote to receipt"

---

## Time Allocation

- **Setup:** 5 min (seeding + navigation)
- **Auth:** 2 min (login demo)
- **Quotes:** 12 min (list, create, workflow, details)
- **Suppliers:** 8 min (list, details, add new)
- **Purchase Orders:** 18 min (list, create, workflow, completed example)
- **GRN:** 8 min (creation, multi-GRN, tracking)
- **Data Isolation:** 3 min (security concept)
- **Q&A:** 4 min (client questions)

**Total: ~60 minutes**

---

## Fallback Options

If something doesn't load:

1. **Refresh Page:** Ctrl+Shift+R (hard refresh)
2. **Check Console:** F12 → Console (look for red errors)
3. **Restart Server:** Kill and restart `npm run dev`
4. **Reseed Data:** Run `node scripts/seed-demo-data.mjs` again
5. **Clear Cache:** Go to Application tab → Storage → Clear all

---

## Post-Demo

### What to Mention:
- "This is version 1.0 of Tier 2 - more features coming"
- "Data is secured with role-based access control"
- "Mobile apps are in development"
- "API available for ERP integrations"
- "Customization available for larger deployments"

### Next Steps:
- Collect feedback on feature gaps
- Discuss pricing tiers
- Explain training and onboarding process
- Set up production environment timeline
