import { ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import DefectBadge from './DefectBadge';
import SeverityIndicator from './SeverityIndicator';

export default function InspectionTable({ rows, onRowClick }) {
  if (!rows?.length) {
    return (
      <div className="card text-center py-12">
        <div className="text-muted text-sm">No inspections match your filters.</div>
      </div>
    );
  }
  return (
    <div className="card !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {['Inspection ID', 'Product', 'Time', 'Defect', 'Severity', 'Confidence', 'Match', 'Decision', ''].map((h) => (
                <th key={h} className="text-left label px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => onRowClick?.(r)}
                className="border-b border-white/[0.04] last:border-0
                           hover:bg-white/[0.03] cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">{r.id}</td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{r.productId}</td>
                <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">{r.time}</td>
                <td className="px-4 py-3"><DefectBadge defect={r.defect} /></td>
                <td className="px-4 py-3"><SeverityIndicator severity={r.severity} /></td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">{r.confidence}%</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">{r.standardMatch}%</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={r.decision === 'PASS' ? 'success' : r.decision === 'REJECT' ? 'danger' : 'warning'}>
                    {r.decision}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3">
                  <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}