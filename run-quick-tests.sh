#!/bin/bash
# Quick Test Execution Script for CI/CD Pipelines
# Usage: ./run-quick-tests.sh

set -e

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║          🚀 FieldCost Automated Test Suite - Quick Mode            ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test execution function
run_test_suite() {
  local test_name=$1
  local test_file=$2
  
  echo -e "${YELLOW}Running: ${test_name}${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if node "$test_file" 2>&1; then
    echo -e "${GREEN}✅ ${test_name} PASSED${NC}"
    return 0
  else
    echo -e "${RED}❌ ${test_name} FAILED${NC}"
    return 1
  fi
  echo ""
}

# Track results
PASSED=0
FAILED=0
START_TIME=$(date +%s)

# Run Core Tests (Required for all deployments)
echo -e "\n${YELLOW}📋 CORE API TESTS (Required)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if run_test_suite "Comprehensive API Tests" "comprehensive-automated-tests.mjs"; then
  ((PASSED++))
else
  ((FAILED++))
fi

# Run Security Tests (Recommended)
echo -e "\n${YELLOW}🔐 SECURITY TESTS (Recommended)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if run_test_suite "Security & Penetration Tests" "test-security.mjs"; then
  ((PASSED++))
else
  ((FAILED++))
fi

# Run Optional Tests (Can skip in fast CI pipelines)
if [ "$FULL_TEST" == "true" ]; then
  echo -e "\n${YELLOW}📊 OPTIONAL TESTS (Full Suite)${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if run_test_suite "Database Schema Tests" "test-database-schema.mjs"; then
    ((PASSED++))
  else
    ((FAILED++))
  fi
  
  if run_test_suite "Data Validation Tests" "test-data-validation.mjs"; then
    ((PASSED++))
  else
    ((FAILED++))
  fi
  
  if run_test_suite "Performance Tests" "test-performance.mjs"; then
    ((PASSED++))
  else
    ((FAILED++))
  fi
fi

# Final Summary
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                         📊 TEST SUMMARY                            ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Tests Passed:   ${GREEN}${PASSED}${NC}"
echo -e "Tests Failed:   ${RED}${FAILED}${NC}"
echo "Execution Time: ${DURATION}s"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Application is ready for deployment.${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
  exit 1
fi
