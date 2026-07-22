# ADJUSTMENT.md - Microservices Backend

## What changed and why

Started as one big server.js handling everything. Broke it into 4 microservices - auth, orders, products, reports - each with its own routes, models, and database connection. Then we put nginx in front as a load balancer.

The original setup had separate nginx instances per service, each with an active and standby container. You had to manage ports, configure upstreams, and if something broke you had to figure out which nginx to look at. It worked but it was messy.

Switched to Docker Swarm. Now there's one Nginx on port 80, an API Gateway that routes to the right service, and Swarm handles all the replica management. If a container dies, Swarm replaces it automatically. No manual failover, no separate load balancer configs per service. Way cleaner.

## Important: Docker Swarm Only

This project uses Docker Swarm (`docker-stack.yml`) for deployment, NOT Docker Compose (`docker-compose.yml`). The Compose file is kept for reference only.

- **Deploy:** `docker stack deploy -c docker-stack.yml finmark`
- **Remove:** `docker stack rm finmark`
- **Check:** `docker stack services finmark`
- **Mongo Express:** `http://localhost:8082` (login: `finmark` / `finmark123`)
- **API:** `http://localhost` (port 80 via Nginx)

Do NOT use `docker-compose up` - use the Swarm commands above.

## Current folder structure

```
backend/
├── api-gateway/            # central router - Express + http-proxy-middleware
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── auth-service/           # login, user management
│   ├── models/User.js
│   ├── routes.js
│   ├── server.js
│   └── Dockerfile
├── orders-service/         # order placement
│   ├── models/Order.js
│   ├── routes.js
│   ├── server.js
│   └── Dockerfile
├── products-service/       # product catalog + Redis cache
│   ├── models/Product.js
│   ├── routes.js
│   ├── server.js
│   └── Dockerfile
├── reports-service/        # analytics and reports
│   ├── models/Report.js
│   ├── routes.js
│   ├── server.js
│   └── Dockerfile
├── shared/
│   └── db.js               # shared MongoDB connection helper
├── seed/
│   └── seed.js             # database seeder (runs on host machine)
├── nginx/
│   ├── nginx.conf          # single centralized load balancer config
│   └── Dockerfile
├── mongo-init/             # replica set keyfile + init scripts (compose only)
├── docker-stack.yml        # Swarm deployment
├── docker-compose.yml      # local dev alternative
├── package.json
└── .env                    # admin credentials, MongoDB URI
```

## MongoDB Replica Set

MongoDB runs as a single-node replica set called `rs0`. We needed this because Mongoose connections in the services use replica set mode. Without it, writes would fail or you'd get warnings.

The replica set is initialized automatically when the container first starts via `mongo-init/init-replicaset.sh`. It waits for Mongo to be ready, then runs `rs.initiate()` to set up the single member.

To verify it's working:

```bash
docker exec -it $(docker ps -q -f name=finmark-mongo) mongosh --eval "rs.status()"
```

You should see `ok: 1` and the state should show `PRIMARY` for the single member. If the replica set was never initialized, you'll get an error saying "not initialized yet" and you need to run the init script manually.

MongoDB uses port 27018 because port 27017 is taken by another project on the machine. Inside Docker, the services connect to port 27017 on the container. The 27018 mapping is just for accessing Mongo from the host machine.

## Redis Cache

Redis is only on the products-service. It uses a cache-aside pattern - first request hits MongoDB, stores the result in Redis with a 60 second TTL. Subsequent requests within that window come from cache.

If Redis goes down, the products-service still works. It falls back to MongoDB and logs `[Redis] Cache unavailable - falling back to MongoDB`. Same if caching fails - it just skips the cache and serves from the database.

Check the logs to see cache behavior:

```bash
docker service logs finmark_finmark-products
```

You'll see `[Redis] Cache hit` or `[Redis] Cache miss - fetching from MongoDB` in the output. After the 60 second TTL expires, the next request will be a cache miss again.

## Rate Limiting

Rate limiting is configured in Nginx to prevent system flooding during peak hours. Each IP address is limited to 10 requests per second with a burst allowance of 20 requests.

**Configuration (nginx/nginx.conf):**
- `limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s` - Defines the rate limit zone
- `limit_req zone=api burst=20 nodelay` - Applies the limit to all incoming requests

