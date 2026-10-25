import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthBridgeArt } from '../../components/auth/AuthBridgeArt';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [accountType, setAccountType] = useState<'freelancer' | 'business'>('freelancer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemos, setShowDemos] = useState(false);

  const validateForm = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrorMsg('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      if (accountType === 'freelancer') {
        navigate('/freelancer/dashboard');
      } else if (accountType === 'business') {
        navigate('/business/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (role: 'business' | 'freelancer') => {
    if (role === 'business') {
      setEmail('client@skillbridge.io');
      setPassword('Password123!');
      setAccountType('business');
    } else {
      setEmail('sarah@skillbridge.io');
      setPassword('Password123!');
      setAccountType('freelancer');
    }
    setEmailError('');
    setPasswordError('');
    setErrorMsg('');
  };

  const handleQuickLaunch = async (role: 'business' | 'freelancer') => {
    setErrorMsg('');
    setLoading(true);
    try {
      await quickLoginAs(role);
      if (role === 'freelancer') navigate('/freelancer/dashboard');
      else navigate('/business/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccountType = (type: 'freelancer' | 'business') => {
    setAccountType(type);
    if (errorMsg) setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#072A20] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* Two-Column Card Container matching visual reference */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-5xl lg:min-h-[640px] grid grid-cols-1 lg:grid-cols-12 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-2xl border border-[#1F5A46]/80 my-auto"
      >
        {/* Left Panel (Emerald #0B3D2E) with animated bridge and dynamic reaction */}
        <div className="lg:col-span-6 bg-[#0B3D2E] p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-[#F6F1E4] relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1F5A46]">
          {/* Subtle Ambient Glow behind bridge */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C9A24B] rounded"
            >
              <div className="w-5 h-5 border-[1.5px] border-[#C9A24B] rotate-45 transform flex items-center justify-center transition-transform group-hover:rotate-[135deg] duration-300">
                <div className="w-1.5 h-1.5 bg-[#C9A24B]" />
              </div>
              <span className="font-serif text-2xl tracking-normal text-[#F6F1E4] font-medium">
                SkillBridge
              </span>
            </Link>
          </div>

          {/* Animated Center Content reacting to toggle */}
          <div className="my-auto py-8 lg:py-10 space-y-4 relative z-10">
            <AnimatePresence mode="wait">
              {accountType === 'freelancer' ? (
                <motion.div
                  key="freelancer-copy"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                    WELCOME BACK • TALENT
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.1] text-[#F6F1E4]">
                    Good work begins <br />
                    with <span className="italic text-[#E5CB86]">trust.</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed max-w-sm pt-1">
                    Pick up your projects, proposals, and milestones right where you left off.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="business-copy"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                    WELCOME BACK • CLIENT
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.1] text-[#F6F1E4]">
                    Great teams begin <br />
                    with <span className="italic text-[#E5CB86]">vision.</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed max-w-sm pt-1">
                    Engage verified specialists, manage workspaces, and release milestone payouts.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Faint gold line-art bridge with animated flowing light beam */}
            <div className="pt-4 -mb-4">
              <AuthBridgeArt roleMode={accountType} />
            </div>
          </div>

          {/* Left Footer */}
          <div className="text-xs text-[#8CA699] font-normal pt-4 border-t border-[#1F5A46]/40 relative z-10 flex items-center justify-between">
            <span>Milestone-protected payments, clear fees.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-pulse" />
          </div>
        </div>

        {/* Right Panel (Ivory #F6F1E4) */}
        <div className="w-full lg:col-span-6 bg-[#F6F1E4] text-[#0B3D2E] p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05, ease: 'easeOut' }}
            className="max-w-[420px] w-full mx-auto space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="font-serif text-4xl font-medium text-[#0B3D2E] tracking-tight">
                Sign in
              </h2>
              <p className="text-xs text-[#4F6B5E] mt-1.5">
                New here?{' '}
                <Link
                  to="/register"
                  className="text-[#8C6D2B] hover:text-[#5F4818] underline underline-offset-4 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A24B] rounded"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Sliding Toggle Switch (Freelancer <-> Business) */}
            <div>
              <div
                role="tablist"
                aria-label="Account type toggle"
                className="relative p-1 bg-[#EBE5D6] rounded-[12px] border border-[#DDD5C3] flex items-center shadow-inner"
              >
                {/* Sliding active pill indicator */}
                <motion.div
                  className="absolute top-1 bottom-1 rounded-[8px] bg-white shadow-sm border border-[#C9A24B]/40"
                  layout
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  style={{
                    width: 'calc(50% - 4px)',
                    left: accountType === 'freelancer' ? '4px' : 'calc(50%)',
                  }}
                />

                <button
                  type="button"
                  role="tab"
                  id="tab-freelancer"
                  aria-selected={accountType === 'freelancer'}
                  onClick={() => toggleAccountType('freelancer')}
                  className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-[8px] transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] ${
                    accountType === 'freelancer'
                      ? 'text-[#0B3D2E]'
                      : 'text-[#5C7366] hover:text-[#0B3D2E]'
                  }`}
                >
                  Freelancer
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-business"
                  aria-selected={accountType === 'business'}
                  onClick={() => toggleAccountType('business')}
                  className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-[8px] transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] ${
                    accountType === 'business'
                      ? 'text-[#0B3D2E]'
                      : 'text-[#5C7366] hover:text-[#0B3D2E]'
                  }`}
                >
                  Business
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Field with Crisp White Placeholder */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-medium text-[#2E4238] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'login-email-error' : undefined}
                  placeholder="you@example.com"
                  className={`w-full px-3.5 py-3 rounded-[8px] bg-[#1E2421] text-[#F6F1E4] placeholder-white placeholder:text-white placeholder:text-opacity-90 border text-sm transition-all focus:outline-none ${
                    emailError
                      ? 'border-[#B3402F] focus:border-[#B3402F] focus:ring-2 focus:ring-[#B3402F]/30'
                      : 'border-[#2D3832] focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/30'
                  }`}
                />
                {emailError && (
                  <p
                    id="login-email-error"
                    className="text-xs text-[#B3402F] mt-1.5 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password Field with Crisp White Placeholder */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-[#2E4238] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'login-password-error' : undefined}
                    placeholder="••••••••••••"
                    className={`w-full pl-3.5 pr-11 py-3 rounded-[8px] bg-[#1E2421] text-[#F6F1E4] placeholder-white placeholder:text-white placeholder:text-opacity-90 border text-sm transition-all focus:outline-none ${
                      passwordError
                        ? 'border-[#B3402F] focus:border-[#B3402F] focus:ring-2 focus:ring-[#B3402F]/30'
                        : 'border-[#2D3832] focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/30'
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9DB5A8] hover:text-[#F6F1E4] focus:outline-none focus:ring-1 focus:ring-[#C9A24B] rounded transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p
                    id="login-password-error"
                    className="text-xs text-[#B3402F] mt-1.5 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-[#3A5044] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#3D4C44] text-[#0B3D2E] accent-[#0B3D2E] focus:ring-2 focus:ring-[#C9A24B]"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#526B5E] hover:text-[#0B3D2E] underline underline-offset-2 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A24B] rounded"
                >
                  Forgot password?
                </Link>
              </div>

              {/* API Error Alert Area */}
              {errorMsg && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="p-3.5 rounded-[8px] bg-[#FDF2F0] border border-[#F4BFB7] text-[#B3402F] text-xs flex items-center gap-2.5 shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 text-[#B3402F] shrink-0" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-[8px] bg-[#0B3D2E] hover:bg-[#114A39] text-[#F6F1E4] font-medium text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:ring-offset-2 focus:ring-offset-[#F6F1E4] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin text-[#E5CB86]" />}
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              </button>
            </form>

            {/* Protected Security Note */}
            <p className="text-[11px] text-center text-[#5C7366] leading-relaxed">
              Protected by secure sign-in. Admin access is not available here.
            </p>

            {/* Collapsible Demo Accounts Section */}
            <div className="pt-2 border-t border-black/[0.08]">
              <button
                type="button"
                onClick={() => setShowDemos(!showDemos)}
                aria-expanded={showDemos}
                className="w-full flex items-center justify-between text-xs font-medium text-[#4D6357] hover:text-[#0B3D2E] py-1 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A24B] rounded"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A17A28]" />
                  Try a demo account
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showDemos ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showDemos && (
                <div className="mt-2.5 p-3 rounded-[8px] bg-white border border-[#E5DFD0] space-y-2 text-xs">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8C6D2B]">
                    Click to fill credentials
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectDemo('business')}
                      className="p-2.5 text-left rounded-[6px] bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-[#DDD5C3] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A24B]"
                    >
                      <div className="font-semibold text-[#0B3D2E]">Client Demo</div>
                      <div className="text-[10px] text-[#6E8276]">Alex Chen • Business</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDemo('freelancer')}
                      className="p-2.5 text-left rounded-[6px] bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-[#DDD5C3] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A24B]"
                    >
                      <div className="font-semibold text-[#0B3D2E]">Talent Demo</div>
                      <div className="text-[10px] text-[#6E8276]">Sarah Jenkins • Freelancer</div>
                    </button>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#6E8276]">
                    <span>Or instant launch:</span>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => handleQuickLaunch('business')}
                        className="text-[#0B3D2E] font-medium hover:text-[#C9A24B] underline"
                      >
                        Client
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleQuickLaunch('freelancer')}
                        className="text-[#0B3D2E] font-medium hover:text-[#C9A24B] underline"
                      >
                        Freelancer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
