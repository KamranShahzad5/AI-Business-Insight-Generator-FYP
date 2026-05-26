import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, User, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import clsx from 'clsx';

const priorityConfig = {
  High: { badge: 'badge-high', icon: ArrowUp, label: 'High' },
  Medium: { badge: 'badge-medium', icon: ArrowRight, label: 'Medium' },
  Low: { badge: 'badge-low', icon: ArrowDown, label: 'Low' },
};

const statusConfig = {
  'Todo': { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', label: 'To Do' },
  'In Progress': { color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20', label: 'In Progress' },
  'Completed': { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Done' },
};

export default function TasksTab({ plan, updatePlan }) {
  const tasks = plan.tasks || [];
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'High', 'Medium', 'Low'];

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.priority === filter);

  const toggleStatus = (taskId) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const cycle = { 'Todo': 'In Progress', 'In Progress': 'Completed', 'Completed': 'Todo' };
      return { ...t, status: cycle[t.status] };
    });
    updatePlan(plan.id, { tasks: updated });
  };

  const done = tasks.filter(t => t.status === 'Completed').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="space-y-5 pb-6">
      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-200">Overall Progress</p>
            <p className="text-xs text-slate-500">{done} of {tasks.length} tasks completed</p>
          </div>
          <span className="text-2xl font-display font-bold text-gradient">{pct}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          />
        </div>
      </div>

      {/* Priority filter */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
              filter === f
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10 hover:text-slate-300'
            )}
          >
            {f}
            {f === 'All' ? ` (${tasks.length})` : ` (${tasks.filter(t => t.priority === f).length})`}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.map((task, i) => {
          const priority = priorityConfig[task.priority] || priorityConfig.Medium;
          const status = statusConfig[task.status] || statusConfig['Todo'];
          const PriorityIcon = priority.icon;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={clsx(
                'card flex items-start gap-4 cursor-pointer group transition-all duration-200',
                task.status === 'Completed' ? 'opacity-60' : ''
              )}
              onClick={() => toggleStatus(task.id)}
            >
              <div className="flex-shrink-0 pt-0.5">
                {task.status === 'Completed' ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : task.status === 'In Progress' ? (
                  <div className="w-5 h-5 rounded-full border-2 border-brand-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-400" />
                  </div>
                ) : (
                  <Circle size={20} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h4 className={clsx(
                    'text-sm font-semibold leading-tight',
                    task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-100'
                  )}>
                    {task.name}
                  </h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${priority.badge}`}>
                      <PriorityIcon size={10} />
                      {priority.label}
                    </span>
                    <span className={clsx('badge border', status.bg, status.color)}>
                      {status.label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{task.desc}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} /> {task.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={11} /> {task.owner}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-slate-600 text-center">Click a task to cycle through statuses: To Do → In Progress → Completed</p>
    </div>
  );
}
