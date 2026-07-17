const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

const services = [
  { path: '/api/auth', target: 'http://finmark-auth:3001', standby: 'http://finmark-auth:3001' },
  { path: '/api/orders', target: 'http://finmark-orders:3002', standby: 'http://finmark-orders:3002' },
  { path: '/api/products', target: 'http://finmark-products:3003', standby: 'http://finmark-products:3003' },
  { path: '/api/reports', target: 'http://finmark-reports:3004', standby: 'http://finmark-reports:3004' },
];

let counter = 0;

services.forEach((service) => {
  app.use(service.path, (req, res, next) => {
    const targets = [service.target, service.standby];
    const target = targets[counter % 2];
    counter++;
    createProxyMiddleware({ target, changeOrigin: true, pathRewrite: { '^': service.path } })(req, res, next);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
