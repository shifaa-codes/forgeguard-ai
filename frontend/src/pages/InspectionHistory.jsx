import { useEffect, useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import InspectionTable from '../components/InspectionTable';
import InspectionDetailModal from '../components/InspectionDetailModal';
import { getInspectionHistory } from '../services/api';

const filters = [
  { id: 'all',      label: 'All' },
  { id: 'passed',   label: 'Passed' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'high',     label: 'High Severity' },
  { id: 'critical', label: 'Critical' },
];

export default function InspectionHistory() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { getInspectionHistory().then(setRows); }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchQ = !q || r.productId.toLowerCase().includes(q.toLowerCase())
                       || r.id.toLowerCase().includes(q.toLowerCase());
      const matchF =
        filter === 'all' ? true :
        filter === 'passed' ? r.decision === 'PASS' :
        filter === 'rejected' ? r.decision === 'REJECT' :
        filter === 'high' ? r.severity === 'High' :
        filter === 'critical' ? r.severity === 'Critical' : true;
      return matchQ && matchF;
    });
  }, [rows, q, filter]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="card !p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-base/60
                          border border-white/[0.08] flex-1 focus-within:border-warm/40 transition-colors">
            <Search className="w-4 h-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by Product ID or Inspection ID…"
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted hidden md:block" />
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${filter === f.id
                    ? 'bg-warm text-[#0B1114] shadow-glow-warm'
                    : 'bg-white/[0.04] text-ink-soft border border-white/[0.06] hover:bg-white/[0.08]'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-xs text-muted">
          Showing <span className="text-ink font-mono">{filtered.length}</span> of {rows.length} inspections
        </div>
      </div>

      <InspectionTable rows={filtered} onRowClick={setSelected} />

      {selected && <InspectionDetailModal inspection={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}