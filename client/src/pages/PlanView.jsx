import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Edit3, Trash2, Check, X, FileText,
  ListChecks, Banknote, Shield, Calendar, BarChart2,
  Search, MessageSquare, ChevronDown, Bot, Zap,
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import BusinessPlanTab from '../components/plan/BusinessPlanTab';
import TasksTab from '../components/plan/TasksTab';
import CostsTab from '../components/plan/CostsTab';
import RisksTab from '../components/plan/RisksTab';
import AIChatPanel from '../components/plan/AIChatPanel';
import MarketResearchTab from '../components/plan/MarketResearchTab';
import AnalyticsDashboard from '../components/plan/AnalyticsDashboard';

const tabs = [
  { id: 'plan',      label: 'Business Plan',   icon: FileText,  color: 'text-brand-400'   },
  { id: 'tasks',     label: 'Tasks',            icon: ListChecks, color: 'text-accent-400'  },
  { id: 'costs',     label: 'Cost Estimates',   icon: Banknote,  color: 'text-emerald-400' },
  { id: 'risks',     label: 'Risk Analysis',    icon: Shield,    color: 'text-amber-400'   },
  { id: 'market',    label: 'Market Research',  icon: Search,    color: 'text-cyan-400'    },
  { id: 'analytics', label: 'Analytics',        icon: BarChart2, color: 'text-rose-400'    },
];

export default function PlanView() {
  const { id } = useParams();
  const { getPlan, updatePlan, deletePlan } = useApp();
  const navigate = useNavigate();
  const plan = getPlan(id);
  const [activeTab, setActiveTab] = useState('plan');
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(plan?.title || '');
  const [showChat, setShowChat] = useState(false);
  const [tabDropdownOpen, setTabDropdownOpen] = useState(false);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-32 px-4 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-100 mb-2">Plan not found</h2>
        <p className="text-slate-400 text-sm mb-6">This plan may have been deleted or doesn't exist.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
      </div>
    );
  }

  const handleRename = () => {
    if (!newTitle.trim()) return;
    updatePlan(id, { title: newTitle.trim() });
    setEditing(false);
    toast.success('Plan renamed');
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${plan.title}"? This cannot be undone.`)) {
      deletePlan(id);
      toast.success('Plan deleted');
      navigate('/dashboard');
    }
  };

  const tasksDone  = plan.tasks?.filter(t => t.status === 'Completed').length || 0;
  const tasksTotal = plan.tasks?.length || 0;
  const highRisks  = plan.risks?.filter(r => r.severity === 'High').length || 0;
  const progress   = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="relative flex flex-col h-full">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 mb-4 space-y-3 pb-4 border-b border-white/5">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Dashboard
        </button>

        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') setEditing(false);
                  }}
                  autoFocus
                  className="input-field text-lg font-display font-bold py-2 flex-1"
                />
                <button onClick={handleRename} className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all">
                  <Check size={15} />
                </button>
                <button onClick={() => setEditing(false)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-all">
                  <X size={15} />
                </button>
              </div>
            ) : (
              <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100 break-words leading-tight">
                {plan.title}
              </h1>
            )}
          </div>

          {/* Actions */}
          {!editing && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => { setEditing(true); setNewTitle(plan.title); }}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Edit3 size={13} />
                <span className="hidden sm:inline">Rename</span>
              </button>
              <button onClick={handleDelete} className="btn-danger text-xs py-2 px-3 flex items-center gap-1.5">
                <Trash2 size={13} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Meta + quick stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={11} />
            {formatDate(plan.createdAt)}
          </div>
          {plan.industry && (
            <span className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium capitalize">
              {plan.industry}
            </span>
          )}
        </div>

        {/* Quick stat cards — always visible, no scroll needed */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white/3 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] text-slate-500 mb-1">Tasks Done</p>
            <p className="text-base font-bold font-display text-slate-100">{tasksDone}<span className="text-slate-500 font-normal text-xs">/{tasksTotal}</span></p>
            <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="bg-white/3 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] text-slate-500 mb-1">High Risks</p>
            <p className="text-base font-bold font-display text-amber-400">{highRisks}</p>
            <p className="text-[10px] text-slate-600 mt-1">identified</p>
          </div>
          <div className="bg-white/3 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] text-slate-500 mb-1">Progress</p>
            <p className="text-base font-bold font-display text-emerald-400">{progress}%</p>
            <p className="text-[10px] text-slate-600 mt-1">complete</p>
          </div>
        </div>
      </div>

      {/* ── TABS ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 mb-4">

        {/* Mobile: dropdown */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setTabDropdownOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2">
              {currentTab && <currentTab.icon size={15} className={currentTab.color} />}
              <span className="text-sm font-medium text-slate-200">{currentTab?.label}</span>
            </div>
            <ChevronDown size={15} className={`text-slate-500 transition-transform ${tabDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {tabDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full mt-1.5 left-0 right-0 bg-surface-900 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setTabDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-b border-white/5 last:border-0 ${
                        activeTab === tab.id ? 'bg-brand-500/10 text-brand-300' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <Icon size={15} className={activeTab === tab.id ? 'text-brand-400' : tab.color} />
                      {tab.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: icon + label tabs */}
        <div className="hidden sm:grid grid-cols-6 gap-1.5 bg-white/3 p-1.5 rounded-xl border border-white/5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-brand-400' : tab.color} />
                <span className="leading-tight text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB CONTENT ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'plan'      && <BusinessPlanTab plan={plan} />}
            {activeTab === 'tasks'     && <TasksTab plan={plan} updatePlan={updatePlan} />}
            {activeTab === 'costs'     && <CostsTab plan={plan} />}
            {activeTab === 'risks'     && <RisksTab plan={plan} />}
            {activeTab === 'market'    && <MarketResearchTab plan={plan} updatePlan={updatePlan} />}
            {activeTab === 'analytics' && <AnalyticsDashboard plan={plan} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── FLOATING AI CHAT BUTTON ─────────────────────────────────────── */}
      <motion.button
        onClick={() => setShowChat(v => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold text-sm shadow-glow-md"
      >
        <Bot size={18} />
        <span>AI Advisor</span>
        {showChat && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </motion.button>

      {/* ── AI CHAT PANEL (slide-in from right) ────────────────────────── */}
      <AnimatePresence>
        {showChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 320 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 320 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 bg-surface-900 border-l border-white/10 shadow-2xl"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-surface-900/90 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
                    <Zap size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">AI Business Advisor</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-[10px] text-emerald-400">Online</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Chat content */}
              <div className="h-[calc(100%-56px)] overflow-hidden">
                <AIChatPanel plan={plan} updatePlan={updatePlan} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
