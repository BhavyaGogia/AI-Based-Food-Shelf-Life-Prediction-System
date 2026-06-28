require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const productsRoutes = require('./routes/products.routes');
const shelfLifeRoutes = require('./routes/shelfLife.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/shelf-life', shelfLifeRoutes);

// Global Error Handler
app.use(errorHandler);

// Connect DB
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
