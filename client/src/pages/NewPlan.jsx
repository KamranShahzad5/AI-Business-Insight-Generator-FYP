import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { generateFullPlan } from '../utils/aiEngine';
import toast from 'react-hot-toast';
import {
  Sparkles, Lightbulb, ArrowRight, ChevronDown, Brain,
  Loader2, CheckCircle2, Zap, TrendingUp, Shield, ListChecks,
} from 'lucide-react';

const industries = [
  { value: 'tech', label: '💻 Technology / SaaS' },
  { value: 'retail', label: '🛍️ Retail / Consumer Goods' },
  { value: 'food', label: '🍽️ Food & Beverage' },
  { value: 'health', label: '🏥 Healthcare / MedTech' },
  { value: 'education', label: '🎓 Education / EdTech' },
  { value: 'finance', label: '💰 Finance / FinTech' },
  { value: 'realestate', label: '🏠 Real Estate / PropTech' },
  { value: 'ecommerce', label: '🛒 E-Commerce' },
  { value: 'other', label: '✨ Other' },
];

const ideaExamples = [
  "An AI-powered platform that helps small businesses automate their social media marketing...",
  "A subscription box service delivering curated artisan coffee blends from around the world...",
  "A mobile app connecting local farmers directly to urban consumers for fresh produce delivery...",
  "A SaaS tool that uses machine learning to predict and reduce employee churn for HR teams...",
];

const loadingSteps = [
  { icon: Brain,        label: 'Analyzing your business idea...',   color: 'text-brand-400'   },
  { icon: TrendingUp,   label: 'Generating market analysis...',     color: 'text-emerald-400' },
  { icon: ListChecks,   label: 'Building task roadmap...',          color: 'text-accent-400'  },
  { icon: Zap,          label: 'Estimating costs & revenue...',     color: 'text-amber-400'   },
  { icon: Shield,       label: 'Identifying risks & mitigations...', color: 'text-rose-400'   },
  { icon: CheckCircle2, label: 'Finalizing your plan...',           color: 'text-emerald-400' },
];

export default function NewPlan() {
  const { addPlan } = useApp();
  const navigate = useNavigate();
  const [idea, setIdea] = useState('');
  const [industry, setIndustry] = useState('tech');
  const [budget, setBudget] = useState(1000000);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);

  const handleGenerate = async () => {
    if (idea.trim().length < 20) {
      toast.error('Please describe your idea in at least 20 characters');
      return;
    }
    setLoading(true);
    setLoadStep(0);

    const stepInterval = setInterval(() => {
      setLoadStep(s => {
        if (s >= loadingSteps.length - 2) { clearInterval(stepInterval); return s; }
        return s + 1;
      });
    }, 700);

    try {
      const plan = await generateFullPlan(idea.trim(), industry, budget);
      setLoadStep(loadingSteps.length - 1);
      await new Promise(r => setTimeout(r, 600));
      const savedPlan = await addPlan(plan);
      toast.success('Business plan generated! 🚀');
      navigate(`/plan/${savedPlan.id}`);
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-8 px-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-brand-500/30 text-brand-300 text-xs font-semibold mb-3 sm:mb-4">
          <Sparkles size={11} /> AI Business Plan Generator
        </div>
        <h1 className="text-xl sm:text-3xl font-display font-bold text-slate-100 mb-2">
          Describe Your Business Idea
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Tell us about your idea in plain language. The AI will generate a comprehensive business plan, tasks, costs, and risk analysis in seconds.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen loadStep={loadStep} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Main textarea */}
            <div className="card p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Lightbulb size={16} className="text-amber-400" />
                <label className="text-sm font-semibold text-slate-200">
                  Your Business Idea <span className="text-red-400">*</span>
                </label>
              </div>
              <textarea
                value={idea}
                onChange={e => setIdea(e.target.value)}
                placeholder="Describe your business idea in detail. Include what problem you're solving, who your target customers are, and what makes your solution unique..."
                rows={6}
                className="input-field resize-none text-sm leading-relaxed"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3">
                <p className="text-xs text-slate-600">{idea.length} characters · Minimum 20</p>
                <div className="flex flex-wrap gap-2">
                  {ideaExamples.slice(0, 2).map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setIdea(ex)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-all"
                    >
                      Example {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Options row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Industry */}
              <div className="card p-4 sm:p-6">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-3">
                  Industry
                </label>
                <div className="relative">
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="input-field appearance-none pr-9 cursor-pointer text-sm"
                  >
                    {industries.map(ind => (
                      <option key={ind.value} value={ind.value} className="bg-surface-800">
                        {ind.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Budget */}
              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Startup Budget
                  </label>
                  <span className="text-brand-300 font-bold font-display text-sm">
                    PKR {budget.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={10000000}
                  step={100000}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-white/10 accent-brand-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1.5">
                  <span>PKR 100k</span><span>PKR 5M</span><span>PKR 10M</span>
                </div>
              </div>
            </div>

            {/* What you'll get */}
            <div className="card border border-white/5 p-4 sm:p-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 sm:mb-4">
                What the AI will generate for you:
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { icon: '📋', title: 'Business Plan',  desc: '6 detailed sections'    },
                  { icon: '✅', title: 'Task Roadmap',   desc: '8–12 prioritized tasks'  },
                  { icon: '💰', title: 'Cost Estimates', desc: 'Startup + monthly costs' },
                  { icon: '⚠️', title: 'Risk Analysis',  desc: '5–8 risks + mitigation' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 bg-white/3 rounded-xl p-2.5 sm:p-3">
                    <span className="text-lg sm:text-xl flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <motion.button
              onClick={handleGenerate}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={idea.trim().length < 20}
              className="w-full btn-primary justify-center py-3.5 sm:py-4 text-sm shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Sparkles size={17} />
              Generate Full Business Plan with AI
              <ArrowRight size={15} />
            </motion.button>
            <p className="text-center text-xs text-slate-600">
              Takes 5–10 seconds · Powered by Groq AI (Llama 3.1)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingScreen({ loadStep }) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="card border border-brand-500/20 py-10 sm:py-12 text-center px-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-glow-md"
      >
        <Zap size={28} className="text-white" />
      </motion.div>

      <h2 className="text-lg sm:text-xl font-display font-bold text-slate-100 mb-2">
        AI is crafting your business plan...
      </h2>
      <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8">
        Analyzing your idea and generating insights
      </p>

      <div className="space-y-3 max-w-sm mx-auto text-left">
        {loadingSteps.map((step, i) => {
          const Icon = step.icon;
          const isDone = i < loadStep;
          const isActive = i === loadStep;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= loadStep ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isDone ? 'bg-emerald-500/20' : isActive ? 'bg-brand-500/20' : 'bg-white/5'}`}>
                {isDone
                  ? <CheckCircle2 size={16} className="text-emerald-400" />
                  : isActive
                    ? <Loader2 size={16} className={`${step.color} animate-spin`} />
                    : <Icon size={16} className="text-slate-600" />
                }
              </div>
              <span className={`text-xs sm:text-sm ${isDone ? 'text-emerald-400 line-through' : isActive ? 'text-slate-100' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 max-w-xs mx-auto">
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
            animate={{ width: `${((loadStep + 1) / loadingSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Step {loadStep + 1} of {loadingSteps.length}
        </p>
      </div>
    </motion.div>
  );
}

          <motion.div
            animate={{ width: `${Math.round((loadStep / (loadingSteps.length - 1)) * 100)}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          />
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">
          {Math.round((loadStep / (loadingSteps.length - 1)) * 100)}% complete
        </p>
      </div>
    </motion.div>
  );
}
