import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import {
  Search, Plus, FileText, Trash2, Eye, Calendar, ListChecks,
  AlertTriangle, Sparkles, TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function Dashboard() {
  const { plans, deletePlan, user } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = plans.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.idea.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id, title, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deletePlan(id);
      toast.success('Plan deleted');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-100 mb-2">
            Good {getGreeting()},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0] || 'Founder'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-400">
            You have <span className="text-brand-300 font-semibold">{plans.length} business plan{plans.length !== 1 ? 's' : ''}</span> saved.
          </p>
        </div>
        <button onClick={() => navigate('/new-plan')} className="btn-primary self-start text-xs sm:text-sm md:text-base min-h-[44px] flex items-center gap-2">
          <Plus size={16} /> Generate New Plan
        </button>
      </div>

      {/* Stats bar */}
      {plans.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[
            { icon: FileText, label: 'Total Plans', value: plans.length, color: 'text-brand-400' },
            { icon: ListChecks, label: 'Total Tasks', value: plans.reduce((a, p) => a + (p.tasks?.length || 0), 0), color: 'text-emerald-400' },
            { icon: AlertTriangle, label: 'Total Risks', value: plans.reduce((a, p) => a + (p.risks?.length || 0), 0), color: 'text-amber-400' },
            { icon: TrendingUp, label: 'Avg. Budget', value: `PKR ${Math.round(plans.reduce((a, p) => a + (p.budget || 0), 0) / plans.length).toLocaleString()}`, color: 'text-accent-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card flex flex-col items-center sm:items-start gap-2 p-2.5 sm:p-3 md:p-4"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <stat.icon size={16} className={stat.color} />
              </div>
              <div className="min-w-0 text-center sm:text-left w-full">
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">{stat.label}</p>
                <p className="text-base sm:text-lg md:text-xl font-bold font-display text-slate-100 truncate">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Search */}
      {plans.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your business plans..."
            className="input-field pl-10 text-sm md:text-base w-full min-h-[44px]"
          />
        </div>
      )}

      {/* Plans grid */}
      <AnimatePresence mode="wait">
        {plans.length === 0 ? (
          <EmptyState navigate={navigate} />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 md:py-20"
          >
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-300 font-semibold mb-1">No plans match "{search}"</p>
            <p className="text-slate-500 text-sm">Try a different search term</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
          >
            {filtered.map((plan, i) => {
              const highRisks = plan.risks?.filter(r => r.severity === 'High').length || 0;
              return (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(`/plan/${plan.id}`)}
                  className="card cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-accent-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-600/20 to-accent-600/20 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-brand-300" />
                      </div>
                      {/* Action buttons */}
                      <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/plan/${plan.id}`); }}
                          className="w-9 h-9 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 flex items-center justify-center text-brand-400 transition-all flex-shrink-0 min-h-[44px] min-w-[44px]"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={e => handleDelete(plan.id, plan.title, e)}
                          className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all flex-shrink-0 min-h-[44px] min-w-[44px]"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-display font-semibold text-slate-100 text-sm md:text-base mb-1 line-clamp-2 group-hover:text-brand-200 transition-colors">
                      {plan.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                      {plan.idea}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      <div className="bg-white/3 rounded-lg p-1.5 sm:p-2 text-center">
                        <p className="text-xs sm:text-sm font-bold text-slate-200">{plan.tasks?.length || 0}</p>
                        <p className="text-[10px] text-slate-500">Tasks</p>
                      </div>
                      <div className="bg-white/3 rounded-lg p-1.5 sm:p-2 text-center">
                        <p className={`text-xs sm:text-sm font-bold ${highRisks > 2 ? 'text-red-400' : 'text-amber-400'}`}>{plan.risks?.length || 0}</p>
                        <p className="text-[10px] text-slate-500">Risks</p>
                      </div>
                      <div className="bg-white/3 rounded-lg p-1.5 sm:p-2 text-center">
                        <p className="text-xs sm:text-sm font-bold text-emerald-400">
                          {plan.budget >= 1000000
                            ? `${(plan.budget / 1000000).toFixed(1)}M`
                            : `${Math.round((plan.budget || 100000) / 1000)}k`}
                        </p>
                        <p className="text-[10px] text-slate-500">PKR</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={11} />
                        <span className="text-[11px]">{formatDistanceToNow(plan.createdAt)}</span>
                      </div>
                      {plan.industry && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium capitalize truncate max-w-[80px]">
                          {plan.industry}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 sm:py-20 md:py-28 text-center px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/20 flex items-center justify-center mb-4 sm:mb-6"
      >
        <Sparkles size={32} className="text-brand-400" />
      </motion.div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-slate-100 mb-2">No plans yet</h2>
      <p className="text-sm md:text-base text-slate-400 max-w-sm mb-6 sm:mb-8">
        Generate your first AI-powered business plan in seconds. Just describe your idea and let the AI do the rest.
      </p>
      <button onClick={() => navigate('/new-plan')} className="btn-primary text-sm md:text-base min-h-[44px] flex items-center gap-2">
        <Sparkles size={16} />
        Generate Your First Plan
      </button>
    </motion.div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
