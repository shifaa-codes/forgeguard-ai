import { Search, Bell, Menu, Wifi, Command } from 'lucide-react';

export default function Navbar({ title, subtitle, onMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06]
                       bg-[#0a1013]/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        <button className="md:hidden btn-ghost !p-2" onClick={onMenu}>
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-base md:text-lg font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted truncate">{subtitle}</p>}
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl
                        bg-white/[0.04] border border-white/[0.06] w-72
                        focus-within:border-warm/40 transition-colors">
          <Search className="w-4 h-4 text-muted" />
          <input
            placeholder="Search inspections, products…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted"
          />
          <span className="kbd flex items-center gap-0.5">
            <Command className="w-3 h-3" />K
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl
                        bg-white/[0.03] border border-white/[0.06]">
          <Wifi className="w-3.5 h-3.5 text-success" />
          <span className="text-xs text-ink-soft font-medium">Online</span>
        </div>

        <button className="relative btn-ghost !p-2.5">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warm ring-2 ring-[#0a1013]" />
        </button>
      </div>
    </header>
  );
}