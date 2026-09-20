export const defectTypes = ['Scratch', 'Crack', 'Dent', 'Surface Defect', 'Deformation'];
export const severities = ['Low', 'Medium', 'High', 'Critical'];

export const dashboardStats = {
  totalInspected: 1250,
  passed: 1143,
  rejected: 107,
  defectRate: 8.56,
};

export const defectDistribution = [
  { name: 'Scratch',        value: 51, color: '#B58863' },
  { name: 'Crack',          value: 24, color: '#4A9EFF' },
  { name: 'Dent',           value: 18, color: '#8B5CF6' },
  { name: 'Surface Defect', value: 14, color: '#F59E0B' },
];

export const inspectionTrend = Array.from({ length: 12 }, (_, i) => {
  const inspected = 90 + Math.round(Math.sin(i / 1.6) * 25 + i * 3);
  const defectRate = +(6 + Math.sin(i / 2) * 2 + Math.random() * 1.5).toFixed(2);
  return {
    time: `${8 + i}:00`,
    inspected,
    defectRate,
    defects: Math.round((inspected * defectRate) / 100),
  };
});

const defectPool = [
  { defect: 'None',           severity: '—',        confidence: 98 },
  { defect: 'Scratch',        severity: 'High',     confidence: 94 },
  { defect: 'Crack',          severity: 'Critical', confidence: 91 },
  { defect: 'Dent',           severity: 'Medium',   confidence: 89 },
  { defect: 'Surface Defect', severity: 'Low',      confidence: 92 },
];

export const recentInspections = [
  { id: 'INS-1250', productId: 'P-1042', time: '10:42 AM', defect: 'Scratch', severity: 'High',     confidence: 94, standardMatch: 88, decision: 'REJECT' },
  { id: 'INS-1249', productId: 'P-1043', time: '10:43 AM', defect: 'None',    severity: '—',        confidence: 98, standardMatch: 97, decision: 'PASS'   },
  { id: 'INS-1248', productId: 'P-1044', time: '10:44 AM', defect: 'Crack',   severity: 'Critical', confidence: 91, standardMatch: 82, decision: 'REJECT' },
  { id: 'INS-1247', productId: 'P-1045', time: '10:45 AM', defect: 'None',    severity: '—',        confidence: 99, standardMatch: 99, decision: 'PASS'   },
  { id: 'INS-1246', productId: 'P-1046', time: '10:46 AM', defect: 'Dent',    severity: 'Medium',   confidence: 89, standardMatch: 90, decision: 'REJECT' },
  { id: 'INS-1245', productId: 'P-1047', time: '10:47 AM', defect: 'None',    severity: '—',        confidence: 96, standardMatch: 95, decision: 'PASS'   },
  { id: 'INS-1244', productId: 'P-1048', time: '10:48 AM', defect: 'Surface Defect', severity: 'Low', confidence: 92, standardMatch: 93, decision: 'REJECT' },
];

export const generateInspectionHistory = (count = 40) => {
  return Array.from({ length: count }, (_, i) => {
    const base = recentInspections[i % recentInspections.length];
    const n = 1250 - i;
    return {
      ...base,
      id: `INS-${n}`,
      productId: `P-${1000 + n}`,
      time: `${10 - Math.floor(i / 10)}:${String((58 - i) % 60).padStart(2, '0')} AM`,
    };
  });
};

export const standardProduct = {
  name: 'Metal Component A',
  id: 'STD-MC-A-001',
  registeredAt: '2024-11-08 09:15 AM',
  status: 'Active Standard',
  image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
  specifications: {
    material: 'Grade 304 Stainless Steel',
    dimensions: '120 × 80 × 15 mm',
    tolerance: '±0.05 mm',
    surfaceFinish: 'Ra 0.8 µm',
  },
};

/* MOCK CAMERA STATE — represents what a real backend would return.
   This is NOT AI inference. It's a state machine for UI demonstration.
   Replace with WebSocket/SSE from FastAPI + YOLO later. */
export const mockCameraStates = [
  {
    id: 'good',
    type: 'PASS',
    status: '✓ PRODUCT PASSED',
    label: 'Product Passed',
    defect: 'None',
    confidence: 98.4,
    standardMatch: 98,
    severity: null,
    decision: 'PASS',
    bbox: null,
  },
  {
    id: 'scratch',
    type: 'DEFECT',
    status: '⚠ DEFECT DETECTED',
    label: 'Scratch',
    defect: 'Scratch',
    confidence: 94.2,
    standardMatch: 88.1,
    severity: 'High',
    decision: 'REJECT',
    bbox: { x: 32, y: 28, w: 34, h: 30, label: 'SCRATCH', conf: 94 },
  },
  {
    id: 'crack',
    type: 'DEFECT',
    status: '⚠ DEFECT DETECTED',
    label: 'Crack',
    defect: 'Crack',
    confidence: 91.7,
    standardMatch: 82.4,
    severity: 'Critical',
    decision: 'REJECT',
    bbox: { x: 40, y: 20, w: 28, h: 46, label: 'CRACK', conf: 91 },
  },
  {
    id: 'dent',
    type: 'DEFECT',
    status: '⚠ DEFECT DETECTED',
    label: 'Dent',
    defect: 'Dent',
    confidence: 89.3,
    standardMatch: 90.2,
    severity: 'Medium',
    decision: 'REJECT',
    bbox: { x: 45, y: 45, w: 22, h: 22, label: 'DENT', conf: 89 },
  },
  {
    id: 'unknown',
    type: 'REVIEW',
    status: '⚠ STANDARD MISMATCH',
    label: 'Unknown Product',
    defect: 'Unknown',
    confidence: 62.1,
    standardMatch: 54.3,
    severity: null,
    decision: 'REVIEW',
    bbox: null,
  },
];

export const liveStats = {
  inspected: 248,
  passed: 221,
  rejected: 27,
  defectRate: 10.9,
};