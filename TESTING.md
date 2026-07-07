# FinMark Backend Testing

This document explains what was tested, how to run the tests, and what each test validates.

## How to Run

Run all tests:
```bash
cd backend
npm run test:all
```

Or run them individually per service:
```bash
npm run test:auth
npm run test:orders
npm run test:reports
```

Each command runs Jest inside its respective service folder. You should see all 9 tests pass.

## What We Tested

We focused on the 3 functional endpoints in our backend:

### 1. Login (`POST /api/auth/login`)

**Why:** Authentication is the first thing users interact with. If login is broken, nothing else matters.

**Test cases:**
- Valid credentials → returns 200 with a token
- Wrong password → returns 401 with error message
- Empty/missing fields → returns 401 (backend treats invalid input the same as wrong credentials)

**File:** `backend/auth-service/tests/auth.test.js`

### 2. Orders (`POST /api/orders`)

**Why:** This is the core functionality - placing orders. We need to make sure the validation works.

**Test cases:**
- Complete data (customerName, quantity, orderValue) → returns 201 with order ID
- Missing any field → returns 400 with validation error
- Empty body → returns 400

**File:** `backend/orders-service/tests/orders.test.js`

### 3. Reports (`GET /api/reports/summary`)

**Why:** The reports endpoint has logic to skip corrupted records in the mock data. We need to verify the aggregation math is correct and that corrupted data doesn't break anything.

**Test cases:**
- Returns correct totals from valid records only
  - Expected totalRevenue: 2941 (sum of 9 valid orders)
  - Expected totalItemsSold: 68 (sum of 9 valid orders)
- Response structure has the correct fields

**File:** `backend/reports-service/tests/reports.test.js`

## Test Results (as of July 2026)

```
Test Suites: 3 passed, 3 total
Tests:       9 passed, 9 total
```

| Endpoint | Test | Result |
|----------|------|--------|
| POST /api/auth/login | Valid credentials | PASS |
| POST /api/auth/login | Wrong password | PASS |
| POST /api/auth/login | Missing fields | PASS |
| POST /api/orders | Complete data | PASS |
| POST /api/orders | Missing customerName | PASS |
| POST /api/orders | Missing quantity | PASS |
| POST /api/orders | Empty body | PASS |
| GET /api/reports/summary | Correct totals | PASS |
| GET /api/reports/summary | Response structure | PASS |

## Notes

- Tests run against the actual route handlers (not the full server, but the same logic)
- No database needed - we test against the hardcoded mock data
- If you change the mock credentials in `auth-service/routes.js`, update the test accordingly
- If you modify the mock order stream in `reports-service/routes.js`, recalculate the expected totals
