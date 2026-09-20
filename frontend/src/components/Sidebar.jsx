import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Package, History,
  BarChart3, ShieldCheck, LogOut, CircleDot,Scan
} from 'lucide-react';

const nav = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/inspection', icon: Scan,            label: 'New Inspection' }, 
  { to: '/app/live',      icon: Activity,        label: 'Live Inspection' },
  { to: '/app/standard',  icon: Package,         label: 'Standard Product' },
  { to: '/app/history',   icon: History,         label: 'Inspection History' },
  { to: '/app/analytics', icon: BarChart3,       label: 'Analytics' },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const loc = useLocation();
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-[260px] shrink-0
          border-r border-white/[0.06] bg-[#0a1013]/95 backdrop-blur-xl
          flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-warm to-[#8a6244]
                            flex items-center justify-center shadow-glow-warm">
              <ShieldCheck className="w-5 h-5 text-[#0B1114]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-[15px] tracking-tight">ForgeGuard <span className="text-warm">AI</span></div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Quality Vision</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="label px-3 pb-2">Operations</div>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                 transition-all duration-200 relative
                 ${isActive
                   ? 'bg-white/[0.06] text-ink border border-white/[0.08]'
                   : 'text-muted hover:text-ink hover:bg-white/[0.04] border border-transparent'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-warm rounded-r-full shadow-glow-warm" />
                  )}
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-warm' : ''}`} strokeWidth={2} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* System Status */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="label mb-1.5">System Status</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-ink-soft font-medium">All Systems Operational</span>
          </div>
        </div>

        
      </aside>
    </>
  );
}