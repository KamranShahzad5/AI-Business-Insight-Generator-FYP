import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { Bar as ChartBar } from 'react-chartjs-2';
import { Banknote, TrendingUp, Clock, Target } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend);

function fmt(n) {
  if (n >= 1000000) return `PKR ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `PKR ${(n / 1000).toFixed(0)}k`;
  return `PKR ${n}`;
}

export default function CostsTab({ plan }) {
  const costs = plan.costEstimates;
  if (!costs) return <div className="text-slate-500 text-sm">No cost data available.</div>;

  const startupTotal = Object.values(costs.startup).reduce((a, b) => a + b, 0);
  const monthlyTotal = Object.values(costs.monthly).reduce((a, b) => a + b, 0);

  const startupItems = [
    { label: 'Development', value: costs.startup.development, color: 'bg-brand-500' },
    { label: 'Marketing', value: costs.startup.marketing, color: 'bg-accent-500' },
    { label: 'Design', value: costs.startup.design, color: 'bg-amber-500' },
    { label: 'Infrastructure', value: costs.startup.infrastructure, color: 'bg-emerald-500' },
    { label: 'Legal', value: costs.startup.legal, color: 'bg-rose-500' },
    { label: 'Misc', value: costs.startup.miscellaneous, color: 'bg-cyan-500' },
  ];

  const revenueChartData = {
    labels: ['Year 1', 'Year 2', 'Year 3'],
    datasets: [
      {
        label: 'Revenue',
        data: [costs.year1Revenue, costs.year2Revenue, costs.year3Revenue],
        backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(167,139,250,0.7)', 'rgba(217,70,239,0.7)'],
        borderColor: ['rgb(99,102,241)', 'rgb(167,139,250)', 'rgb(217,70,239)'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        callbacks: {
          label: ctx => ` ${fmt(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', callback: v => fmt(v) },
      },
    },
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Banknote, label: 'Total Startup Cost', value: fmt(startupTotal), color: 'text-brand-400', bg: 'from-brand-600/20 to-brand-800/10' },
          { icon: TrendingUp, label: 'Monthly Burn Rate', value: fmt(monthlyTotal), color: 'text-amber-400', bg: 'from-amber-600/20 to-amber-800/10' },
          { icon: Clock, label: 'Time to Revenue', value: costs.timeToRevenue, color: 'text-emerald-400', bg: 'from-emerald-600/20 to-emerald-800/10' },
          { icon: Target, label: 'Break-even Month', value: `Month ${costs.breakEvenMonth}`, color: 'text-accent-400', bg: 'from-accent-600/20 to-accent-800/10' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`card bg-gradient-to-br ${kpi.bg}`}
            >
              <Icon size={18} className={`${kpi.color} mb-2`} />
              <p className="text-[11px] text-slate-500 mb-1">{kpi.label}</p>
              <p className="text-lg font-display font-bold text-slate-100">{kpi.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Startup cost breakdown */}
        <div className="card">
          <h3 className="section-heading mb-4">Startup Cost Breakdown</h3>
          <div className="space-y-3">
            {startupItems.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-slate-400 font-semibold">{fmt(item.value)}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / startupTotal) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-white/5 flex justify-between text-sm">
              <span className="font-semibold text-slate-300">Total</span>
              <span className="font-bold text-brand-300">{fmt(startupTotal)}</span>
            </div>
          </div>
        </div>

        {/* Monthly costs */}
        <div className="card">
          <h3 className="section-heading mb-4">Monthly Operating Costs</h3>
          <div className="space-y-3">
            {[
              { label: 'Team Salaries', value: costs.monthly.salaries },
              { label: 'Marketing Spend', value: costs.monthly.marketing },
              { label: 'Hosting & Cloud', value: costs.monthly.hosting },
              { label: 'Tools & Software', value: costs.monthly.tools },
              { label: 'Customer Support', value: costs.monthly.support },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-slate-400">{item.label}</span>
                <span className="text-xs font-semibold text-slate-200">{fmt(item.value)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-1">
              <span className="font-semibold text-slate-300">Monthly Total</span>
              <span className="font-bold text-amber-300">{fmt(monthlyTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Projection Chart */}
      <div className="card">
        <h3 className="section-heading mb-1">3-Year Revenue Projection</h3>
        <p className="section-sub mb-5">AI-estimated revenue based on your industry and budget</p>
        <div style={{ height: 220 }}>
          <ChartBar data={revenueChartData} options={chartOptions} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
          {[
            { label: 'Year 1', value: costs.year1Revenue },
            { label: 'Year 2', value: costs.year2Revenue },
            { label: 'Year 3', value: costs.year3Revenue },
          ].map((y, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-slate-500 mb-0.5">{y.label}</p>
              <p className="text-lg font-display font-bold text-gradient">{fmt(y.value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
