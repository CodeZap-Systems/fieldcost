# FieldCost Load Testing Guide

Complete guide to running and interpreting k6 load tests for FieldCost.

---

## Overview

Load testing validates system performance under realistic traffic conditions. This guide covers:

- **What**: 4 k6 load test suites (Auth, Projects, Tasks, Invoices)
- **Why**: Ensure response times <500ms at 100 concurrent users
- **When**: Run before production deployment, after performance optimization, weekly in CI/CD
- **Where**: `tests/load/` directory with npm scripts

---

## Prerequisites

### Install k6

```bash
# macOS (Homebrew)
brew install k6

# Windows (Chocolatey)
choco install k6

# Linux (apt)
sudo apt-get install k6

# Or download from: https://grafana.com/products/cloud/k6/download/
```

### Verify Installation

```bash
k6 version
# Output: k6 v0.50.0 or later
```

---

## Load Test Suite

### Available Test Scripts

| Script | Purpose | VUs | Duration | Focus |
|--------|---------|-----|----------|-------|
| `auth-load-test.js` | Authentication flows | 100 | 120s | Login, register, logout, security |
| `project-load-test.js` | Project CRUD operations | 100 | 120s | Create, list, filter, report |
| `task-load-test.js` | Task management | 100 | 120s | Create, assign, complete, filter |
| `invoice-load-test.js` | Invoice generation | 100 | 120s | Create, PDF, calculate, update |

### Test Configuration

All tests use consistent configuration:

```javascript
stages: [
  { duration: '30s', target: 100 },  // Ramp up to 100 VUs over 30s
  { duration: '60s', target: 100 },  // Maintain 100 VUs for 60s
  { duration: '30s', target: 0 },    // Ramp down to 0 VUs over 30s
]

thresholds: {
  http_req_duration: ['p(95)<500', 'p(99)<1000'],  // Response time
  http_req_failed: ['rate<0.01'],                  // Error rate <1%
  'checks': ['rate>0.95'],                         // Check pass rate >95%
}
```

---

## Running Tests

### Individual Test Execution

```bash
# Run authentication load test
k6 run tests/load/auth-load-test.js

# Run with custom base URL
BASE_URL=http://staging.fieldcost.com k6 run tests/load/auth-load-test.js

# Run with custom environment
k6 run tests/load/auth-load-test.js --env BASE_URL=http://localhost:3000
```

### Sequential Test Execution

```bash
# Run all load tests one after another
k6 run tests/load/auth-load-test.js && \
k6 run tests/load/project-load-test.js && \
k6 run tests/load/task-load-test.js && \
k6 run tests/load/invoice-load-test.js

# Or use npm script
npm run test:load
```

### Parallel Test Execution (Advanced)

```bash
# Run all tests in parallel using npm
npm run test:load:parallel
```

### Using npm Scripts

```bash
# Run all load tests
npm run test:load

# Run tests with output
npm run test:load -- --out json=load-results.json

# Watch mode (reruns on file changes)
npm run test:load:watch
```

---

## Test Outputs & Metrics

### Console Output Example

```
          /\      |‾‾| /‾‾/‾‾/
     /\  /  \     |  |/  /  /
    /  \/    \    |     (  (
   /          \   |  |\  \
  / __________ \  |__| \__\

     execution: local
        script: tests/load/auth-load-test.js
        output: -

  scenarios: (100.00%) 1 scenario, 100 max VUs, 2m0s max duration
             default: 100 iterations shared among 100 VUs (maxDuration: 2m0s, gracefulStop: 30s)

     data_received..................: 245 MB 2.0 MB/s
     data_sent......................: 34 MB  284 kB/s
     http_req_blocked...............: avg=5.23ms   min=1.14ms  med=2.45ms  max=89.34ms p(90)=8.23ms  p(95)=12.45ms
     http_req_connecting............: avg=3.12ms   min=0s      med=1.98ms  max=45.23ms p(90)=5.23ms  p(95)=8.12ms
     http_req_duration..............: avg=187.45ms min=45.23ms med=156.78ms max=498.34ms p(90)=310.23ms p(95)=387.45ms p(99)=456.78ms
     http_req_failed................: 0%
     http_req_receiving.............: avg=12.34ms  min=2.11ms  med=8.45ms  max=89.23ms p(90)=24.56ms p(95)=34.23ms
     http_req_sending...............: avg=2.34ms   min=0.45ms  med=1.89ms  max=12.34ms p(90)=3.45ms  p(95)=4.56ms
     http_req_tls_handshaking.......: avg=0ms      min=0s      med=0s      max=0ms     p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=172.77ms min=42.12ms med=146.34ms max=478.67ms p(90)=298.45ms p(95)=367.89ms
     iteration_duration.............: avg=1.45s    min=1.12s   med=1.34s   max=2.89s   p(90)=1.78s   p(95)=1.98s
     iterations.....................: 1000 100/s
     vus............................: 100  100/s
     vus_max........................: 100
```

