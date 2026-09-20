const API_BASE = 'http://localhost:8000/api';

/**
 * Run a single-image inspection via the backend YOLO pipeline.
 * @param {File} file - Image file
 * @returns {Promise<Object>} Backend inspection result
 */
export async function runInspection(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/inspection/image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      err.error ||
      err.detail?.error ||
      `Inspection failed (${res.status})`;
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Fetch the currently active standard product (if any).
 */
export async function getStandard() {
  const res = await fetch(`${API_BASE}/standard`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data : null;
}

/**
 * Fetch recent inspection history (for the sidebar "Recent" list).
 */
export async function getRecentInspections(limit = 5) {
  const res = await fetch(
    `${API_BASE}/inspection/history?limit=${limit}&page=1`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}