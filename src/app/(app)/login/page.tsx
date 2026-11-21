'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { loginUser, UserRole } from '@/lib/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  auditor: '/dashboard/auditor',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  // Run once after mount to catch error parameters from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      if (errorParam) {
        setError(errorParam);
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    setLoading(true);

    if (resetMode) {
      try {
        await sendPasswordResetEmail(auth, email.trim());
        setResetSuccess('Password reset link sent. Check your inbox.');
        setResetMode(false);
      } catch (err: any) {
        console.error('Reset error:', err);
        setError('Failed to send reset email. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const user = await loginUser(email.trim(), password);
      router.push(ROLE_ROUTES[user.role]);
    } catch (err: any) {
      console.error('Login error:', err);
      const code = err.code || '';
      if (code === 'auth/invalid-credential') setError('Incorrect email or password. Please try again.');
      else if (code === 'auth/user-not-found') setError('No account found with this email.');
      else if (code === 'auth/wrong-password') setError('Incorrect password. Please try again.');
      else if (code === 'auth/too-many-requests') setError('Too many failed attempts. Please try again later.');
      else setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="typography-scope min-h-screen flex flex-col items-center justify-between bg-[#FAFAFA] px-4 py-8 text-[#181818] relative overflow-hidden font-sans">
      {/* Subtle website border grid lines matching signup */}
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1248px] border-x border-[#ededed] pointer-events-none" />

      {/* Top spacer to balance the bottom legal footer and keep container centered */}
      <div className="w-full h-6 pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-[420px] sm:max-w-[440px] flex flex-col items-center relative z-10 my-auto">
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

        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl border border-[#e8e8e8] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-[#181818] tracking-tight">
              {resetMode ? 'Reset password' : 'Sign in to Audiment'}
            </h1>
            <p className="text-xs text-[#737373] mt-1 leading-relaxed">
              {resetMode
                ? 'Enter your work email address to receive a secure reset link.'
                : 'Enter your credentials to access your organization dashboard.'}
            </p>
          </div>

          {/* Status alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-600"
              >
                {error}
              </motion.div>
            )}

            {resetSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700"
              >
                {resetSuccess}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {!resetMode && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-[13px] font-medium text-[#181818]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetMode(true);
                      setError('');
                      setResetSuccess('');
                    }}
                    className="text-xs text-[#FF5400] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    disabled={loading}
                    className="w-full h-11 px-3.5 pr-10 rounded-xl border border-[#e0e0e0] bg-white text-[14px] text-[#181818] placeholder:text-[#999999] focus:outline-none focus:border-[#FF5400] focus:ring-2 focus:ring-[#FF5400]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#181818] transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || (!resetMode && !password)}
              className="w-full h-11 rounded-full bg-[#FF5400] hover:bg-[#E04A00] text-white text-[14px] font-medium tracking-tight transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {resetMode ? 'Sending reset link…' : 'Signing in…'}
                </span>
              ) : resetMode ? (
                'Send reset link'
              ) : (
                'Sign in'
              )}
            </button>

            {resetMode ? (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setResetMode(false);
                    setError('');
                    setResetSuccess('');
                  }}
                  disabled={loading}
                  className="text-xs text-[#737373] hover:text-[#181818] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </button>
              </div>
            ) : (
              <div className="pt-2 text-center text-xs text-[#737373]">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="text-[#FF5400] hover:underline font-medium transition-colors"
                >
                  Create an account
                </Link>
              </div>
            )}
          </form>
        </div>

        {/* Back to Home Link */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-[#737373] hover:text-[#181818] inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-black/[0.04]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>
      </div>

      {/* Legal Footer at bottom matching signup */}
      <footer className="w-full text-center relative z-10 pt-6 pb-2">
        <p className="text-[11px] text-[#737373] leading-relaxed max-w-xs mx-auto">
          By signing in, you agree to our{' '}
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
