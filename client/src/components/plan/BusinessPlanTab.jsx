import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Package, Megaphone, Settings, BarChart3 } from 'lucide-react';

const sections = [
  { key: 'executiveSummary', label: 'Executive Summary', icon: BookOpen, color: 'from-brand-500 to-brand-700' },
  { key: 'marketAnalysis', label: 'Market Analysis', icon: TrendingUp, color: 'from-emerald-500 to-teal-700' },
  { key: 'productDescription', label: 'Product Description', icon: Package, color: 'from-accent-500 to-accent-700' },
  { key: 'marketingStrategy', label: 'Marketing Strategy', icon: Megaphone, color: 'from-amber-500 to-orange-600' },
  { key: 'operationsPlan', label: 'Operations Plan', icon: Settings, color: 'from-rose-500 to-pink-700' },
  { key: 'financialOverview', label: 'Financial Overview', icon: BarChart3, color: 'from-cyan-500 to-blue-700' },
];

export default function BusinessPlanTab({ plan }) {
  const bp = plan.businessPlan;
  if (!bp) return <div className="text-slate-500 text-sm">No business plan data.</div>;

  return (
    <div className="space-y-5 pb-6">
      {sections.map((sec, i) => {
        const Icon = sec.icon;
        const content = bp[sec.key];
        return (
          <motion.div
            key={sec.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.color} flex items-center justify-center flex-shrink-0 shadow-glow-sm`}>
                <Icon size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-slate-100 mb-2">{sec.label}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{content}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
