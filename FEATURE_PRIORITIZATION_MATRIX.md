# ⚡ FieldCost Feature Prioritization Matrix
## What to build first, second, third (Decision Framework)

---

## 🎯 PRIORITIZATION MODEL

We use a simple 2x2 matrix to decide which features to build:

```
IMPACT (Revenue + Retention Improvement)
       │
  HIGH │  BUILD FIRST       │  MONITOR & PLAN
       │  (Quick Wins)      │  (Future Roadmap)
       ├────────────────────┼─────────────────────
  LOW  │  NICE-TO-HAVE      │  DON'T BUILD
       │  (Backlog)         │  (Distraction)
       └────────────────────┴─────────────────────
                LOW        │        HIGH
                         EFFORT
```

---

## 📋 THE PRIORITIZED FEATURE LIST

### 🔴 BUILD NOW (Next 30 Days) — High Impact, Low Effort

| Feature | Why | Impact | Effort | Owner | Timeline |
|---------|-----|--------|--------|-------|----------|
| **Landing Page + Stripe** | Revenue starts here | R6k MRR | 5 days | Marketing + Backend | Days 1-5 |
| **Interactive Onboarding (60 sec)** | <10 min aha moment | +20 retention | 3 days | Frontend | Days 3-5 |
| **Email Signup Sequence** | Nurture free users | +15% conversion | 2 days | Marketing | Days 2-3 |
| **WhatsApp Task Notifications** | Contractors live on WA | +25% engagement | 2 days | Backend | Days 6-7 |
| **Support Email + Intercom** | Customer retention | -50% churn | 1 day | Ops | Day 1 |
| **"First Invoice" Template** | Remove friction | +30% activation | 2 days | Frontend | Days 4-5 |
| **Demo Data Auto-Load** | Instant gratification | +40% time-to-value | 1 day | Backend | Day 3 |
| **CSV Export (Tasks + Invoices)** | Reduce switching cost | +15% retention | 2 days | Backend | Days 8-10 |
| **Contract Freelancer Help** | Launch velocity | Team unblocked | N/A | Ops | Day 1 |

**30-Day Success = All 9 features live, 10 customers onboarded**

---

### 🟡 BUILD NEXT (Days 31-90) — Medium Impact, Medium Effort

| Feature | Why | Impact | Effort | Owner | Timeline |
|---------|-----|--------|--------|-------|----------|
| **Tier 2 ERP Integration (Sage 50)** | Premium revenue | +R15k MRR | 15 days | Backend | Days 31-45 |
| **Mobile App MVP (iOS/Android)** | Field crews can't use web | T2 adoption | 20 days | Mobile Dev | Days 35-55 |
| **Offline Sync (Geolocation)** | Work where no signal | Better UX | 10 days | Backend | Days 45-55 |
| **Approval Workflows** | Enterprise requirement | T3 enterprise | 10 days | Product | Days 50-60 |
| **WIP Tracking Dashboard** | Money-maker feature | High engagement | 10 days | Frontend | Days 55-65 |
| **Budget Alerts** | Risk prevention | Reduces disputes | 5 days | Backend | Days 60-65 |
| **Gantt Charts** | Project planning | T2 stickiness | 10 days | Frontend | Days 70-80 |
| **Health Score (in-app)** | Retention engine | Churn reduction | 7 days | Backend | Days 81-88 |
| **Referral Program Config** | Zero-CAC customers | 20+ referrals | 3 days | Product | Days 89-92 |
| **Tier 3 Demo Environment** | Sales enablement | 3 pilots signed | 3 days | DevOps | Days 93-96 |

**90-Day Success = R25k MRR, 5 Tier 2 customers, 70% retention, 3 Tier 3 pilots**

---

### 🟢 BUILD LATER (Days 91-180) — Lower Urgency

