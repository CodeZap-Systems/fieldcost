# Git Branching Strategy for FieldCost

## Branch Structure

### 🔴 `main` - PRODUCTION
**Environment**: Live Vercel deployment  
**Purpose**: Production-ready code serving real clients  
**Rules**:
- ⚠️ **NEVER commit directly to main**
- Only merge from `staging` after full testing
- Requires pull request approval
- All tests must pass
- Deployed automatically to Vercel on merge

**Protection Settings** (Set in GitHub):
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Restrict who can push to matching branches

---

### 🟡 `staging` - STAGING ENVIRONMENT
**Environment**: Staging Vercel deployment (if set up) or local testing  
**Purpose**: Integration testing for Tier 2 features  
**Rules**:
- Merge feature branches here FIRST
- Test thoroughly before promoting to main
- Use staging Supabase database (not production!)
- Environment variables should use `STAGING_` prefix

**Protection Settings** (Set in GitHub):
- Require pull request reviews before merging (optional but recommended)
- Require status checks to pass before merging

---

### 🟢 `feature/*` - FEATURE BRANCHES
**Environment**: Local development  
**Purpose**: Individual Tier 2 feature development  
**Naming Convention**: `feature/[short-description]`

**Examples**:
- `feature/payment-gateway`
- `feature/analytics-dashboard`
- `feature/email-notifications`
- `feature/advanced-reporting`

**Rules**:
- Create from `staging` (NOT from main!)
- One feature per branch
- Delete after merging to staging
- Keep branches short-lived (merge within 1-2 weeks)

---

## Workflow Diagram

```
feature/analytics-dashboard
          ↓ (PR)
       staging
          ↓ (PR after testing)
        main → Vercel Production
```

---

## Complete Feature Development Workflow

### Step 1: Start New Feature
```bash
git checkout staging
git pull origin staging
git checkout -b feature/analytics-dashboard
```

### Step 2: Develop
- Write code
- Test locally
- Commit often

```bash
git add .
git commit -m "feat: add analytics dashboard with charts"
```

### Step 3: Push Feature Branch
```bash
git push origin feature/analytics-dashboard
```

### Step 4: Create Pull Request
- Go to GitHub
- Click "New Pull Request"
- **Base:** `staging` (NOT main!)
- **Compare:** `feature/analytics-dashboard`
- Fill out PR template
- Request review

### Step 5: Merge to Staging
- After approval, merge to staging
- Delete feature branch
- Test on staging environment

### Step 6: Promote to Production (Later)
- Create PR from `staging` → `main`
- After final testing, merge
- Vercel auto-deploys to production

---

## Environment Variables

### Production (main branch)
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```

### Staging (staging branch)
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_STAGING_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_key
```

**⚠️ IMPORTANT**: Always use staging database for feature development!

---

## Emergency Hotfix Workflow

For critical production bugs:

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# Fix bug
git add .
git commit -m "fix: resolve critical production issue"

# Push and create PR directly to main
git push origin hotfix/critical-bug-fix
# Create PR: hotfix/critical-bug-fix → main

# After merging to main, also merge to staging
git checkout staging
git merge main
git push origin staging
```

---

## Common Commands Reference

### Switch between branches
```bash
git checkout main      # Switch to production
git checkout staging   # Switch to staging
git checkout feature/my-feature  # Switch to feature
```

### Update your branch
```bash
git pull origin staging  # Get latest staging changes
```

### See all branches
```bash
git branch -a  # Show all branches (local and remote)
```

### Delete old feature branch
```bash
git branch -d feature/old-feature  # Delete locally
git push origin --delete feature/old-feature  # Delete on GitHub
```

---

## Setting Up Branch Protection on GitHub

1. Go to: `https://github.com/CodeZap-Systems/fieldcost/settings/branches`
2. Click "Add rule" for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (at least 1)
   - ✅ Dismiss stale pull request approvals
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators (apply to everyone)

3. Optionally add rule for `staging`:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass

---

## Emergency Contact

If you need to override branch protection for an emergency:
1. Contact repository admin
2. Document the reason
3. Create follow-up PR to fix any issues

---

**Last Updated**: March 5, 2026  
**Maintained By**: FieldCost Development Team
