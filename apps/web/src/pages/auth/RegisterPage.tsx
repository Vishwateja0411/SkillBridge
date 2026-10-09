import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, Mail, Lock, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'freelancer' | 'business'>('freelancer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await register({ name, email, password, role });
      if (role === 'freelancer') {
        navigate('/freelancer/onboarding');
      } else {
        navigate('/business/onboarding');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-teal flex items-center justify-center text-white mx-auto shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-navy">Create Your SkillBridge Account</h2>
          <p className="text-xs text-slate-500">Join our two-sided AI talent marketplace</p>
        </div>

        {/* Role Selection Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">Select Your Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('freelancer')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                role === 'freelancer'
                  ? 'border-brand-indigo bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-xs text-slate-900">I am a Freelancer</div>
              <div className="text-[11px] text-slate-500 mt-1">Apply to projects and build your reputation</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('business')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                role === 'business'
                  ? 'border-brand-navy bg-slate-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-xs text-slate-900">I am a Business</div>
              <div className="text-[11px] text-slate-500 mt-1">Post projects and hire top tier specialists</div>
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
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {role === 'business' ? 'Company Contact / Full Name' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@techventures.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
              />
            </div>
          </div>

          {/* Protected admin notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              Administrative accounts are strictly provisioned through internal security protocols and cannot be created via public registration.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold text-xs transition-colors shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Onboarding'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-indigo hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
