import { Camera, Radio, Cpu } from 'lucide-react';
import DetectionOverlay from './DetectionOverlay';

export default function CameraPanel({ state, fps, processing, mock = true }) {
  const isDefect = state?.type === 'DEFECT';
  const isReview = state?.type === 'REVIEW';

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden
                    border border-white/[0.08] bg-[#0a0f12] shadow-2xl">
      {/* Mock "camera" background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#16323A] via-[#0f1e24] to-[#0B1114]" />
        {/* Faux product silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[46%] h-[62%] rounded-2xl
                          bg-gradient-to-br from-[#3D4D55] via-[#2a3941] to-[#1a252b]
                          border border-white/[0.06]
                          shadow-[inset_0_2px_24px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.6)]" />
        </div>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Detection bbox */}
      {state?.bbox && <DetectionOverlay bbox={state.bbox} />}

      {/* Top-left LIVE badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                         bg-danger/90 text-white text-[10px] font-bold tracking-wider
                         shadow-glow-danger">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
          LIVE
        </span>
        {mock && (
          <span className="px-2 py-1 rounded-md bg-warning/15 border border-warning/30
                           text-warning text-[10px] font-bold tracking-wider">
            DEMO MODE
          </span>
        )}
      </div>

      {/* Top-right meta */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur border border-white/[0.08]
                         text-[10px] font-mono text-ink-soft flex items-center gap-1">
          <Camera className="w-3 h-3" /> CAM-01
        </span>
        <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur border border-white/[0.08]
                         text-[10px] font-mono text-ink-soft flex items-center gap-1">
          <Radio className="w-3 h-3 text-success" /> {fps} FPS
        </span>
      </div>

      {/* Bottom status strip */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between
                      px-3 py-2 rounded-xl bg-black/55 backdrop-blur-md border border-white/[0.08]">
        <div className="flex items-center gap-2 text-[11px] font-mono text-ink-soft">
          <Cpu className="w-3.5 h-3.5 text-electric" />
          <span>YOLOv8 · 640×640 · inference 34ms</span>
        </div>
        <div className="text-[11px] font-mono text-ink-soft">
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>

      {/* Processing overlay */}
      {processing && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]
                        flex items-center justify-center animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl
                          bg-black/60 border border-white/[0.1]">
            <div className="w-4 h-4 rounded-full border-2 border-warm border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-ink-soft">Analyzing frame…</span>
          </div>
        </div>
      )}

      {/* Flash on defect */}
      {isDefect && !processing && (
        <div className="absolute inset-0 pointer-events-none animate-fade-in"
             style={{ boxShadow: 'inset 0 0 120px rgba(239,68,68,0.35)' }} />
      )}
      {isReview && !processing && (
        <div className="absolute inset-0 pointer-events-none animate-fade-in"
             style={{ boxShadow: 'inset 0 0 120px rgba(245,158,11,0.3)' }} />
      )}
    </div>
  );
}