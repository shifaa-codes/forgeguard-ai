export default function ChartCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-muted mt-0.5">{subtitle}</div>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}