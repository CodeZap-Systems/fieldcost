# FieldCost - Multi-Tier Feature Specification

## Overview
FieldCost operates as a progressive feature tier system, allowing customers to start with basic functionality and expand to full enterprise capabilities. The system uses company-based tier classification with optional feature gating.

---

## TIER 1: Demo & Learning Environment ✅ COMPLETE

### Purpose
- Free exploration environment with sample data
- Sales/training tool
- Zero risk of data loss
- Learning curve flattening

### Current Features (IMPLEMENTED ✅)
- ✅ Project Management (Create, Read, Update, Delete)
- ✅ Customer Management (CRUD)
- ✅ Task Management with photo attachments
- ✅ Invoice Generation (read-only)
- ✅ Basic Reporting Dashboard
- ✅ Data Isolation (Demo company data completely separated)
- ✅ CSV Export (invoices)
- ✅ Multi-user support (read/write to demo data)
- ✅ Role-based access control (Demo, Admin)
- ✅ Real-time status updates
- ✅ Crew/Team Management

### Restrictions
- No production data access
- No integration with external accounting systems
- Sample data resets monthly
- Limited to predefined companies
- No archival/historical data
- No advanced analytics

### Technology Stack
- Next.js 14
- Supabase (multi-tenant)
- Tailwind CSS
- React Hook Form

---

## TIER 2: Business Operations ⏳ IN PROGRESS

### Purpose
- Small to medium-sized construction companies
- Real data management
- Single company focus
- Professional invoicing & reporting

### Required Features (PLANNED)

#### Core CRUD Operations (PARTIAL ✅)
- ✅ Project Management (Create, Read, Update, Delete)
- ✅ Customer Management (CRUD)
- ✅ Task Management (CRUD with photos)
- ✅ Invoice Management (Read, Create basic)
- ✅ Crew Management (teams, hourly rates)
- ✅ Item/Inventory Management
- ✅ Budget Tracking per project
- ⏳ **[NEW] Quotation/Quote Management** (to customers) - Not implemented
- ⏳ **[NEW] Supplier Purchase Order Management** (from vendors) - Not implemented

#### Financial Operations (PARTIAL ✅)
- ✅ Invoice generation (basic)
- ✅ CSV Export
- ✅ PDF Export (fallback to CSV)
- ✅ Payment tracking (partial)
- ⏳ **[NEW] Quote-to-Invoice Workflow** (provide quotes to customers) - Not implemented
- ⏳ **[NEW] Purchase Order Workflow** (procure materials from suppliers) - Not implemented
- ⏳ **[NEW] PO Receipt & Goods Received Tracking** - Not implemented
- ⏳ **[NEW] Multi-currency support** - Not implemented
- ⏳ **[NEW] Tax/VAT calculation** - Not implemented
- ⏳ **[NEW] Discount management** - Not implemented

#### Reporting & Analytics (PARTIAL ✅)
- ✅ Dashboard overview (basic)
- ✅ Project profitability reports
- ✅ Task completion reports
- ✅ Invoice aging reports
- ⏳ **[NEW] Revenue forecasting** - Not implemented
- ⏳ **[NEW] Cost analysis** - Not implemented
- ⏳ **[NEW] Resource utilization reports** - Not implemented
- ⏳ **[NEW] Custom report builder** - Not implemented

#### Integrations (PARTIAL ✅)
- ✅ Supabase backend
- ✅ Multi-company data isolation
- ⏳ **[NEW] Supplier Directory Integration** - Not implemented
- ⏳ **[NEW] Inventory Sync from Purchase Orders** - Not implemented
- ⏳ **[NEW] QuickBooks Online Integration** (for expense tracking from POs) - Not implemented
- ⏳ **[NEW] SAGE 100 Integration** (for procurement) - Not implemented
- ⏳ **[NEW] Xero Integration** (for supplier management) - Not implemented

#### User Management (COMPLETE ✅)
- ✅ Role-based access control (Admin, Manager, Team Lead, Worker)
- ✅ Multi-user login
- ✅ User invitations
- ✅ Permission levels
- ✅ Activity logging

### Pricing Model (Suggested)
- **Base**: $49/month (1 user, 1 company, core CRUD)
- **Standard**: $99/month (5 users, unlimited companies, + Quotations + Orders)
- **Plus**: $199/month (15 users, API access, advanced reporting)

### Success Metrics
- ✅ 81% test coverage (current)
- Target: 90% test coverage before tier 2 launch
- Zero data isolation breaches
- <200ms API response time
- 99.5% uptime

---

## TIER 3: Enterprise Solutions 🔮 ROADMAP

### Purpose
- Large construction firms
- Multiple project management
- Advanced accounting integration
- Compliance & audit trails
- White-label licensing

### Planned Features

#### Advanced Operations
- [ ] Multi-company management
- [ ] Subcontractor Management (B2B linking)
- [ ] Equipment/Asset tracking
- [ ] Site Safety compliance logs
- [ ] Environmental/CSR tracking
- [ ] Quality assurance checklists

