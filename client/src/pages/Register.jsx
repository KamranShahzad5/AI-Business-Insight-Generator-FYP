import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, ArrowRight, User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register({ name: form.name.trim(), email: form.email, password: form.password });
      toast.success(`Account created! Welcome, ${user.name?.split(' ')[0] || form.name.split(' ')[0]}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Registration failed';
      if (msg.toLowerCase().includes('exists') || msg.toLowerCase().includes('already')) {
        setErrors({ email: 'An account with this email already exists' });
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
        toast.error('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); },
    className: `input-field ${errors[key] ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`,
  });

  const strengthPct = Math.min(100, (form.password.length / 12) * 100);
  const strengthColor = strengthPct < 40 ? 'bg-red-500' : strengthPct < 70 ? 'bg-amber-500' : 'bg-emerald-500';
  const strengthLabel = strengthPct < 40 ? 'Weak' : strengthPct < 70 ? 'Good' : 'Strong';

  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-accent-950 via-surface-900 to-brand-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-40" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center shadow-glow-sm">
            <Zap size={17} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">Insightify</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Join 10,000+ Founders Building Smarter
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Create your free account and get your first AI business plan in under 5 minutes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '📋', label: 'Unlimited Plans' },
              { icon: '⚡', label: 'Instant Generation' },
              { icon: '🤖', label: 'AI Chat Advisor' },
              { icon: '📊', label: 'Visual Analytics' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-3 flex items-center gap-2.5">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-slate-300 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-600">© 2024 Insightify</div>
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

          <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Create your account</h1>
          <p className="text-sm text-slate-400 mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Jane Smith" {...field('name')} className={`input-field pl-9 ${errors.name ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" placeholder="you@example.com" {...field('email')} className={`input-field pl-9 ${errors.email ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  {...field('password')}
                  className={`input-field pl-9 pr-11 ${errors.password ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div animate={{ width: `${strengthPct}%` }} className={`h-full rounded-full ${strengthColor} transition-all duration-300`} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{strengthLabel} password</p>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Confirm Password
              </label>
              <input type="password" placeholder="Repeat password" {...field('confirm')} className={`input-field ${errors.confirm ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`} />
              {errors.confirm && <p className="text-red-400 text-xs mt-1.5">{errors.confirm}</p>}
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
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            By signing up, you agree to our{' '}
            <span className="text-slate-400 hover:text-white cursor-pointer">Terms</span> &{' '}
            <span className="text-slate-400 hover:text-white cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