| Feature | Why | Rationale | Timeline |
|---------|-----|-----------|----------|
| **SOC 2 Type II Certification** | Enterprise trust | Required for Tier 3 large deals | M4-M5 |
| **Multi-Company Holding Structure** | Enterprise feature | Only a few customers need it | M5-M6 |
| **Custom Branding (White Label)** | Enterprise requirement | Nice-to-have for T3 | M5 |
| **Advanced Webhooks + API** | Custom integrations | Tech-savvy customers | M5-M6 |
| **Regional Expansion (Botswana)** | Market growth | After domestic dominance | M6 |
| **Xero Integration** | Premium feature | Secondary to Sage | M4-M5 |
| **Photo Chains (Legal Evidence)** | Compliance | Limited market need (mining) | M5-M6 |
| **Advanced Audit Logs** | Compliance + Enterprise | Niche requirement | M5-M6 |

---

## 📊 EFFORT vs IMPACT BREAKDOWN

### High Impact, Low Effort (BUILD FIRST) 🔴
```
Landing page        3-5 days    → R6k MRR potential
Onboarding flow     3 days      → 50% retention
Email sequences     2 days      → 15% higher conversion
WhatsApp alerts     2 days      → 25% engagement
First-invoice UX    2 days      → 30% activation
Demo data loading   1 day       → 40% faster time-to-value
CSV export          2 days      → 15% retention
```
**Total: ~15-20 days of focused work = R6k MRR launch readiness**

### High Impact, Medium Effort (BUILD NEXT) 🟡
```
Mobile app (iOS)    20 days     → Tier 2 adoption (must have)
ERP sync (Sage)     15 days     → R15k MRR expansion
Offline sync        10 days     → Mobile usability
Approval workflows  10 days     → Enterprise requirement
WIP dashboard       10 days     → Engagement/retention
Gantt charts        10 days     → High engagement
```
**Total: ~75-90 days of work = R25k MRR + Tier 2 market ready**

### Medium Impact, High Effort (BUILD LATER) 🟢
```
SOC 2 certification  4-6 weeks   → Enterprise trust (T3 gate)
Multi-org setup      3 weeks     → Complex enterprise feature
Webhooks/API         2 weeks     → Tech-heavy customers only
Custom branding      1-2 weeks   → Nice-to-have for T3
Photo chains         2 weeks     → Niche mining/construction
```
**Total: 90-180 days = Enterprise hardening for Tier 3**

---

## 🎯 CRITICAL PATH (The Minimum to Ship)

**To launch Day 30 and get 10 customers**, you MUST have:

```
ESSENTIAL (Block if missing):
✅ Landing page (drives traffic)
✅ Stripe/Yoco integration (takes payment)
✅ Onboarding to first invoice (aha moment)
✅ Email + Intercom (support)

NICE-TO-HAVE (Defer if needed):
⏳ WhatsApp notifications (can add later)
⏳ CSV export (MVP without it)
```

**Minimum = 5 days of engineering work**

---

## 💰 ROI CALCULATION (Why This Order?)

### Tier 1 Launch (Features that drive R6k MRR in 30 days)

| Feature | Dev Cost | Revenue Impact | ROI | Priority |
|---------|----------|-----------------|-----|----------|
| **Landing page** | R8k | R6k MRR = R72k/yr | 900% | 🔴 Now |
| **Onboarding UX** | R12k | +20% -> +R1.4k MRR | 120% | 🔴 Now |
| **Email sequence** | R6k | +15% conversion | 180% | 🔴 Now |
| **Support (Intercom)** | R4k | -50% churn | 240% | 🔴 Now |
| **WhatsApp alerts** | R8k | +25% engagement | 150% | 🟡 Soon |

**Total: ~R38k dev cost → R6k MRR** (ROI breaks even in 6-7 months, scales to R150k after)

### Tier 2 Launch (Features that drive additional R15k MRR in 90 days)

| Feature | Dev Cost | Revenue Impact | Notes |
|---------|----------|-----------------|-------|
| **Mobile app** | R150k | +R15k MRR = R180k/yr | Must-have for field crews |
| **ERP sync** | R60k | Enables Tier 2 upgrade | Sage 50 integration |
| **Offline sync** | R40k | Better mobile UX | Support field work |

