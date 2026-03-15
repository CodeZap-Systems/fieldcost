# FieldCost Demo Data Reference Card

## Quick Launch
```bash
# Terminal 1: Seed demo data
node scripts/seed-demo-data.mjs

# Terminal 2: Start server
npm run dev

# Navigate to http://localhost:3000
```

---

## Demo Credentials

**URL:** http://localhost:3000/auth/demo-login

| Field | Value |
|-------|-------|
| **Demo Access** | Demo user automatically created |
| **Company** | Demo Company (ID: 8) |
| **User ID** | e66081a8-af72-5722-8cce-e3a996196ad2 |

---

## Sample Customers

| # | Name | Email | Contact |
|---|------|-------|---------|
| 1 | **Acme Construction Ltd** | contact@acmeconstruction.co.za | - |
| 2 | **BuildMaster Properties** | info@buildmaster.co.za | - |
| 3 | **Urban Development Corp** | sales@urbandevelopment.co.za | - |

---

## Sample Suppliers

| # | Name | Contact | City | Rating | Payment Terms |
|---|------|---------|------|--------|----------------|
| 1 | **BuildCo Supply Chain** | John Mthembu | Johannesburg | ⭐ 4.8 | Net 30 |
| 2 | **Premium Materials Ltd** | Sarah Nkomo | Cape Town | ⭐ 4.5 | Net 15 |
| 3 | **Equipment Rentals SA** | Michael van der Merwe | Pretoria | ⭐ 4.2 | Per Invoice |

---

## Sample Projects

| # | Name | Description | Company |
|---|------|-------------|---------|
| 1 | **Sandton Shopping Mall Renovation** | Complete renovation with utilities | Demo Co |
| 2 | **Waterfront Office Complex** | 15-story office building | Demo Co |
| 3 | **Residential Estate Development** | 50-unit estate with amenities | Demo Co |

---

## Sample Quotes

### Quote 1: Sandton Project
```
Reference:   QT-[timestamp]-001
Customer:    Acme Construction Ltd
Project:     Sandton Shopping Mall Renovation
Amount:      R 1,850,000
Status:      SENT ✓
Valid Until: 2026-04-15
Sent On:     Today

Line Items:
  • Steel Beams (150 tons @ R12,000/ton) = R1,800,000
  • Foundation Work (1 ea @ R50,000) = R50,000
```

### Quote 2: Waterfront Project
```
Reference:   QT-[timestamp]-002
Customer:    BuildMaster Properties
Project:     Waterfront Office Complex
Amount:      R 3,200,000
Status:      ACCEPTED ✓
Valid Until: 2026-04-20
Sent On:     Today
Accepted On: Today

Line Items:
  • Electrical Wiring (25 km @ R45,000/km) = R1,125,000
  • HVAC Systems (1 ea @ R2,500,000) = R2,500,000
  • Contingency (R75,000)
```

### Quote 3: Residential Project
```
Reference:   QT-[timestamp]-003
Customer:    Urban Development Corp
Project:     Residential Estate Development
Amount:      R 2,500,000
Status:      DRAFT
Valid Until: (Not set yet)

Line Items:
  (None yet - show creation during demo)
```

---

## Sample Purchase Orders

### PO 1: Steel Materials (Status: FULLY RECEIVED ✓)
```
Reference:       PO-[timestamp]-001
Supplier:        BuildCo Supply Chain
Project:         Sandton Shopping Mall Renovation
Total Amount:    R 1,800,000
Status:          FULLY RECEIVED ✓
Required By:     2026-04-01
Delivery Date:   2026-03-25

Line Items:
  • Steel Beams Grade S355 (150 tons @ R12,000) = R1,800,000
  • Bolts and Fasteners (5 boxes @ R12,000) = R60,000

GRNs:
  ✓ GRN-[timestamp]-001 (Received by James Siziba)
  ✓ GRN-[timestamp]-002 (Received by James Siziba)
```

### PO 2: Electrical Materials (Status: CONFIRMED)
```
Reference:       PO-[timestamp]-002
Supplier:        Premium Materials Ltd
Project:         Waterfront Office Complex
Total Amount:    R 2,200,000
Status:          CONFIRMED
Required By:     2026-03-30
Delivery Date:   (Pending)

Line Items:
  • Copper Wiring 10mm (50 km @ R35,000) = R1,750,000
  • Electrical Panels (8 ea @ R25,000) = R200,000
  • Accessories (R250,000)
```

