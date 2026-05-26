import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  TrendingUp, CheckCircle2, AlertTriangle, Banknote,
  Target, ListChecks, BarChart2, Activity
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  ArcElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

// Chart.js default dark theme options
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 16 },
    },
    tooltip: {
      backgroundColor: '#1e293b',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
    },
  },
  scales: {
    x: {
      ticks: { color: '#64748b', font: { size: 10 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
    },
    y: {
      ticks: { color: '#64748b', font: { size: 10 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 12 },
    },
    tooltip: {
      backgroundColor: '#1e293b',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
    },
  },
  cutout: '65%',
};

function fmt(n) {
  if (n >= 1000000) return `PKR ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `PKR ${(n / 1000).toFixed(0)}k`;
  return `PKR ${n}`;
}

export default function AnalyticsDashboard({ plan }) {
  const costs = plan.costEstimates;
  const tasks = plan.tasks || [];
  const risks = plan.risks || [];

  // ── KPI Cards ───────────────────────────────────────────────────────────
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const highRisks = risks.filter(r => r.severity === 'High').length;
  const startupTotal = costs
    ? Object.values(costs.startup || {}).reduce((a, b) => a + b, 0)
    : 0;
  const monthlyTotal = costs
    ? Object.values(costs.monthly || {}).reduce((a, b) => a + b, 0)
    : 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const kpis = [
    { label: 'Task Completion', value: `${completionRate}%`, sub: `${completedTasks}/${totalTasks} done`, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'High-Risk Items', value: highRisks, sub: `of ${risks.length} total risks`, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Startup Cost', value: fmt(startupTotal), sub: 'one-time investment', icon: Banknote, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Monthly Burn', value: fmt(monthlyTotal), sub: 'recurring costs', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  // ── Startup Costs Bar Chart ─────────────────────────────────────────────
  const startupLabels = costs
    ? Object.keys(costs.startup || {}).map(k => k.charAt(0).toUpperCase() + k.slice(1))
    : [];
  const startupValues = costs ? Object.values(costs.startup || {}) : [];

  const startupBarData = {
    labels: startupLabels,
    datasets: [{
      label: 'Startup Cost (PKR)',
      data: startupValues,
      backgroundColor: [
        'rgba(99,102,241,0.7)', 'rgba(168,85,247,0.7)', 'rgba(236,72,153,0.7)',
        'rgba(59,130,246,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)',
      ],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  // ── Monthly Costs Doughnut ──────────────────────────────────────────────
  const monthlyLabels = costs
    ? Object.keys(costs.monthly || {}).map(k => k.charAt(0).toUpperCase() + k.slice(1))
    : [];
  const monthlyValues = costs ? Object.values(costs.monthly || {}) : [];

  const monthlyDoughnutData = {
    labels: monthlyLabels,
    datasets: [{
      data: monthlyValues,
      backgroundColor: [
        'rgba(99,102,241,0.8)', 'rgba(168,85,247,0.8)', 'rgba(236,72,153,0.8)',
        'rgba(59,130,246,0.8)', 'rgba(16,185,129,0.8)',
      ],
      borderColor: 'rgba(255,255,255,0.05)',
      borderWidth: 2,
    }],
  };

  // ── Revenue Projection Line Chart ───────────────────────────────────────
  const y1 = costs?.year1Revenue || 0;
  const y2 = costs?.year2Revenue || 0;
  const y3 = costs?.year3Revenue || 0;
  const startupCostTotal = startupTotal;

  const revenueLineData = {
    labels: ['Start', 'Month 3', 'Month 6', 'Year 1', 'Year 2', 'Year 3'],
    datasets: [
      {
        label: 'Revenue (PKR)',
        data: [0, Math.round(y1 * 0.1), Math.round(y1 * 0.4), y1, y2, y3],
        borderColor: 'rgba(16,185,129,0.9)',
        backgroundColor: 'rgba(16,185,129,0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16,185,129,1)',
        pointRadius: 4,
      },
      {
        label: 'Cumulative Cost (PKR)',
        data: [
          startupCostTotal,
          startupCostTotal + monthlyTotal * 3,
          startupCostTotal + monthlyTotal * 6,
          startupCostTotal + monthlyTotal * 12,
          startupCostTotal + monthlyTotal * 24,
          startupCostTotal + monthlyTotal * 36,
        ],
        borderColor: 'rgba(239,68,68,0.7)',
        backgroundColor: 'rgba(239,68,68,0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239,68,68,1)',
        pointRadius: 4,
      },
    ],
  };

  // ── Task Status Doughnut ────────────────────────────────────────────────
  const taskStatuses = ['Todo', 'In Progress', 'Completed'];
  const taskCounts = taskStatuses.map(s => tasks.filter(t => t.status === s).length);

  const taskDoughnutData = {
    labels: taskStatuses,
    datasets: [{
      data: taskCounts,
      backgroundColor: ['rgba(99,102,241,0.8)', 'rgba(245,158,11,0.8)', 'rgba(16,185,129,0.8)'],
      borderColor: 'rgba(255,255,255,0.05)',
      borderWidth: 2,
    }],
  };

  // ── Task Priority Bar Chart ─────────────────────────────────────────────
  const priorities = ['High', 'Medium', 'Low'];
  const priorityCounts = priorities.map(p => tasks.filter(t => t.priority === p).length);

  const priorityBarData = {
    labels: priorities,
    datasets: [{
      label: 'Tasks',
      data: priorityCounts,
      backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)', 'rgba(16,185,129,0.7)'],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  // ── Risk by Severity Doughnut ───────────────────────────────────────────
  const riskLevels = ['High', 'Medium', 'Low'];
  const riskCounts = riskLevels.map(s => risks.filter(r => r.severity === s).length);

  const riskDoughnutData = {
    labels: riskLevels,
    datasets: [{
      data: riskCounts,
      backgroundColor: ['rgba(239,68,68,0.8)', 'rgba(245,158,11,0.8)', 'rgba(16,185,129,0.8)'],
      borderColor: 'rgba(255,255,255,0.05)',
      borderWidth: 2,
    }],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-display font-bold text-slate-100">Analytics Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">Visual overview of your business plan metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
              <kpi.icon size={18} className={kpi.color} />
            </div>
            <div>
              <p className="text-lg font-bold font-display text-slate-100">{kpi.value}</p>
              <p className="text-[10px] text-slate-500">{kpi.label}</p>
              <p className="text-[10px] text-slate-600">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Projection — full width */}
      {(y1 > 0 || y2 > 0 || y3 > 0) && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">Revenue vs Cost Projection</h3>
          </div>
          <div style={{ height: 220 }}>
            <Line data={revenueLineData} options={baseOptions} />
          </div>
          {costs?.breakEvenMonth && (
            <p className="text-xs text-slate-500 mt-3 text-center">
              📍 Estimated break-even: <span className="text-emerald-400 font-semibold">Month {costs.breakEvenMonth}</span>
              {costs.timeToRevenue && (
                <> · First revenue in <span className="text-brand-400 font-semibold">{costs.timeToRevenue}</span></>
              )}
            </p>
          )}
        </div>
      )}

      {/* Startup Costs Bar + Monthly Doughnut */}
      {costs && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Banknote size={16} className="text-brand-400" />
              <h3 className="text-sm font-semibold text-slate-200">Startup Cost Breakdown</h3>
            </div>
            <div style={{ height: 200 }}>
              <Bar data={startupBarData} options={{ ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }} />
            </div>
            <p className="text-xs text-slate-500 text-right mt-2">Total: <span className="text-brand-300 font-bold">{fmt(startupTotal)}</span></p>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-200">Monthly Cost Distribution</h3>
            </div>
            <div style={{ height: 200 }}>
              <Doughnut data={monthlyDoughnutData} options={doughnutOptions} />
            </div>
            <p className="text-xs text-slate-500 text-right mt-2">Monthly: <span className="text-amber-300 font-bold">{fmt(monthlyTotal)}</span></p>
          </div>
        </div>
      )}

      {/* Task Analytics */}
      {tasks.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">Task Status</h3>
            </div>
            <div style={{ height: 200 }}>
              <Doughnut data={taskDoughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-accent-400" />
              <h3 className="text-sm font-semibold text-slate-200">Tasks by Priority</h3>
            </div>
            <div style={{ height: 200 }}>
              <Bar data={priorityBarData} options={{ ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }} />
            </div>
          </div>
        </div>
      )}

      {/* Risk Analytics */}
      {risks.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-red-400" />
            <h3 className="text-sm font-semibold text-slate-200">Risk Severity Distribution</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div style={{ height: 180 }} className="md:col-span-1">
              <Doughnut data={riskDoughnutData} options={doughnutOptions} />
            </div>
            <div className="md:col-span-2 space-y-2">
              {risks.map((risk, i) => {
                const colorMap = { High: 'bg-red-400', Medium: 'bg-amber-400', Low: 'bg-emerald-400' };
                const textMap = { High: 'text-red-400', Medium: 'text-amber-400', Low: 'text-emerald-400' };
                return (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorMap[risk.severity] || 'bg-slate-400'}`} />
                    <span className="text-slate-300 flex-1 truncate">{risk.name}</span>
                    <span className={`font-semibold ${textMap[risk.severity] || 'text-slate-400'}`}>{risk.severity}</span>
                    <span className="text-slate-600 w-16 text-right">{risk.likelihood}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Revenue milestones */}
      {costs && (y1 > 0 || y2 > 0 || y3 > 0) && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-brand-400" />
            <h3 className="text-sm font-semibold text-slate-200">Revenue Milestones</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Year 1 Revenue', value: fmt(y1), color: 'text-brand-300', bg: 'bg-brand-500/10' },
              { label: 'Year 2 Revenue', value: fmt(y2), color: 'text-emerald-300', bg: 'bg-emerald-500/10' },
              { label: 'Year 3 Revenue', value: fmt(y3), color: 'text-accent-300', bg: 'bg-accent-500/10' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-4 text-center ${item.bg}`}>
                <p className={`text-xl font-bold font-display ${item.color}`}>{item.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
