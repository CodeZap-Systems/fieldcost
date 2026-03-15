#!/bin/bash
# Test Execution Script
# Run this to execute all tests with proper configuration

set -e

echo "================================"
echo "FieldCost Test Suite Runner"
echo "================================"
echo ""

# Check if server is running
echo "Checking if development server is running on localhost:3000..."
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "❌ Server not running. Start it with: npm run dev"
  exit 1
fi
echo "✅ Server is running"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
TEST_TYPE=${1:-"all"}

run_api_tests() {
  echo "${YELLOW}Running API Tests with Jest + Supertest...${NC}"
  npm test -- tests/api --verbose --coverage=false
  echo "${GREEN}✅ API Tests Complete${NC}"
  echo ""
}

run_e2e_tests() {
  echo "${YELLOW}Running E2E Tests with Playwright...${NC}"
  npx playwright test tests/e2e
  echo "${GREEN}✅ E2E Tests Complete${NC}"
  echo ""
}

run_tier2_tests() {
  echo "${YELLOW}Running Tier 2 Feature Tests...${NC}"
  echo "Testing Quotations..."
  npm test -- tests/api/quotes.test.ts --verbose --coverage=false
  npx playwright test tests/e2e/quotes.spec.ts
  
  echo ""
  echo "Testing Suppliers..."
  npm test -- tests/api/suppliers.test.ts --verbose --coverage=false
  npx playwright test tests/e2e/suppliers.spec.ts
  
  echo ""
  echo "Testing Purchase Orders & GRN..."
  npm test -- tests/api/purchase-orders.test.ts --verbose --coverage=false
  npx playwright test tests/e2e/purchase-orders.spec.ts
  
  echo "${GREEN}✅ Tier 2 Tests Complete${NC}"
  echo ""
}

case $TEST_TYPE in
  "api")
    run_api_tests
    ;;
  "e2e")
    run_e2e_tests
    ;;
  "tier2")
    run_tier2_tests
    ;;
  "all")
    run_api_tests
    run_e2e_tests
    ;;
  *)
    echo "Usage: ./run-tests.sh [api|e2e|tier2|all]"
    exit 1
    ;;
esac

echo ""
echo "${GREEN}================================${NC}"
echo "${GREEN}Test Execution Complete!${NC}"
echo "${GREEN}================================${NC}"
echo ""
echo "📊 To view test results:"
echo "   - API: Check terminal output above"
echo "   - E2E: Run 'npx playwright show-report'"
echo ""
