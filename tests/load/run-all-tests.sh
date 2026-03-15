#!/usr/bin/env bash
# Load Test Runner - Execute all FieldCost load tests
# Usage: ./run-load-tests.sh [base-url]

BASE_URL="${1:-http://localhost:3000}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="load-test-results-$TIMESTAMP"

echo "=========================================="
echo "FieldCost Load Testing Suite"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo "Results Directory: $RESULTS_DIR"
echo ""

# Create results directory
mkdir -p "$RESULTS_DIR"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run a test
run_test() {
  local test_name=$1
  local test_file=$2
  
  echo ""
  echo -e "${YELLOW}Running: $test_name${NC}"
  echo "=========================================="
  
  # Run test with JSON output
  k6 run "$test_file" \
    --out json="$RESULTS_DIR/${test_name}.json" \
    --env BASE_URL="$BASE_URL"
  
  local exit_code=$?
  
  if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✓ $test_name PASSED${NC}"
    echo "$test_name: PASSED" >> "$RESULTS_DIR/results-summary.txt"
  else
    echo -e "${RED}✗ $test_name FAILED${NC}"
    echo "$test_name: FAILED (exit code: $exit_code)" >> "$RESULTS_DIR/results-summary.txt"
  fi
  
  return $exit_code
}

# Run all tests
echo ""
echo "Starting load tests..."
echo ""

# Test 1: Authentication
run_test "auth-load-test" "tests/load/auth-load-test.js"
AUTH_RESULT=$?

echo ""
sleep 5

# Test 2: Projects
run_test "project-load-test" "tests/load/project-load-test.js"
PROJECT_RESULT=$?

echo ""
sleep 5

# Test 3: Tasks
run_test "task-load-test" "tests/load/task-load-test.js"
TASK_RESULT=$?

echo ""
sleep 5

# Test 4: Invoices
run_test "invoice-load-test" "tests/load/invoice-load-test.js"
INVOICE_RESULT=$?

# Summary
echo ""
echo "=========================================="
echo -e "${YELLOW}TEST SUMMARY${NC}"
echo "=========================================="
echo ""

if [ -f "$RESULTS_DIR/results-summary.txt" ]; then
  cat "$RESULTS_DIR/results-summary.txt"
fi

echo ""
echo "Results saved to: $RESULTS_DIR/"
echo ""

# Overall result
if [ $AUTH_RESULT -eq 0 ] && [ $PROJECT_RESULT -eq 0 ] && [ $TASK_RESULT -eq 0 ] && [ $INVOICE_RESULT -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Review detailed results in: $RESULTS_DIR/"
  echo "2. Check metrics with: k6-html-reporter -i $RESULTS_DIR/auth-load-test.json"
  echo ""
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  echo ""
  echo "Review failed tests in: $RESULTS_DIR/"
  echo ""
  exit 1
fi
