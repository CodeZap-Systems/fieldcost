# Data Integrity Cleanup - Quick Start Guide (Windows PowerShell)
# Run these commands in sequence

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "FieldCost Data Integrity Cleanup" -ForegroundColor Cyan
Write-Host "Location: https://fieldcost.vercel.app" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# STEP 1: BACKUP
Write-Host "📌 STEP 1: Backup Production Database" -ForegroundColor Yellow
Write-Host "Run this SQL on production database first:" -ForegroundColor Gray
Write-Host ""
Write-Host "CREATE TABLE items_backup_20260315 AS SELECT * FROM items;" -ForegroundColor Green
Write-Host "CREATE TABLE customers_backup_20260315 AS SELECT * FROM customers;" -ForegroundColor Green
Write-Host "CREATE TABLE projects_backup_20260315 AS SELECT * FROM projects;" -ForegroundColor Green
Write-Host "CREATE TABLE invoices_backup_20260315 AS SELECT * FROM invoices;" -ForegroundColor Green
Write-Host ""
Read-Host "⏸️  Press Enter once backup is complete"

# STEP 2: DRY RUN CLEANUP
Write-Host ""
Write-Host "📌 STEP 2: Run Cleanup Script (DRY RUN - No Data Deleted)" -ForegroundColor Yellow
Write-Host "Command: node scripts/cleanup-duplicates.mjs" -ForegroundColor Gray
Write-Host ""
Write-Host "This will show you exactly what will be deleted:" -ForegroundColor Gray
Write-Host "  - Number of duplicate items" -ForegroundColor Gray
Write-Host "  - Number of duplicate customers" -ForegroundColor Gray
Write-Host "  - Number of duplicate projects" -ForegroundColor Gray
Write-Host "  - Number of duplicate invoices" -ForegroundColor Gray
Write-Host ""
$response = Read-Host "⏸️  Ready to run? (y/n)"
if ($response -eq "y") {
  Write-Host ""
  Write-Host "Running cleanup in DRY RUN mode..." -ForegroundColor Cyan
  node scripts/cleanup-duplicates.mjs
} else {
  Write-Host "Skipped dry run" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "📌 STEP 3: Review Results" -ForegroundColor Yellow
Write-Host "Check the output above. If it looks correct, proceed to production cleanup." -ForegroundColor Gray
Write-Host ""
$response = Read-Host "⏸️  Ready for PRODUCTION cleanup? (y/n)"
if ($response -ne "y") {
  Write-Host "Cleanup cancelled" -ForegroundColor Red
  exit 1
}

# STEP 3: PRODUCTION CLEANUP
Write-Host ""
Write-Host "⚠️  PRODUCTION MODE: Deleting duplicates..." -ForegroundColor Red
node scripts/cleanup-duplicates.mjs --production

# STEP 4: APPLY MIGRATION
Write-Host ""
Write-Host "📌 STEP 4: Apply Database Migration" -ForegroundColor Yellow
Write-Host "Command: npx prisma migrate deploy" -ForegroundColor Gray
Write-Host ""
npx prisma migrate deploy

# STEP 5: DEPLOY API
Write-Host ""
Write-Host "📌 STEP 5: Deploy Updated API" -ForegroundColor Yellow
Write-Host "Commands to run:" -ForegroundColor Gray
Write-Host ""
Write-Host "git add ." -ForegroundColor Green
Write-Host "git commit -m 'fix: Add comprehensive duplicate prevention (database + API)'" -ForegroundColor Green
Write-Host "git push origin main" -ForegroundColor Green
Write-Host ""
Read-Host "⏸️  Press Enter to continue"

git add .
git commit -m "fix: Add comprehensive duplicate prevention (database + API)"
git push origin main

Write-Host ""
Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 STEP 6: Verify Results (Run these SQL queries)" -ForegroundColor Yellow
Write-Host ""
Write-Host "-- Should all return 0 rows (no duplicates):" -ForegroundColor Gray
Write-Host ""
Write-Host "SELECT company_id, LOWER(name), COUNT(*) as count FROM items GROUP BY company_id, LOWER(name) HAVING COUNT(*) > 1;" -ForegroundColor Green
Write-Host "SELECT company_id, LOWER(name), COUNT(*) as count FROM customers GROUP BY company_id, LOWER(name) HAVING COUNT(*) > 1;" -ForegroundColor Green
Write-Host "SELECT company_id, LOWER(name), COUNT(*) as count FROM projects GROUP BY company_id, LOWER(name) HAVING COUNT(*) > 1;" -ForegroundColor Green
Write-Host "SELECT company_id, invoice_number, COUNT(*) as count FROM invoices GROUP BY company_id, invoice_number HAVING COUNT(*) > 1;" -ForegroundColor Green
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ CLEANUP COMPLETE" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