**How it works:**
- Normal traffic: Handled immediately
- Burst traffic (up to 20 requests): Handled without delay
- Exceeding rate: Returns 503 "Service Temporarily Unavailable"

**Why this matters:**
Without rate limiting, a surge in traffic (like during peak hours) could overwhelm the system and cause key pages to fail to load. This solves the issue identified in our MS1 audit where the single server ran out of resources under concurrent requests.

**To test rate limiting:**
```bash
# Send rapid requests to trigger rate limit
for i in {1..30}; do curl -s http://localhost/health; done
# After 20+ requests, you'll see 503 errors
```

## How to start with Docker Swarm

First time only - initialize the swarm:

```bash
cd backend
docker swarm init
```

Build all images:

```bash
docker build -t finmark-api-gateway:latest -f api-gateway/Dockerfile .
docker build -t finmark-auth:latest -f auth-service/Dockerfile .
docker build -t finmark-orders:latest -f orders-service/Dockerfile .
docker build -t finmark-products:latest -f products-service/Dockerfile .
docker build -t finmark-reports:latest -f reports-service/Dockerfile .
docker build -t finmark-nginx:latest -f nginx/Dockerfile .
```

Deploy the stack:

```bash
docker stack deploy -c docker-stack.yml finmark
```

After deploying, here's what's running:

| Service | Replicas | Purpose | Internal Port |
|---------|----------|---------|---------------|
| finmark-nginx | 1 | Entry point - routes all traffic on port 80 | 80 |
| finmark-api-gateway | 1 | Routes requests to the right microservice | 3000 |
| finmark-auth | 2 | Login, user management | 3001 |
| finmark-orders | 2 | Order placement | 3002 |
| finmark-products | 2 | Product catalog + Redis cache | 3003 |
| finmark-reports | 2 | Analytics and reports | 3004 |
| finmark-mongo | 1 | Database | 27017 (27018 from host) |
| finmark-redis | 1 | Cache for products-service only | 6379 |
| finmark-mongo-express | 1 | Web UI for browsing MongoDB | 8081 (8082 from host) |

The "internal port" is what services use inside the Docker network. You don't access these directly - everything goes through port 80.

Check everything is running:

```bash
docker stack services finmark
```

All services should show 2/2 or 1/1 in the REPLICAS column.

Stop everything:

```bash
docker stack rm finmark
```

## How to start with Docker Compose

For local dev if you don't want Swarm. Uses active/standby container names, separate ports per service.

```bash
cd backend
docker compose up --build
```

This starts 14 containers. The Swarm setup is what we actually use, but the Compose file is kept around for reference.

## How to seed the database

Run from the host machine, not inside Docker. Make sure MongoDB is running first.

```bash
cd backend
npm run seed
```

