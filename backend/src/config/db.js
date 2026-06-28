const mongoose = require('mongoose');

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ No MONGODB_URI provided. Running in mock mode.');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000 // fail fast if no DB
    });
    console.log('✅ Connected to MongoDB Atlas — himshakti DB');
  } catch (err) {
    console.error('❌ MongoDB connection failed. Running in mock mode. Error:', err.message);
  }
}

module.exports = { connectDB };
