import { useMockCamera } from '../hooks/useMockCamera';
import CameraPanel from '../components/CameraPanel';
import StatusBadge from '../components/StatusBadge';
import DefectBadge from '../components/DefectBadge';
import SeverityIndicator from '../components/SeverityIndicator';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/Toast';
import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { liveStats } from '../data/mockData';

export default function LiveInspection() {
  const { current, fps, processing } = useMockCamera({ interval: 4500 });
  const { toasts, push } = useToast();
  const lastId = useRef(null);

  useEffect(() => {
    if (!current || lastId.current === current.id) return;
    lastId.current = current.id;
    if (current.type === 'DEFECT') {
      push(`${current.defect} detected — ${current.confidence}% confidence`, 'error');
    } else if (current.type === 'REVIEW') {
      push('Standard mismatch — manual review required', 'warning');
    } else {
      push('Product passed inspection', 'success');
    }
  }, [current, push]);

  const isPass = current?.decision === 'PASS';
  const isReject = current?.decision === 'REJECT';
  const isReview = current?.decision === 'REVIEW';

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      {/* Camera */}
      <div className="lg:col-span-3 space-y-4">
        <CameraPanel state={current} fps={fps} processing={processing} mock />

        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Camera" value="CAM-01" />
          <MiniStat label="Resolution" value="1920×1080" />
          <MiniStat label="Latency" value="34 ms" />
        </div>
      </div>

      {/* Right panel */}
      <div className="lg:col-span-2 space-y-4">
        {/* Current inspection */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold">Current Inspection</div>
              <div className="text-xs text-muted font-mono">Product P-1047</div>
            </div>
            <StatusBadge tone={isPass ? 'success' : isReject ? 'danger' : 'warning'} pulse>
              {isPass ? 'PASS' : isReject ? 'REJECT' : 'REVIEW'}
            </StatusBadge>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="Standard Match" value={`${current?.standardMatch ?? 0}%`} />
            <Field label="Confidence"     value={current ? `${current.confidence}%` : '—'} />
            <Field label="Defect"         value={<DefectBadge defect={current?.defect} />} />
            <Field label="Severity"       value={<SeverityIndicator severity={current?.severity || '—'} />} />
          </div>

          {/* Big decision */}
          <div className={`rounded-2xl p-6 text-center border transition-all duration-500
            ${isPass ? 'bg-success/[0.08] border-success/30 shadow-glow-success'
              : isReject ? 'bg-danger/[0.08] border-danger/30 shadow-glow-danger'
              : 'bg-warning/[0.08] border-warning/30'}`}>
            <div className="flex items-center justify-center mb-2">
              {isPass ? <CheckCircle2 className="w-12 h-12 text-success" />
                : isReject ? <XCircle className="w-12 h-12 text-danger" />
                : <AlertTriangle className="w-12 h-12 text-warning" />}
            </div>
            <div className={`text-3xl font-bold tracking-tight
              ${isPass ? 'text-success' : isReject ? 'text-danger' : 'text-warning'}`}>
              {current?.decision || '—'}
            </div>
            <div className="text-xs text-muted mt-1 uppercase tracking-wider">
              {isPass ? 'Product Passed' : isReject ? 'Defect Detected' : 'Standard Mismatch'}
            </div>
          </div>

          {isReview && (
            <p className="text-xs text-muted mt-3 leading-relaxed">
              The detected product does not sufficiently match the registered standard.
              Manual review recommended before proceeding.
            </p>
          )}
        </div>

        {/* Live stats */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-electric" />
            <div className="font-semibold">Live Statistics</div>
            <span className="ml-auto text-[10px] text-muted font-mono">session</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatRow label="Inspected" value={liveStats.inspected} />
            <StatRow label="Passed"    value={liveStats.passed}    tone="success" />
            <StatRow label="Rejected"  value={liveStats.rejected}  tone="danger" />
            <StatRow label="Defect Rate" value={`${liveStats.defectRate}%`} tone="warm" />
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="card !p-3">
      <div className="label mb-1">{label}</div>
      <div className="font-mono text-sm text-ink-soft">{value}</div>
    </div>
  );
}
function Field({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div className="label mb-1.5">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
function StatRow({ label, value, tone = 'default' }) {
  const tones = { success: 'text-success', danger: 'text-danger', warm: 'text-warm', default: 'text-ink' };
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02]">
      <span className="text-xs text-muted">{label}</span>
      <span className={`font-mono font-bold ${tones[tone]}`}>{value}</span>
    </div>
  );
}