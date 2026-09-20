import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

export default function DefectBadge({ defect }) {
  if (!defect || defect === 'None')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-success font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" /> No Defect
      </span>
    );

  if (defect === 'Unknown')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-warning font-medium">
        <HelpCircle className="w-3.5 h-3.5" /> Unknown
      </span>
    );

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-warm font-medium">
      <AlertTriangle className="w-3.5 h-3.5" /> {defect}
    </span>
  );
}