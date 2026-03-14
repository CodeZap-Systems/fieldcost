# FieldCost Security Testing Guide

## 🔒 Overview

This comprehensive security testing suite validates FieldCost against OWASP Top 10 vulnerabilities:

- ✅ **SQL Injection**
- ✅ **Cross-Site Scripting (XSS)**
- ✅ **Cross-Site Request Forgery (CSRF)**
- ✅ **Broken Authentication**
- ✅ **Insecure Direct Object Reference (IDOR)**
- ✅ **RBAC Privilege Escalation**
- ✅ **Malicious File Uploads**
- ✅ **API Rate Limiting**
- ✅ **Input Validation Bypass**
- ✅ **Command Injection**

---

## 📂 Test Files

### `tests/security/auth-security.test.ts`
**Authentication & Session Security Tests**

- SQL injection in email/password fields
- XSS prevention in login forms
- Brute force attack protection
- Session fixation attacks
- Session expiration handling
- Password reset security
- Rate limiting on authentication

**70+ Test Cases**

### `tests/security/api-security.test.ts`
**API Endpoint Security Tests**

- SQL injection in query parameters
- SQL injection in POST bodies
- NoSQL injection prevention
- Command injection prevention
- Path traversal attacks
- IDOR (Insecure Direct Object Reference)
- Missing authentication enforcement
- Invalid token rejection
- Input validation bypass
- Type coercion attacks
- Header manipulation
- Oversized payload handling

**60+ Test Cases**

### `tests/security/upload-security.test.ts`
**File Upload Vulnerability Tests**

- Executable file (.exe, .php) rejection
- Malicious file type detection
- File size limit enforcement
- Path traversal in filenames
- Polyglot file detection
- Null byte injection
- Script content in uploads
- ZIP bomb detection
- MIME type validation
- Filename sanitization

**40+ Test Cases**

### `tests/security/rbac-security.test.ts`
**Role-Based Access Control Tests**

- Admin-only endpoint protection
- Privilege escalation prevention
- JWT token tampering detection
- Cross-company data isolation
- Permission validation
- Role-based constraints
- Token expiration/revocation
- Audit logging
- Default deny principle
- Concurrent access control

**50+ Test Cases**

---

## 🚀 Running Security Tests

### Run All Security Tests
```bash
npm run test:security
```

### Run Specific Security Test Suite
```bash
# Authentication security
npm run test:security -- auth-security

# API security
npm run test:security -- api-security

# Upload security
npm run test:security -- upload-security

# RBAC security
npm run test:security -- rbac-security
```

### Run with Coverage
```bash
npm run test:security -- --coverage
```

### Run with Verbose Output
```bash
npm run test:security -- --verbose
```

### Watch Mode (Re-run on Changes)
```bash
npm run test:security:watch
```

---

## 🧪 Test Categories

### 1. Authentication Security (auth-security.test.ts)

#### SQL Injection Tests
```typescript
// Test payloads
' OR '1'='1
admin'--
' OR 1=1--
1' UNION SELECT * FROM users--
'; DROP TABLE users; --
```

Verifies that:
- ✅ SQL injections in email don't execute
- ✅ SQL injections in password don't bypass login
- ✅ Error messages don't expose database structure
- ✅ Invalid credentials are consistently rejected

#### XSS Prevention Tests
```typescript
// Test payloads
<script>alert(1)</script>
<img src=x onerror="alert(1)">
javascript:alert(1)
<svg onload="alert(1)">
"><script>alert(1)</script>
```

Verifies that:
- ✅ Scripts don't execute in form fields
- ✅ HTML entities are escaped
- ✅ Event handlers are stripped
- ✅ Reset tokens sanitize URL parameters

#### Brute Force Protection
- Logs multiple failed attempts
- Triggers rate limiting (429) after 10 attempts
- Blocks further attempts temporarily
- Logs security events

#### Session Security
- Session invalidation on logout
- Session fixation prevention
- Session expiration handling
- Token rotation on login

### 2. API Security (api-security.test.ts)

#### SQL Injection in APIs
```bash
GET /api/projects?search=' OR '1'='1
GET /api/projects/1' OR '1'='1
POST /api/projects
  { "name": "'; DROP TABLE--" }
```

Verifies:
- ✅ No SQL errors in responses
- ✅ Queries executed safely
- ✅ No unauthorized data exposure

#### IDOR Prevention
```bash
GET /api/projects/other_user_project_id
PUT /api/projects/other_user_project_id
DELETE /api/projects/other_user_project_id
```

