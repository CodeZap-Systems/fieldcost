# FieldCost Load Testing Suite

Comprehensive load testing scripts using k6 for the FieldCost SaaS platform.

## Prerequisites

### Install k6

**Windows (via Chocolatey):**
```powershell
choco install k6
```

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo apt-get install k6
```

**Or download from:** https://k6.io/docs/getting-started/installation/

## Test Scripts Overview

### 1. Authentication Load Test (`auth-load-test.js`)

Tests registration and demo login endpoints under load.

**Scenarios Tested:**
- User registration with unique emails
- Demo account creation
- Rate limiting on auth endpoints

**Virtual User Ramp:**
- 0-10 VUs over 30s (warm-up)
- 10-50 VUs over 1m (ramp-up)
- 50-100 VUs over 1.5m (full load)
- Hold 100 VUs for 3m (sustained)
- Ramp down (cool-down)

**Run:**
```bash
k6 run tests/load/auth-load-test.js
```

**With custom base URL:**
```bash
BASE_URL=http://example.com:3000 k6 run tests/load/auth-load-test.js
```

---

### 2. Project Management Load Test (`project-load-test.js`)

Tests project CRUD operations (Create, Read, Update, List).

**Scenarios Tested:**
- Create new projects
- List all projects
- Get project details
- Update project information
- User isolation (per-VU projects)

**Run:**
```bash
k6 run tests/load/project-load-test.js
```

---

### 3. Task Management Load Test (`task-load-test.js`)

Tests task creation, status updates, and management.

**Scenarios Tested:**
- Create tasks with random durations
- List tasks
- Get task details
- Update task status (todo → in-progress → done)
- Delete tasks

**Run:**
```bash
k6 run tests/load/task-load-test.js
```

---

### 4. Invoice Management Load Test (`invoice-load-test.js`)

Tests invoice creation, updates, PDF generation, and management.

**Scenarios Tested:**
- Create invoices with random amounts
- List invoices
- Get invoice details
- Update invoice status
- Generate PDF (CPU-intensive operation)
- Delete invoices

**Run:**
```bash
k6 run tests/load/invoice-load-test.js
```

---

## Running All Tests

### Sequential Execution

```bash
# Run each test individually
k6 run tests/load/auth-load-test.js
k6 run tests/load/project-load-test.js
k6 run tests/load/task-load-test.js
k6 run tests/load/invoice-load-test.js
```

### Parallel Execution (with proper isolation)

```bash
# Run multiple tests in parallel (requires different ports or isolated environments)
k6 run tests/load/auth-load-test.js & k6 run tests/load/project-load-test.js
```

---

## Performance Thresholds

Each test enforces the following thresholds:

### Response Time Thresholds
- **95th percentile (p95):** Must be < 500ms
- **99th percentile (p99):** Must be < 1000ms

### Error Rate
- **HTTP errors:** Must be < 10% (0.1 rate)

### Check Success Rate
- **Assertions:** Must pass > 95% of the time

### Example Threshold Output
```
checks................... [ 96.5% ] ✓
http_req_duration........ [ ok ] ✓ p(95)<500ms ✓ p(99)<1000ms
http_req_failed.......... [ ok ] ✓ rate<10%
```

**Test fails if:**
- Response times exceed thresholds
- Error rate > 10%
- Check pass rate < 95%

---

## Load Configuration

All tests use the same ramping strategy:

```
30 seconds   → 10 VUs (warm-up)
1 minute     → 50 VUs (ramp-up)
1.5 minutes  → 100 VUs (full load)
3 minutes    → 100 VUs (sustained load)
1 minute     → 50 VUs (ramp-down)
30 seconds   → 0 VUs (cool-down)
```

**Total Test Duration:** ~8 minutes

---

## Interpreting Results

### Sample Output
```
scenarios: (100.00%) 1 complete, 0 broken
duration: 7m43s rounds: 400, iterations: 4000
√ checks................... [ 9800 / 10000 ] 98.00%
   ✓ response time < 500ms............... [ 9500 / 10000 ]
   ✓ response time < 1000ms............. [ 9900 / 10000 ]
   
   http_req_duration................. avg=287ms p(95)=450ms p(99)=850ms
   http_reqs_failed.................. 15 (0.15%)