**Total: R250k dev → R180k/yr additional revenue** (ROI in 1.4 years, but unlocks Tier 2 market)

---

## ⏰ PHASE-BASED EXECUTION PLAN

### Phase 1: Launch (Days 1-30)

**Day 1-5: Foundations**
- [ ] Landing page designed + copy written
- [ ] Stripe/Yoco account created + webhooks integrated
- [ ] Support infrastructure (email, Intercom)
- [ ] DevOps: Deploy landing page to fieldcost.co.za

**Day 6-15: Customer Onboarding Path**
- [ ] Interactive walkthrough (first 60 seconds)
- [ ] "Create your first invoice" template
- [ ] Demo data auto-seeding on signup
- [ ] Email welcome sequence (5 emails over 7 days)

**Day 16-25: Customer Enablement**
- [ ] WhatsApp task notifications
- [ ] CSV export for tasks + invoices
- [ ] Tutorial videos (60 sec each)
- [ ] FAQ page + live chat trained staff

**Day 26-30: Go-Live**
- [ ] Final testing (dogfooding with 3 internal users)
- [ ] Marketing launch email + LinkedIn posts
- [ ] Outbound sales campaign (50 contractor calls)
- [ ] Set up analytics (Mixpanel, customer success metrics)

**Success = 10 customers, R6k MRR, 80% onboarding completion**

---

### Phase 2: Expansion (Days 31-90)

**Week 5-6: Tier 2 Prep**
- [ ] Mobile app scaffold (React Native)
- [ ] Sage 50 OAuth flow (licensing)
- [ ] Database migrations for Tier 2 schema
- [ ] Sales collateral: ROI calculator, case studies

**Week 7-10: Mobile MVP**
- [ ] iOS + Android app in stores
- [ ] Core features: Projects, Tasks, Time tracking
- [ ] Offline queue (sync when online)
- [ ] Push notifications for task assignment

**Week 11-13: ERP + Workflows**
- [ ] Complete Sage 50 sync (invoices, budgets, GL)
- [ ] Approval workflows (3-level sign-off)
- [ ] WIP tracking dashboard
- [ ] Budget alerts (50%, 75%, 100% spent)

**Week 14: Enterprise Features**
- [ ] Multi-org database schema
- [ ] RBAC setup (5+ roles)
- [ ] Audit logging framework
- [ ] Demo environment for sales

**Success = 5 Tier 2 pilots, R25k MRR, 70% retention, 3 Tier 3 leads**

---

### Phase 3: Scale (Days 91-180)

**Month 4: Enterprise Hardening**
- [ ] Gantt charts (Tier 2 feature)
- [ ] Geolocation tracking (legal accuracy)
- [ ] Photo chains (evidence audit trail)
- [ ] Xero integration (secondary ERP)

**Month 5: Compliance & Regional**
- [ ] SOC 2 Type II audit plan
- [ ] POPIA (SA privacy law) compliance
- [ ] Botswana/Namibia deployment
- [ ] Custom branding (white-label)

**Month 6: Operational Excellence**
- [ ] Load testing + database optimization
- [ ] 99.9% uptime SLA achievement
- [ ] Advanced webhooks + API
- [ ] Enterprise support (SLA, account manager)

**Success = 2 Tier 3 deals, R150k MRR, 75% gross margin, geographic expansion**

---

## 🚨 "KILL FEATURES" (Don't Build These)

These features sound good but **kill product focus**:

| Feature | Why Kill | Alternative |
|---------|----------|-------------|
| **Mobile app for Tier 1** | Tier 1 doesn't need offline | Use web on phone, launch app for T2 |
| **Advanced Analytics** | Contractors don't care | Simple "revenue this month" widget |
| **Custom Reports** | Manual workaround exists | CSV export covers 90% of needs |
| **Photo AI (auto-tagging)** | Niche feature, high cost | Manual tagging is fine |
| **Crew Matching (find subs)** | Out of scope | Build in Year 2 if traction |
| **Marketplace (buy/sell items)** | Distraction | Inventory tracking is enough |
| **AI Job Recommendations** | Speculative | Manual job posting is enough |

