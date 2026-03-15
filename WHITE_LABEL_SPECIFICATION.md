# FieldCost - White-Label Bespoke Specification

## Product Positioning

**FieldCost** is an enterprise-grade white-label platform for construction and mining project costing, with integrated ERP capabilities at its core. Rather than a multi-tier SaaS, it is a customizable foundation for bespoke construction management systems deployed on-premise or in dedicated cloud environments.

### Key Characteristics
- **White-Label Ready**: Fully customizable branding, workflows, and business logic
- **Bespoke Deployment**: Licensed and deployed per enterprise client
- **ERP-First Architecture**: Integrated ERP capabilities (inventory, procurement, payroll, GL) built-in, not bolted-on
- **Enterprise-Grade**: Multi-company support, advanced security, compliance-ready
- **Developer-Friendly**: TypeScript API, REST/GraphQL interfaces, webhook extensibility

---

## CORE PLATFORM: Tier 2 Operations + ERP Integration

FieldCost releases as a single, enterprise-capable platform. The Tier 2 feature set (project costing, invoicing, purchase orders, supplier management) is the **production standard**. A demo/training mode is available for evaluations and staff training.

### Base Platform Features (PRODUCTION READY)

#### Core Project & Financial Operations
- ✅ **Project Management**: Create, manage, and track construction projects with budgets and profitability
- ✅ **Customer Management**: Maintain client database with invoicing addresses and payment terms
- ✅ **Task Management**: Assign work, track progress, capture photo evidence
- ✅ **Crew & Team Management**: Staff database with hourly rates, skills, and allocation
- ✅ **Item/Inventory Management**: Material and equipment tracking with supplier linking
- ✅ **Quote Management**: Generate and track quotations to customers with approval workflows
- ✅ **Purchase Order System**: Procure materials from suppliers with status tracking and GRN validation
- ✅ **Invoice Generation**: Create professional invoices from projects, tasks, and purchase orders with PDF export

#### ERP Integration (CORE COMPETENCY)

The modern construction company operates across these systems. FieldCost integrates them at the platform level:

##### Procurement & Inventory (ERP Core)
- Order-to-Cash: Quotes → Sales Orders → Invoices
- Procure-to-Pay: Purchase Requisitions → Purchase Orders → Goods Receipt → Supplier Invoices → GL
- Inventory Management: Real-time stock tracking, cost rollup, variance analysis
- Vendors & Supplier Management: Master data, payment terms, performance metrics
- **Integrated Systems**: SAP, NetSuite, Xero, QuickBooks Online, SAGE 100

##### Financials & General Ledger (ERP Integration)
- Chart of Accounts: Project-based and cost-code allocation
- Invoice Line Items: Mapped to GL cost codes for accounting
- Expense Tracking: PO receipts and invoices post to GL
- Real-Time Financial Reports: P&L by project, cost center, time period
- Tax/VAT: Multi-region tax rules and compliance
- **Integrated Systems**: QuickBooks, Xero, NetSuite, SAP, SAGE

##### Human Capital Management (Future ERP)
- Payroll Integration: Link crew timesheets to payroll system
- Labor Costing: Actual labor cost vs. project budget
- Skills & Certification: Crew skills mapped to task requirements
- **Planned Integrations**: ADP, Sage Payroll, custom payroll systems

##### Analytics & Business Intelligence (ERP Analytics)
- Real-time dashboards: Project profitability, cash position, resource utilization
- Forecasting: Revenue and cost projections based on pipeline and history
- Variance Analysis: Budget vs. actual with root cause identification
- Benchmarking: Performance against historical and industry standards
- **Report Types**: Executive summaries, detailed P&L, variance analysis, cash flow

#### Security & Compliance (ERP Standard)
- ✅ Row-Level Security: Company-scoped data isolation with user/role enforcement
- ✅ Audit Trails: Complete activity logs with timestamp, user, and change tracking
- ✅ PDF Encryption: Output encryption with password protection
- ✅ Role-Based Access Control: Admin, Manager, Supervisor, Worker with permission granularity
- ✅ Multi-Company Support: Unlimited company profiles in single deployment
- ✅ User Management: Invitations, permission assignment, team structures

#### Deployment & Customization
- ✅ **Branding System**: Logo, color schemes, custom domain support
- ✅ **Workflow Customization**: Configurable approval workflows, notification rules
- ✅ **Custom Fields**: Extensible data model without code changes
- ✅ **API Access**: Full REST API for third-party integrations and custom apps
- ✅ **Webhook Support**: Event-driven automation (PO created, Invoice approved, etc.)
- ✅ **Mobile App Ready**: Progressive Web App (PWA) for offline crews

---

## DEMO & TRAINING MODE

For sales demonstrations and staff training, FieldCost includes an optional **Demo Company** with pre-loaded sample data:

- Complete project & financial workflows visible in <5 minutes
- No production data risk
- Staff training without impacting live system
- Monthly data refresh option

**Not a separate "tier"** — a training mode within the platform, toggled at login.

---

## DEPLOYMENT MODELS

### On-Premise (Most Common)
- Dedicated PostgreSQL database
- Self-hosted Next.js application
- Client manages infrastructure
- Highest data control and customization

### Dedicated Cloud (Premium)
- Supabase-managed PostgreSQL
- White-labeled cloud deployment
- Client controls access and data migration
- Upgrade path to on-premise if needed

