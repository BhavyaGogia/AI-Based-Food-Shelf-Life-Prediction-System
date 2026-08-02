// Vercel Serverless Function entry point.
// Imports the Express app and exports it for Vercel to handle.
// Vercel calls this as a serverless function for all /api/* routes.

const app = require('../backend/server');

module.exports = app;
