'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import ShimmerText from '@/components/app-ui/shimmer-text';
import { ArrowLeft, ChevronDown, Eye, EyeOff, Clock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INDUSTRY_OPTIONS = [
  { value: 'restaurant', label: 'Restaurant & Food Service' },
  { value: 'manufacturing', label: 'Manufacturing & Processing' },
  { value: 'hotel', label: 'Hotel & Hospitality' },
  { value: 'retail', label: 'Retail & Supermarket' },
  { value: 'healthcare', label: 'Healthcare & Pharma' },
  { value: 'logistics', label: 'Logistics & Warehousing' },
  { value: 'facilities', label: 'Facility Management' },
  { value: 'other', label: 'Other' },
];

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+65', flag: '🇸🇬' },
  { code: '+966', flag: '🇸🇦' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+49', flag: '🇩🇪' },
];

export default function SignupPage() {
  const router = useRouter();

  // Step 1, 2, 3, 'verify', or 'waitlist'
  const [step, setStep] = useState<1 | 2 | 3 | 'verify' | 'waitlist'>(1);

  // Form values
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification & Final Setup
  const [code, setCode] = useState('');
  const [verifyPhase, setVerifyPhase] = useState<'code' | 'password'>('code');
  const [countdown, setCountdown] = useState(0);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Countdown timer for OTP resend
  function startCountdown() {
    setCountdown(45);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Step 1: Email ──────────────────────────────────────────────────────────
  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid work email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (data.exists) {
        setError('An account with this email already exists. Please sign in.');
        return;
      }
      setStep(2);
    } catch {
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Phone (Must be exactly 10 digits) ──────────────────────────────
  function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setStep(3);
  }

  // ── Step 3: Profile Details -> Request Verification OTP ─────────────────────
  async function handleStep3(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (companyName.trim().length < 2) {
      setError("Please enter your company's name.");
      return;
    }
    if (!industry) {
      setError('Please select an industry.');
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const selectedIndustry =
      INDUSTRY_OPTIONS.find((opt) => opt.value === industry)?.label || industry;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          phone: fullPhone,
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          industry: selectedIndustry,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      if (data.waitlisted) {
        setStep('waitlist');
        return;
      }

      setStep('verify');
      setVerifyPhase('code');
      startCountdown();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Step 4.1: Verify OTP Code ──────────────────────────────────────────────
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          checkOnly: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please check the code.');
      }

      if (data.waitlisted) {
        setStep('waitlist');
        return;
      }

      // Code successfully verified! On the SAME window, proceed to password setup
      setError('');
      setVerifyPhase('password');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Step 4.2: Set Password and Complete Account Setup ──────────────────────
  async function handleCompleteSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration.');
      }

      if (data.waitlisted) {
        setStep('waitlist');
        return;
      }

      if (data.customToken && auth) {
        await signInWithCustomToken(auth, data.customToken);
      }

      router.push(data.redirectUrl || '/dashboard/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  async function handleResendCode() {
    if (countdown > 0 || loading) return;
    setError('');
    setLoading(true);

    try {
      const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
      const selectedIndustry =
        INDUSTRY_OPTIONS.find((opt) => opt.value === industry)?.label || industry;

      const res = await fetch('/api/auth/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          phone: fullPhone,
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          industry: selectedIndustry,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend verification code.');
      }

      startCountdown();
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  }

  // ── Unified Back Handler ───────────────────────────────────────────────────
  function handleBack() {
    setError('');
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 'verify') {
      if (verifyPhase === 'password') {
        setVerifyPhase('code');
      } else {
        setStep(3);
      }
    }
  }

  const stepIndex = step === 'verify' ? 4 : step === 'waitlist' ? 0 : step;

  return (
    <main className="typography-scope min-h-screen flex flex-col items-center justify-between bg-[#FAFAFA] px-4 py-8 text-[#181818] relative overflow-hidden font-sans">
      {/* Subtle website border grid lines */}
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1248px] border-x border-[#ededed] pointer-events-none" />

      {/* Top spacer to balance the bottom legal footer and keep container centered */}
      <div className="w-full h-6 pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-[400px] flex flex-col items-center relative z-10 my-auto">
        {/* Brand: Official Homepage Audiment Logo with Subtle Ambient Sheen */}
        <Link
          href="/"
          className="mb-6 sm:mb-7 block text-center transition-transform hover:scale-[1.03] group"
        >
          <div className="relative inline-block mx-auto">
            <Image
              src="/logos/audiment.svg"
              alt="Audiment"
              width={180}
              height={52}
              className="h-[44px] sm:h-[50px] w-auto mx-auto object-contain block"
              priority
            />
            {/* Subtle light sheen gliding across the logo paths */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                maskImage: 'url(/logos/audiment.svg)',
                WebkitMaskImage: 'url(/logos/audiment.svg)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            >
              <motion.div
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </Link>

        {/* Progress dots: shifted away from logo, snug/close to container box */}
        {step !== 'waitlist' && (
          <div className="flex items-center justify-center gap-1.5 mb-2.5 sm:mb-3">
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stepIndex >= 1 ? 'w-6 bg-[#FF5400]' : 'w-2 bg-[#e0e0e0]'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stepIndex >= 2 ? 'w-6 bg-[#FF5400]' : 'w-2 bg-[#e0e0e0]'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stepIndex >= 3 ? 'w-6 bg-[#FF5400]' : 'w-2 bg-[#e0e0e0]'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stepIndex >= 4 ? 'w-6 bg-[#FF5400]' : 'w-2 bg-[#e0e0e0]'
              }`}
            />
          </div>
        )}

        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl border border-[#e8e8e8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-8">
          {/* Error Message */}
          {error && step !== 'verify' && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 1: ENTER YOUR EMAIL
              ═══════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-[13px] font-medium text-[#181818]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  required
                  autoFocus
                  disabled={loading}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e0e0e0] bg-white text-[14px] text-[#181818] placeholder:text-[#999999] focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-11 rounded-full bg-[#FF5400] hover:bg-[#E04A00] text-white text-[14px] font-medium tracking-tight transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer mt-2"
              >
                {loading ? 'Checking…' : 'Continue'}
              </button>

              <div className="pt-2 text-center text-xs text-[#737373]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-[#FF5400] hover:underline font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 2: ENTER PHONE NUMBER (Must be 10 digits)
              ═══════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="phoneNumber"
                  className="block text-[13px] font-medium text-[#181818]"
                >
                  Phone number
                </label>

                <div className="flex gap-2">
                  <div className="relative shrink-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-11 rounded-xl border border-[#e0e0e0] bg-white pl-3 pr-7 text-xs text-[#181818] appearance-none focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15 transition-all cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#737373] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="10-digit number"
                    autoComplete="tel-national"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(val);
                      if (error) setError('');
                    }}
                    required
                    autoFocus
                    className="flex-1 h-11 px-3.5 rounded-xl border border-[#e0e0e0] bg-white text-[14px] text-[#181818] placeholder:text-[#999999] focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phoneNumber.replace(/\D/g, '').length !== 10}
                className="w-full h-11 rounded-full bg-[#FF5400] hover:bg-[#E04A00] text-white text-[14px] font-medium tracking-tight transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer mt-2"
              >
                Continue
              </button>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 3: FULL NAME, COMPANY'S NAME, INDUSTRY DROPDOWN (REVEALING)
              ═══════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-3.5">
              {/* Full Name: Initial Field */}
              <div className="space-y-1">
                <label
                  htmlFor="fullName"
                  className="block text-[13px] font-medium text-[#181818]"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Tariq Mansoor"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError('');
                  }}
                  required
                  autoFocus
                  disabled={loading}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e0e0e0] bg-white text-[14px] text-[#181818] placeholder:text-[#999999] focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15 transition-all"
                />
              </div>

              {/* Company's Name: Reveals from bottom once Full Name has >= 2 characters */}
              <AnimatePresence>
                {fullName.trim().length >= 2 && (
                  <motion.div
                    key="company-name-reveal"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-1"
                  >
                    <label
                      htmlFor="companyName"
                      className="block text-[13px] font-medium text-[#181818]"
                    >
                      Company&apos;s Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="e.g. Al Safadi Hospitality"
                      autoComplete="organization"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        if (error) setError('');
                      }}
                      required
                      disabled={loading}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#e0e0e0] bg-white text-[14px] text-[#181818] placeholder:text-[#999999] focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Industry Dropdown: Reveals from bottom once Company's Name has >= 2 characters */}
              <AnimatePresence>
                {fullName.trim().length >= 2 && companyName.trim().length >= 2 && (
                  <motion.div
                    key="industry-reveal"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-1"
                  >
                    <label
                      htmlFor="industry"
                      className="block text-[13px] font-medium text-[#181818]"
                    >
                      Industry
                    </label>
                    <div className="relative">
                      <select
                        id="industry"
                        value={industry}
                        onChange={(e) => {
                          setIndustry(e.target.value);
                          if (error) setError('');
                        }}
                        disabled={loading}
                        className="w-full h-11 px-3.5 pr-8 rounded-xl border border-[#e0e0e0] bg-white text-[14px] text-[#181818] appearance-none focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15 transition-all cursor-pointer"
                      >
                        <option value="" disabled>
                          Select your industry
                        </option>
                        {INDUSTRY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#737373] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue Button: Reveals from bottom once Industry is selected */}
              <AnimatePresence>
                {fullName.trim().length >= 2 && companyName.trim().length >= 2 && Boolean(industry) && (
                  <motion.div
                    key="continue-btn-reveal"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="pt-1"
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-full bg-[#FF5400] hover:bg-[#E04A00] text-white text-[14px] font-medium tracking-tight transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                    >
                      {loading ? 'Continuing…' : 'Continue'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 4: EMAIL VERIFICATION CODE (OTP) & SET PASSWORD
              ═══════════════════════════════════════════════════════════════════ */}
          {step === 'verify' && (
            <div>
              {verifyPhase === 'code' ? (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-1.5 text-center pb-2">
                    <h3 className="text-base font-semibold text-[#181818]">
                      Enter Verification Code
                    </h3>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      We sent a 6-digit code to{' '}
                      <strong className="text-[#181818]">{email}</strong>.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.replace(/\D/g, ''));
                        if (error) setError('');
                      }}
                      required
                      autoFocus
                      disabled={loading}
                      className={`w-full h-12 text-center text-2xl tracking-[0.4em] font-mono rounded-xl border bg-white font-semibold transition-all placeholder:text-[#bbbbbb] ${
                        error
                          ? 'border-red-500 text-red-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                          : 'border-[#e0e0e0] text-[#181818] focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15'
                      }`}
                    />
                    {error && (
                      <p className="text-center text-xs text-red-600 font-medium pt-1">
                        {error.replace(/\s*\d+\s*attempts?\s*remaining\.?/i, '').trim()}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full h-11 rounded-full bg-[#FF5400] hover:bg-[#E04A00] text-white text-[14px] font-medium tracking-tight transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer mt-2"
                  >
                    {loading ? 'Verifying…' : 'Continue'}
                  </button>

                  <div className="text-center text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={countdown > 0 || loading}
                      className="text-[#FF5400] hover:underline disabled:text-[#737373] disabled:no-underline inline-flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {countdown > 0 ? (
                        <>
                          <Clock className="w-3.5 h-3.5" /> Resend in {countdown}s
                        </>
                      ) : (
                        'Resend Code'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* PASSWORD SETUP AT THE VERY END AFTER VERIFICATION (ON SAME WINDOW) */
                <form onSubmit={handleCompleteSignup} className="space-y-4">
                  <div className="space-y-1.5 text-center pb-1">
                    <h3 className="text-base font-semibold text-[#181818]">
                      Set Your Password
                    </h3>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      Choose a password to activate your workspace.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="setPassword"
                      className="block text-[13px] font-medium text-[#181818]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="setPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError('');
                        }}
                        required
                        minLength={6}
                        autoFocus
                        disabled={loading}
                        className={`w-full h-11 px-3.5 pr-10 rounded-xl border bg-white text-[14px] placeholder:text-[#999999] transition-all ${
                          error
                            ? 'border-red-500 text-red-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                            : 'border-[#e0e0e0] text-[#181818] focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#181818] transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="text-xs text-red-600 font-medium pt-0.5">
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || password.length < 6}
                    className="w-full h-11 rounded-full bg-[#FF5400] hover:bg-[#E04A00] text-white text-[14px] font-medium tracking-tight transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer mt-2"
                  >
                    {loading ? 'Activating Workspace…' : 'Activate Workspace & Open Dashboard'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              WAITLIST SCREEN (IF 75 CAP REACHED)
              ═══════════════════════════════════════════════════════════════════ */}
          {step === 'waitlist' && (
            <div className="text-center space-y-3 py-2">
              <h3 className="text-base font-semibold text-[#181818]">
                Priority Access Waitlist
              </h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Our initial launch cohort is full. We have placed{' '}
                <strong className="text-[#181818]">{email}</strong> on our priority list.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="text-xs text-[#FF5400] hover:underline"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Back button on the bottom of the container box, outside */}
        {step !== 1 && step !== 'waitlist' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="text-xs text-[#737373] hover:text-[#181818] inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-black/[0.04]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>
        )}
      </div>

      {/* Legal Footer at the bottom of the screen */}
      <footer className="w-full text-center relative z-10 pt-6 pb-2">
        <p className="text-[11px] text-[#737373] leading-relaxed max-w-xs mx-auto">
          By creating an account, you agree to our{' '}
          <Link
            href="/terms-of-service"
            className="text-[#181818] hover:underline underline-offset-2"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy-policy"
            className="text-[#181818] hover:underline underline-offset-2"
          >
            Privacy Policy
          </Link>
        </p>
      </footer>
    </main>
  );
}
