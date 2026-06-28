require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const { connectDB } = require('./src/config/db');
const corsMiddleware = require('./src/middleware/cors');
const errorHandler = require('./src/middleware/errorHandler');
const { shelfLifeLimiter } = require('./src/middleware/rateLimiter');

const productRoutes = require('./src/routes/products.routes');
const shelfLifeRoutes = require('./src/routes/shelfLife.routes');

const app = express();

// ── Security & Parsing ────────────────────────────────────────────────────────
app.use(helmet());                                // security headers
app.use(corsMiddleware);                          // CORS
app.use(express.json({ limit: '10kb' }));         // body parser, size-limited
app.use(express.urlencoded({ extended: false }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    service: 'himshakti-shelf-life-api',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res, next) => {
  try {
    const Product = require('./src/models/Product.model');
    const Analysis = require('./src/models/Analysis.model');

    const [analysesRun, productsTracked, safeBatches, riskWarnings] = await Promise.all([
      Analysis.countDocuments({}),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, riskLevel: { $ne: 'HIGH' } }),
      Product.countDocuments({ isActive: true, riskLevel: 'HIGH' })
    ]);

    res.json({
      success: true,
      data: {
        analysesRun,
        productsTracked,
        safeBatches,
        riskWarnings
      }
    });
  } catch (err) {
    next(err);
  }
});

app.use('/api/products', productRoutes);
app.use('/api/shelf-life', shelfLifeLimiter, shelfLifeRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`
  });
});

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🌿 Products API: http://localhost:${PORT}/api/products`);
  });
});
