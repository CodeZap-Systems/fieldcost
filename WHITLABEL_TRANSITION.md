# FieldCost: SaaS to White-Label Transition Guide

## Strategic Shift Summary

**Date**: March 15, 2026  
**From**: Multi-tier SaaS (Tier 1 Demo, Tier 2 Business, Tier 3 Enterprise)  
**To**: White-label bespoke platform with ERP integration at core

---

## What Changed

### Business Model
| Aspect | Previous (SaaS) | New (White-Label) |
|--------|-----------------|-------------------|
| **Positioning** | Mass-market construction SaaS | Enterprise bespoke platform |
| **Pricing** | Monthly subscription per company | Upfront license + annual support |
| **Tiers** | 3 pricing tiers (Starter, Professional, Enterprise) | Single feature set, customized on deployment |
| **Customers** | Unlimited parallel customers | Licensed per enterprise deploy |
| **Segments** | SMB (50-500 users) | Mid-market and Enterprise (100-5,000 users) |
| **Deployment** | Shared cloud multi-tenant | Dedicated cloud or on-premise |

### Platform Architecture
| Aspect | Previous | New |
|--------|----------|-----|
| **Feature Gates** | Tier 1/2/3 checks in code | Feature activation via config |
| **ERP Integration** | Nice-to-have (Tier 3 roadmap) | Core platform competency |
| **Customization** | Limited per tier | Workflow engine + custom fields |
| **Demo Mode** | Separate Tier 1 with reset data | Optional mode within platform |
| **Target User Count** | Single company multi-user | Multi-company by role/team |

### Code Implications
- **Remove**: Tier gating logic (`if (tier === 'TIER2') { ... }`)
- **Keep**: Demo company mode (for training/evaluation)
- **Add**: White-label customization hooks (branding, workflows)
- **Enhance**: ERP integration connectors (QuickBooks, Xero, NetSuite)
- **Update**: API documentation (from SaaS to white-label licensing)

---

## Feature Set: What's the Standard Now

### Tier 2 = Production Standard
Everything in the previous "Tier 2 Business Operations" is now the **baseline platform**:

✅ Project Management (CRUD)  
✅ Customer & Vendor Management  
✅ Quote Management (Quote-to-Invoice)  
✅ Purchase Order Workflow  
✅ Goods Received Note Tracking  
✅ Invoice Generation with PDF Export  
✅ Financial Reporting (Project P&L, Aging)  
✅ Multi-user with role-based access  
✅ Audit trails and compliance logging  
✅ Multi-company data isolation  

### Tier 1 (Demo) → Optional Training Mode
The previous demo environment is now an optional feature:
- Available in all deployments as "Training Company"
- Pre-loaded sample data for onboarding
- Can be toggled on/off per deployment
- Not a separate product tier

### Tier 3 (Enterprise) → Customization Layer
Advanced enterprise features move to the customization/integration layer:
- Equipment tracking (custom fields + custom workflows)
- Subcontractor management (custom relationship rules)
- Advanced analytics dashboards (reporting config)
- Integration with specific ERP systems per customer

---

## Deployment & Sales Model Changes

### Previous Sales Approach
- Sign up → Select plan tier → Usage-based billing → Support email

### New Sales Approach
1. **License Agreement** (legal/procurement)
2. **Dedicated Deployment** (infrastructure)
3. **ERP Integration Planning** (discovery workshop)
4. **Configuration & Customization** (consulting services)
5. **Training & Go-Live** (change management)
6. **Annual Renewal** (support + hosting)

**Sales Cycle**: 90-180 days (vs. instant signup)  
**Deal Size**: $50K-500K lifetime value (vs. $500-2K/year per user)  
**Customer Success**: Assigned success manager (vs. self-serve)

---

## Codebase Updates Required

### 1. Remove Tier Gating Logic
**Files to Update**:
- `app/dashboard/page.tsx` - Remove tier selector
- `app/components/DashboardTierSwitcher.tsx` - Remove or repurpose
- `lib/tierConfig.ts` - Delete
- Any route with `if (tier === 'TIER2')` checks

**Approach**:
- Delete tier-checking code
- Default to "production" behavior
- Keep demo mode as optional feature flag

### 2. Rename "Tier 2" to "Core Platform"
**Documentation Updates**:
- `TIER_SPECIFICATION.md` → Mark as deprecated, reference `WHITE_LABEL_SPECIFICATION.md`
- Update API docs to remove tier references
- Update setup guide to assume Tier 2 features

### 3. Enhance ERP Integration
**New Priority**:
- Complete QuickBooks Online connector
- Build Xero connector with tax mapping
- Plan NetSuite connector for enterprise
- Document GL posting logic
- Implement webhook event system

**Files**:
- `app/api/erp/` directory (create)
- `lib/erp-connectors/` (create subdirectory structure)
- `supabase/migrations/` (add ERP-related tables)

