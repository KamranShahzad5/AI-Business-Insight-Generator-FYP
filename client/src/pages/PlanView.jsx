import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Edit3, Trash2, Check, X, FileText,
  ListChecks, Banknote, Shield, Calendar, BarChart2, Search,
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
  { id: 'plan', label: 'Business Plan', icon: FileText },
  { id: 'tasks', label: 'Tasks', icon: ListChecks },
  { id: 'costs', label: 'Cost Estimates', icon: Banknote },
  { id: 'risks', label: 'Risk Analysis', icon: Shield },
  { id: 'market', label: 'Market Research', icon: Search },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

export default function PlanView() {
  const { id } = useParams();
  const { getPlan, updatePlan, deletePlan } = useApp();
  const navigate = useNavigate();
  const plan = getPlan(id);
  const [activeTab, setActiveTab] = useState('plan');
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(plan?.title || '');

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-display font-bold text-slate-100 mb-2">Plan not found</h2>
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

  return (
    <div className="flex gap-5 h-[calc(100vh-9rem)]">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Back + header */}
        <div className="flex-shrink-0 mb-5">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Dashboard
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false); }}
                    autoFocus
                    className="input-field text-lg font-display font-bold py-2"
                  />
                  <button onClick={handleRename} className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all">
                    <Check size={15} />
                  </button>
                  <button onClick={() => setEditing(false)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-all">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <h1 className="text-xl font-display font-bold text-slate-100 truncate">{plan.title}</h1>
              )}
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar size={11} />
                  {formatDate(plan.createdAt)}
                </div>
                {plan.industry && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium capitalize">
                    {plan.industry}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {tasksDone}/{tasksTotal} tasks completed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {!editing && (
                <button
                  onClick={() => { setEditing(true); setNewTitle(plan.title); }}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  <Edit3 size={13} /> Rename
                </button>
              )}
              <button onClick={handleDelete} className="btn-danger text-xs py-2 px-3">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 flex-shrink-0 mb-5 bg-white/3 p-1 rounded-xl border border-white/5 w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'tab-btn-active' : 'tab-btn'}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
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
              className="h-full"
            >
              {activeTab === 'plan' && <BusinessPlanTab plan={plan} />}
              {activeTab === 'tasks' && <TasksTab plan={plan} updatePlan={updatePlan} />}
              {activeTab === 'costs' && <CostsTab plan={plan} />}
              {activeTab === 'risks' && <RisksTab plan={plan} />}
              {activeTab === 'market' && <MarketResearchTab plan={plan} />}
              {activeTab === 'analytics' && <AnalyticsDashboard plan={plan} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel plan={plan} updatePlan={updatePlan} />
    </div>
  );
}
