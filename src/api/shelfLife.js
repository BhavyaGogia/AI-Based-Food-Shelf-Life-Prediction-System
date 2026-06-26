/**
 * Fetch products from the backend database.
 * Supports query params like limit.
 * @param {Object} params - Query parameters.
 * @returns {Promise<Object>} API response.
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/api/products${query ? `?${query}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch dynamic system stats from the backend.
 * @returns {Promise<Object>} API response.
 */
export async function getStats() {
  const response = await fetch('/api/stats');
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
  const response = await fetch('/api/shelf-life/analyse', {
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
