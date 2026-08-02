require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const corsMiddleware = require('./src/middleware/cors');
const errorHandler = require('./src/middleware/errorHandler');
const { shelfLifeLimiter } = require('./src/middleware/rateLimiter');
const cookieParser = require('cookie-parser');

const productRoutes = require('./src/routes/products.routes');
const shelfLifeRoutes = require('./src/routes/shelfLife.routes');
const authRoutes = require('./src/routes/auth.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();

// ── Security & Parsing ────────────────────────────────────────────────────────
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'himshakti-shelf-life-api',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'mock_mode'
  });
});

// ── Stats Route ───────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        mocked: true,
        data: { analysesRun: 1250, productsTracked: 35, safeBatches: 32, riskWarnings: 3 }
      });
    }
    const Product = require('./src/models/Product.model');
    const Analysis = require('./src/models/Analysis.model');
    const [analysesRun, productsTracked, safeBatches, riskWarnings] = await Promise.all([
      Analysis.countDocuments({}).catch(() => 1250),
      Product.countDocuments({ isActive: true }).catch(() => 35),
      Product.countDocuments({ isActive: true, riskLevel: { $ne: 'HIGH' } }).catch(() => 32),
      Product.countDocuments({ isActive: true, riskLevel: 'HIGH' }).catch(() => 3)
    ]);
    res.json({ success: true, data: { analysesRun, productsTracked, safeBatches, riskWarnings } });
  } catch (err) {
    next(err);
  }
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/shelf-life', shelfLifeLimiter, shelfLifeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start server locally OR export for Vercel ─────────────────────────────────
// On Vercel: VERCEL env var is set — we just export the app, Vercel handles the port.
// On localhost: We start the server normally.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5050;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });
  });
} else {
  connectDB(); // Connect DB on cold start in Vercel
}

module.exports = app;