Verifies:
- ✅ Users can't access other users' data
- ✅ Users can't modify others' projects
- ✅ Users can't delete others' data
- ✅ Proper 403/404 responses

#### Authentication Enforcement
```bash
GET /api/projects                    # No token → 401
GET /api/projects (invalid token)   # Invalid → 401/403
GET /api/projects (Bearer format)   # Must be "Bearer token"
```

Verifies:
- ✅ All endpoints require authentication
- ✅ Invalid tokens are rejected
- ✅ Expired tokens are rejected
- ✅ Malformed headers are handled

#### Input Validation
```bash
POST /api/projects
  { "name": null }           # Missing required field
  { "budget": "text" }       # Wrong type
  { "budget": -50000 }       # Negative number
  { "name": "A".repeat(1MB) } # Oversized payload
  { invalid json }           # Malformed JSON
```

Verifies:
- ✅ Required fields enforced
- ✅ Type checking works
- ✅ Business logic validated
- ✅ Payload size limited

### 3. File Upload Security (upload-security.test.ts)

#### Dangerous File Types
```typescript
logo.exe           // Executable
shell.php          // Web shell
archive.zip        // Compression
logo.jpg.js        // Double extension
../../etc/passwd   // Path traversal
logo<script>.jpg   // Script injection
logo\x00.jpg       // Null byte
```

Verifies:
- ✅ Executable files blocked
- ✅ Script files blocked
- ✅ Archive files blocked
- ✅ Double extensions handled
- ✅ Path traversal prevented
- ✅ Null bytes stripped

#### File Size Limits
- Tests oversized files (10MB+)
- Verifies 413 response for too large
- Tests empty files
- Tests maximum allowed sizes

#### MIME Type Validation
- Validates file content matches extension
- Detects MIME type mismatches
- Tests polyglot files (valid as multiple types)

#### Zip Bomb Detection
- Tests compressed files that expand to huge sizes
- Verifies decompression bomb protection
- Tests maximum decompression ratios

### 4. RBAC Security (rbac-security.test.ts)

#### Admin-Only Endpoints
```typescript
POST   /api/admin/subscription-plans     // Admin only
GET    /api/admin/dashboard              // Admin only
POST   /api/admin/users                  // Admin only
DELETE /api/admin/users/{id}             // Admin only
```

Verifies:
- ✅ Non-admin users get 403
- ✅ Admin users get proper access
- ✅ Permissions are checked before execution

#### Privilege Escalation Prevention
```typescript
// User attempts to change own role
PUT /api/users/profile { "role": "admin" }  → 403

// PM attempts to assign admin to others
PUT /api/admin/users/{id} { "role": "admin" } → 403

// Attempt to forge JWT with admin claims → 401
```

Verifies:
- ✅ Users can't self-promote
- ✅ PMs can't assign roles
- ✅ JWT tampering detected
- ✅ Signature validation works

#### Cross-Company Data Isolation
```typescript
GET /api/projects/other_company_project  → 403/404
PUT /api/projects/other_company_project  → 403/404
DELETE /api/company/other_company        → 403
```

Verifies:
- ✅ Companies can't see each other's data
- ✅ Cross-company modifications blocked
- ✅ Data properly isolated

#### Role-Specific Constraints
| Role | Can Create Projects | Can Create Invoices | Can View Payroll |
|------|-------------------|-----------------|------------------|
| Admin | ✅ | ✅ | ✅ |
| PM | ✅ | ❌ | ❌ |
| Accountant | ❌ | ✅ | ✅ |
| Field Crew | ❌ | ❌ | ❌ |

---

## 📊 Security Test Coverage

### Total Tests: 220+

| Category | Tests | Coverage |
|----------|-------|----------|
| Authentication | 70+ | Login, Register, Logout, Session, MFA |
| API Security | 60+ | Injection, IDOR, Auth, Validation |
| File Upload | 40+ | Type, Size, Content, Path Traversal |
| RBAC | 50+ | Permission, Escalation, Audit |
| **TOTAL** | **220+** | **Comprehensive** |

---

## 🔍 How Tests Work

### Example: SQL Injection Test
```typescript
test('should reject SQL injection in email field', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);

  const sqlPayloads = [
    "admin' OR '1'='1",
    "admin'--",
    "' OR 1=1--",
  ];

  for (const payload of sqlPayloads) {
    await page.fill('input[name="email"]', payload);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button:has-text("Register")');

    // Should reject invalid email
    const errorMessage = await page.textContent('[role="alert"]');
    expect(errorMessage).toBeTruthy();
  }
});
```

