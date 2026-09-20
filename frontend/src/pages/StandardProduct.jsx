import { useEffect, useRef, useState } from 'react';
import { Upload, Info, ImageIcon, CheckCircle2, X } from 'lucide-react';
import StandardProductCard from '../components/StandardProductCard';
import { getStandardProduct, uploadStandardProduct } from '../services/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/Toast';

export default function StandardProduct() {
  const [product, setProduct] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const { toasts, push } = useToast();

  useEffect(() => { getStandardProduct().then(setProduct); }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadStandardProduct(file, { name: 'New Standard', id: 'STD-' + Date.now() });
      push('Standard product registered successfully', 'success');
      const updated = await getStandardProduct();
      setProduct(updated);
    } catch {
      push('Failed to register standard product', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3 space-y-5">
        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`card cursor-pointer transition-all duration-300 text-center py-14
            ${dragging ? 'border-warm/50 bg-warm/[0.04] shadow-glow-warm' : 'hover:border-white/[0.15]'}`}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
                 onChange={(e) => handleFile(e.target.files[0])} />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-warm/20 to-transparent
                          border border-warm/25 flex items-center justify-center mb-5">
            {uploading
              ? <div className="w-6 h-6 rounded-full border-2 border-warm border-t-transparent animate-spin" />
              : <Upload className="w-7 h-7 text-warm" />}
          </div>
          <div className="font-semibold text-lg mb-1">
            {uploading ? 'Processing image…' : 'Upload Ideal Product'}
          </div>
          <div className="text-sm text-muted mb-4">
            Drag and drop a reference image, or click to browse
          </div>
          <div className="flex items-center justify-center gap-3 text-xs text-muted">
            <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">PNG</span>
            <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">JPG</span>
            <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">Max 10 MB</span>
          </div>
        </div>

        {/* Current standard */}
        {product && <StandardProductCard product={product} onViewDetails={() => push('Opening details…', 'info')} />}
      </div>

      {/* Info side */}
      <div className="lg:col-span-2 space-y-5">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-electric/10 border border-electric/25
                            flex items-center justify-center">
              <Info className="w-4 h-4 text-electric" />
            </div>
            <div className="font-semibold">Why Standard Product?</div>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            The registered standard represents the expected appearance and structure of a correct product.
            Incoming products can be evaluated against this reference during inspection.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-warning/[0.06] border border-warning/20">
            <div className="text-xs text-warning font-semibold mb-1">Important</div>
            <p className="text-xs text-ink-soft leading-relaxed">
              This is a <strong className="text-ink">reference standard</strong> — not a training dataset.
              The vision model is pre-trained; the standard is used at inference time for comparison.
            </p>
          </div>
        </div>

        {product && (
          <div className="card">
            <div className="font-semibold mb-4">Specifications</div>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-muted capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono text-xs text-ink-soft">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="font-semibold mb-3">Detection Capabilities</div>
          <div className="space-y-2">
            {['Scratch', 'Crack', 'Dent', 'Surface Defect', 'Deformation'].map((d) => (
              <div key={d} className="flex items-center gap-2 text-sm text-ink-soft">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}