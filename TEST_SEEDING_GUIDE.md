# Test Data Seeding Guide

## 🌱 Overview

The test seeding system automatically populates your test database with realistic FieldCost data for automated testing. This includes test users, companies, projects, invoices, tasks, customers, and inventory items.

---

## 📋 What Gets Seeded

### Test Users (4 users)
| Email | Password | Role |
|-------|----------|------|
| `qa_admin@fieldcost.com` | `TestPassword123!` | admin |
| `qa_pm@fieldcost.com` | `TestPassword123!` | project_manager |
| `qa_field@fieldcost.com` | `TestPassword123!` | field_crew |
| `qa_accountant@fieldcost.com` | `TestPassword123!` | accountant |

### Test Companies (2 companies)
- **QA Test Contractor** (contractor type)
  - Tax Number: QA123456789
  - Registration: QA001
  
- **QA Test Mining** (mining type)
  - Tax Number: QA987654321
  - Registration: QA002

### Test Projects (4 projects)
- Phase 1 (Active, R50,000 budget)
- Phase 2 (Planning, R75,000 budget)
- (2 per company)

### Test Data Per Company
- **Projects**: 2
- **Invoices**: 4 (with line items, tax calculations)
- **Tasks**: 6 (various statuses and priorities)
- **Customers**: 2
- **Inventory Items**: 3

---

## 🚀 Quick Start

### 1. Configure Environment
```bash
# Copy template to .env.test
cp .env.test.example .env.test

# Edit with your Supabase credentials
nano .env.test
```

### 2. Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

### 3. Seed Test Data (in another terminal)
```bash
npm run test:seed
```

### 4. Run Tests
```bash
npm test
```

---

## 📖 Common Usage Patterns

### Seed Fresh Data (Clear Then Seed)
```bash
npm run test:seed:clear
# Deletes all test data, then seeds fresh
```

### Seed Without Clearing
```bash
npm run test:seed
# Adds test data to existing database
# Safe to run multiple times
```

### Seed Specific Modules
The seeder creates data for all modules. To test just one module:

```bash
# After seeding, run specific test
npm run test:auth        # Test just authentication
npm run test:projects    # Test just projects
npm run test:invoices    # Test just invoices
```

### Seed During CI/CD
```bash
# In GitHub Actions or other CI
npm run test:seed
npm test
```

---

## 🔍 What Each Seed Function Does

### `seedUsers()`
- Creates 4 test users with different roles
- Confirms emails automatically
- All use password: `TestPassword123!`

### `seedCompanies()`
- Creates contractor and mining company types
- Includes tax numbers and registration numbers
- Returns company IDs for use in other seeders

### `seedProjects(projectIds)`
- Creates 2 projects per company
- Includes realistic budgets (R50k-R75k)
- Sets start/end dates for 90-120 day projects
- Mix of active and planning statuses

### `seedInvoices(projects)`
- Creates 2 invoices per project
- Includes realistic line items (labor, materials)
- Auto-calculates subtotal, 15% VAT, and totals
- Mix of draft and sent statuses

### `seedTasks(projects)`
- Creates 3 tasks per project
- Includes todo, in_progress statuses
- Sets priorities (high, medium)
- 7-30 day due dates

### `seedCustomers(companies)`
- Creates 2 customers per company
- Realistic South African contact info
- Email and phone validation ready

### `seedInventory(companies)`
- Creates 3 items per company (steel, concrete, safety)
- Includes SKUs, costs, and selling prices
- Low stock thresholds for testing

---

## 🛡️ Safety Features

### Idempotent
- Safe to run multiple times
- Won't create duplicates (same data each run)
- Warns if users already exist

### Dependency-Aware
- Seeds in correct order (users → companies → projects → etc.)
- Returns IDs for downstream tables
- Handles errors gracefully

### Transactional
- If something fails, shows warning not error
- Continues with other data
- Completes as much as possible

---

## 🐛 Troubleshooting

### "Missing Supabase credentials"
```bash
# Check .env.test has values
cat .env.test

# Should have:
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### "User already exists" warnings
This is normal if you've run seeder before. It means:
- Test user already in database
- Continuing with other data
- Safe to ignore ⚠️

### Database connection errors
```bash
# Verify database is running
psql $DATABASE_URL -c "SELECT 1"

# Check dev server is running
curl http://localhost:3000
```

### Cannot find module '@supabase/supabase-js'
```bash
# Install dependencies
npm install
```

---

## 📊 Verification

### Check Data Was Seeded
```bash
# In Supabase dashboard:
# - Database → Tables → users (should see 4 test users)
# - Database → Tables → companies (should see 2 companies)
# - Database → Tables → projects (should see 4 projects)
```

### Run Immediate Test
```bash
# Try login as test user
npm run test:auth
# Should pass 16+ tests
```

### Check Data Structure
```sql
-- List test companies
SELECT name, type, registrationNumber FROM companies 
WHERE name LIKE 'QA%';

