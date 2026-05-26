import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login({ email: form.email, password: form.password });
      toast.success(`Welcome back, ${user.name?.split(' ')[0] || 'there'}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Login failed';
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials')) {
        setErrors({ email: 'Invalid email or password' });
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
        toast.error('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-950 via-surface-900 to-accent-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center shadow-glow-sm">
              <Zap size={17} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg">Insightify</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Your AI Business Advisor Awaits
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Generate complete business plans, financial forecasts, and risk analyses in under 5 seconds.
          </p>
          <div className="space-y-3">
            {['Business Plan generation in seconds', 'Intelligent cost estimation', 'AI Chat for real-time Q&A'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={10} className="text-brand-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-600">
          © 2024 Insightify · AI Business Platform
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg">Insightify</span>
          </div>

          <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((ev) => ({ ...ev, email: '' })); }}
                className={`input-field ${errors.email ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => { setForm((f) => ({ ...f, password: e.target.value })); setErrors((ev) => ({ ...ev, password: '' })); }}
                  className={`input-field pr-11 ${errors.password ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="w-full btn-primary justify-center py-3.5 text-sm shadow-glow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
