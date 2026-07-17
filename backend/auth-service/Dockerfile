FROM node:18-alpine

WORKDIR /app

COPY auth-service/package*.json ./

RUN npm ci --only=production

COPY auth-service/server.js auth-service/routes.js ./
COPY auth-service/models/ ./models/
COPY shared/db.js ./shared/

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/auth/health || exit 1

CMD ["node", "server.js"]
