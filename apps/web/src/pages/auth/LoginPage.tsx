import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAs } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role: 'business' | 'freelancer' | 'admin') => {
    setLoading(true);
    try {
      await quickLoginAs(role);
      if (role === 'freelancer') navigate('/freelancer/dashboard');
      else if (role === 'business') navigate('/business/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-3">
          <img
            src="/logo.png"
            alt="SkillBridge Logo"
            className="w-14 h-14 object-contain rounded-2xl mx-auto shadow-sm"
          />
          <h2 className="text-2xl font-extrabold text-brand-navy">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your SkillBridge account to manage your projects</p>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-indigo">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Instant Demo Logins (1-Click)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuick('business')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 border border-indigo-100 text-[11px] font-bold text-slate-800 shadow-xs"
            >
              Client (Alex)
            </button>
            <button
              type="button"
              onClick={() => handleQuick('freelancer')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 border border-indigo-100 text-[11px] font-bold text-slate-800 shadow-xs"
            >
              Freelancer (Sarah)
            </button>
            <button
              type="button"
              onClick={() => handleQuick('admin')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 border border-indigo-100 text-[11px] font-bold text-purple-700 shadow-xs"
            >
              Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-brand-indigo hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-indigo hover:underline">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};
