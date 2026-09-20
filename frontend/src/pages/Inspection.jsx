import { useState, useRef } from 'react';
import {
  Upload, Scan, CheckCircle2, XCircle, AlertTriangle,
  Loader2, RotateCcw, TrendingUp, ShieldCheck
} from 'lucide-react';
import { runInspection, getStandard } from '../services/inspection';
import { useEffect } from 'react';

export default function Inspection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [standard, setStandard] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    getStandard().then(setStandard).catch(() => {});
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG)');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  const runInspect = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const res = await runInspection(file);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const decisionColors = {
    PASS: { text: 'text-success', bg: 'bg-success/10', border: 'border-success/30', icon: CheckCircle2 },
    REJECT: { text: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30', icon: XCircle },
    REVIEW: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle },
  };

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      {/* Left: Upload / Preview */}
      <div className="lg:col-span-3 space-y-4">
        {/* Upload zone */}
        {!preview && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`card cursor-pointer transition-all duration-300 text-center py-16
              ${dragging ? 'border-warm/50 bg-warm/[0.04] shadow-glow-warm' : 'hover:border-white/[0.15]'}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-warm/20 to-transparent
                            border border-warm/25 flex items-center justify-center mb-5">
              <Upload className="w-7 h-7 text-warm" />
            </div>
            <div className="font-semibold text-lg mb-1">Upload Product for Inspection</div>
            <div className="text-sm text-muted mb-4">
              Drag and drop an image, or click to browse
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-muted">
              <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">PNG</span>
              <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">JPG</span>
              <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">Max 10 MB</span>
            </div>
          </div>
        )}

        {/* Preview + result overlay */}
        {preview && (
          <div className="card !p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-warm" />
                <div className="font-semibold text-sm">Product Image</div>
              </div>
              <button onClick={reset} className="btn-ghost !p-2" title="Reset">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden
                            bg-gradient-to-br from-[#16323A] via-[#0f1e24] to-[#0B1114]
                            border border-white/[0.08]">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              {/* Detection bounding boxes */}
              {result?.defects?.map((d, i) => (
                <div
                  key={i}
                  className="absolute animate-bbox-in pointer-events-none"
                  style={{
                    left: `${(d.bbox.x1 / 640) * 100}%`,
                    top: `${(d.bbox.y1 / 640) * 100}%`,
                    width: `${((d.bbox.x2 - d.bbox.x1) / 640) * 100}%`,
                    height: `${((d.bbox.y2 - d.bbox.y1) / 640) * 100}%`,
                  }}
                >
                  {['top-0 left-0 border-t-2 border-l-2',
                    'top-0 right-0 border-t-2 border-r-2',
                    'bottom-0 left-0 border-b-2 border-l-2',
                    'bottom-0 right-0 border-b-2 border-r-2'].map((c, k) => (
                    <span key={k} className={`absolute w-4 h-4 ${c} border-danger`}
                          style={{ filter: 'drop-shadow(0 0 6px #EF4444)' }} />
                  ))}
                  <div className="absolute -top-7 left-0 px-2 py-1 rounded-md
                                  bg-danger text-white text-[10px] font-bold tracking-wider
                                  font-mono shadow-glow-danger whitespace-nowrap">
                    {d.class_name.toUpperCase()} {Math.round(d.confidence * 100)}%
                  </div>
                </div>
              ))}
            </div>

            {!result && (
              <button
                onClick={runInspect}
                disabled={loading}
                className="btn-primary w-full justify-center !py-3 mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running AI Inspection…
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    Run Inspection
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="card !p-4 border-danger/30 bg-danger/[0.06] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-danger text-sm">Inspection Failed</div>
              <div className="text-xs text-ink-soft mt-0.5">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Result panel */}
      <div className="lg:col-span-2 space-y-4">
        {/* Standard status */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-electric" />
            <div className="font-semibold text-sm">Reference Standard</div>
          </div>
          {standard ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{standard.name || 'Standard'}</div>
                <div className="text-[11px] font-mono text-muted">{standard.product_id}</div>
              </div>
              <span className="px-2 py-1 rounded-md bg-success/15 border border-success/30
                               text-success text-[10px] font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
          ) : (
            <div className="text-xs text-muted">
              No active standard registered. Comparison will be skipped.
            </div>
          )}
        </div>

        {/* Result */}
        {result ? (
          <>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-sm">Inspection Result</div>
                  <div className="text-[11px] font-mono text-muted">{result.inspection_id}</div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                  border ${result.model_mode === 'real'
                    ? 'bg-success/15 border-success/30 text-success'
                    : 'bg-warning/15 border-warning/30 text-warning'}`}>
                  {result.model_mode === 'real' ? 'YOLO' : 'Mock'}
                </span>
              </div>

              {/* Big decision */}
              {(() => {
                const cfg = decisionColors[result.decision] || decisionColors.REVIEW;
                const Icon = cfg.icon;
                return (
                  <div className={`rounded-2xl p-6 text-center border ${cfg.bg} ${cfg.border}`}>
                    <Icon className={`w-12 h-12 mx-auto mb-2 ${cfg.text}`} />
                    <div className={`text-3xl font-bold tracking-tight ${cfg.text}`}>
                      {result.decision}
                    </div>
                    <div className="text-xs text-muted mt-1 uppercase tracking-wider">
                      {result.decision === 'PASS' ? 'Product Passed'
                        : result.decision === 'REJECT' ? 'Defect Detected'
                        : 'Manual Review Required'}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Details */}
            <div className="card">
              <div className="font-semibold text-sm mb-3">Detection Details</div>
              <div className="space-y-2">
                <DetailRow label="Standard Match" value={`${result.standard_match?.toFixed(1) || 0}%`} />
                <DetailRow label="Status" value={result.standard_status || '—'} />
                <DetailRow label="Severity" value={result.severity || '—'} />
                <DetailRow label="Defects Found" value={result.defects?.length || 0} />
              </div>

              {result.defects?.length > 0 && (
                <>
                  <div className="divider my-4" />
                  <div className="label mb-2">Detected Defects</div>
                  <div className="space-y-2">
                    {result.defects.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg
                                              bg-white/[0.03] border border-white/[0.06]">
                        <div>
                          <div className="text-sm font-medium text-danger capitalize">
                            {d.class_name.replace(/_/g, ' ')}
                          </div>
                          <div className="text-[11px] text-muted">
                            Confidence: {Math.round(d.confidence * 100)}%
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-muted">
                          {d.severity?.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="card text-center py-10">
            <TrendingUp className="w-8 h-8 text-muted mx-auto mb-3" />
            <div className="text-sm text-muted">
              Upload an image and run inspection to see results
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-medium text-ink-soft">{value}</span>
    </div>
  );
}