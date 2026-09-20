export default function StatusBadge({ children, tone = 'neutral', pulse = false }) {
  const tones = {
    success: 'text-success border-success/30 bg-success/10',
    danger:  'text-danger  border-danger/30  bg-danger/10',
    warning: 'text-warning border-warning/30 bg-warning/10',
    info:    'text-electric border-electric/30 bg-electric/10',
    neutral: 'text-ink-soft border-white/[0.1] bg-white/[0.04]',
    warm:    'text-warm border-warm/30 bg-warm/10',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                     border text-[11px] font-semibold uppercase tracking-wider ${tones[tone]}`}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}