### SaaS Pilot (Evaluation Only)
- Shared tenant for cost evaluation
- Data isolation via company_id RLS
- Upgrade to dedicated deployment for production
- Moving to white-label after contract signed

---

## BUSINESS MODEL: Licensing & Consulting

FieldCost is **not a SaaS subscription**. It is deployed under a licensing model:

### Licensing Tiers

| Model | Use Case | Deployment | Price | Support |
|-------|----------|-----------|-------|---------|
| **Startup License** | Single site, <500K annual spend | Cloud (Supabase) | $5K-10K setup + $500/mo hosting | Email + Slack |
| **Enterprise License** | Multi-site, >$5M annual spend | On-Premise or Dedicated Cloud | Custom quote | Dedicated success manager |
| **Reseller License** | White-label deployment to clients | Partner managed | Custom quote | Technical support + co-marketing |
| **Consulting Services** | Custom integration, ERP connection | On-client infrastructure | $150-250/hr | Dedicated team |

### Revenue Model
- **Upfront License Fee**: One-time $5K-50K+ depending on deployment
- **Annual Support & Host**: 15-20% of license fee
- **ERP Integration Services**: Time & materials (typically $20-100K)
- **Custom Development**: Per-engagement rates

---

## TECHNICAL ARCHITECTURE

### Core Stack
- **Framework**: Next.js 16 with TypeScript for type safety
- **Database**: PostgreSQL with Row-Level Security (company-scoped)
- **Auth**: Supabase Auth for user management
- **Hosting**: Vercel (default), self-hosted Node, or on-premise
- **UI**: React 19 with Tailwind CSS for responsive design
- **Forms**: React Hook Form with validation
- **State**: Zustand for lightweight state management
- **PDF**: pdfkit with encryption support

### ERP Integration Layer
- **API Contracts**: RESTful endpoints mapping to QuickBooks, Xero, NetSuite APIs
- **Data Sync**: Scheduled sync for invoices, expenses, GL posts
- **Error Handling**: Retry logic with dead-letter queues
- **Audit Trail**: All sync operations logged for compliance
- **Webhook Support**: Real-time event notifications to connected systems

### Security Architecture
- **Network**: HTTPS/TLS for all communication
- **Auth**: OAuth2/JWT token-based with refresh token rotation
- **Database**: Encrypted fields for PII, Row-Level Security at DB level
- **Secrets**: Environment variables with secrets management vault
- **Audit**: Immutable logs of all data access and modifications

---

## DEVELOPMENT ROADMAP

### Phase 1: Foundation Ready ✅ (COMPLETE)
- Core platform features (projects, customers, invoicing)
- Quote and Purchase Order workflows
- Basic ERP connectors (stub for QuickBooks, Xero)
- Multi-company, role-based security
- Demo mode and training data

### Phase 2: ERP Deep Integration 🔄 (CURRENT)
- Full QuickBooks Online connector
- Xero connector with tax integration
- NetSuite connector for enterprise clients
- Payroll sync (ADP, Sage)
- Real-time GL posting from invoices and expenses
- Advanced financial reporting with GL drill-down

### Phase 3: Enterprise Customization (Q3 2026)
- Custom field builder UI
- Workflow customization engine
- Approval routing with delegate rules
- White-label mobile app
- Advanced integrations marketplace

### Phase 4: Vertical Solutions (Q4 2026)
- Civil Engineering configuration
- Mining-specific cost tracking
- Utility contractor templates
- Building construction presets

---

## CUSTOMER SUCCESS CRITERIA

Each deployment is measured on:

1. **System Adoption**: >90% of team using platform weekly by month 3
2. **Data Accuracy**: 100% of labor-hours and materials accounted for
3. **Financial Reconciliation**: ±2% variance between FieldCost and GL
4. **ERP Sync**: 99.5% automated GL posting success
5. **ROI**: 6-month payback through reduced invoicing time and margin improvement
6. **Scalability**: Support 100+ projects simultaneously without performance degradation

---

## NOT INCLUDED IN PLATFORM

To stay focused on construction-specific ERP, FieldCost **does not** include:

- ❌ Resource scheduling/capacity planning (integrate with Planview, Monday.com)
- ❌ Stand-alone CRM (use Salesforce, Pipedrive for sales pipeline)
- ❌ Document management (integrate with SharePoint, Box)
- ❌ Time and materials billing beyond task-level (use advanced ERP for complex arrangements)
- ❌ Multi-currency accounting (deploy separate instances per currency region)

These can be integrated via API if needed.

---

## NEXT STEPS FOR ENTERPRISE CLIENT

1. **License Agreement**: Sign FieldCost licensing agreement with implementation terms
2. **Dedicated Deployment**: Set up on-premise or cloud instance
3. **ERP Discovery**: Identify target ERP system and integration requirements
4. **Configuration Workshop**: Customize chart of accounts, cost codes, workflows
5. **Data Migration**: Migrate historical projects and customers
6. **ERP Integration**: Build and test connectors to accounting system
7. **User Training**: Conduct rollout training for finance and operations teams
8. **Go-Live**: Production deployment with go-live support
9. **Ongoing Support**: Annual licensing, system updates, custom enhancements

**Typical Timeline**: 8-12 weeks from signature to go-live

**Investment Range**: $50K-500K depending on scope and ERP complexity
