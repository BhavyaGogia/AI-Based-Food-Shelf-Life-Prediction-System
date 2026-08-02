const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://ai-based-food-shelf-life-prediction.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

module.exports = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, Postman, same-origin Vercel)
    if (!origin) return callback(null, true);
    // Allow localhost during development
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    // Allow all Vercel deployments for this project
    if (/^https:\/\/ai-based-food-shelf-life[\w-]*\.vercel\.app$/.test(origin)) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});
