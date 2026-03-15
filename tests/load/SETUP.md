# Load Testing Setup Guide

## Prerequisites

### 1. Install k6

k6 is already installed via npm:
```powershell
npm install -g k6
```

Verify installation:
```powershell
k6 version
```

### 2. Start the FieldCost Application

You **must** start the application server before running load tests.

#### Option A: Development Mode
```powershell
npm run dev
```

This starts the Next.js dev server, typically at `http://localhost:3000`

#### Option B: Production Build & Start
```powershell
npm run build
npm start
```

### 3. Verify Server is Running

Check the server is accessible:
```powershell
curl http://localhost:3000
```

You should get a response (even a 404 is fine - it means the server is listening).

---

## Running Load Tests

Once the server is running in another terminal:

### Run All Tests
```powershell
.\tests\load\run-load-tests.ps1 -BaseUrl "http://localhost:3000"
```

### Run Individual Test
```powershell
k6 run tests/load/auth-load-test.js
```

### Run With Custom Base URL
```powershell
$env:BASE_URL="http://example.com:3000"
k6 run tests/load/auth-load-test.js
```

### Run With JSON Output
```powershell
k6 run tests/load/auth-load-test.js --out json=results.json
```

---

## What Each Test Does

1. **auth-load-test.js** - Tests authentication endpoints
   - POST /api/registrations (user signup)
   - POST /api/demo (demo login)
   - Ramps up to 100 virtual users
   - Duration: ~8 minutes

2. **project-load-test.js** - Tests project management
   - Create, list, read, update projects
   - Validates CRUD operations under load
   - Duration: ~8 minutes

3. **task-load-test.js** - Tests task management
   - Create, list, get, update task status, delete
   - Tests task lifecycle
   - Duration: ~8 minutes

4. **invoice-load-test.js** - Tests invoice operations
   - Create, list, get, update invoices
   - Tests PDF generation under load
   - Heaviest workload
   - Duration: ~8 minutes

---

## Expected Output

When a test passes:
```
PASSED
```

When a test fails (threshold not met):
```
FAILED
```

### Performance Thresholds

Each test enforces:
- **Response time (p95):** < 500ms ✓
- **Response time (p99):** < 1000ms ✓
- **Error rate:** < 10% ✓

---

## Troubleshooting

### Error: "Connection refused"
**Cause:** API server is not running  
**Solution:** Start with `npm run dev` in another terminal

### Error: "k6 command not found"  
**Cause:** k6 not installed  
**Solution:** Run `npm install -g k6`

### Tests complete but with failures
**Cause:** Server performance doesn't meet thresholds  
**Solution:** 
- Check server logs for errors
- Run only one test at a time
- Increase hardware resources

### Port 3000 already in use
**Solution:** Either:
- Kill the process on port 3000: `netstat -ano | findstr :3000`
- Use different port: `PORT=3001 npm run dev`
- Update test base URL: `.\tests\load\run-load-tests.ps1 -BaseUrl "http://localhost:3001"`

---

## Results

After running tests, check:
- **Summary:** `ls load-test-results-*`
- **JSON output:** Open `load-test-results-*/auth-load-test.js.json`
- **Detailed metrics:** These files contain timing, error rates, etc.

---

## Next Steps

1. ✅ Start API server (`npm run dev`)
2. ✅ Run load tests (`.\tests\load\run-load-tests.ps1`)
3. ✅ Review results in `load-test-results-*` directory
4. ✅ Identify performance bottlenecks
5. ✅ Optimize as needed

---

## Advanced Usage

### Run with increased verbosity
```powershell
k6 run tests/load/auth-load-test.js -v
```

### Run with tags
```powershell
k6 run tests/load/auth-load-test.js --include-tags smoke
```

### Run with custom thresholds
Edit the test file and modify the `thresholds` object:
```javascript
export const options = {
  thresholds: {
    'http_req_duration': ['p(95) < 1000'],  // Relax threshold
  }
}
```

---

## Generate HTML Reports

Install the reporter:
```powershell
npm install -g @grafana/k6-html-reporter
```

Run test with JSON output:
```powershell
k6 run tests/load/auth-load-test.js --out json=results.json
```

Generate HTML report:
```powershell
k6-html-reporter -i results.json -o report.html
```

Open `report.html` in browser for visual results.
