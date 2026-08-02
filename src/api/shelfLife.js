import { API_BASE } from '../lib/api';

/**
 * Fetch products from the backend database.
 * Supports query params like limit.
 * @param {Object} params - Query parameters.
 * @returns {Promise<Object>} API response.
 */
export async function getProducts(params = {}, retries = 3) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/api/products${query ? `?${query}` : ''}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (err) {
    if (retries > 0) {
      // Render free tier cold start can take 30-50s. Wait 15s and retry.
      await new Promise(r => setTimeout(r, 15000));
      return getProducts(params, retries - 1);
    }
    throw err;
  }
}


/**
 * Fetch dynamic system stats from the backend.
 * @returns {Promise<Object>} API response.
 */
export async function getStats() {
  const response = await fetch(`${API_BASE}/api/stats`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Call the shelf life AI analysis endpoint.
 * @param {Object} formData - Form data with product specifications.
 * @returns {Promise<Object>} API response.
 */
export async function analyseShelfLife(formData) {
  const response = await fetch(`${API_BASE}/api/shelf-life/analyse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const getPrefetchResult = async (productId) => {
  const res = await fetch(`${API_BASE}/api/shelf-life/prefetch/${productId}`);
  return res.json();
};

export const prefetchAll = async () => {
  const res = await fetch(`${API_BASE}/api/shelf-life/prefetch-all`, { method: 'POST' });
  return res.json();
};

export async function getHistory(page = 1, limit = 100) {
  const res = await fetch(`${API_BASE}/api/shelf-life/history?page=${page}&limit=${limit}`);
  return res.json();
}

export async function approveBatch(id) {
  const res = await fetch(`${API_BASE}/api/shelf-life/approve/${id}`, { method: 'PUT' });
  return res.json();
}

export async function rejectBatch(id) {
  const res = await fetch(`${API_BASE}/api/shelf-life/reject/${id}`, { method: 'PUT' });
  return res.json();
}

export async function dispatchBatch(id) {
  const res = await fetch(`${API_BASE}/api/shelf-life/dispatch/${id}`, { method: 'PUT' });
  return res.json();
}

export async function updateStorageZone(id, storageZone) {
  const res = await fetch(`${API_BASE}/api/shelf-life/storage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storageZone })
  });
  return res.json();
}
