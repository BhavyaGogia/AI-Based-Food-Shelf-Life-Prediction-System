const mongoose = require('mongoose');

// Cache the connection across serverless function invocations (Vercel).
// Without this, every new invocation opens a new DB connection and
// MongoDB Atlas free tier hits connection limits quickly.
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ CRITICAL ERROR: No MONGODB_URI provided.');
    return;
  }

  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already being established, wait for it
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4 // Force IPv4 to avoid SRV resolution issues
    }).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB Atlas — himshakti DB');
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('❌ MongoDB connection failed:', err.message);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDB };
