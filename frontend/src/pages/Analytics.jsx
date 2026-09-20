import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Activity, AlertTriangle, Target, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import QualityAlert from '../components/QualityAlert';
import { getAnalytics } from '../services/api';
import { dashboardStats } from '../data/mockData';

const severityData = [
  { name: 'Low',      value: 34, color: '#22C55E' },
  { name: 'Medium',   value: 41, color: '#F59E0B' },
  { name: 'High',     value: 22, color: '#EF4444' },
  { name: 'Critical', value: 10, color: '#DC2626' },
];

export default function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { getAnalytics().then(setData); }, []);
  if (!data) return <div className="text-muted text-sm">Loading analytics…</div>;

  const passRate = ((dashboardStats.passed / dashboardStats.totalInspected) * 100).toFixed(1);
  const rejectRate = ((dashboardStats.rejected / dashboardStats.totalInspected) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Inspected" value={dashboardStats.totalInspected.toLocaleString()} icon={Activity}    accent="electric" />
        <StatCard label="Pass Rate"       value={passRate}  suffix="%" icon={Target}    accent="success" />
        <StatCard label="Reject Rate"     value={rejectRate} suffix="%" icon={AlertTriangle} accent="danger" />
        <StatCard label="Defect Rate"     value={dashboardStats.defectRate} suffix="%" icon={TrendingUp} accent="warm" />
      </div>

      {/* Alert */}
      <QualityAlert
        title="⚠ Defect rate increased by 35% in the last 2 hours"
        message="Unusual spike detected on production line A. Investigation recommended."
        frequency="Scratch — 48% of all detected defects"
        action="Recommended Action: Inspect the relevant production stage"
      />

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Defect Trends" subtitle="Defect count over the shift">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#8A8580" fontSize={11} />
                <YAxis stroke="#8A8580" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="defects" name="Defects"
                      stroke="#B58863" strokeWidth={2.5} dot={{ r: 3, fill: '#B58863' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Defect Distribution" subtitle="By defect category">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.defectDistribution} dataKey="value" nameKey="name"
                     cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} stroke="none">
                  {data.defectDistribution.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#8A8580' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Severity Distribution" subtitle="Detected defects by severity">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#8A8580" fontSize={11} />
                <YAxis stroke="#8A8580" fontSize={11} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                  {severityData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Most common defect */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-warm" />
            <div className="font-semibold">Most Common Defect</div>
          </div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-5xl font-bold text-warm tracking-tight">Scratch</div>
              <div className="text-sm text-muted mt-1">48% of all detected defects</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-ink">51</div>
              <div className="text-xs text-muted">occurrences</div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {data.defectDistribution.map((d) => {
              const max = Math.max(...data.defectDistribution.map(x => x.value));
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-ink-soft">{d.name}</span>
                    <span className="font-mono text-muted">{d.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                         style={{ width: `${(d.value / max) * 100}%`, background: d.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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