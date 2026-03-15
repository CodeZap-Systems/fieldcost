#!/bin/bash
# Data Integrity Cleanup - Quick Start Guide
# Run these commands in sequence

echo "=========================================="
echo "FieldCost Data Integrity Cleanup"
echo "Location: https://fieldcost.vercel.app"
echo "=========================================="
echo ""

# STEP 1: BACKUP
echo "📌 STEP 1: Backup Production Database"
echo "Run this SQL on production database first:"
echo ""
echo "CREATE TABLE items_backup_20260315 AS SELECT * FROM items;"
echo "CREATE TABLE customers_backup_20260315 AS SELECT * FROM customers;"
echo "CREATE TABLE projects_backup_20260315 AS SELECT * FROM projects;"
echo "CREATE TABLE invoices_backup_20260315 AS SELECT * FROM invoices;"
echo ""
echo "⏸️  Press Enter once backup is complete..."
read

# STEP 2: DRY RUN CLEANUP
echo ""
echo "📌 STEP 2: Run Cleanup Script (DRY RUN - No Data Deleted)"
echo "Command: node scripts/cleanup-duplicates.mjs"
echo ""
echo "This will show you exactly what will be deleted:"
echo "  - Number of duplicate items"
echo "  - Number of duplicate customers"
echo "  - Number of duplicate projects"
echo "  - Number of duplicate invoices"
echo ""
echo "⏸️  Ready to run? (y/n)"
read response
if [ "$response" = "y" ]; then
  node scripts/cleanup-duplicates.mjs
else
  echo "Skipped dry run"
  exit 1
fi

echo ""
echo "📌 STEP 3: Review Results"
echo "Check the output above. If it looks correct, proceed to production cleanup."
echo ""
echo "⏸️  Ready for PRODUCTION cleanup? (y/n)"
read response
if [ "$response" != "y" ]; then
  echo "Cleanup cancelled"
  exit 1
fi

# STEP 3: PRODUCTION CLEANUP
echo ""
echo "⚠️  PRODUCTION MODE: Deleting duplicates..."
node scripts/cleanup-duplicates.mjs --production

# STEP 4: APPLY MIGRATION
echo ""
echo "📌 STEP 4: Apply Database Migration"
echo "Command: npx prisma migrate deploy"
echo ""
npx prisma migrate deploy

# STEP 5: DEPLOY API
echo ""
echo "📌 STEP 5: Deploy Updated API"
echo "Commands to run:"
echo ""
echo "git add ."
echo "git commit -m 'fix: Add comprehensive duplicate prevention (database + API)'"
echo "git push origin main"
echo ""
echo "⏸️  Press Enter to continue..."
read

git add .
git commit -m "fix: Add comprehensive duplicate prevention (database + API)"
git push origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📌 STEP 6: Verify Results (Run these SQL queries)"
echo ""
echo "SELECT company_id, LOWER(name), COUNT(*) FROM items GROUP BY company_id, LOWER(name) HAVING COUNT(*) > 1;"
echo "SELECT company_id, LOWER(name), COUNT(*) FROM customers GROUP BY company_id, LOWER(name) HAVING COUNT(*) > 1;"
echo "SELECT company_id, LOWER(name), COUNT(*) FROM projects GROUP BY company_id, LOWER(name) HAVING COUNT(*) > 1;"
echo "SELECT company_id, invoice_number, COUNT(*) FROM invoices GROUP BY company_id, invoice_number HAVING COUNT(*) > 1;"
echo ""
echo "All should return 0 rows!"
echo ""
echo "=========================================="
echo "✅ CLEANUP COMPLETE"
echo "=========================================="
