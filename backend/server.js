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

app.get('/test-db', async (req, res) => {
  try {
    const start = Date.now();
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    const state = mongoose.connection.readyState;
    res.json({ success: true, state, time: Date.now() - start });
  } catch (err) {
    res.json({ success: false, error: err.message, name: err.name, uri: !!process.env.MONGODB_URI });
  }
});

// ── Stats Route ───────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        mocked: true,
        data: { analysesRun: 1250, productsTracked: 35, safeBatches: 32, riskWarnings: 3 },
        debugUri: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) : 'missing'
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

// ── Serverless DB Middleware ──────────────────────────────────────────────────
// Ensure DB connection is initiated on every request in Vercel to handle 
// warm containers that failed to connect on initialization.
if (process.env.VERCEL) {
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      console.error('Serverless DB Connect Error:', err.message);
      // Wait, don't crash, just let it proceed to next() and the routes will fail 
      // or return a proper 500. Actually, returning 500 here is safer.
      res.status(500).json({ success: false, error: 'Database connection failed' });
    }
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/shelf-life', shelfLifeLimiter, shelfLifeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Startup ───────────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5050;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });
  });
}

module.exports = app;
