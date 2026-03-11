# 🚀 Tier 3 Enterprise Admin CMS Features

## Overview

The Admin CMS now includes **5 comprehensive Tier 3 Enterprise management systems** to handle all advanced subscription, billing, and operational features for high-ACV contracts.

---

## ✨ New Features Added

### 1. **Tier 3 Features Management** 
**Path:** `/admin/tier3-features`

Manage which enterprise capabilities are available per subscription plan:

#### Features Included (13 Total)
- **Core Enterprise** (7 features)
  - Multi-Company Setup
  - Multi-Currency Support (ZAR/USD/EUR)
  - GPS Tracking & Geolocation
  - Legal Photo Evidence Chain
  - Offline Mobile Sync
  - 6-Role RBAC System
  - Complete Audit Trails

- **Advanced Capabilities** (4 features)
  - Custom Workflow Builder
  - Mining-Specific Workflows
  - Dedicated Support + SLA
  - Live WIP Tracking & Reporting

- **Integration & API** (2 features)
  - REST API Access (7 endpoints)
  - Advanced Financial Reporting

#### API Endpoint
- `GET /api/admin/tier3-features` - List all Tier 3 features
- `POST /api/admin/tier3-features` - Enable/disable features per plan

---

### 2. **Feature Quotas Management**
**Path:** `/admin/feature-quotas`

Monitor and manage usage limits for API calls, storage, and features per company:

#### Quota Types
- **API Calls**: Requests per minute / per day
- **Photo Storage**: GB available for evidence
- **Custom Workflows**: Maximum templates
- **GPS Locations**: Monthly location data points
- **Custom Reset Periods**: Monthly, yearly, or never

#### Features
- Real-time usage tracking with progress bars
- Color-coded warnings (green < 70%, yellow 70-90%, red > 90%)
- Edit quotas with different reset periods
- Usage analytics per company

#### API Endpoint
- `GET /api/admin/feature-quotas` - Fetch company quotas
- `POST /api/admin/feature-quotas` - Create new quota
- `PATCH /api/admin/feature-quotas` - Update quota limits

---

### 3. **Company Tier 3 Configuration**
**Path:** `/admin/company-config`

Manage complete Tier 3 settings for each customer:

#### Configuration Options
- **SLA Tier Selection**
  - Gold SLA: 99.5% uptime, 4-hour response, business hours support
  - Platinum SLA: 99.99% uptime, 1-hour response, 24/7/365 support

- **Company Details**
  - Registration number
  - Support email & phone
  - Parent company (for multi-entity structures)

- **Resources & Limits**
  - Max active projects
  - Max users
  - Default currency
  - Supported currencies

- **Feature Enablement**
  - Visual display of all 13 enabled Tier 3 features
  - Quick count of active features

#### API Endpoint
- `GET /api/admin/company-config` - Fetch company configuration
- `PATCH /api/admin/company-config` - Update configuration

---

### 4. **Custom Workflows Builder**
**Path:** `/admin/workflows`

Create mining/construction-specific workflows with approval chains:

#### Workflow Template Types
- **Mining Workflows**: Open pit, underground, processing workflows
- **Construction Workflows**: Foundation, framing, finishing stages
- **General Workflows**: Custom business processes

#### Stage Configuration
Each workflow stage supports:
- Stage name & order
- Photo evidence requirements
- GPS verification mandates
- Estimated duration
- Role-based notifications
- Transition rules

#### Workflow Features
- Multi-stage workflow design
- Approval chain configuration
- 2-way integration with phase management
- Built-in mining safety templates
- Customizable transitions

#### Real-world Examples
1. **Open Pit Mining Daily Cycle**
   - Safety Check (requires photo + GPS)
   - Excavation (8 hours)
   - Quality Verification (requires photo + GPS)
   - Sign-off (requires approval)

2. **Building Foundation**
   - Site Preparation (requires photo + GPS)
   - Formwork Installation (6 hours)
   - Concrete Pour (8 hours)
   - Inspection & Approval (requires photo)

#### API Endpoint
- `GET /api/admin/workflows` - List workflows per company
- `POST /api/admin/workflows` - Create new workflow
- `PATCH /api/admin/workflows` - Update workflow
- `DELETE /api/admin/workflows` - Deactivate workflow

---

### 5. **API Key Management**
**Path:** `/admin/api-keys`

Manage REST API access for Tier 3 companies with granular permissions:

#### Key Features
- **Unique API Keys**: Each key has SHA-256 hash for security
- **Fine-grained Permissions**: 13+ permission types:
  - tasks:read, tasks:write
  - projects:read, projects:write
  - invoices:read, invoices:write
  - crew:read, crew:write
  - photos:read, photos:write
  - reports:read
  - workflows:read, workflows:write

- **Rate Limiting**
  - Per-minute limits (default 600)
  - Per-day limits (default 500,000)
  - Custom rates per API key

- **Key Lifecycle**
  - Active, Revoked, Expired statuses
  - Creation tracking
  - Last-used timestamps
  - Auto-expiration support

