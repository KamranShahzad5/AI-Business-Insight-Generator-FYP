import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Edit3, Trash2, Check, X, FileText,
  ListChecks, Banknote, Shield, Calendar, BarChart2, Search, MessageSquare, ChevronDown,
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
  { id: 'plan',      label: 'Business Plan',   icon: FileText   },
  { id: 'tasks',     label: 'Tasks',           icon: ListChecks },
  { id: 'costs',     label: 'Cost Estimates',  icon: Banknote   },
  { id: 'risks',     label: 'Risk Analysis',   icon: Shield     },
  { id: 'market',    label: 'Market Research', icon: Search     },
  { id: 'analytics', label: 'Analytics',       icon: BarChart2  },
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

  const tasksDone = plan.tasks?.filter(t => t.status === 'Completed').length || 0;
  const tasksTotal = plan.tasks?.length || 0;
  const currentTabLabel = tabs.find(t => t.id === activeTab)?.label || 'Select Tab';

  return (
    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5 h-full lg:h-[calc(100vh-9rem)]">

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Back + header */}
        <div className="flex-shrink-0 mb-3 sm:mb-4 space-y-3 sm:space-y-4 pb-3 sm:pb-4 border-b border-white/5">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Dashboard
          </button>

          {/* Title and Meta Section */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start justify-between gap-2 min-h-[44px]">
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false); }}
                      autoFocus
                      className="input-field text-base font-display font-bold py-2 flex-1 min-w-0"
                    />
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={handleRename} className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all flex-shrink-0">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditing(false)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-all flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100 break-words">{plan.title}</h1>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* AI Chat toggle — mobile only */}
                <button
                  onClick={() => setShowChat(v => !v)}
                  className="lg:hidden w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 hover:bg-brand-500/20 transition-all flex-shrink-0"
                  title="AI Chat"
                >
                  <MessageSquare size={16} />
                </button>
                {!editing && (
                  <button
                    onClick={() => { setEditing(true); setNewTitle(plan.title); }}
                    className="btn-secondary text-xs py-2.5 px-2 sm:px-3 min-h-[44px] flex items-center"
                  >
                    <Edit3 size={14} />
                    <span className="hidden sm:inline ml-1">Rename</span>
                  </button>
                )}
                <button onClick={handleDelete} className="btn-danger text-xs py-2.5 px-2 sm:px-3 min-h-[44px] flex items-center">
                  <Trash2 size={14} />
                  <span className="hidden sm:inline ml-1">Delete</span>
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar size={12} />
                {formatDate(plan.createdAt)}
              </div>
              {plan.industry && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium capitalize">
                  {plan.industry}
                </span>
              )}
              <span className="text-xs text-slate-500">
                {tasksDone}/{tasksTotal} tasks
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation — Desktop: horizontal, Mobile: dropdown */}
        <div className="flex-shrink-0 mb-3 sm:mb-4">
          {/* Mobile: Dropdown */}
          <div className="sm:hidden">
            <div className="relative">
              <button
                onClick={() => setTabDropdownOpen(!tabDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all min-h-[44px]"
              >
                <span className="text-sm font-medium text-slate-300">{currentTabLabel}</span>
                <ChevronDown size={16} className={`transition-transform ${tabDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {tabDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-2 left-0 right-0 bg-surface-900 border border-white/10 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setTabDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all text-left border-b border-white/5 last:border-b-0 min-h-[44px] ${
                          activeTab === tab.id
                            ? 'bg-brand-500/15 text-brand-300'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>

          {/* Desktop/Tablet: Horizontal scroll */}
          <div className="hidden sm:flex overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 bg-white/3 p-2 rounded-xl border border-white/5 w-max">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                      activeTab === tab.id
                        ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full px-1"
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
      </div>

      {/* AI Chat Panel — desktop: always visible, mobile: toggle */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:block lg:flex-shrink-0 lg:w-80 fixed lg:static inset-0 lg:inset-auto z-30 bg-surface-950 lg:bg-transparent"
          >
            <AIChatPanel plan={plan} updatePlan={updatePlan} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Chat Panel */}
      <div className="hidden lg:block lg:flex-shrink-0 lg:w-80">
        <AIChatPanel plan={plan} updatePlan={updatePlan} />
      </div>
    </div>
  );
}
