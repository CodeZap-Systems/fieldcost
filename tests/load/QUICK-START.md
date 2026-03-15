# Quick Start Guide - Load Testing with k6

## Installation

### Windows
```powershell
choco install k6
```

### macOS
```bash
brew install k6
```

### Linux
```bash
sudo apt-get install k6
```

---

## Running Tests

### Single Test Runs

```bash
# Authentication test
k6 run tests/load/auth-load-test.js

# Project test
k6 run tests/load/project-load-test.js

# Task test
k6 run tests/load/task-load-test.js

# Invoice test
k6 run tests/load/invoice-load-test.js
```

### With Custom Base URL

```bash
BASE_URL=http://production.example.com:3000 k6 run tests/load/auth-load-test.js
```

### Run All Tests

**Windows (PowerShell):**
```powershell
.\tests\load\run-load-tests.ps1

# With custom URL
.\tests\load\run-load-tests.ps1 -BaseUrl "http://example.com:3000"

# Generate HTML reports
.\tests\load\run-load-tests.ps1 -GenerateReport

# Stop on first failure
.\tests\load\run-load-tests.ps1 -StopOnFailure
```

**macOS/Linux:**
```bash
./tests/load/run-all-tests.sh

# With custom URL
./tests/load/run-all-tests.sh http://example.com:3000
```

---

## Export Results

### JSON Output
```bash
k6 run tests/load/auth-load-test.js --out json=results.json
```

### Generate HTML Report

```bash
# Install reporter (once)
npm install -g @grafana/k6-html-reporter

# Generate HTML from JSON results
k6-html-reporter -i results.json -o report.html
```

---

## Monitor Performance

### Thresholds Overview

Each test enforces:
- **Response Time (p95):** < 500ms ✓
- **Response Time (p99):** < 1000ms ✓
- **Error Rate:** < 10% ✓
- **Check Pass Rate:** > 95% ✓

### Real-time Monitoring

```bash
# Run with verbose output
k6 run tests/load/auth-load-test.js -v

# Watch specific metric
k6 run tests/load/auth-load-test.js --logformat json | grep "http_req_duration"
```

---

## Virtual Users & Load

Each test runs:
1. **Warm-up** (30s): Ramp to 10 VUs
2. **Ramp-up** (1m): Ramp to 50 VUs
3. **Full load** (1.5m): Ramp to 100 VUs
4. **Sustained** (3m): Hold at 100 VUs
5. **Cool-down** (1.5m): Ramp back to 0

**Total Duration:** ~8 minutes

---

## Success/Failure Criteria

### ✓ PASSED Test Output
```
checks:..................... [ 96.5% ] ✓
http_req_duration (p95)...... [ ok ] ✓ 
http_req_duration (p99)...... [ ok ] ✓ 
http_req_failed............. [ ok ] ✓ rate<10%
```

### ✗ FAILED Test Output
```
checks:..................... [ 89.2% ] ✗
http_req_duration (p95)...... [ fail ] ✗ p(95) > 500ms
http_req_failed............. [ fail ] ✗ rate>10%
```

---

## Customization

### Change VU Count

Edit test file, find `stages`:
```javascript
export const options = {
  stages: [
    { duration: '30s', target: 20 },    // Change 10 → 20
    { duration: '1m', target: 100 },    // Change 50 → 100
    { duration: '1m30s', target: 200 }, // Change 100 → 200
  ]
}
```

### Change Thresholds

```javascript
thresholds: {
  'http_req_duration': [
    'p(95) < 1000',  // More lenient (1000ms)
    'p(99) < 2000',  // More lenient (2000ms)
  ],
  'http_req_failed': ['rate < 0.2'], // Allow 20% errors
}
```

---

## Troubleshooting

### Port Already in Use
```bash
# Use different port or export results to different location
BASE_URL=http://localhost:3001 k6 run tests/load/auth-load-test.js
```

### Server Not Responding
```bash
# Check if server is running
curl http://localhost:3000/api/demo

# Start server first
npm run dev
```

### Rate Limiting Errors
```
Error: 429 Too Many Requests
```
- Reduce `target` VU count in test stages
- Increase duration between requests
- Check server rate limit configuration

### Memory Issues
```bash
# Reduce VU count or test duration
k6 run tests/load/auth-load-test.js --vus 50 --duration 2m
```

---

## Performance Targets

### Expected Results

| Test | p95 | p99 | Error Rate |
|------|-----|-----|-----------|
| Auth | 200ms | 400ms | < 1% |
| Projects | 180ms | 420ms | < 1% |
| Tasks | 150ms | 380ms | < 1% |
| Invoices | 250ms | 550ms | < 2% |
| PDF Gen | 600ms | 1200ms | < 2% |

---

## Common Metrics

```
VUs active.............. Current number of virtual users
VUs running............ Active VUs executing iterations
Iterations............ Total test iterations completed
http_reqs............ Total HTTP requests made
http_req_duration... Response time metrics
http_req_failed..... Failed HTTP requests
checks.............. Assertion pass/fail counts
```

---

## Integration with CI/CD

### GitHub Actions
```yaml
- name: Run Load Tests
  run: |
    npm install k6
    k6 run tests/load/auth-load-test.js
```

### Jenkins
```groovy
stage('Load Testing') {
  steps {
    sh 'k6 run tests/load/auth-load-test.js --out json=results.json'
    publishHTML([
      reportDir: '.', 
      reportFiles: 'results.json'
    ])
  }
}
```

---

## Cloud Testing

### Run on Grafana Cloud
```bash
# Login first
k6 cloud auth

# Run on cloud infrastructure
k6 cloud run tests/load/auth-load-test.js

# View results
k6 cloud status
```

---

## Next Steps

1. **Run baseline test:** Execute tests against current environment
2. **Document results:** Save performance metrics
3. **Set SLOs:** Define acceptable thresholds for your team
4. **Automate:** Add to CI/CD pipeline
5. **Monitor:** Run regularly to detect regressions

---

**For detailed documentation, see [tests/load/README.md](./README.md)**
