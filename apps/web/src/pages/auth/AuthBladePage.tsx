import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthBladePageProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthBladePage: React.FC<AuthBladePageProps> = ({ initialMode = 'signin' }) => {
  const { login, register, quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'signin' or 'signup'
  const [isSignUp, setIsSignUp] = useState<boolean>(
    initialMode === 'signup' || location.pathname.includes('register')
  );

  // Sync mode if route changes
  useEffect(() => {
    if (location.pathname.includes('register')) {
      setIsSignUp(true);
    } else if (location.pathname.includes('login')) {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  // Sign In Form States
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInShowPassword, setSignInShowPassword] = useState(false);
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(true);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpShowPassword, setSignUpShowPassword] = useState(false);
  const [signUpRole, setSignUpRole] = useState<'business' | 'freelancer'>('business');

  // Shared status states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(signUpPassword);

  // Switch Mode Handler
  const toggleMode = (mode: 'signin' | 'signup') => {
    setErrorMessage('');
    setFieldErrors({});
    setIsSignUp(mode === 'signup');
    window.history.replaceState(null, '', mode === 'signup' ? '/register' : '/login');
  };

  // Sign In Submission
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const errors: Record<string, string> = {};

    if (!signInIdentifier.trim()) {
      errors.identifier = 'Username or email is required';
    }
    if (!signInPassword) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await login(signInIdentifier.trim(), signInPassword);
      // Retrieve stored user or default redirect
      navigate('/business/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const errors: Record<string, string> = {};

    if (!signUpName.trim()) {
      errors.name = 'Full name is required';
    }
    if (!signUpEmail.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!signUpPassword) {
      errors.password = 'Password is required';
    } else if (signUpPassword.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await register({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: signUpRole,
      });

      if (signUpRole === 'freelancer') {
        navigate('/freelancer/onboarding');
      } else {
        navigate('/business/onboarding');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login
  const handleQuickDemo = async (role: 'business' | 'freelancer') => {
    setErrorMessage('');
    setLoading(true);
    try {
      await quickLoginAs(role);
      if (role === 'freelancer') {
        navigate('/freelancer/dashboard');
      } else {
        navigate('/business/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07241B] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#104837]/35 via-[#0C382B]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[400px] bg-[#C9A24B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Animated Card */}
      <div className="w-full max-w-[940px] min-h-[580px] bg-[#F5EFEB] rounded-[28px] sm:rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.65)] relative overflow-hidden flex flex-col md:flex-row border border-[#164737]/40 z-10">

        {/* ========================================================================= */}
        {/* DESKTOP ANIMATED BLADE: Deep Emerald Green Promo Panel that slides across */}
        {/* ========================================================================= */}
        <motion.div
          className="hidden md:flex absolute top-0 bottom-0 z-20 w-[48%] bg-gradient-to-br from-[#08281F] via-[#0B3327] to-[#061F18] p-10 lg:p-12 flex-col justify-between overflow-hidden shadow-2xl"
          initial={false}
          animate={{
            left: isSignUp ? '0%' : '52%',
            clipPath: isSignUp
              ? 'polygon(0% 0%, 100% 0%, calc(100% - 46px) 100%, 0% 100%)'
              : 'polygon(46px 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 30,
            mass: 0.9,
          }}
        >
          {/* Subtle Golden hairline on the slanted blade edge */}
          <div
            className={`absolute top-0 bottom-0 pointer-events-none w-[1.5px] bg-gradient-to-b from-[#E5CB86]/70 via-[#C9A24B]/40 to-transparent ${
              isSignUp ? 'right-[23px] rotate-[3.2deg]' : 'left-[23px] -rotate-[3.2deg]'
            }`}
          />

          {/* Ambient inner soft glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Kicker */}
          <div className="relative z-10 pt-2">
            <span className="text-[11px] font-bold tracking-[0.28em] text-[#D4B56C] uppercase font-mono">
              SKILLBRIDGE
            </span>
          </div>

          {/* Dynamic Editorial Headline with cross-fade animation */}
          <div className="relative z-10 my-auto py-8">
            <AnimatePresence mode="wait">
              {!isSignUp ? (
                <motion.div
                  key="welcome-back-copy"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-4xl lg:text-5xl text-[#F6F2E8] font-normal tracking-tight leading-[1.12]">
                    Welcome<br />
                    <span className="italic font-normal text-[#E2C785]">back.</span>
                  </h2>
                  <p className="text-xs lg:text-sm text-[#9DB8A9] font-normal leading-relaxed max-w-[280px]">
                    Your contracts, your milestones, and your verified talent are exactly where you left them.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="start-page-copy"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-4xl lg:text-5xl text-[#F6F2E8] font-normal tracking-tight leading-[1.12]">
                    Start the<br />
                    <span className="italic font-normal text-[#E2C785]">first contract.</span>
                  </h2>
                  <p className="text-xs lg:text-sm text-[#9DB8A9] font-normal leading-relaxed max-w-[280px]">
                    One platform for verified AI talent, turnkey engineering, and guaranteed milestone escrow.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom subtle trust seal */}
          <div className="relative z-10 pb-2 flex items-center gap-2 text-[11px] text-[#789685] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
            <span>Milestone Escrow Guaranteed</span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* DESKTOP FORMS LAYER: Two 50% columns inside the Ivory Container           */}
        {/* ========================================================================= */}

        {/* COLUMN 1 (LEFT): SIGN IN FORM */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-between transition-opacity duration-300 ${
            !isSignUp ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none md:pointer-events-none'
          }`}
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#142A20] tracking-tight mb-7">
              Sign in
            </h1>

            {errorMessage && !isSignUp && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-100/80 border border-red-300/80 flex items-center gap-2 text-red-800 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSignInSubmit} className="space-y-6">
              {/* Field: Username or email */}
              <div className="space-y-1 relative">
                <label className="block text-[11px] font-semibold text-[#806F54] uppercase tracking-wider">
                  Username or email
                </label>
                <div className="relative border-b-2 border-[#D9CEBA] focus-within:border-[#B58A38] transition-colors pb-1">
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-transparent text-sm text-[#142A20] placeholder-[#A8987F]/70 focus:outline-none pr-8 py-1"
                  />
                  <User className="w-4 h-4 text-[#8C7A5E] absolute right-1 top-2 pointer-events-none" />
                </div>
                {fieldErrors.identifier && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.identifier}</p>
                )}
              </div>

              {/* Field: Password */}
              <div className="space-y-1 relative">
                <label className="block text-[11px] font-semibold text-[#806F54] uppercase tracking-wider">
                  Password
                </label>
                <div className="relative border-b-2 border-[#D9CEBA] focus-within:border-[#B58A38] transition-colors pb-1">
                  <input
                    type={signInShowPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent text-sm text-[#142A20] placeholder-[#A8987F]/70 focus:outline-none pr-8 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => setSignInShowPassword(!signInShowPassword)}
                    className="absolute right-1 top-2 text-[#8C7A5E] hover:text-[#142A20] transition-colors"
                  >
                    {signInShowPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Actions Row: Keep me signed in + Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#142A20] select-none">
                  <div
                    onClick={() => setKeepMeSignedIn(!keepMeSignedIn)}
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors ${
                      keepMeSignedIn
                        ? 'bg-[#0E3A2B] text-white'
                        : 'border border-[#A8987F] bg-transparent'
                    }`}
                  >
                    {keepMeSignedIn && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-medium">Keep me signed in</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your email.')}
                  className="text-[#967228] hover:text-[#7A5A1B] font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Pill Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#0E3A2C] hover:bg-[#144A39] text-[#F6F2E8] text-sm font-semibold tracking-wide shadow-lg shadow-[#0E3A2C]/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
              </button>
            </form>
          </div>

          {/* Footer Toggle */}
          <div className="pt-6 text-xs text-[#52665B]">
            <span>New to SkillBridge? </span>
            <button
              type="button"
              onClick={() => toggleMode('signup')}
              className="font-bold text-[#142A20] underline hover:text-[#967228] transition-colors ml-1"
            >
              Create an account
            </button>
          </div>
        </div>

        {/* COLUMN 2 (RIGHT): CREATE ACCOUNT FORM */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-between transition-opacity duration-300 ${
            isSignUp ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none md:pointer-events-none'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#142A20] tracking-tight">
                Create account
              </h1>

              {/* Role Toggle Switch */}
              <div className="flex bg-[#EAE2D1] p-1 rounded-full text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setSignUpRole('business')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    signUpRole === 'business'
                      ? 'bg-[#0E3A2C] text-[#F6F2E8] shadow-sm'
                      : 'text-[#6B5A41] hover:text-[#142A20]'
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setSignUpRole('freelancer')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    signUpRole === 'freelancer'
                      ? 'bg-[#0E3A2C] text-[#F6F2E8] shadow-sm'
                      : 'text-[#6B5A41] hover:text-[#142A20]'
                  }`}
                >
                  Talent
                </button>
              </div>
            </div>

            {errorMessage && isSignUp && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-100/80 border border-red-300/80 flex items-center gap-2 text-red-800 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSignUpSubmit} className="space-y-5">
              {/* Field: Full Name */}
              <div className="space-y-1 relative">
                <label className="block text-[11px] font-semibold text-[#806F54] uppercase tracking-wider">
                  Full name
                </label>
                <div className="relative border-b-2 border-[#D9CEBA] focus-within:border-[#B58A38] transition-colors pb-1">
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full bg-transparent text-sm text-[#142A20] placeholder-[#A8987F]/70 focus:outline-none pr-8 py-1"
                  />
                  <User className="w-4 h-4 text-[#8C7A5E] absolute right-1 top-2 pointer-events-none" />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Field: Email address */}
              <div className="space-y-1 relative">
                <label className="block text-[11px] font-semibold text-[#806F54] uppercase tracking-wider">
                  Email address
                </label>
                <div className="relative border-b-2 border-[#D9CEBA] focus-within:border-[#B58A38] transition-colors pb-1">
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full bg-transparent text-sm text-[#142A20] placeholder-[#A8987F]/70 focus:outline-none pr-8 py-1"
                  />
                  <Mail className="w-4 h-4 text-[#8C7A5E] absolute right-1 top-2 pointer-events-none" />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Field: Password */}
              <div className="space-y-1 relative">
                <label className="block text-[11px] font-semibold text-[#806F54] uppercase tracking-wider">
                  Password
                </label>
                <div className="relative border-b-2 border-[#D9CEBA] focus-within:border-[#B58A38] transition-colors pb-1">
                  <input
                    type={signUpShowPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent text-sm text-[#142A20] placeholder-[#A8987F]/70 focus:outline-none pr-8 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => setSignUpShowPassword(!signUpShowPassword)}
                    className="absolute right-1 top-2 text-[#8C7A5E] hover:text-[#142A20] transition-colors"
                  >
                    {signUpShowPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password strength dashes from the screenshot */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 w-6 rounded-full transition-colors ${
                          passwordStrength >= step
                            ? 'bg-[#B58A38]'
                            : 'bg-[#DDD2C0]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#806F54] font-medium">
                    Use 8 characters or more.
                  </span>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Pill Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#0E3A2C] hover:bg-[#144A39] text-[#F6F2E8] text-sm font-semibold tracking-wide shadow-lg shadow-[#0E3A2C]/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create account</span>}
              </button>
            </form>
          </div>

          {/* Footer Toggle */}
          <div className="pt-6 text-xs text-[#52665B]">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => toggleMode('signin')}
              className="font-bold text-[#142A20] underline hover:text-[#967228] transition-colors ml-1"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Discreet 1-Click Quick Demo Bar (Preserves Tester Experience)             */}
      {/* ========================================================================= */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#8BA496] relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-[#C9A24B] font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Demo Login:</span>
        </span>
        <button
          type="button"
          onClick={() => handleQuickDemo('business')}
          className="px-3.5 py-1.5 rounded-full bg-[#0E3A2B]/80 hover:bg-[#154B3A] text-[#F6F2E8] border border-[#276450]/60 transition-all shadow-sm hover:scale-105 active:scale-95"
        >
          Client Demo (Alex Chen)
        </button>
        <button
          type="button"
          onClick={() => handleQuickDemo('freelancer')}
          className="px-3.5 py-1.5 rounded-full bg-[#0E3A2B]/80 hover:bg-[#154B3A] text-[#F6F2E8] border border-[#276450]/60 transition-all shadow-sm hover:scale-105 active:scale-95"
        >
          Talent Demo (Sarah Jenkins)
        </button>
      </div>
    </div>
  );
};
