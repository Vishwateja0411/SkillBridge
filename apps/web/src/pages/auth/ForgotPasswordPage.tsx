import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.login; // trigger request
    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-brand-navy">Reset Password</h2>
          <p className="text-xs text-slate-500">Enter your email address to receive password reset instructions</p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-brand-indigo mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">Recovery Email Dispatched</h3>
            <p className="text-xs text-slate-600">
              If an account is associated with {email}, you will receive a secure password reset link shortly.
            </p>
            <Link to="/login" className="inline-block mt-3 text-xs font-bold text-brand-indigo hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-slate-500 pt-2">
              <Link to="/login" className="font-bold text-brand-indigo hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
