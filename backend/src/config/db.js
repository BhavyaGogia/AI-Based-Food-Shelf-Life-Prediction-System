const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ CRITICAL ERROR: No MONGODB_URI provided in environment variables.');
    return;
  }

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        family: 4 // Force IPv4 to fix SRV resolution issues on some Windows machines
      });
      console.log('✅ Connected to MongoDB Atlas — himshakti DB');
    } catch (err) {
      console.error('⚠️ MongoDB connection failed. Retrying in 5 seconds...', err.message);
      setTimeout(connectWithRetry, 5000);
    }
  };

  connectWithRetry();
}

module.exports = { connectDB };
