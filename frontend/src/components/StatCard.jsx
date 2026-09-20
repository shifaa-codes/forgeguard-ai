export default function StatCard({ label, value, icon: Icon, trend, accent = 'warm', suffix }) {
  const accents = {
    warm:     'text-warm from-warm/20',
    electric: 'text-electric from-electric/20',
    violet:   'text-violet2 from-violet2/20',
    success:  'text-success from-success/20',
    danger:   'text-danger from-danger/20',
  };
  const a = accents[accent];
  const trendPositive = trend && trend.startsWith('+');

  return (
    <div className="card card-hover animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.split(' ')[1]} to-transparent
                        border border-white/[0.06] flex items-center justify-center`}>
          <Icon className={`w-[18px] h-[18px] ${a.split(' ')[0]}`} strokeWidth={2.2} />
        </div>
        {trend && (
          <span className={`text-[11px] font-mono px-2 py-1 rounded-md border
            ${trendPositive
              ? 'text-success border-success/25 bg-success/10'
              : 'text-danger border-danger/25 bg-danger/10'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="label mb-1">{label}</div>
      <div className="stat-value">
        {value}{suffix && <span className="text-lg text-muted ml-1">{suffix}</span>}
      </div>
    </div>
  );
}