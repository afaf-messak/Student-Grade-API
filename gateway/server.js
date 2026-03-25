const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// ─── Service URLs ─────────────────────────────────────────────────────────────
const AUTH_SERVICE    = process.env.AUTH_SERVICE_URL    || 'http://auth-service:3001';
const STUDENT_SERVICE = process.env.STUDENT_SERVICE_URL || 'http://student-service:3002';
const GRADE_SERVICE   = process.env.GRADE_SERVICE_URL   || 'http://grade-service:3003';

// ─── Gateway info ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🎓 Student Grade API — Gateway',
    version: '1.0.0',
    routes: {
      auth:     '/api/auth/*    → auth-service:3001',
      students: '/api/students/* → student-service:3002',
      subjects: '/api/subjects/* → student-service:3002',
      grades:   '/api/grades/*   → grade-service:3003',
    },
  });
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'gateway', timestamp: new Date().toISOString() });
});

// ─── Proxy options ────────────────────────────────────────────────────────────
const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error(`[Gateway] Proxy error → ${target}:`, err.message);
      res.status(502).json({ success: false, message: 'Service temporairement indisponible' });
    },
  },
});

// ─── Route proxies ────────────────────────────────────────────────────────────
app.use('/api/auth',     createProxyMiddleware(proxyOptions(AUTH_SERVICE)));
app.use('/api/students', createProxyMiddleware(proxyOptions(STUDENT_SERVICE)));
app.use('/api/subjects', createProxyMiddleware(proxyOptions(STUDENT_SERVICE)));
app.use('/api/grades',   createProxyMiddleware(proxyOptions(GRADE_SERVICE)));

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} introuvable` });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Gateway démarré sur le port ${PORT}`);
  console.log(`   auth-service    → ${AUTH_SERVICE}`);
  console.log(`   student-service → ${STUDENT_SERVICE}`);
  console.log(`   grade-service   → ${GRADE_SERVICE}`);
});