-- Count test projects
SELECT COUNT(*) as project_count FROM projects 
WHERE name LIKE 'QA%';

-- Check invoice totals
SELECT invoiceNumber, subtotal, tax, total FROM invoices 
WHERE invoiceNumber LIKE 'QA%';
```

---

## 🔄 Seed Data Lifecycle

### Initial Setup
```bash
npm run test:seed              # First time
npm run dev &                  # Start server
npm test                       # Run tests
```

### Subsequent Test Runs
```bash
npm test                       # Uses existing data
# No need to re-seed unless testing business logic changes
```

### Before Major Changes
```bash
npm run test:seed:clear        # Fresh data
npm test                       # Full validation
```

---

## ⚙️ Configuration

### Adjust Seed Data
Edit `scripts/test-seed.mjs`:

```javascript
// Change test user email
const testUsers = [
  {
    email: 'your-email@example.com',  // ← Change here
    password: 'TestPassword123!',
    // ...
  }
];

// Change project budget
const generateProjects = (companyId) => [
  {
    name: 'Your Project Name',
    budget: 100000,  // ← Change budget
    // ...
  }
];
```

### Disable Specific Seeders
Comment out in `main()` function:

```javascript
async function main() {
  // await seedUsers();           // Skip users
  const companies = await seedCompanies();
  const projects = await seedProjects(companies);
  // await seedInvoices(projects);  // Skip invoices
  // ...
}
```

---

## 🎓 Best Practices

✅ **DO:**
- Run `npm run test:seed` before first test session
- Use `npm run test:seed:clear` before regression testing
- Check both console output and database for verification
- Keep .env.test in .gitignore (contains secrets)

❌ **DON'T:**
- Run seeder on production database (wrong credentials)
- Manually edit test data in database (seed will overwrite)
- Commit .env.test to git
- Change seeder without updating test expectations

---

## 📈 Expected Output

Successful seed run looks like:

```
🌱 FieldCost Test Data Seeder

==================================================

👥 Seeding test users...
✅ Created user: qa_admin@fieldcost.com
✅ Created user: qa_pm@fieldcost.com
✅ Created user: qa_field@fieldcost.com
✅ Created user: qa_accountant@fieldcost.com

🏢 Seeding test companies...
✅ Created company: QA Test Contractor (ID: abc123)
✅ Created company: QA Test Mining (ID: def456)

📋 Seeding test projects...
✅ Created project: QA Test Project - Phase 1
✅ Created project: QA Test Project - Phase 2
✅ Created project: QA Test Project - Phase 1
✅ Created project: QA Test Project - Phase 2

💰 Seeding test invoices...
✅ Created invoice: QA-INV-1234567890-001
✅ Created invoice: QA-INV-1234567890-002
✅ Created invoice: QA-INV-1234567890-003
✅ Created invoice: QA-INV-1234567890-004

✓ Seeding test tasks...
✅ Created task: QA Foundation Setup
✅ Created task: QA Structural Work
✅ Created task: QA Finishing
... (12 tasks total)

👤 Seeding test customers...
✅ Created customer: QA Test Customer A
✅ Created customer: QA Test Customer B
✅ Created customer: QA Test Customer A
✅ Created customer: QA Test Customer B

📦 Seeding test inventory...
✅ Created inventory item: Steel Beam - 10m
✅ Created inventory item: Concrete Mix - Bag
✅ Created inventory item: Safety Helmet - Orange
... (6 items total)

==================================================

✅ Test data seeding complete!

Test Credentials:
  Admin:      qa_admin@fieldcost.com / TestPassword123!
  PM:         qa_pm@fieldcost.com / TestPassword123!
  Field:      qa_field@fieldcost.com / TestPassword123!
  Accountant: qa_accountant@fieldcost.com / TestPassword123!

Ready for testing! Run: npm test
```

---

## 🚀 Integration with Testing

### Before E2E Tests
```bash
npm run test:seed              # Populate test database
npm run dev &                  # Start server
npm run test:e2e              # Run Playwright tests
pkill -f "next dev"            # Stop server
```

### Before API Tests
```bash
npm run test:seed              # Populate test database
npm run test:api              # Run Jest tests
```

### Full CI/CD Flow
```bash
npm run test:seed              # ← Add to CI pipeline
npm run test                   # Runs both E2E and API
```

---

## 📝 Notes

- Test data includes realistic South African details (addresses, tax numbers)
- Prices and budgets designed for field construction scenarios
- Invoice tax calculation uses standard 15% VAT
- All timestamps use current time (relative dates for future)
- Safe to run in development, staging, AND ci environments

---

## Need Help?

See related documentation:
- [Testing Guide](./tests/README.md)
- [Test Execution Commands](./tests/TEST_EXECUTION_GUIDE.txt)
- [Implementation Checklist](./tests/IMPLEMENTATION_CHECKLIST.md)
- [GitHub Actions CI/CD](./.github/workflows/test.yml)