#### Advanced Financial
- [ ] Multi-currency with real-time rates
- [ ] Complex tax scenarios (GST/VAT/PST)
- [ ] Recurring invoices/subscriptions
- [ ] Automated payment reminders
- [ ] Expense management with receipt scanning
- [ ] Contract management with auto-billing
- [ ] Change order management
- [ ] Retainage/Holdback management

#### Advanced Reporting
- [ ] Real-time financial dashboards
- [ ] Predictive analytics (ML-based forecasting)
- [ ] Custom KPI tracking
- [ ] Benchmark reports (industry comparisons)
- [ ] Audit trail/compliance reports
- [ ] BI tool integration (Power BI, Tableau)

#### Enterprise Integrations
- [ ] Salesforce CRM
- [ ] HubSpot
- [ ] Stripe/PayPal for online payments
- [ ] Document management systems
- [ ] ERP Systems (NetSuite, SAP)
- [ ] Email integration with compliance

#### Security & Compliance
- [ ] Audit logging with immutable records
- [ ] GDPR/POPIA compliance tools
- [ ] SOC 2 certification
- [ ] API rate limiting & key management
- [ ] Advanced permission system (granular)
- [ ] Two-factor authentication (MFA)
- [ ] Single Sign-On (SSO) via SAML/OAuth

#### White-Label Options
- [ ] Custom branding (logos, colors, domain)
- [ ] Custom workflows
- [ ] White-label mobile app
- [ ] Reseller portal
- [ ] Custom integrations marketplace

### Estimated Timeline
- Phase 1: Q2 2026 (Q-to-O features)
- Phase 2: Q3 2026 (Enterprise integrations)
- Phase 3: Q4 2026 (Advanced analytics & white-label)

### Pricing Model (Estimated)
- **Enterprise**: $499/month (unlimited users, all features)
- **Custom**: Custom pricing (dedicated support, custom integrations)

---

## TIER 2 IMPLEMENTATION ROADMAP

### Phase 1: Quotation & Supplier Purchase Order Management (4-6 weeks)

#### Quotation Module (to Customers)
**Duration**: 2-2.5 weeks  
**Difficulty**: Medium (60/100)

