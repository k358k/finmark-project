FROM node:18-alpine

WORKDIR /app

COPY api-gateway/package*.json ./

RUN npm ci --only=production

COPY api-gateway/server.js ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
