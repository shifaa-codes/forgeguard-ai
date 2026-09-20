export default function SeverityIndicator({ severity }) {
  if (!severity || severity === '—')
    return <span className="text-xs text-muted">—</span>;

  const map = {
    Low:      { color: '#22C55E', bars: 1 },
    Medium:   { color: '#F59E0B', bars: 2 },
    High:     { color: '#EF4444', bars: 3 },
    Critical: { color: '#DC2626', bars: 4 },
  };
  const s = map[severity] || map.Low;

  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1 rounded-full transition-all"
            style={{
              height: `${6 + i * 2}px`,
              background: i <= s.bars ? s.color : 'rgba(255,255,255,0.08)',
              boxShadow: i <= s.bars ? `0 0 8px ${s.color}66` : 'none',
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color: s.color }}>{severity}</span>
    </div>
  );
}