Features:
1. Quote creation from projects (what we're quoting to customers)
2. Quote line items (labor, materials, equipment)
3. Quote versioning
4. Quote-to-invoice conversion
5. Quote PDF generation
6. Quote approval workflow
7. Quote expiry date tracking
8. Quote analytics (win/loss rates)

API Endpoints to Build:
- `POST /api/quotes` - Create quote
- `GET /api/quotes?company_id=X` - List quotes
- `PATCH /api/quotes/{id}` - Update quote
- `DELETE /api/quotes/{id}` - Delete quote
- `POST /api/quotes/{id}/approve` - Approve workflow
- `POST /api/quotes/{id}/convert` - Convert to invoice
- `GET /api/quotes/{id}/pdf` - Generate PDF

Database Changes:
- New `quotes` table
- New `quote_line_items` table
- New `quote_statuses` enum
- Foreign keys to projects, customers

Components to Build:
- `QuoteForm.tsx` - Create/edit form
- `QuoteList.tsx` - Quote list view
- `QuoteDetailView.tsx` - Single quote view
- `QuoteLineItemEditor.tsx` - Line item management
- `QuoteToInvoiceModal.tsx` - Conversion dialog

#### Supplier Purchase Order Module (from Vendors)
**Duration**: 2-2.5 weeks  
**Difficulty**: Medium (65/100)

Features:
1. Purchase order creation from suppliers (materials, equipment procurement)
2. Supplier/Vendor management
3. PO line items (materials, services)
4. PO status tracking (Draft, Sent to Supplier, Confirmed, Received, Invoiced)
5. Goods Received Note (GRN) tracking
6. PO-to-Expense tracking
7. Multiple deliveries per PO
8. PO performance metrics (delivery times, quality)

API Endpoints to Build:
- `POST /api/purchase-orders` - Create PO
- `GET /api/purchase-orders?company_id=X` - List POs
- `PATCH /api/purchase-orders/{id}` - Update PO
- `DELETE /api/purchase-orders/{id}` - Delete PO
- `POST /api/purchase-orders/{id}/send` - Send to supplier
- `POST /api/purchase-orders/{id}/confirm` - Confirm receipt
- `POST /api/purchase-orders/{id}/grn` - Record goods received
- `GET /api/purchase-orders/{id}/pdf` - Generate PDF

Database Changes:
- New `purchase_orders` table (vendor_id, company_id, status, etc.)
- New `purchase_order_line_items` table
- New `suppliers` table (vendor master data)
- New `goods_received_notes` table (GRN tracking)
- New `po_statuses` enum

Components to Build:
- `PurchaseOrderForm.tsx` - Create/edit form
- `PurchaseOrderList.tsx` - PO list with status
- `PurchaseOrderDetailView.tsx` - Single PO view
- `POLineItemEditor.tsx` - Line item management
- `SupplierSelector.tsx` - Vendor selection/management
- `GoodsReceivedModal.tsx` - GRN tracking

### Phase 2: Enhanced Financial Operations (3-4 weeks)

#### Discount & Tax Management
**Duration**: 1.5 weeks  
**Difficulty**: Medium (55/100)

#### Multi-Currency Support
**Duration**: 1.5 weeks  
**Difficulty**: Hard (70/100)

#### Advanced Reporting
**Duration**: 1 week  
**Difficulty**: Medium (60/100)

### Phase 3: Testing & Deployment (1-2 weeks)

#### Test Coverage Improvements
- Unit tests for quote/order logic
- Integration tests for quote-to-invoice workflow
- E2E tests for complete financial flow
- Performance tests for bulk operations

#### Documentation
- User guides for quote/order management
- API documentation
- Deployment guide
- Migration guide for existing data

---

## RECOMMENDED IMPLEMENTATION APPROACH

### Sprint 1-2: Quotation Module (Weeks 1-3)
```timeline
Week 1: Database schema, API endpoints, core business logic
Week 2: UI components, form validation, PDF generation
Week 3: Quote-to-Invoice workflow, testing
```

### Sprint 3-4: Supplier Purchase Order Module (Weeks 4-6)
```timeline
Week 4: Database schema, API endpoints, PO creation, supplier master
Week 5: GRN tracking, PO status updates, PDF generation
Week 6: PO-to-Expense workflow, testing
```

### Sprint 5: Integration & Testing (Week 7)
```timeline
Complete end-to-end testing
Quote → Invoice complete flow (Customer sales)
PO → Goods Received → Expense complete flow (Supplier procurement)
Performance optimization
```

---

## DIFFICULTY ASSESSMENT

### Quotation Module: Medium (60/100)
**Pros**:
- Follows existing invoice patterns
- Linear workflow (create → approve → convert)
- Well-defined data structure

**Cons**:
- PDF generation complexity
- Version control (quote updates)
- Approval workflow logic
- Multi-user collaboration

### Supplier Purchase Order Module: Medium-Hard (65/100)
**Pros**:
- Clear vendor-focused workflow
- Simple line items (materials/services)
- GRN tracking well-established in construction

**Cons**:
- Multiple delivery tracking per PO
- Goods validation (received vs. ordered)
- Supplier performance metrics
- Integration with inventory/expense tracking

### Recommendation
**Start with Quotation Module** - it's the natural entry point to offer quotes to customers and has fewer dependencies than purchase orders.

---

## TIER CLOSURE CRITERIA

### Tier 1 (Demo) - Already Complete ✅
- [x] 81% test pass rate
- [x] Core CRUD operations
- [x] Data isolation
- [x] Multi-user support
- [x] Sample data management

### Tier 2 - Closure Requirements ⏳
- [ ] Core features: Quotations + Supplier Purchase Orders (IN PROGRESS)
- [ ] 90% test pass rate (target)
- [ ] API endpoints fully tested
- [ ] UI components fully functional
- [ ] PDF export working (quotes and POs)
- [ ] Quote-to-Invoice workflow complete
- [ ] PO-to-Expense tracking complete
- [ ] Goods Received Note tracking functional
- [ ] User documentation complete
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Production deployment successful

### Tier 3 - Future Roadmap 🔮
- [ ] Advanced integrations
- [ ] Enterprise security
- [ ] White-label support
- [ ] Custom workflows

---

## EFFORT ESTIMATION SUMMARY

| Feature | Weeks | Difficulty | Risk |
|---------|-------|-----------|------|
| Quote Management | 2-2.5 | Medium | Low |
| Supplier Purchase Orders | 2-2.5 | Medium-Hard | Low-Medium |
| Goods Received Tracking | 1 | Medium | Low |
| Tax/Discounts | 1.5 | Medium | Medium |
| Multi-Currency | 1.5 | Hard | High |
| Testing & Docs | 1-2 | Low | Low |
| **TOTAL TIER 2** | **6-8 weeks** | **Medium-Hard** | **Medium** |

---

## NEXT STEPS

1. **Approve Tier 2 Specification** ✅ (awaiting feedback)
2. **Setup Tier 2 Database Schema** (quotes, purchase_orders, suppliers, grn tables)
3. **Build Quotation API Endpoints** (POST, GET, PATCH, DELETE)
4. **Build Quotation UI Components** (forms, lists, viewers)
5. **Implement Quote-to-Invoice Conversion**
6. **Build Supplier Purchase Order API Endpoints**
7. **Build Supplier/Vendor Master Data Management**
8. **Build Goods Received Note (GRN) Tracking**
9. **Build Purchase Order UI Components**
10. **Implement Expense Tracking from POs**
11. **Comprehensive Testing Suite**
12. **Production Deployment**

---

## SUCCESS METRICS (Expected Post-Tier 2)

- Quote creation time: <30 seconds
- Quote-to-Invoice conversion: <5 seconds
- Quote PDF generation: <2 seconds
- Purchase Order creation time: <30 seconds
- Goods Received Note logging: <3 seconds
- PO PDF generation: <2 seconds
- API response time: <200ms (p95)
- Test coverage: >90%
- User adoption: >60% of Tier 2 customers use quote feature in first month
- Purchase order efficiency: >80% orders delivered on time

