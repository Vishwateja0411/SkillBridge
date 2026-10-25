import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthBridgeArt } from '../../components/auth/AuthBridgeArt';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [role, setRole] = useState<'freelancer' | 'business'>('freelancer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Work email is required');
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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!agreeTerms) {
      setTermsError('You must accept the terms of service');
      isValid = false;
    } else {
      setTermsError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrorMsg('');
    setLoading(true);

    try {
      await register({ name: name.trim(), email: email.trim(), password, role });
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

  const toggleRole = (newRole: 'freelancer' | 'business') => {
    setRole(newRole);
    if (errorMsg) setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#072A20] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* Responsive Card Container matching visual reference */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-5xl lg:min-h-[660px] grid grid-cols-1 lg:grid-cols-12 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-2xl border border-[#1F5A46]/80 my-auto"
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
              {role === 'freelancer' ? (
                <motion.div
                  key="freelancer-reg-copy"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                    MEMBERSHIP • TALENT
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.1] text-[#F6F1E4]">
                    Build what matters. <br />
                    <span className="italic text-[#E5CB86]">Partner</span> with the finest.
                  </h1>

                  <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed max-w-sm pt-1">
                    Deliver independent craft with milestone protections, clear 5% fees, and verified reviews.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="business-reg-copy"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                    MEMBERSHIP • CLIENT
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.1] text-[#F6F1E4]">
                    Hire verified talent. <br />
                    <span className="italic text-[#E5CB86]">Scale</span> with certainty.
                  </h1>

                  <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed max-w-sm pt-1">
                    Post unlimited opportunities, discover verified candidates, and enjoy 0% client surcharge.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Faint gold line-art bridge with animated flowing light beam */}
            <div className="pt-4 -mb-4">
              <AuthBridgeArt roleMode={role} />
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
                Create an account
              </h2>
              <p className="text-xs text-[#4F6B5E] mt-1.5">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#8C6D2B] hover:text-[#5F4818] underline underline-offset-4 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A24B] rounded"
                >
                  Sign in
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
                    left: role === 'freelancer' ? '4px' : 'calc(50%)',
                  }}
                />

                <button
                  type="button"
                  role="tab"
                  id="reg-tab-freelancer"
                  aria-selected={role === 'freelancer'}
                  onClick={() => toggleRole('freelancer')}
                  className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-[8px] transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] ${
                    role === 'freelancer'
                      ? 'text-[#0B3D2E]'
                      : 'text-[#5C7366] hover:text-[#0B3D2E]'
                  }`}
                >
                  Freelancer
                </button>

                <button
                  type="button"
                  role="tab"
                  id="reg-tab-business"
                  aria-selected={role === 'business'}
                  onClick={() => toggleRole('business')}
                  className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-[8px] transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] ${
                    role === 'business'
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
              {/* Name Field with White Placeholder */}
              <div>
                <label
                  htmlFor="register-name"
                  className="block text-xs font-medium text-[#2E4238] mb-1.5"
                >
                  {role === 'business' ? 'Contact Name or Company Lead' : 'Full Legal Name'}
                </label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? 'register-name-error' : undefined}
                  placeholder={role === 'business' ? 'e.g. Alex Chen' : 'e.g. Sarah Jenkins'}
                  className={`w-full px-3.5 py-3 rounded-[8px] bg-[#1E2421] text-[#F6F1E4] placeholder-white placeholder:text-white placeholder:text-opacity-90 border text-sm transition-all focus:outline-none ${
                    nameError
                      ? 'border-[#B3402F] focus:border-[#B3402F] focus:ring-2 focus:ring-[#B3402F]/30'
                      : 'border-[#2D3832] focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/30'
                  }`}
                />
                {nameError && (
                  <p
                    id="register-name-error"
                    className="text-xs text-[#B3402F] mt-1.5 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{nameError}</span>
                  </p>
                )}
              </div>

              {/* Email Field with White Placeholder */}
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-xs font-medium text-[#2E4238] mb-1.5"
                >
                  Work Email Address
                </label>
                <input
                  id="register-email"
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
                  aria-describedby={emailError ? 'register-email-error' : undefined}
                  placeholder="name@company.com"
                  className={`w-full px-3.5 py-3 rounded-[8px] bg-[#1E2421] text-[#F6F1E4] placeholder-white placeholder:text-white placeholder:text-opacity-90 border text-sm transition-all focus:outline-none ${
                    emailError
                      ? 'border-[#B3402F] focus:border-[#B3402F] focus:ring-2 focus:ring-[#B3402F]/30'
                      : 'border-[#2D3832] focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/30'
                  }`}
                />
                {emailError && (
                  <p
                    id="register-email-error"
                    className="text-xs text-[#B3402F] mt-1.5 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password Field with White Placeholder */}
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-xs font-medium text-[#2E4238] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'register-password-error' : undefined}
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
                    id="register-password-error"
                    className="text-xs text-[#B3402F] mt-1.5 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#3A5044] select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (termsError) setTermsError('');
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-[#3D4C44] text-[#0B3D2E] accent-[#0B3D2E] focus:ring-2 focus:ring-[#C9A24B]"
                  />
                  <span className="leading-snug">
                    I agree to the{' '}
                    <Link to="/terms" className="underline hover:text-[#0B3D2E]">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="underline hover:text-[#0B3D2E]">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {termsError && (
                  <p className="text-xs text-[#B3402F] mt-1 font-medium">{termsError}</p>
                )}
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
                <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              </button>
            </form>

            {/* Protected Security Note */}
            <p className="text-[11px] text-center text-[#5C7366] leading-relaxed">
              Protected by secure sign-in. Admin registration is restricted.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
