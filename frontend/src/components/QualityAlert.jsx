import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function QualityAlert({ title, message, frequency, action }) {
  return (
    <div className="rounded-2xl p-5 border border-warning/25
                    bg-gradient-to-br from-warning/[0.08] to-transparent
                    shadow-[0_0_40px_-12px_rgba(245,158,11,0.4)]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-warning/15 border border-warning/30
                        flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-warning" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-warning mb-1">{title}</div>
          <p className="text-sm text-ink-soft mb-3">{message}</p>
          {frequency && (
            <div className="text-xs text-ink-soft mb-3">
              Most frequent defect: <span className="text-warm font-semibold">{frequency}</span>
            </div>
          )}
          {action && (
            <div className="flex items-center gap-2 text-xs text-ink font-medium">
              <span className="w-1 h-1 rounded-full bg-warning" />
              {action}
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}