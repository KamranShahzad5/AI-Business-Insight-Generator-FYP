import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, ArrowRight, Sparkles, BarChart3, Shield, MessageSquare,
  CheckCircle, Star, ChevronRight, Brain, Rocket, TrendingUp, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Brain,
    title: 'AI Business Plan',
    desc: 'Generate comprehensive, market-ready business plans in seconds. Executive summaries, market analysis, financial overviews and more.',
    gradient: 'from-brand-500 to-brand-700',
  },
  {
    icon: CheckCircle,
    title: 'Smart Task Breakdown',
    desc: 'Auto-generate prioritized task lists with owners, durations, and status tracking. Your roadmap, built by AI.',
    gradient: 'from-accent-500 to-accent-700',
  },
  {
    icon: BarChart3,
    title: 'Cost Estimation',
    desc: 'Visual cost breakdowns with startup costs, monthly burn rate, and 3-year revenue projections powered by industry benchmarks.',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    icon: Shield,
    title: 'Risk Analysis',
    desc: 'Identify potential threats with severity ratings, likelihood scores, and AI-crafted mitigation strategies.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    desc: 'Ask anything about your business plan. Get instant, contextual answers from your dedicated AI business advisor.',
    gradient: 'from-rose-500 to-pink-700',
  },
  {
    icon: TrendingUp,
    title: 'Financial Insights',
    desc: 'Interactive Chart.js visualizations of your financial projections. Understand your path to profitability at a glance.',
    gradient: 'from-cyan-500 to-blue-700',
  },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Startup Founder', text: 'Insightify cut my business planning time from 3 weeks to 3 hours. The AI insights are genuinely impressive.', rating: 5 },
  { name: 'Marcus Williams', role: 'VC Analyst', text: 'The risk analysis feature alone is worth it. I use it to quickly evaluate early-stage startups.', rating: 5 },
  { name: 'Priya Sharma', role: 'MBA Graduate', text: 'Better than most consulting decks I\'ve seen. The financial projections are surprisingly accurate.', rating: 5 },
];

