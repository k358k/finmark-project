const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

const services = [
  { path: '/api/auth', target: 'http://finmark-auth-active:3001', standby: 'http://finmark-auth-standby:3011' },
  { path: '/api/orders', target: 'http://finmark-orders-active:3002', standby: 'http://finmark-orders-standby:3012' },
  { path: '/api/products', target: 'http://finmark-products-active:3003', standby: 'http://finmark-products-standby:3013' },
  { path: '/api/reports', target: 'http://finmark-reports-active:3004', standby: 'http://finmark-reports-standby:3014' },
];

let counter = 0;

services.forEach((service) => {
  app.use(service.path, (req, res, next) => {
    const targets = [service.target, service.standby];
    const target = targets[counter % 2];
    counter++;

    // Restore the full path so auth-service receives /api/auth/login
    req.url = service.path + req.url;

    createProxyMiddleware({
      target,
      changeOrigin: true,
    })(req, res, next);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});