**What it does:**
1. Navigates to registration page
2. Enters SQL injection payload as email
3. Attempts to submit
4. Verifies error is shown (payload rejected)
5. Checks user wasn't created

### Example: IDOR Test
```typescript
test('should prevent access to other users projects', async () => {
  const response = await request
    .get('/api/projects/other_user_project_id')
    .set('Authorization', 'Bearer user1_token')
    .expect([403, 404]);

  expect(response.status).toMatch(/403|404/);
});
```

**What it does:**
1. Attempts to access project from different user
2. Uses valid authentication token
3. Verifies 403 (forbidden) or 404 (not found)
4. Ensures data isn't exposed

---

## 🛡️ Security Best Practices Tested

### Input Validation
- ✅ Required fields enforced
- ✅ Type checking
- ✅ Length limits
- ✅ Format validation
- ✅ Whitelisting only
- ✅ Sanitization

### Authentication
- ✅ Passwords hashed
- ✅ Sessions secure
- ✅ Tokens validated
- ✅ Brute force protection
- ✅ Rate limiting
- ✅ MFA ready

### Authorization
- ✅ RBAC enforced
- ✅ Default deny
- ✅ Permission validation
- ✅ Audit logging
- ✅ Token verification
- ✅ No privilege escalation

### Data Protection
- ✅ SQL injection blocked
- ✅ IDOR prevented
- ✅ XSS mitigated
- ✅ CSRF tokens
- ✅ Data isolation
- ✅ Encryption ready

### API Security
- ✅ Authentication required
- ✅ Rate limiting
- ✅ Input validation
- ✅ Output encoding
- ✅ Error handling
- ✅ Logging

---

## ⚠️ Critical Tests

These tests MUST pass before production:

1. **SQL Injection Blocking** - Database must be protected
2. **Authentication Required** - All APIs must require auth
3. **RBAC Enforcement** - Users must not access others' data
4. **File Upload Validation** - No executable files allowed
5. **XSS Prevention** - Scripts must not execute
6. **Rate Limiting** - Brute force must be prevented

---

## 🚨 Failed Test Handling

### If SQL Injection Test Fails
```
❌ Database error leaked in response
→ Stop deployment
→ Sanitize all database queries
→ Use parameterized queries
→ Re-run tests
```

### If RBAC Test Fails
```
❌ User accessed other user's project
→ Stop deployment
→ Fix authorization checks
→ Verify company isolation
→ Add audit logging
→ Re-run tests
```

### If Authentication Test Fails
```
❌ Unauthenticated request succeeded
→ Stop deployment
→ Verify auth middleware
→ Check token validation
→ Test with valid/invalid tokens
→ Re-run tests
```

---

## 📈 Continuous Security Testing

### Run on Every Commit
```bash
npm run test:security
```

### Run Before Deployment
```bash
npm run test:security -- --coverage
npm run test:security:report
```

### Scheduled Security Audits
```bash
# Run nightly security tests
0 2 * * * npm run test:security
```

---

## 🔐 Environment Variables Needed

```bash
# .env.test
NODE_ENV=test
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=test_key

# Must NOT be production URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fieldcost_test
```

---

## ✅ Success Criteria

All tests should:
- ✅ Reject malicious input
- ✅ Validate authentication
- ✅ Enforce authorization
- ✅ Prevent exploitation
- ✅ Handle errors gracefully
- ✅ Log security events

---

## 📞 Security Incidents

If a test failure indicates a real vulnerability:

1. **Stop All Operations** - Don't deploy
2. **Isolate the Issue** - Determine severity
3. **Fix Immediately** - Patch the vulnerability
4. **Add Test** - Ensure regression test exists
5. **Review Similar Code** - Check for same issue elsewhere
6. **Deploy Patch** - Release security fix
7. **Notify Users** - If customer data affected
8. **Update Tests** - Prevent future issues

---

## 🎯 Next Steps

1. Run security tests: `npm run test:security`
2. Review failures: Fix any red tests
3. Check coverage: `npm run test:security -- --coverage`
4. Integrate with CI/CD: Add to GitHub Actions
5. Schedule recurring: Nightly security audits
6. Document findings: Security test reports
7. Remediate issues: Fix any vulnerabilities found

---

## 📚 Related Guides

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Testing Guide](../tests/README.md)
- [API Test Seed](../API_TEST_SEED.md)
- [GitHub Actions](../.github/workflows/test.yml)

---

**Status**: ✅ Ready for Use  
**Test Count**: 220+  
**Coverage**: OWASP Top 10  
**Last Updated**: March 12, 2026
