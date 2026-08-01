/**
 * Central API base URL for all fetch calls.
 *
 * - In development: '' (empty string) — Vite's dev proxy forwards /api/* to localhost:5050.
 * - In production (Vercel): the full Render backend URL from VITE_API_URL env var.
 *
 * Usage: `fetch(`${API_BASE}/api/some-endpoint`)`
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? '';
