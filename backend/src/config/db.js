const mongoose = require('mongoose');

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ CRITICAL ERROR: No MONGODB_URI provided in environment variables. Terminating backend.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast if no DB
      family: 4 // Force IPv4 to fix SRV resolution issues on some Windows machines
    });
    console.log('✅ Connected to MongoDB Atlas — himshakti DB');
  } catch (err) {
    console.error('❌ CRITICAL ERROR: MongoDB connection failed. Terminating backend. Error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
