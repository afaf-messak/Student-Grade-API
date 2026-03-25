const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));

app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true
}));

app.use('/students', createProxyMiddleware({
  target: 'http://student-service:3002',
  changeOrigin: true
}));

app.use('/subjects', createProxyMiddleware({
  target: 'http://student-service:3002',
  changeOrigin: true
}));

app.use('/grades', createProxyMiddleware({
  target: 'http://grade-service:3003',
  changeOrigin: true
}));

app.get('/health', (req, res) => res.json({ status: 'Gateway OK' }));

app.listen(3000, () => console.log('Gateway lancé sur le port 3000'));
