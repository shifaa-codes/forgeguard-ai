import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, CheckCircle2, XCircle, TrendingDown,
  ArrowRight, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import InspectionTable from '../components/InspectionTable';
import InspectionDetailModal from '../components/InspectionDetailModal';
import { getDashboardStats } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats().then(setData);
  }, []);

  if (!data) return <LoadingSkeleton />;

const stats = data?.stats || { totalInspected: 0, passed: 0, rejected: 0, defectRate: 0 };
const recent = data?.recent || [];
const defectDistribution = data?.defectDistribution || [];
const trend = data?.trend || [];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Inspected" value={stats.totalInspected.toLocaleString()} icon={Package}       accent="electric" trend="+12%" />
        <StatCard label="Passed"          value={stats.passed.toLocaleString()}          icon={CheckCircle2}  accent="success"  trend="+9%"  />
        <StatCard label="Rejected"        value={stats.rejected}                          icon={XCircle}       accent="danger"   trend="-3%"  />
        <StatCard label="Defect Rate"     value={stats.defectRate} suffix="%"             icon={TrendingDown}  accent="warm"     trend="-0.8%"/>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Inspection Trend" subtitle="Products inspected & defect rate"
                   className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#8A8580" fontSize={11} />
                <YAxis yAxisId="l" stroke="#8A8580" fontSize={11} />
                <YAxis yAxisId="r" orientation="right" stroke="#8A8580" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#8A8580' }} />
                <Line yAxisId="l" type="monotone" dataKey="inspected" name="Inspected"
                      stroke="#4A9EFF" strokeWidth={2.5} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="defectRate" name="Defect Rate %"
                      stroke="#B58863" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Defect Distribution" subtitle="Last 24 hours">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={defectDistribution} dataKey="value" nameKey="name"
                     cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                  {defectDistribution.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {defectDistribution.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-ink-soft">{d.name}</span>
                <span className="ml-auto font-mono text-muted">{d.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold">Recent Inspections</div>
            <div className="text-xs text-muted">Latest products analyzed on the line</div>
          </div>
          <button onClick={() => navigate('/app/history')} className="btn-ghost">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <InspectionTable rows={recent} onRowClick={setSelected} />
      </div>

      {selected && <InspectionDetailModal inspection={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg bg-[#101A1F]/95 backdrop-blur border border-white/[0.1] text-xs">
      {label && <div className="text-muted mb-1">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-ink-soft">{p.name}:</span>
          <span className="font-mono text-ink">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-2xl bg-white/[0.03]" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-96 rounded-2xl bg-white/[0.03]" />
        <div className="h-96 rounded-2xl bg-white/[0.03]" />
      </div>
    </div>
  );
}