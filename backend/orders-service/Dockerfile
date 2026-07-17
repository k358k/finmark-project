FROM node:18-alpine

WORKDIR /app

COPY orders-service/package*.json ./

RUN npm ci --only=production

COPY orders-service/server.js orders-service/routes.js ./
COPY orders-service/models/ ./models/
COPY shared/db.js ./shared/

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/orders/health || exit 1

CMD ["node", "server.js"]