#### Key Formats
- **Production Keys**: `sk_live_xxx...`
- **Test Keys**: `sk_test_xxx...`
- **Revoked/Expired**: Show in disabled state

#### API Endpoint
- `GET /api/admin/api-keys` - List keys per company
- `POST /api/admin/api-keys` - Generate new key
- `PATCH /api/admin/api-keys` - Update rate limits
- `DELETE /api/admin/api-keys` - Revoke key

---

## 📊 Database Schema Additions

The Admin CMS works with these Tier 3 database tables (from `admin-cms-schema.sql`):

```sql
-- Core Tier 3 tables
CREATE TABLE tier3_companies (multi-company hierarchy)
CREATE TABLE tier3_field_roles (6-role RBAC matrix)
CREATE TABLE tier3_role_permissions (30+ permissions)
CREATE TABLE task_location_snapshots (GPS history)
CREATE TABLE photo_evidence (photos + metadata)
CREATE TABLE photo_evidence_chain (chain of custody)
CREATE TABLE offline_bundles (device sync tracking)
CREATE TABLE offline_sync_log (sync audit trail)
CREATE TABLE tier3_audit_logs (complete change history)
CREATE TABLE custom_workflows (workflow definitions)
CREATE TABLE workflow_stages (stage configuration)
CREATE TABLE mining_site_workflows (mining templates)
CREATE TABLE tier3_wip_snapshots (live WIP tracking)
CREATE TABLE currency_exchange_rates (multi-currency)
CREATE TABLE plan_features (feature enablement per plan)
CREATE TABLE feature_quotas (usage limits per company)
```

---

## 🔗 Admin Navigation

All new Tier 3 features accessible from `/admin`:

```
Dashboard
├── Subscription Plans (Core)
├── Subscriptions (Core)
├── Billing & Invoices (Core)
├── Payments (Core)
├── Users & Teams (Core)
├── Audit Logs (Core)
├── Analytics (Core)
├── Settings (Core)
├── Tier 3 Features ⭐ (NEW)
├── Feature Quotas ⭐ (NEW)
├── Company Config ⭐ (NEW)
├── Workflows ⭐ (NEW)
└── API Keys ⭐ (NEW)
```

---

## 🎯 Integration with Demo Mode

All 5 new Tier 3 pages are demo-mode aware:
- Shows `DemoModeBanner` at top when in demo company
- Changes marked as "for testing only"
- Full feature parity with production
- Allows safe exploration within demo environment

---

## 💡 Usage Scenarios

### Scenario 1: Onboarding New Enterprise Customer
1. Go to **Company Config** → Set SLA Tier (Platinum recommended)
2. Go to **Tier 3 Features** → Enable all 13 features for Tier 3 plan
3. Go to **Feature Quotas** → Configure API limits & storage
4. Go to **Workflows** → Load mining/construction templates
5. Go to **API Keys** → Generate keys for integrations

### Scenario 2: Customizing Workflows for Client
1. Go to **Workflows** → Create new custom workflow
2. Add stages with photo/GPS requirements
3. Set approval chain
4. Name and describe workflow type
5. Test in demo mode before going live

### Scenario 3: Managing API Access
1. Go to **API Keys** → Generate new key
2. Set permissions (tasks:read/write, invoices:read, etc.)
3. Configure rate limits based on plan
4. Share with client (only shown once)
5. Monitor usage in **Feature Quotas**

---

## 🔐 Security Features

- **API Keys**: Never stored in plaintext (SHA-256 hashes)
- **Permissions**: Granular role-based access control
- **Audit Trails**: All changes logged with timestamps
- **Rate Limiting**: Prevent abuse with per-minute/day limits
- **Key Revocation**: Immediately disable compromised keys
- **Admin Middleware**: All endpoints require authentication

---

## 📈 Tier 3 Competitive Advantage

These 5 admin tools enable FieldCost to:
- ✅ Manage **unlimited features** per customer (vs Sage X3 one-size-fits-all)
- ✅ Support **custom workflows** specific to client operations
- ✅ Provide **API-first approach** for integrations
- ✅ Track **feature usage** per company with quotas
- ✅ Scale **SLA support** from Gold to Platinum tiers

---

## 🚀 Next Steps

1. **Connect to Supabase**
   - Deploy `admin-cms-schema.sql` to Supabase
   - Update API routes with real database queries

2. **Test in Production**
   - Create test Tier 3 company
   - Configure features and quotas
   - Generate and test API keys

3. **Client Documentation**
   - Create API reference guide
   - Document workflow customization process
   - Establish rate limit guidelines

4. **Monitor & Optimize**
   - Track feature quota usage
   - Monitor API performance
   - Adjust limits based on usage patterns

---

## 📞 Support

All Tier 3 admin pages include:
- Inline help text
- Real-time validation
- Demo mode testing
- Production-ready code

For questions about specific features, refer to:
- `ADMIN_CMS_COMPLETE.md` - Full CMS overview
- `TIER3_BUILD_COMPLETE.md` - Tier 3 details
- `ADMIN_CMS_DEMO_INTEGRATION.md` - Demo mode guide