### 4. White-Label Configuration
**New System**:
- Company branding table in database
- Custom field definitions
- Workflow rule engine
- Custom report builder interface

**Files to Create**:
- `app/admin/branding/page.tsx`
- `app/admin/workflows/page.tsx`
- `lib/customization/branding.ts`
- `lib/customization/workflows.ts`

### 5. Update README & Documentation
- README: Explain white-label positioning
- Setup guide: Assume deployment (not signup)
- Business guide: Explain licensing model
- API docs: Focus on customization and ERP integration

---

## User Experience Changes

### For Demo Users
- **No change**: Can still access demo company and training data
- **Now**: Called "Training Mode" instead of "Tier 1"
- **Optional**: Can be disabled per deployment

### For Production Users
- **Gain**: All Tier 2 features available by default
- **No wait**: No need to upgrade for quotes, POs, etc.
- **Focus**: Customizing to their specific workflows
- **Integrate**: Connecting to their ERP system

### For Admins/IT Teams
- **New focus**: Customizing company branding, workflows, fields
- **New responsibility**: Managing ERP integrations and sync
- **New tools**: Workflow builder, custom field management
- **New docs**: White-label configuration guides

---

## Migration Path for Existing Customers

If FieldCost has existing Tier 1/Tier 2 customers on the old model, the migration is straightforward:

1. **Tier 1 (Demo) Users**
   - Give them a separate "Training Company" in new system
   - No changes to their workflow
   - Option to upgrade to production company running Tier 2 features

2. **Tier 2 (Business) Users**
   - They already have all core features
   - Gain access to customization/ERP integration
   - Move to white-label licensing model (update contract)

3. **Tier 3 (Enterprise) Users**
   - Already on custom deployments
   - No disruption
   - New white-label framework gives more customization options

---

## Key Messaging for Customers

### Old Positioning
> "FieldCost is a construction costing SaaS with tiered features for companies of all sizes."

### New Positioning
> "FieldCost is an enterprise white-label construction ERP platform deployed on your infrastructure, configured for your specific workflows and integrated with your existing accounting system."

### Talking Points
1. **De-risk IT spending**: White-label on your data, no third-party access
2. **Faster ROI**: Pre-built construction workflows, faster than building from scratch
3. **ERP advantage**: Built-in integration with QuickBooks, Xero, NetSuite—not bolted on
4. **Scale easier**: Multi-company, multi-site support from day one
5. **Customize fearlessly**: Change workflows without vendor approval

---

## Timeline

### Immediate (Week 1-2)
- [ ] Create WHITE_LABEL_SPECIFICATION.md (DONE)
- [ ] Update README.md (DONE)
- [ ] Update business terminology guide
- [ ] Brief sales team on new positioning

### Short-term (Week 3-4)
- [ ] Remove tier gating logic from codebase
- [ ] Update API documentation
- [ ] Create white-label configuration UI sketch
- [ ] Plan ERP integration roadmap

### Medium-term (Month 2-3)
- [ ] Build ERP integration framework
- [ ] Implement white-label customization system
- [ ] Update deploy documentation
- [ ] Conduct customer communications

### Long-term (Month 4+)
- [ ] Roll out to new customers under white-label model
- [ ] Migrate existing customers (if any)
- [ ] Release mobile app as white-label option
- [ ] Publish case studies of successful deployments

---

## FAQ

**Q: Does this mean we're more expensive now?**  
A: Yes, but the value is different. License fee is higher ($50K+) but covers unlimited users and companies. No monthly per-user recurring fees.

**Q: Can we still do multi-tenant SaaS?**  
A: The platform is designed for dedicated deployment, but the codebase supports multi-tenant with RLS. You could sell it as SaaS, but that's not the default positioning.

**Q: What about the demo environment?**  
A: Still available in every deployment. Now called "Training Company" instead of "Tier 1."

**Q: Do we need to change the database schema?**  
A: No. The Tier 2 schema already supports everything. Just need to enable all features by default and add customization/integration tables.

**Q: What about existing Tier 1 and Tier 3 documentation?**  
A: Keep it for historical reference. Reference WHITE_LABEL_SPECIFICATION.md as the current model.

**Q: Can customers still signup on the website and start using it?**  
A: Not in the new model. White-label requires a deployment conversation. You could keep a "try FieldCost" demo environment on the website (using the Training Company mode).

---

## Success Metrics in New Model

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **License Conversions** | 3-5 per quarter | New customer contracts signed |
| **ERP Integration Rate** | 90% of customers integrated within 3 months of go-live | Integration tickets closed |
| **Customer NPS** | >50 | Post-deployment survey |
| **Support Ticket Resolution** | 95% within 48 hours | Internal SLA tracking |
| **Customization Revenue** | 40% of total contract value | Consulting hours invoiced |
| **Repeat/Expansion Business** | 60% of customers increase scope in year 2 | Expansion deals signed |
