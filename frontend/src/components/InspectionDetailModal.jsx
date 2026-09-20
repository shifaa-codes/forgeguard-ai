import { X, Scan, Ruler, Calendar, Hash } from 'lucide-react';
import StatusBadge from './StatusBadge';
import DefectBadge from './DefectBadge';
import SeverityIndicator from './SeverityIndicator';
import DetectionOverlay from './DetectionOverlay';

export default function InspectionDetailModal({ inspection, onClose }) {
  if (!inspection) return null;
  const hasDefect = inspection.defect !== 'None';
  const bbox = hasDefect
    ? { x: 28, y: 30, w: 40, h: 34, label: inspection.defect.toUpperCase(), conf: inspection.confidence }
    : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4
                    bg-black/70 backdrop-blur-md animate-fade-in"
         onClick={onClose}>
      <div
        className="w-full max-w-3xl card !p-0 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric/20 to-transparent
                            border border-electric/20 flex items-center justify-center">
              <Scan className="w-[18px] h-[18px] text-electric" />
            </div>
            <div>
              <div className="font-semibold">{inspection.id}</div>
              <div className="text-xs text-muted font-mono">Product: {inspection.productId}</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost !p-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5 p-5">
          {/* Image preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden
                          border border-white/[0.08] bg-[#0a0f12]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#16323A] via-[#0f1e24] to-[#0B1114]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[52%] h-[64%] rounded-2xl bg-gradient-to-br from-[#3D4D55] to-[#1a252b]
                              border border-white/[0.06]" />
            </div>
            {bbox && <DetectionOverlay bbox={bbox} />}
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60
                            text-[10px] font-mono text-ink-soft border border-white/[0.08]">
              Captured frame
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <DetailRow label="Defect"      value={<DefectBadge defect={inspection.defect} />} />
            <DetailRow label="Severity"    value={<SeverityIndicator severity={inspection.severity} />} />
            <DetailRow label="Confidence"  value={<span className="font-mono text-sm">{inspection.confidence}%</span>} />
            <DetailRow label="Std Match"   value={<span className="font-mono text-sm">{inspection.standardMatch}%</span>} />
            <DetailRow label="Decision"    value={
              <StatusBadge tone={inspection.decision === 'PASS' ? 'success' : inspection.decision === 'REJECT' ? 'danger' : 'warning'}>
                {inspection.decision}
              </StatusBadge>
            } />

            <div className="divider my-2" />
            <div className="flex items-center gap-2 text-xs text-muted">
              <Calendar className="w-3.5 h-3.5" /> {inspection.time}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Hash className="w-3.5 h-3.5" /> Standard: STD-MC-A-001
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Ruler className="w-3.5 h-3.5" /> Inspector: Vision Pipeline v1.2
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-white/[0.06] flex justify-end gap-3">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary">Export Report</button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <span className="label">{label}</span>
      <span>{value}</span>
    </div>
  );
}