Reads `MONGO_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `.env`. Uses argon2 for password hashing, not bcrypt. Clears all existing data before inserting, so safe to run multiple times.

Default `.env` values:

```
MONGO_URI=mongodb://localhost:27018/finmark?directConnection=true
ADMIN_EMAIL=admin@finmark.com
ADMIN_PASSWORD=Password123!
```

If you change the admin password in `.env`, the seed script regenerates the hash automatically.

## Validations

Each service validates input before hitting the database. Here's what each one checks.

**auth-service** - POST /api/auth/login
- Email and password are both required. Missing either returns 400 with "Email and password are required".
- Wrong email or wrong password both return 401 with "Invalid email or password". No separate message for each - keeps it secure.

**orders-service** - POST /api/orders
- customerName, quantity, and orderValue are all required. Missing any returns 400 with "All fields are required".
- customerName is validated with a regex: must be at least 2 characters, only letters, numbers, spaces, hyphens, or apostrophes. Failing this returns 400 with a message explaining the allowed characters.

**reports-service** - GET /api/reports/summary
- No input validation needed since it's a GET with no parameters.
- Records with null or undefined totalRevenue or totalItemsSold are skipped. You'll see `[System Notice] Corrupted record skipped safely` in the logs. Doesn't crash, doesn't return an error - just skips the bad record and continues summing the valid ones.

**products-service** - GET /api/products
- If Redis is down, it falls back to MongoDB automatically. You'll see `[Redis] Cache unavailable - falling back to MongoDB` in the logs. No crash, no error response to the client.
- If caching fails (Redis rejects the set), it still serves the data from MongoDB. Logs show `[Redis] Failed to cache - continuing without cache`.

**All services** - Every service exposes GET /api/<service-name>/health returning `{ "status": "ok" }`. Used by Docker health checks and the API Gateway to know if a service is alive.

## Port reference

Everything goes through port 80. The frontend only hits one port. The API Gateway figures out which service to route to.

| What             | Port  | Notes                                           |
|------------------|-------|-------------------------------------------------|
| API (all services) | 80  | Nginx → API Gateway → service                   |
| Mongo Express    | 8082  | Web dashboard for browsing MongoDB              |
| MongoDB          | 27018 | From host machine. Inside Docker it's 27017     |

The old setup had ports 3001-3004 for active instances, 3011-3014 for standby, and 4000-4007 for load balancers. None of that exists anymore. Port 80, that's it.

## Mongo Express

Web UI for viewing and editing MongoDB data directly in the browser.

- URL: http://localhost:8082
- Credentials: `finmark` / `finmark123`
- Browse all collections: users, products, orders, reports

## Frontend

The frontend is a separate client that calls the backend API. It runs on a different port than the backend.

### How to Start Frontend

```bash
cd frontend/src
npx serve .
```

The frontend will start at `http://localhost:3000`.

### How It Works

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:3000 | Login page, dashboard, orders, reports |
| Backend API | http://localhost (port 80) | API Gateway → microservices |
| Mongo Express | http://localhost:8082 | Database browser |

The frontend calls `http://localhost/api/...` for all API requests. Nginx routes these to the API Gateway, which routes to the correct microservice.

### Pages

| Page | URL | Purpose |
|------|-----|---------|
| Login | http://localhost:3000 | Sign in page |
| Dashboard | http://localhost:3000/dashboard.html | Main dashboard |
| Orders | http://localhost:3000/products.html | Product catalog + place order |
| Reports | http://localhost:3000/reports.html | Analytics and reports |

### Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| FinMark App | admin@finmark.com | Password123! |
| Mongo Express | finmark | finmark123 |

## Testing failover

This is just regular dev workflow, not a presentation trick. Swarm manages replicas automatically so you can test that it actually works.

Check what's running:

```bash
docker stack services finmark
```

Pick a service and scale it down:

```bash
docker service scale finmark_finmark-auth=1
```

Test that it still works:

```bash
curl http://localhost/api/auth/health
```

It should still return `{"status":"ok"}`. The surviving replica handles the traffic.

Scale it back up:

```bash
docker service scale finmark_finmark-auth=2
```

Check that Swarm created a new task:

```bash
docker service ps finmark_finmark-auth
```

You'll see the old task as "Shutdown" or "Complete" and a new one as "Running". Swarm handled the whole thing. No restart needed, no config change, no manual intervention.

Works the same way with any service - just replace `finmark-auth` with `finmark-orders`, `finmark-products`, or `finmark-reports`.

## Notes for the team

For backend - each service has its own folder with `server.js`, `routes.js`, `models/`, and a `package.json`. If you add a dependency, run `npm install` inside that service folder. The `shared/db.js` handles the MongoDB connection so don't duplicate it. Every service exposes `GET /api/<service>/health` for health checks.

For frontend - all API calls go to port 80. Same URLs as before, just drop the port number. So `http://localhost:4000/api/auth/login` becomes `http://localhost/api/auth/login`. The API Gateway handles routing to the right service. Check `api-gateway/server.js` to see how the routing works.

For documentation - `docker-stack.yml` is the production config. `docker-compose.yml` is kept for local dev reference. The architecture flow is: User → Nginx (port 80) → API Gateway (port 3000, internal) → microservice. Redis is only on products-service for caching.

## How to run tests

Run all tests:

```bash
npm run test:all
```

Run individual services:

```bash
npm run test:auth
npm run test:orders
npm run test:reports
npm run test:products
```

Tests use jest and supertest. They test routes directly, don't need MongoDB or Docker running. Products doesn't have tests yet.