### PO 3: Equipment Rental (Status: SENT TO SUPPLIER)
```
Reference:       PO-[timestamp]-003
Supplier:        Equipment Rentals SA
Project:         Residential Estate Development
Total Amount:    R 500,000
Status:          SENT TO SUPPLIER
Required By:     2026-04-10
Delivery Date:   (Not yet confirmed)

Line Items:
  • Excavator CAT 320 Rental (30 days @ R15,000/day) = R450,000
  • Delivery Fee (R50,000)
```

---

## Sample Items Available

| # | Item Name | Description |
|----|-----------|-------------|
| 1 | Steel Beams (per ton) | Structural steel |
| 2 | Concrete (per m³) | Ready-mix concrete |
| 3 | Brickwork (per 1000) | Quality bricks |
| 4 | Electrical Wiring (per km) | Heavy duty cable |
| 5 | Labour - Skilled (per day) | Construction workers |
| 6 | Excavator Rental (per day) | Heavy equipment |
| 7 | Architectural Consultation (per hour) | Design services |
| 8 | Safety Equipment Bundle | PPE and safety gear |

---

## Demo Flow Timestamps

| Time | Activity | Duration |
|------|----------|----------|
| 0:00 | Welcome & Overview | 2 min |
| 2:00 | Navigate Dashboard | 3 min |
| 5:00 | **QUOTES Demo** | 12 min |
| 17:00 | **SUPPLIERS Demo** | 8 min |
| 25:00 | **PURCHASE ORDERS Demo** | 18 min |
| 43:00 | **GRN Demo** | 8 min |
| 51:00 | Data Isolation & Security | 3 min |
| 54:00 | Q&A & Discussion | 6 min |
| 60:00 | **END** | |

---

## Status Color Codes

### Quotes
| Status | Color | Meaning |
|--------|-------|---------|
| Draft | Gray | Waiting to send |
| Sent | Blue | With customer |
| Accepted | Green | ✓ Customer agreed |
| Rejected | Red | ✗ Customer declined |

### Purchase Orders
| Status | Color | Meaning |
|--------|-------|---------|
| Draft | Gray | Work in progress |
| Sent to Supplier | Blue | Awaiting confirmation |
| Confirmed | Yellow | Supplier confirmed |
| Partially Received | Orange | Partial delivery |
| Fully Received | Green | ✓ Complete delivery |
| Invoiced | Purple | ✓ Payment processed |

### GRN (Goods Received Notes)
| Status | Meaning |
|--------|---------|
| Pending | Awaiting receipt |
| Received | ✓ Items confirmed |
| Verified | ✓ Quality checked |
| Invoiced | ✓ Associated with PO invoice |

---

## Common Demo Phrases

### When showing Quotes:
> "Here you can see all quotes we've sent to customers. Each quote has a unique reference number, and the system tracks whether it's been sent, accepted, or rejected."

### When showing Suppliers:
> "This is our complete supplier database. We track their ratings, payment terms, and contact information all in one place. This prevents duplicate vendors and keeps procurement organized."

### When showing POs:
> "The purchase order workflow ensures nothing gets lost. We can see exactly what stage each order is at - whether it's been sent to the supplier, confirmed, or received."

### When showing GRNs:
> "When goods arrive, we create a Goods Received Note to verify quantities and quality. We can see exactly who received items and when, creating a complete audit trail."

### When showing Calculations:
> "The system automatically calculates all totals - quantity × rate. This eliminates manual entry errors and keeps financial data accurate."

### When showing Status Changes:
> "Notice how the status updated automatically and the date was logged. The system tracks every change for compliance and accountability."

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Demo data not showing | Run: `node scripts/seed-demo-data.mjs` |
| Server not responding | Run: `npm run dev` |
| Page not loading | Hard refresh: Ctrl+Shift+R |
| Some fields missing | Check browser devtools (F12) for errors |
| Need fresh start | Kill server, delete .next folder, run npm run dev |

---

## Post-Demo Talking Points

✅ **Highlights:**
- "Complete document lifecycle management"
- "Automatic financial calculations"
- "Supplier collaboration platform"
- "Full audit trail for compliance"
- "Role-based security"
- "Multi-company support"
- "Mobile-responsive design"

🚀 **Coming Soon:**
- "Mobile apps for on-site access"
- "Real-time supplier notifications"
- "Automated invoicing"
- "Budget tracking and reports"
- "Integration with major ERPs"
- "Advanced analytics dashboard"

💡 **Custom Options:**
- "White-label versions available"
- "Custom integrations"
- "Training and support packages"
- "On-premises deployment option"
