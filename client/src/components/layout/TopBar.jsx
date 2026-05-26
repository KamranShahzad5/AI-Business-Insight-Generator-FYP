import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const titles = {
  '/dashboard': 'Dashboard',
  '/new-plan': 'Generate New Plan',
};

export default function TopBar() {
  const { darkMode, setDarkMode, user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const title = titles[location.pathname] ||
    (location.pathname.startsWith('/plan/') ? 'Business Plan' : 'Insightify');

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-surface-900/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-10">
      <div>
        <h1 className="text-base font-semibold font-display text-slate-100">{title}</h1>
        <p className="text-xs text-slate-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/new-plan')}
          className="btn-primary text-xs py-2 px-4"
        >
          <Plus size={14} />
          New Plan
        </button>

        <button
          onClick={() => setDarkMode(v => !v)}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all duration-200"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative">
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all duration-200">
            <Bell size={16} />
          </button>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 ring-2 ring-surface-900" />
        </div>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shadow-glow-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
