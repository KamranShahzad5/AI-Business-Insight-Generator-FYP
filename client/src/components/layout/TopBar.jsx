import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus, Bell, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const titles = {
  '/dashboard': 'Dashboard',
  '/new-plan': 'Generate New Plan',
};

export default function TopBar() {
  const { darkMode, setDarkMode, user, sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const title = titles[location.pathname] ||
    (location.pathname.startsWith('/plan/') ? 'Business Plan' : 'Insightify');

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-16 flex items-center justify-between px-3 sm:px-6 border-b border-white/5 bg-surface-900/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-10">

      {/* Left — Hamburger (mobile) + Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="lg:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all duration-200 flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-semibold font-display text-slate-100 leading-tight">
            {title}
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* New Plan button — hide text on very small screens */}
        <button
          onClick={() => navigate('/new-plan')}
          className="btn-primary text-xs py-2 px-2.5 sm:px-4 flex items-center gap-1"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">New Plan</span>
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(v => !v)}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all duration-200"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications — hide on very small screens */}
        <div className="relative hidden sm:block">
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all duration-200">
            <Bell size={16} />
          </button>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 ring-2 ring-surface-900" />
        </div>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shadow-glow-sm flex-shrink-0">
          {initials}
        </div>
      </div>
    </header>
  );
}

    </header>
  );
}
