import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0B3D2E]">
      <div className="max-w-md w-full space-y-6 bg-[#114A39] p-8 sm:p-10 rounded-[12px] border border-[#1F5A46] shadow-xl text-[#F6F1E4]">
        <div className="text-center space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
            SECURITY RECOVERY
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#F6F1E4]">Reset Password</h2>
          <p className="text-xs text-[#BFD0C6]">
            Enter your email address to receive password reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-6 rounded-[8px] bg-[#072A20] border border-[#1F5A46] text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#7BC49A] mx-auto" />
            <h3 className="font-serif text-lg text-[#F6F1E4]">Recovery Email Dispatched</h3>
            <p className="text-xs text-[#BFD0C6] leading-relaxed">
              If an account is associated with {email}, you will receive a secure password reset link shortly.
            </p>
            <Link to="/login" className="inline-block mt-3 text-xs font-medium text-[#E5CB86] hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#F6F1E4] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9DB5A8] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-[#BFD0C6] pt-3 border-t border-[#1F5A46]">
              Remember your password?{' '}
              <Link to="/login" className="text-[#E5CB86] hover:underline font-medium">
                Return to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
