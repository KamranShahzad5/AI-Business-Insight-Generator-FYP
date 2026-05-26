import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import clsx from 'clsx';

const severityConfig = {
  High: { badge: 'badge-high', bar: 'bg-red-500', dot: 'bg-red-400', label: 'High' },
  Medium: { badge: 'badge-medium', bar: 'bg-amber-500', dot: 'bg-amber-400', label: 'Medium' },
  Low: { badge: 'badge-low', bar: 'bg-emerald-500', dot: 'bg-emerald-400', label: 'Low' },
};

const likelihoodPct = { High: 80, Medium: 50, Low: 25 };

export default function RisksTab({ plan }) {
  const risks = plan.risks || [];
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? risks : risks.filter(r => r.severity === filter);
  const highCount = risks.filter(r => r.severity === 'High').length;
  const medCount = risks.filter(r => r.severity === 'Medium').length;

  return (
    <div className="space-y-5 pb-6">
      {/* Risk summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Risks', value: risks.length, color: 'text-slate-300' },
          { label: 'High Severity', value: highCount, color: 'text-red-400' },
          { label: 'Medium Severity', value: medCount, color: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card text-center"
          >
            <p className={`text-3xl font-display font-bold ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['All', 'High', 'Medium', 'Low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              filter === f
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10 hover:text-slate-300'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Risk cards */}
      <div className="space-y-3">
        {filtered.map((risk, i) => {
          const sev = severityConfig[risk.severity] || severityConfig.Medium;
          const lhPct = likelihoodPct[risk.likelihood] || 50;
          const isOpen = expanded === risk.id;

          return (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card cursor-pointer"
              onClick={() => setExpanded(isOpen ? null : risk.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full ${sev.dot} flex-shrink-0 mt-2`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-100">{risk.name}</h4>
                        <span className={`badge ${sev.badge}`}>{sev.label}</span>
                        {risk.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/5">
                            {risk.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{risk.desc}</p>
                    </div>
                    {isOpen ? <ChevronUp size={15} className="text-slate-500 flex-shrink-0 mt-1" /> : <ChevronDown size={15} className="text-slate-500 flex-shrink-0 mt-1" />}
                  </div>

                  {/* Likelihood bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                      <span>Likelihood</span>
                      <span>{risk.likelihood}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lhPct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.06 }}
                        className={`h-full rounded-full ${sev.bar} opacity-60`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded mitigation */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield size={13} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-400 mb-1">Mitigation Strategy</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{risk.mitigation}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
