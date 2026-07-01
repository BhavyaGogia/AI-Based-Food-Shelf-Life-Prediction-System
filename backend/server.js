require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const corsMiddleware = require('./src/middleware/cors');
const errorHandler = require('./src/middleware/errorHandler');
const { shelfLifeLimiter } = require('./src/middleware/rateLimiter');

const productRoutes = require('./src/routes/products.routes');
const shelfLifeRoutes = require('./src/routes/shelfLife.routes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

// ── Security & Parsing ────────────────────────────────────────────────────────
app.use(helmet());                                // security headers
app.use(corsMiddleware);                          // CORS
app.use(express.json({ limit: '10kb' }));         // body parser, size-limited
app.use(express.urlencoded({ extended: false }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'himshakti-shelf-life-api',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'mock_mode'
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        mocked: true,
        data: {
          analysesRun: 1250,
          productsTracked: 35,
          safeBatches: 32,
          riskWarnings: 3
        }
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
app.use('/api/auth', authRoutes);

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
const PORT = process.env.PORT || 5050;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🌿 Products API: http://localhost:${PORT}/api/products`);
});
