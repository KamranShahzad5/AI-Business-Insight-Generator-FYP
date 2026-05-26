import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, Target, AlertTriangle, Search,
  Globe, BarChart2, ArrowUp, ArrowDown, Minus, Loader2,
  CheckCircle2, Building2, ShieldAlert, Lightbulb
} from 'lucide-react';
import { getMarketResearch } from '../../utils/api';
import toast from 'react-hot-toast';

// Helper: color by impact/severity
const severityColor = (s) => {
  if (!s) return 'text-slate-400';
  const v = s.toLowerCase();
  if (v === 'high') return 'text-red-400';
  if (v === 'medium') return 'text-amber-400';
  return 'text-emerald-400';
};

const severityBg = (s) => {
  if (!s) return 'bg-slate-500/10 border-slate-500/20';
  const v = s.toLowerCase();
  if (v === 'high') return 'bg-red-500/10 border-red-500/20';
  if (v === 'medium') return 'bg-amber-500/10 border-amber-500/20';
  return 'bg-emerald-500/10 border-emerald-500/20';
};

const TrendIcon = ({ direction }) => {
  if (direction === 'up') return <ArrowUp size={14} className="text-emerald-400" />;
  if (direction === 'down') return <ArrowDown size={14} className="text-red-400" />;
  return <Minus size={14} className="text-slate-400" />;
};

// SWOT colors
const swotConfig = {
  strengths:    { label: 'Strengths',    color: 'border-emerald-500/30 bg-emerald-500/5', icon: '💪', dot: 'bg-emerald-400' },
  weaknesses:   { label: 'Weaknesses',   color: 'border-red-500/30 bg-red-500/5',         icon: '⚠️', dot: 'bg-red-400' },
  opportunities:{ label: 'Opportunities',color: 'border-brand-500/30 bg-brand-500/5',     icon: '🚀', dot: 'bg-brand-400' },
  threats:      { label: 'Threats',      color: 'border-amber-500/30 bg-amber-500/5',     icon: '🛡️', dot: 'bg-amber-400' },
};

