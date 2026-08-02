/**
 * Central API base URL for all fetch calls.
 *
 * - In development: '' (empty string) — Vite's dev proxy forwards /api/* to localhost:5050.
 * - In production (Vercel): the full Render backend URL from VITE_API_URL env var.
 *
 * Usage: `fetch(`${API_BASE}/api/some-endpoint`)`
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? '';

// Keep the Render free-tier backend alive by pinging /health every 5 minutes.
// This only runs in production (when VITE_API_URL is set).
if (import.meta.env.VITE_API_URL) {
  const ping = () =>
    fetch(`${import.meta.env.VITE_API_URL}/health`, { method: 'GET' }).catch(() => {});
  ping(); // Immediate ping on app load to wake up Render if sleeping
  setInterval(ping, 5 * 60 * 1000); // Then every 5 minutes
}

