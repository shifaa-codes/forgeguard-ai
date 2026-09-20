import { Link } from 'react-router-dom';
import {
  ArrowRight, Activity, ShieldCheck, Package, Camera,
  Scan, Gauge, BarChart3, CheckCircle2, AlertTriangle, Sparkles
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-base text-ink overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a1013]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-warm to-[#8a6244]
                            flex items-center justify-center shadow-glow-warm">
              <ShieldCheck className="w-5 h-5 text-[#0B1114]" strokeWidth={2.5} />
            </div>
            <div className="font-bold tracking-tight">
              ForgeGuard <span className="text-warm">AI</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#how" className="hover:text-ink transition-colors">How it works</a>
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <Link to="/app/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
          </nav>
          <Link to="/app/live" className="btn-primary">
            Launch Console <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            border border-warm/25 bg-warm/[0.06] text-warm text-[11px]
                            font-bold tracking-[0.16em] uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Manufacturing Inspection
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-bold leading-[1.05] tracking-tight mb-6">
              See Every Defect.
              <br />
              <span className="bg-gradient-to-r from-warm via-[#d4a883] to-electric bg-clip-text text-transparent">
                Before It Becomes a Problem.
              </span>
            </h1>

            <p className="text-lg text-ink-soft leading-relaxed mb-8 max-w-xl">
              ForgeGuard AI transforms industrial cameras into intelligent quality inspectors,
              detecting defects, assessing severity and monitoring production quality in real time.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/app/live" className="btn-primary !px-6 !py-3">
                <Activity className="w-4 h-4" />
                Start Live Inspection
              </Link>
              <Link to="/app/dashboard" className="btn-secondary !px-6 !py-3">
                Explore Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Real-time defect detection
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Severity assessment
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Quality analytics
              </div>
            </div>
          </div>

          {/* Hero visual — mock inspection panel */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute -inset-6 bg-gradient-to-tr from-warm/10 via-transparent to-electric/10 blur-3xl rounded-full" />
            <div className="relative card !p-4 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md bg-danger/90 text-white text-[10px]
                                   font-bold tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
                    LIVE
                  </span>
                  <span className="text-[10px] font-mono text-muted">CAM-01 · 28 FPS</span>
                </div>
                <span className="text-[10px] font-mono text-muted">P-1042</span>
              </div>

              {/* Camera view */}
              <div className="relative aspect-video rounded-xl overflow-hidden
                              bg-gradient-to-br from-[#16323A] via-[#0f1e24] to-[#0B1114]
                              border border-white/[0.08]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[52%] h-[64%] rounded-2xl bg-gradient-to-br from-[#3D4D55] to-[#1a252b]
                                  border border-white/[0.06] shadow-2xl" />
                </div>
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                {/* BBox */}
                <div className="absolute animate-bbox-in"
                     style={{ left: '32%', top: '28%', width: '34%', height: '30%' }}>
                  {['top-0 left-0 border-t-2 border-l-2',
                    'top-0 right-0 border-t-2 border-r-2',
                    'bottom-0 left-0 border-b-2 border-l-2',
                    'bottom-0 right-0 border-b-2 border-r-2'].map((c, i) => (
                    <span key={i} className={`absolute w-4 h-4 ${c} border-warm`}
                          style={{ filter: 'drop-shadow(0 0 6px #B58863)' }} />
                  ))}
                  <div className="absolute -top-7 left-0 px-2 py-1 rounded-md
                                  bg-warm text-[#0B1114] text-[10px] font-bold tracking-wider
                                  font-mono shadow-glow-warm">
                    SCRATCH <span className="opacity-70">94%</span>
                  </div>
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-warm to-transparent animate-scan" />
                </div>
              </div>

              {/* Detection summary */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="label mb-1">Standard Match</div>
                  <div className="font-mono text-lg font-bold text-ink">88%</div>
                </div>
                <div className="p-3 rounded-xl bg-danger/[0.08] border border-danger/25">
                  <div className="label mb-1">Decision</div>
                  <div className="text-lg font-bold text-danger flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> REJECT
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="label mb-1">Severity</div>
                  <div className="text-lg font-bold text-warning">HIGH</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative border-t border-white/[0.06] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="label mb-3">The Pipeline</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How ForgeGuard Works</h2>
            <p className="text-muted mt-3 max-w-2xl mx-auto">
              A closed-loop quality inspection workflow — from reference registration to actionable analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Package,  step: '01', title: 'Register Standard Product', desc: 'Upload the approved reference image of a correct product.' },
              { icon: Camera,   step: '02', title: 'Monitor Live Production',   desc: 'Camera feed streams continuously into the inspection pipeline.' },
              { icon: Scan,     step: '03', title: 'Detect Defects',            desc: 'Vision model identifies scratches, cracks, dents and more.' },
              { icon: Gauge,    step: '04', title: 'Assess Severity',           desc: 'Each defect is graded Low, Medium, High or Critical.' },
              { icon: BarChart3,step: '05', title: 'Generate Quality Insights', desc: 'Trends, alerts and analytics for continuous improvement.' },
            ].map(({ icon: Icon, step, title, desc }, i) => (
              <div key={step} className="card card-hover relative animate-slide-up"
                   style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="absolute top-4 right-4 font-mono text-xs text-muted">{step}</div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warm/20 to-transparent
                                border border-warm/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-warm" />
                </div>
                <div className="font-semibold mb-2">{title}</div>
                <div className="text-sm text-muted leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>© 2025 ForgeGuard AI · Industrial Quality Intelligence</div>
          <div className="font-mono">Pipeline v1.2 · YOLOv8 · FastAPI-ready</div>
        </div>
      </footer>
    </div>
  );
}