export default function MarketResearchTab({ plan }) {
  const [data, setData] = useState(plan.marketResearch || null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');

  const loadingMessages = [
    '🔍 Searching the web for market data...',
    '📊 Analyzing competitors...',
    '📈 Pulling industry trends...',
    '🎯 Identifying target audience...',
    '✅ Compiling your research report...',
  ];

  const handleFetch = async () => {
    setLoading(true);
    let step = 0;
    setLoadMsg(loadingMessages[0]);

    const interval = setInterval(() => {
      step = Math.min(step + 1, loadingMessages.length - 1);
      setLoadMsg(loadingMessages[step]);
    }, 2500);

    try {
      const result = await getMarketResearch(plan.idea, plan.industry, plan.budget);
      setData(result);
      toast.success('Market research complete! 📊');
    } catch (err) {
      toast.error(err.message || 'Market research failed. Try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Empty state — not yet fetched
  if (!data && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-brand-500/20 border border-emerald-500/20 flex items-center justify-center mb-6"
        >
          <BarChart2 size={32} className="text-emerald-400" />
        </motion.div>
        <h2 className="text-xl font-display font-bold text-slate-100 mb-2">Market Research</h2>
        <p className="text-sm text-slate-400 max-w-sm mb-2">
          Click below to pull <span className="text-emerald-400 font-semibold">real-time market data</span> for your business idea — competitors, trends, market size, and SWOT analysis.
        </p>
        <p className="text-xs text-slate-600 mb-8">Powered by Groq AI · Takes ~5 seconds</p>
        <button onClick={handleFetch} className="btn-primary">
          <Search size={16} /> Run Market Research
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-brand-500 flex items-center justify-center mb-6 shadow-glow-md"
        >
          <BarChart2 size={28} className="text-white" />
        </motion.div>
        <h2 className="text-lg font-display font-bold text-slate-100 mb-2">Researching your market...</h2>
        <motion.p
          key={loadMsg}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-emerald-400 font-medium"
        >
          {loadMsg}
        </motion.p>
      </div>
    );
  }

  // Data loaded — render full report
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 pb-6"
      >
        {/* Header + Re-run button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-100">Market Research Report</h2>
            <p className="text-xs text-slate-500 mt-0.5">AI-powered research with real web data</p>
          </div>
          <button onClick={handleFetch} className="btn-secondary text-xs py-2 px-3">
            <Search size={13} /> Refresh
          </button>
        </div>

        {/* Summary */}
        {data.researchSummary && (
          <div className="card border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-start gap-3">
              <Lightbulb size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-300 leading-relaxed">{data.researchSummary}</p>
            </div>
          </div>
        )}

        {/* Market Size */}
        {data.marketSize && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={16} className="text-brand-400" />
              <h3 className="text-sm font-semibold text-slate-200">Market Size</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Current Market', value: data.marketSize.current, icon: '📊' },
                { label: 'Projected (5yr)', value: data.marketSize.projected, icon: '📈' },
                { label: 'CAGR Growth', value: data.marketSize.cagr, icon: '🚀' },
                { label: 'Data Source', value: data.marketSize.source, icon: '🔗' },
              ].map((item, i) => (
                <div key={i} className="bg-white/3 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-xs font-bold text-slate-100 leading-tight">{item.value}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trends */}
        {data.trends && data.trends.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-200">Industry Trends</h3>
            </div>
            <div className="space-y-3">
              {data.trends.map((trend, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 bg-white/3 rounded-xl p-3"
                >
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendIcon direction={trend.direction} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-200">{trend.title}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${severityBg(trend.impact)} ${severityColor(trend.impact)}`}>
                        {trend.impact} Impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{trend.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Competitors */}
        {data.competitors && data.competitors.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={16} className="text-accent-400" />
              <h3 className="text-sm font-semibold text-slate-200">Competitor Analysis</h3>
            </div>
            <div className="space-y-3">
              {data.competitors.map((comp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white/3 rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-100">{comp.name}</p>
                      {comp.website && (
                        <p className="text-[10px] text-slate-600">{comp.website}</p>
                      )}
                    </div>
                    {comp.marketShare && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 font-semibold whitespace-nowrap">
                        {comp.marketShare} share
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{comp.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2">
                      <p className="text-[10px] text-emerald-400 font-semibold mb-0.5">✅ Strength</p>
                      <p className="text-[11px] text-slate-300">{comp.strengths}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2">
                      <p className="text-[10px] text-red-400 font-semibold mb-0.5">❌ Weakness</p>
                      <p className="text-[11px] text-slate-300">{comp.weakness}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Target Audience */}
        {data.targetAudience && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-rose-400" />
              <h3 className="text-sm font-semibold text-slate-200">Target Audience</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {[
                  { label: 'Primary Segment', value: data.targetAudience.primarySegment },
                  { label: 'Age Range', value: data.targetAudience.ageRange },
                  { label: 'Location', value: data.targetAudience.location },
                  { label: 'Buying Behavior', value: data.targetAudience.buyingBehavior },
                ].map((item, i) => (
                  <div key={i} className="bg-white/3 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-sm text-slate-200">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/3 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 mb-3">Pain Points</p>
                <ul className="space-y-2">
                  {(data.targetAudience.painPoints || []).map((pain, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-rose-400 mt-0.5 flex-shrink-0">•</span>
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SWOT Analysis */}
        {data.swot && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-brand-400" />
              <h3 className="text-sm font-semibold text-slate-200">SWOT Analysis</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(swotConfig).map(([key, cfg]) => (
                <div key={key} className={`rounded-xl p-4 border ${cfg.color}`}>
                  <p className="text-xs font-bold text-slate-300 mb-3">{cfg.icon} {cfg.label}</p>
                  <ul className="space-y-1.5">
                    {(data.swot[key] || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Entry Barriers */}
        {data.entryBarriers && data.entryBarriers.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert size={16} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-200">Entry Barriers</h3>
            </div>
            <div className="space-y-3">
              {data.entryBarriers.map((b, i) => (
                <div key={i} className="bg-white/3 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-200">{b.barrier}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${severityBg(b.severity)} ${severityColor(b.severity)}`}>
                      {b.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    <span className="text-emerald-400 font-medium">Strategy: </span>
                    {b.howToOvercome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regulatory Notes */}
        {data.regulatoryNotes && (
          <div className="card border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-400 mb-1">Regulatory & Compliance Notes</p>
                <p className="text-sm text-slate-300 leading-relaxed">{data.regulatoryNotes}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
