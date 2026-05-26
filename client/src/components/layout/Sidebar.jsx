import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Sparkles, LogOut, ChevronLeft,
  ChevronRight, Zap, FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/new-plan', icon: Sparkles, label: 'New Plan' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, user, logout, plans } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after clicking a nav item
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* ── Desktop sidebar (always visible, collapsible) ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative hidden lg:flex flex-col h-screen bg-surface-900 border-r border-white/5 overflow-hidden flex-shrink-0 z-30"
      >
        <SidebarContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          plans={plans}
          handleLogout={handleLogout}
          handleNavClick={handleNavClick}
          showToggle={true}
        />
      </motion.aside>

      {/* ── Mobile sidebar (slide in from left) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 lg:hidden flex flex-col h-screen w-64 bg-surface-900 border-r border-white/5 overflow-hidden flex-shrink-0 z-30"
          >
            <SidebarContent
              sidebarOpen={true}
              setSidebarOpen={setSidebarOpen}
              user={user}
              plans={plans}
              handleLogout={handleLogout}
              handleNavClick={handleNavClick}
              showToggle={false}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Shared sidebar content ────────────────────────────────────────────────────
function SidebarContent({ sidebarOpen, setSidebarOpen, user, plans, handleLogout, handleNavClick, showToggle }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <Zap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-display font-bold text-white text-base whitespace-nowrap">
                Insightify
              </span>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5">AI Business Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-brand-300 bg-brand-500/10 border border-brand-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              )
            }
            title={!sidebarOpen ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* Recent Plans */}
        {sidebarOpen && plans.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-2">
              Recent Plans
            </p>
            {plans.slice(0, 5).map(plan => (
              <NavLink
                key={plan.id}
                to={`/plan/${plan.id}`}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  clsx('flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 truncate',
                    isActive
                      ? 'text-brand-300 bg-brand-500/10'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  )
                }
              >
                <FileText size={13} className="flex-shrink-0" />
                <span className="truncate">{plan.title}</span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/5 p-3 space-y-1 flex-shrink-0">
        {sidebarOpen && user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          title={!sidebarOpen ? 'Log out' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Toggle button — desktop only */}
      {showToggle && (
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-brand-600 hover:border-brand-500 transition-all duration-200 z-10"
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      )}
    </>
  );
}

