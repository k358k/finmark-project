# ADJUSTMENT.md - Microservices Restructuring

## What happened

We broke the monolith into 4 separate services. Each one runs on its own port with a standby instance. If the active one dies, the frontend can still hit the standby.

Old setup: one `server.js` on port 3001 handling everything.
New setup: 4 independent Node servers, each with 2 ports running at the same time.

## New folder structure

```
backend/
├── auth-service/          # port 3001 (active) / 3011 (standby)
├── orders-service/        # port 3002 (active) / 3012 (standby)
├── products-service/      # port 3003 (active) / 3013 (standby)
├── reports-service/       # port 3004 (active) / 3014 (standby)
└── package.json           # root scripts live here
```

Each service has its own `server.js`, `routes.js`, `package.json`, and `tests/` folder.

## High Availability Fix

**The problem:** before, each `server.js` called `app.listen()` twice in the same process - once for active, once for standby. So if the Node process crashed, both ports died together. Not really "high availability" if one crash takes out both.

**The fix:** each `server.js` now reads `process.env.PORT` and only listens on that one port. We run two separate OS processes per service - one for active, one for standby. They're completely independent. Kill one and the other keeps running.

Think of it like two separate apps running - they don't affect each other at all. A crash in the standby process won't even blink the active one.

## How to start everything

```bash
cd backend
npm run start:all
```

This uses `concurrently` to spin up all 8 processes at once (2 per service). You'll see 8 console lines - one active + one standby per service, each running as a completely separate process.

## How to start one service

Start the active instance:
```bash
npm run start:auth
npm run start:orders
npm run start:products
npm run start:reports
```

Start a standby instance:
```bash
npm run start:auth:standby
npm run start:orders:standby
npm run start:products:standby
npm run start:reports:standby
```

Each command starts exactly one process on one port. Mix and match as needed.

## How to run tests

Run all tests:
```bash
npm run test:all
```

Run one service's tests:
```bash
npm run test:auth
npm run test:orders
npm run test:reports
```

Note: products-service doesn't have tests yet. It's just a placeholder endpoint.

## Frontend changes needed

The frontend points to port 3001 for everything. Two lines needed updating in `frontend/src/script.js`:

| Line | What it is | URL | Status |
|------|-----------|-----|--------|
| 42 | auth login | `http://localhost:3001/api/auth/login` | Done |
| 99 | orders | `http://localhost:3002/api/orders` | Done |
| 148 | reports summary | `http://localhost:3004/api/reports/summary` | Done |

script.js has already been updated. Nothing for teammates to change here.

## Port reference

| Service | Active | Standby |
|---------|--------|---------|
| auth | 3001 | 3011 |
| orders | 3002 | 3012 |
| products | 3003 | 3013 |
| reports | 3004 | 3014 |

Both ports run at the same time, but as separate processes. If active goes down, hit the standby port instead.
