/**
 * Central API base URL for all fetch calls.
 *
 * - In development (localhost): '' — Vite proxy forwards /api/* to localhost:5050
 * - In production (Vercel): '' — frontend and backend are on the same domain,
 *   so /api/* calls go directly to the Vercel serverless function, no CORS needed.
 */
export const API_BASE = '';
