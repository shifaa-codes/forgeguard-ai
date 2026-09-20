/**
 * ForgeGuard AI — API Service Layer
 * Frontend <-> Backend bridge
 */

const API_BASE = 'http://localhost:8000/api';
const USE_MOCK = false; // ✅ Using real backend

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ---------- Fallback mock data (agar backend down ho) ----------
const fallback = {
  standardProduct: {
    name: 'Metal Component A',
    id: 'STD-MOCK-001',
    registeredAt: '—',
    status: 'Active Standard',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    specifications: {},
  },
  dashboardStats: { totalInspected: 0, passed: 0, rejected: 0, defectRate: 0 },
  defectDistribution: [],
  inspectionTrend: [],
  recentInspections: [],
};

// ---------- Helper ----------
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.warn(`[API] ${url} → ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Network error for ${url}:`, err.message);
    return null;
  }
}

// ---------- Standard Product ----------
export async function getStandardProduct() {
  if (USE_MOCK) { await delay(); return fallback.standardProduct; }
  const data = await safeFetch(`${API_BASE}/standard`);
  if (!data || data.success === false) return null;
  return {
    name: data.name || 'Standard Product',
    id: data.product_id || 'STD-XXX',
    registeredAt: data.created_at || data.registered_at || '—',
    status: data.status === 'active' ? 'Active Standard' : 'Inactive',
    image: data.image_url?.startsWith('http')
      ? data.image_url
      : `http://localhost:8000${data.image_url || ''}`,
    specifications: {},
  };
}

export async function uploadStandardProduct(file, meta = {}) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('name', meta.name || 'Standard Product');
  const res = await fetch(`${API_BASE}/standard/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

// ---------- Inspection ----------
export async function startInspection() {
  return { sessionId: 'sess_' + Date.now(), status: 'running' };
}

export async function getInspectionResult(sessionId) {
  return { sessionId, status: 'ok' };
}

export async function getInspectionHistory(filters = {}) {
  if (USE_MOCK) { await delay(); return []; }
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.decision) params.append('decision', filters.decision);
  if (filters.severity) params.append('severity', filters.severity);
  if (filters.search) params.append('search', filters.search);

  const data = await safeFetch(`${API_BASE}/inspection/history?${params}`);
  if (!data || !data.items) return [];

  return data.items.map((r) => ({
    id: r.inspection_id,
    inspectionId: r.inspection_id,
    productId: r.product_id,
    time: new Date(r.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    }),
    timestamp: r.timestamp,
    defect: r.defect || 'None',
    severity: r.severity || '—',
    confidence: Math.round((r.confidence || 1) * 100),
    standardMatch: Math.round(r.standard_match || 0),
    decision: r.decision,
    imageUrl: r.image_url,
  }));
}

export async function getInspectionDetails(inspectionId) {
  return await safeFetch(`${API_BASE}/inspection/${inspectionId}`);
}

// ---------- Dashboard ----------
export async function getDashboardStats() {
  if (USE_MOCK) {
    await delay();
    return {
      stats: fallback.dashboardStats,
      recent: fallback.recentInspections,
      defectDistribution: fallback.defectDistribution,
      trend: fallback.inspectionTrend,
    };
  }

  const [stats, recent, defectDist, trend] = await Promise.all([
    safeFetch(`${API_BASE}/dashboard/stats`),
    safeFetch(`${API_BASE}/inspection/history?limit=7`),
    safeFetch(`${API_BASE}/analytics/defects`),
    safeFetch(`${API_BASE}/analytics/trend`),
  ]);

  // Defect distribution → array for Recharts
  const defectColors = {
    scratch: '#B58863',
    crack: '#4A9EFF',
    dent: '#8B5CF6',
    surface_defect: '#F59E0B',
    deformation: '#22C55E',
  };
  const defectLabels = {
    scratch: 'Scratch',
    crack: 'Crack',
    dent: 'Dent',
    surface_defect: 'Surface Defect',
    deformation: 'Deformation',
  };
  const defectArr = defectDist
    ? Object.entries(defectDist)
        .filter(([k, v]) => v > 0)
        .map(([k, v]) => ({
          name: defectLabels[k] || k,
          value: v,
          color: defectColors[k] || '#888',
        }))
    : [];

  return {
    stats: stats
      ? {
          totalInspected: stats.total_inspected || 0,
          passed: stats.passed || 0,
          rejected: stats.rejected || 0,
          defectRate: stats.defect_rate || 0,
        }
      : fallback.dashboardStats,
    recent: recent?.items
      ? recent.items.map((r) => ({
          id: r.inspection_id,
          productId: r.product_id,
          time: new Date(r.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit',
          }),
          defect: r.defect || 'None',
          severity: r.severity || '—',
          confidence: Math.round((r.confidence || 1) * 100),
          standardMatch: Math.round(r.standard_match || 0),
          decision: r.decision,
        }))
      : [],
    defectDistribution: defectArr.length > 0 ? defectArr : fallback.defectDistribution,
    trend: trend && trend.length > 0
      ? trend.map((t) => ({
          time: t.time,
          inspected: t.inspected,
          defectRate: t.inspected > 0 ? +((t.defects / t.inspected) * 100).toFixed(2) : 0,
          defects: t.defects,
        }))
      : fallback.inspectionTrend,
  };
}

// ---------- Analytics ----------
export async function getAnalytics() {
  if (USE_MOCK) {
    await delay();
    return {
      defectDistribution: fallback.defectDistribution,
      trend: fallback.inspectionTrend,
    };
  }

  const [defectDist, trend] = await Promise.all([
    safeFetch(`${API_BASE}/analytics/defects`),
    safeFetch(`${API_BASE}/analytics/trend`),
  ]);

  const defectColors = {
    scratch: '#B58863',
    crack: '#4A9EFF',
    dent: '#8B5CF6',
    surface_defect: '#F59E0B',
    deformation: '#22C55E',
  };
  const defectLabels = {
    scratch: 'Scratch',
    crack: 'Crack',
    dent: 'Dent',
    surface_defect: 'Surface Defect',
    deformation: 'Deformation',
  };
  const defectArr = defectDist
    ? Object.entries(defectDist)
        .filter(([k, v]) => v > 0)
        .map(([k, v]) => ({
          name: defectLabels[k] || k,
          value: v,
          color: defectColors[k] || '#888',
        }))
    : [];

  return {
    defectDistribution: defectArr.length > 0 ? defectArr : fallback.defectDistribution,
    trend: trend && trend.length > 0
      ? trend.map((t) => ({
          time: t.time,
          inspected: t.inspected,
          defectRate: t.inspected > 0 ? +((t.defects / t.inspected) * 100).toFixed(2) : 0,
          defects: t.defects,
        }))
      : fallback.inspectionTrend,
  };
}