### Key Metrics Explained

| Metric | Definition | Target | Interpretation |
|--------|-----------|--------|-----------------|
| `http_req_duration` | Total request time | p(95)<500ms | 95% of requests < 500ms ✓ |
| `http_req_failed` | Failed requests | <1% | Error rate must be very low |
| `checks` | Custom validations | >95% | 95%+ checks must pass |
| `iterations` | Test cycles completed | High | More iterations = more load |
| `data_received` | Response volume | Varies | Indica network throughput |
| `data_sent` | Request volume | Varies | Traffic sent to system |

### What p(95) & p(99) Mean

- **p(95)**: 95th percentile - 95% of requests complete within this time
- **p(99)**: 99th percentile - 99% of requests complete within this time

**Example Interpretation**:
```
http_req_duration: p(95)<500ms, p(99)<1000ms

✓ PASS: 95% of requests ≤ 500ms AND 99% ≤ 1000ms
✗ FAIL: If 96% takes >500ms OR any takes >1000ms
```

---

## Performance Baselines

### Development Environment Baseline (3-minute test)

**Expected Results** (after initial optimization):

| Test | p(95) | p(99) | Error Rate | Status |
|------|-------|-------|-----------|--------|
| auth-load-test.js | <300ms | <600ms | <0.5% | ✓ |
| project-load-test.js | <400ms | <800ms | <1% | ✓ |
| task-load-test.js | <350ms | <700ms | <0.8% | ✓ |
| invoice-load-test.js | <450ms | <900ms | <1% | ✓ |

### Production Environment Baselines

| Metric | Target | Threshold |
|--------|--------|-----------|
| Error Rate | <0.5% | Critical if >1% |
| p(95) Response | <300ms | Warn if >400ms |
| p(99) Response | <800ms | Critical if >1000ms |
| CPU Usage | <70% | Critical if >85% |
| Memory Usage | <75% | Critical if >85% |
| Database Connections | <80% pool | Critical if exhausted |

---

## Interpreting Results

### ✓ Healthy Load Test Results

```
Characteristics:
- http_req_duration p(95)<500ms ✓
- http_req_failed rate<0.01 (error rate <1%) ✓
- checks rate>0.95 (>95% pass) ✓
- No gradual degradation during hold phase ✓
- Consistent response times throughout ✓

Action: Ready for deployment
```

### ⚠️ Warning Signs

```
Characteristics:
- http_req_duration p(95) = 450-500ms (borderline)
- http_req_failed rate = 0.5-1% (borderline)
- Slight performance degradation in final minute
- Memory creeping upward

Action: Investigate, optimize non-critical features
```

### ✗ Failing Load Test Results

```
Characteristics:
- http_req_duration p(95)>500ms ✗
- http_req_failed rate>1% ✗
- Rapid degradation during hold phase ✗
- Memory leak indicators
- Connection pool exhaustion

Action: Block deployment, debug immediately
```

---

## Load Test Analysis Workflow

### 1. Run Baseline Test

```bash
k6 run tests/load/auth-load-test.js
# Save output for comparison
```

### 2. Identify Failures

Looking for red flags in output:
- Any threshold violations (✗)
- Slow endpoints (>500ms)
- High error rates (>1%)

### 3. Use k6 Cloud for Analysis

```bash
# Run and upload to k6 Cloud
k6 run --out cloud tests/load/auth-load-test.js

# View at: https://app.k6.io/results/xxxxx
```

### 4. Create JSON Report for Analysis

```bash
k6 run --out json=results.json tests/load/auth-load-test.js

# Analyze with tools or scripts
cat results.json | jq '.data.result'
```

### 5. Drill Down into Slow Endpoints

```javascript
// Modify test to isolate slow endpoint
group('Single Endpoint Test', () => {
  const response = http.get('${BASE_URL}/api/slow-endpoint', {
    headers: { 'Authorization': authToken }
  });
  
  console.log(`Response time: ${response.timings.duration}ms`);
});
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/load-test.yml
name: Load Testing

on:
  schedule:
    - cron: '0 2 * * *'  # Run daily at 2 AM
  workflow_dispatch:     # Manual trigger

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: grafana/setup-k6-action@v1
      
      - name: Run load tests
        run: |
          k6 run tests/load/auth-load-test.js
          k6 run tests/load/project-load-test.js
          k6 run tests/load/task-load-test.js
          k6 run tests/load/invoice-load-test.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
```

### Pre-Deployment Check

```bash
# Run complete load test suite before deployment
npm run test:load

# If all pass, safe to deploy
echo "Load tests passed ✓ - Ready to deploy"
```

