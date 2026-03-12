@echo off
REM Quick Test Execution Script for CI/CD Pipelines (Windows)
REM Usage: run-quick-tests.bat

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║          🚀 FieldCost Automated Test Suite - Quick Mode            ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

set PASSED=0
set FAILED=0

REM Run Core Tests (Required for all deployments)
echo 📋 CORE API TESTS (Required)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo Running: Comprehensive API Tests...
node comprehensive-automated-tests.mjs >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo ✅ Comprehensive API Tests PASSED
  set /a PASSED+=1
) else (
  echo ❌ Comprehensive API Tests FAILED
  set /a FAILED+=1
)

echo.
echo 🔐 SECURITY TESTS (Recommended)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo Running: Security Tests...
node test-security.mjs >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo ✅ Security Tests PASSED
  set /a PASSED+=1
) else (
  echo ❌ Security Tests FAILED
  set /a FAILED+=1
)

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║                         📊 TEST SUMMARY                            ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.
echo Tests Passed:   !PASSED!
echo Tests Failed:   !FAILED!
echo.

if %FAILED% equ 0 (
  echo ✅ All tests passed! Application is ready for deployment.
  exit /b 0
) else (
  echo ❌ Some tests failed. Please review the output above.
  exit /b 1
)
