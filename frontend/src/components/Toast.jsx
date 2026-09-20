import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts }) {
  const icons = {
    success: CheckCircle2,
    error:   AlertTriangle,
    warning: AlertTriangle,
    info:    Info,
  };
  const tones = {
    success: 'border-success/30 text-success',
    error:   'border-danger/30 text-danger',
    warning: 'border-warning/30 text-warning',
    info:    'border-electric/30 text-electric',
  };
  return (
    <div className="fixed bottom-5 right-5 z-[200] space-y-2 max-w-sm">
      {toasts.map((t) => {
        const Icon = icons[t.type] || Info;
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl
                        bg-[#101A1F]/95 backdrop-blur-xl border animate-slide-up
                        shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${tones[t.type] || tones.info}`}
          >
            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="text-sm text-ink flex-1">{t.msg}</div>
          </div>
        );
      })}
    </div>
  );
}