**Principle: Say no to 90% of ideas. Focus on 10% that drive revenue.**

---

## 📏 HOW TO RE-PRIORITIZE (If Context Changes)

If roadmap needs to shift, use this decision tree:

```
Does it bring in revenue?
├─ YES → Is it Tier 1, 2, or 3 customer need?
│  ├─ T1 → HIGH PRIORITY (build immediately)
│  ├─ T2 → MEDIUM PRIORITY (build after T1 stable)
│  └─ T3 → LOWER PRIORITY (build after T2 working)
│
└─ NO → Does it prevent churn?
   ├─ YES → HIGH PRIORITY (retention > acquisition)
   └─ NO → BACKLOG (deprioritize)
```

---

## ✅ DECISION FRAMEWORK (For New Requests)

When someone says "Can we build feature X?", check:

1. **Does it improve onboarding?** (T1 launch) → HIGH
2. **Does it prevent churn?** (Retention) → HIGH
3. **Does it enable revenue?** (T2/T3 expansion) → HIGH
4. **Is it competitive necessity?** (vs competitors) → MEDIUM
5. **Does it improve UI/UX?** (Polish) → MEDIUM
6. **Is it a customer request?** (One-off) → LOW
7. **Is it "nice to have"?** → BACKLOG

**Rule: Only YES to top 3 categories. Everything else goes to backlog.**

---

## 🎯 OWNERSHIP & ACCOUNTABILITY

| Phase | DRI (Owner) | Team | Success Metric |
|-------|-----------|------|---|
| **Phase 1 (Days 1-30)** | VP Sales + PM | Backend + Frontend + Ops | 10 customers, R6k MRR |
| **Phase 2 (Days 31-90)** | Head of Product | Mobile Dev + Backend + Sales | R25k MRR, 70% retention |
| **Phase 3 (Days 91-180)** | VP Product | All teams | R150k MRR, 2 Tier 3 deals |

---

## 📝 SPRINT STRUCTURE (How to Execute)

### Week-by-Week Breakdown (Example: Week 1)

**Monday (Planning)**
- [ ] Review weekly goals (Monday standup)
- [ ] Break features into 1-2 day tasks
- [ ] Assign owners (Backend, Frontend, Design)
- [ ] Set daily deployment target

**Tuesday-Thursday (Execution)**
- [ ] Daily standup (10 min)
- [ ] Ship code daily if possible
- [ ] QA test features as shipped
- [ ] Document in Slack/Linear

**Friday (Review)**
- [ ] Demo shipped features
- [ ] Gather customer feedback
- [ ] Calculate velocity (tasks/week)
- [ ] Plan next week Monday

**Velocity target: 8-12 substantial features/week during Phase 1**

---

## 💡 QUICK REFERENCE (Copy for Your Wall)

```
🔴 BUILD NOW (Days 1-30):
  • Landing page + Stripe
  • Onboarding UX
  • First invoice template
  • Email sequence
  • Support infrastructure

🟡 BUILD NEXT (Days 31-90):
  • Mobile app (iOS/Android)
  • ERP integration (Sage)
  • Offline sync
  • Approval workflows
  • WIP dashboard

🟢 BUILD LATER (Days 91-180):
  • SOC 2 certification
  • Advanced enterprise features
  • Geolocation tracking
  • Multi-org structure
  • Regional expansion

🚫 DON'T BUILD:
  • Advanced analytics dashboard
  • Custom reporting engine
  • Photo AI tagging
  • Crew marketplace
  • Anything not in top 3 categories
```

---

**Status**: 🟢 Ready for Sprint Planning  
**Next Step**: Week 1 Kickoff → Start Phase 1  
**Target**: 10 customers onboarded by Day 30
