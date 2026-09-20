import { Package, Calendar, CheckCircle2, Hash } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function StandardProductCard({ product, onViewDetails }) {
  if (!product) return null;
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warm/20 to-transparent
                          border border-warm/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-warm" />
          </div>
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-xs text-muted font-mono">{product.id}</div>
          </div>
        </div>
        <StatusBadge tone="success" pulse>{product.status}</StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Calendar className="w-3.5 h-3.5" />
          <span>{product.registeredAt}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span>Reference verified</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-white/[0.08] mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-video object-cover"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="btn-secondary justify-center">Replace Standard</button>
        <button className="btn-primary justify-center" onClick={onViewDetails}>View Details</button>
      </div>
    </div>
  );
}