---

## Troubleshooting

### Problem: "Connection refused" / 404 errors

```bash
# Verify server is running
curl http://localhost:3000/api/health

# Run with debugging
k6 run -v tests/load/auth-load-test.js
```

### Problem: High error rate (>1%)

```bash
# Check server logs
npm run dev  # or docker logs

# Run with fewer VUs to isolate
# Edit test: change target: 100 to target: 10
k6 run tests/load/auth-load-test.js
```

### Problem: Response times exceed 500ms

```bash
# Check database performance
# Analyze slow queries in logs
# Review API endpoint efficiency

# Run load test with profiling
k6 run --out cloud tests/load/auth-load-test.js
# View flame graph in k6 Cloud
```

### Problem: Memory usage increasing

```bash
# Indicates memory leak in application
# Check for:
# - Unreleased event listeners
# - Growing caches without eviction
# - Connection pool leaks

# Run with prolonged hold phase to identify
# Modify: { duration: '60s', target: 100 } to { duration: '300s', target: 100 }
```

---

## Advanced Scenarios

### Stress Testing (Gradual Increase)

```javascript
export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 200 },  // Beyond expected load
    { duration: '1m', target: 500 },  // Find breaking point
    { duration: '1m', target: 0 },
  ],
};
```

### Spike Testing (Sudden Traffic)

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '5s', target: 500 },    // Sudden spike
    { duration: '30s', target: 500 },   // Maintain elevated
    { duration: '30s', target: 0 },
  ],
};
```

### Endurance Testing (Long Duration)

```javascript
export const options = {
  stages: [
    { duration: '5m', target: 50 },    // Ramp up
    { duration: '30m', target: 50 },   // Hold for 30 minutes
    { duration: '5m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'],  // Stricter for endurance
  },
};
```

---

## Best Practices

### 1. **Realistic Traffic Patterns**

```javascript
// ✓ Good: Mimics real user behavior
group('Typical User Journey', () => {
  // Login
  http.post(login);
  sleep(1);           // Think time
  
  // Browse projects
  http.get(projects);
  sleep(2);
  
  // Create task
  http.post(createTask);
  sleep(1);
  
  // Logout
  http.post(logout);
});

// ✗ Bad: Unrealistic hammering
for (let i = 0; i < 1000; i++) {
  http.post(api);     // No think time
}
```

### 2. **Use Environment Variables**

```bash
# Don't hardcode
BASE_URL=http://production.com k6 run test.js

# In test
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
```

### 3. **Monitor while Testing**

```bash
# Terminal 1: Run load test
k6 run test.js

# Terminal 2: Monitor server
watch 'ps aux | grep node'

# Terminal 3: Monitor database
watch 'psql -d fieldcost -c "SELECT count(*) FROM pg_stat_activity;"'
```

### 4. **Iterate on Findings**

1. Run test
2. Identify bottleneck
3. Optimize code
4. Re-run test
5. Verify improvement

---

## Performance Optimization Tips

### API Layer

```javascript
// ✓ Add response caching
app.get('/api/projects', cache('1 minute'), handler);

// ✓ Implement pagination
app.get('/api/projects?page=1&limit=50');

// ✓ Use database indexes
CREATE INDEX idx_project_company ON projects(company_id);
```

### Database

```sql
-- ✓ Add indexes on filtered columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_invoice_status ON invoices(status);

-- ✓ Optimize query
EXPLAIN ANALYZE SELECT * FROM invoices WHERE status = 'sent';

-- ✓ Use prepared statements
```

### Load Distribution

```
// ✓ Use load balancer
├── Load Balancer
├── Instance 1
├── Instance 2
└── Instance 3

// ✓ Scale database connections
PGPOOL_NUM_INIT_CHILDREN=32
PGPOOL_MAX_POOL=4
```

---

## Next Steps

1. **Run baseline tests** against development environment
2. **Document current baselines** for your environment
3. **Schedule weekly automated runs** in CI/CD
4. **Set up k6 Cloud** for historical tracking
5. **Create performance runbooks** for response to failures

---

## Resources

- **k6 Documentation**: https://k6.io/docs/
- **k6 CLI Reference**: https://k6.io/docs/cli/
- **k6 Cloud**: https://app.k6.io/
- **Load Testing Best Practices**: https://k6.io/blog/

---

## Support

For issues with load tests:

1. Check test output for specific failures
2. Review API logs for server-side errors
3. Run with `-v` flag for verbose output
4. Test against local environment first
5. Contact DevOps for production testing

---

**Last Updated**: March 2026  
**Load Tests**: 4 suites (Auth, Projects, Tasks, Invoices)  
**Target**: p(95)<500ms, error rate <1%