const stats = [
  { value: '10,000+', label: 'Plans Generated' },
  { value: '95%', label: 'User Satisfaction' },
  { value: '< 5s', label: 'Generation Time' },
  { value: '8 Sections', label: 'Per Business Plan' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-16 h-16 bg-surface-950/80 backdrop-blur-xl border-b border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">Insightify</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
            Log in
          </Link>
          <button onClick={() => navigate('/register')} className="btn-primary text-sm py-2 px-4">
            Get Started <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => navigate('/login')} className="text-xs text-slate-400 hover:text-white px-3 py-1.5">
            Log in
          </button>
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 z-40 bg-surface-900 border-b border-white/10 px-4 py-4 flex flex-col gap-3 md:hidden"
        >
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300 hover:text-white py-2 border-b border-white/5">Features</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300 hover:text-white py-2 border-b border-white/5">How it Works</a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300 hover:text-white py-2 border-b border-white/5">Reviews</a>
          <button onClick={() => navigate('/register')} className="btn-primary text-sm py-2.5 justify-center mt-1">
            Get Started Free <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 text-center">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6 sm:mb-8"
          >
            <Sparkles size={12} />
            AI-Powered Business Intelligence Platform
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          </motion.div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-extrabold leading-tight mb-5 sm:mb-6">
            Turn Your Idea Into a{' '}
            <span className="text-gradient glow-text">
              Full Business Plan
            </span>{' '}
            in Seconds
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Insightify uses advanced AI to generate complete business plans, task breakdowns,
            cost estimates, and risk analyses — everything you need to go from idea to execution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 shadow-glow-md w-full sm:w-auto justify-center"
            >
              <Rocket size={17} />
              Start for Free
              <ArrowRight size={15} />
            </motion.button>
            <Link to="/login" className="btn-secondary text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 w-full sm:w-auto text-center">
              View Demo
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-600">
            No credit card required · Results in under 5 seconds · 100% free to try
          </p>
        </motion.div>

        {/* Hero mockup — hidden on small phones, visible on sm+ */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative z-10 mt-12 sm:mt-20 w-full max-w-5xl mx-auto hidden sm:block"
        >
          <div className="glass rounded-2xl border border-white/10 p-3 sm:p-4 shadow-glow-lg">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="ml-3 flex-1 h-5 rounded-md bg-white/5 max-w-xs" />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
              {['Business Plan', 'Tasks', 'Costs', 'Risks'].map((t, i) => (
                <div key={i} className={`py-2 rounded-lg text-xs font-semibold text-center ${i === 0 ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/3 text-slate-500'}`}>
                  {t}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="col-span-2 space-y-2 sm:space-y-3">
                {['Executive Summary', 'Market Analysis', 'Product Description', 'Marketing Strategy', 'Financial Overview'].map((s, i) => (
                  <div key={i} className="glass rounded-xl p-3">
                    <div className="h-3 bg-white/10 rounded mb-2 w-2/3" />
                    <div className="space-y-1.5">
                      <div className="h-2 bg-white/5 rounded w-full" />
                      <div className="h-2 bg-white/5 rounded w-5/6" />
                      <div className="h-2 bg-white/5 rounded w-4/6" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="glass rounded-xl p-3 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500/30 flex-shrink-0" />
                    <div className="h-2.5 bg-white/10 rounded w-3/4" />
                  </div>
                  {[1,2,3,4].map(i => (
                    <div key={i} className="mb-3">
                      <div className={`rounded-lg p-2 mb-1 ${i % 2 === 0 ? 'bg-brand-500/10 ml-4' : 'bg-white/5'}`}>
                        <div className="h-2 bg-white/10 rounded w-full" />
                        <div className="h-2 bg-white/5 rounded w-3/4 mt-1" />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1 h-8 bg-white/5 rounded-lg" />
                    <div className="w-8 h-8 bg-brand-500/30 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-slate-400 text-xs font-medium mb-4">
              <Sparkles size={12} className="text-brand-400" /> Everything you need
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-4">
              Built for <span className="text-gradient">Founders & Innovators</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              From idea validation to investor-ready documents, Insightify covers every critical aspect of business planning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="card group"
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300`}>
                  <feat.icon size={18} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-slate-100 mb-2 text-sm sm:text-base">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-4">
              <span className="text-gradient">3 Simple Steps</span> to Your Business Plan
            </h2>
            <p className="text-slate-400 mb-10 sm:mb-16 text-sm sm:text-base">No consulting fees. No weeks of research. Just results.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Describe Your Idea', desc: 'Enter your business concept in plain English. The more detail you provide, the richer the output.', icon: '💡' },
              { step: '02', title: 'AI Generates Everything', desc: 'Our AI engine creates a full business plan, task roadmap, financial estimates, and risk assessment in seconds.', icon: '⚡' },
              { step: '03', title: 'Refine with AI Chat', desc: 'Ask your AI advisor follow-up questions, dive deeper into any section, and iterate until it\'s perfect.', icon: '🤖' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card text-center">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{step.icon}</div>
                  <div className="text-xs font-bold text-brand-400 mb-2 font-mono">{step.step}</div>
                  <h3 className="font-display font-semibold text-base sm:text-lg mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden sm:flex absolute top-1/2 -right-4 z-10 text-slate-600">
                    <ChevronRight size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3">Loved by Entrepreneurs</h2>
            <p className="text-slate-400 text-sm sm:text-base">Trusted by founders, analysts, and innovators worldwide.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex gap-0.5 mb-3 sm:mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">{t.name}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card border border-brand-500/20 bg-gradient-to-br from-brand-950/50 to-accent-950/30 shadow-glow-md p-6 sm:p-10"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-glow-md">
              <Zap size={24} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3 sm:mb-4">
              Ready to Build Something <span className="text-gradient">Remarkable?</span>
            </h2>
            <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Join thousands of entrepreneurs who've accelerated their journey with Insightify.
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-sm sm:text-base py-3.5 sm:py-4 px-8 sm:px-10 shadow-glow-md"
            >
              <Rocket size={17} />
              Get Started Free
              <ArrowRight size={15} />
            </motion.button>
            <p className="mt-4 text-xs text-slate-600">No credit card · Free forever · Unlimited plans</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">Insightify</span>
        </div>
        <p className="text-xs text-slate-600">
          © 2024 Insightify · AI Business Insight Generator · Final Year Project
        </p>
      </footer>
    </div>
  );
}

            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card border border-brand-500/20 bg-gradient-to-br from-brand-950/50 to-accent-950/30 shadow-glow-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-glow-md">
              <Zap size={28} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Build Something <span className="text-gradient">Remarkable?</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Join thousands of entrepreneurs who've accelerated their journey with Insightify.
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-base py-4 px-10 shadow-glow-md"
            >
              <Rocket size={18} />
              Get Started Free
              <ArrowRight size={16} />
            </motion.button>
            <p className="mt-4 text-xs text-slate-600">No credit card · Free forever · Unlimited plans</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">Insightify</span>
        </div>
        <p className="text-xs text-slate-600">
          © 2024 Insightify · AI Business Insight Generator · Final Year Project
        </p>
      </footer>
    </div>
  );
}