```

### What This Means:
- ✓ **98% of checks passed** - Good data validation
- ✓ **95th percentile at 450ms** - Well under 500ms threshold
- ✓ **0.15% error rate** - Excellent reliability
- Platform **performs well under load**

---

## Customizing Tests

### Change VU Count

Edit the `options.stages` array:

```javascript
stages: [
  { duration: '30s', target: 20 },   // Change 10 to 20
  { duration: '1m', target: 100 },   // Change 50 to 100
  { duration: '1m30s', target: 200 }, // Change 100 to 200
  // ... rest
]
```

### Change Thresholds

Edit the `options.thresholds`:

```javascript
thresholds: {
  'http_req_duration': [
    'p(95) < 1000',  // Increase to 1000ms
    'p(99) < 2000',  // Increase to 2000ms
  ],
}
```

### Change Base URL

Use environment variable:
```bash
BASE_URL=http://production.example.com:3000 k6 run tests/load/auth-load-test.js
```

---

## Advanced Usage

### Export Results to JSON

```bash
k6 run tests/load/auth-load-test.js --out json=results.json
```

### Run with More Verbose Logging

```bash
k6 run tests/load/auth-load-test.js -v
```

### Generate HTML Report (with k6-html-reporter)

```bash
# Install reporter
npm install -g @grafana/k6-html-reporter

# Run test with JSON output
k6 run tests/load/auth-load-test.js --out json=results.json

# Generate HTML report
k6-html-reporter -i results.json -o report.html
```

### Cloud Testing with Grafana Cloud

```bash
# Login to Grafana Cloud
k6 cloud auth

# Run test on cloud
k6 cloud run tests/load/auth-load-test.js
```

---

## Best Practices

✅ **Do:**
- Run tests against a staging environment first
- Monitor backend logs during tests
- Run at consistent times to detect performance regressions
- Use version control for test scripts
- Document custom thresholds for your SLOs

❌ **Don't:**
- Run load tests directly on production without approval
- Set unrealistic thresholds
- Ignore warnings about rate limiting
- Run all tests simultaneously against shared infrastructure
- Assume one-time results indicate long-term performance

---

## Troubleshooting

### Issue: "Address already in use"

**Solution:** Change base URL or stop other services on that port

### Issue: "Threshold not met"

Check:
1. Is the server running? (`curl http://localhost:3000`)
2. Are there errors in server logs?
3. Is the machine under-resourced?
4. Are thresholds realistic?

### Issue: "Too many requests" errors

**Solution:** Rate limiting is working. Adjust:
- Reduce number of VUs
- Increase test duration to spread requests
- Check server rate limit configuration

---

## Performance Benchmarks

Typical results for a well-optimized API:

| Endpoint | p95 | p99 | Error Rate |
|----------|-----|-----|-----------|
| Registration | 200ms | 400ms | < 1% |
| Demo Login | 150ms | 350ms | < 0.5% |
| Project Create | 180ms | 420ms | < 1% |
| Project List | 100ms | 250ms | < 0.5% |
| Task Create | 150ms | 380ms | < 1% |
| Invoice Create | 200ms | 450ms | < 1% |
| PDF Generate | 600ms | 1200ms | < 2% |

---

## Documentation

- [k6 Documentation](https://k6.io/docs/)
- [k6 HTTP Module](https://k6.io/docs/javascript-api/k6-http/)
- [Performance Testing Best Practices](https://grafana.com/docs/k6/latest/)

---

## Contributing

To add more load tests:

1. Create new script in `tests/load/`
2. Follow the same structure and thresholds
3. Document in this README
4. Test locally before committing

---

**Last Updated:** March 2026
