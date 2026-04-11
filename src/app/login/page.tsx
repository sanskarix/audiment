'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, UserRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import ShimmerText from '@/components/ui/shimmer-text';

const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  auditor: '/dashboard/auditor',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        await sendPasswordResetEmail(auth, email);
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
      const user = await loginUser(email, password);
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
    <main className="typography-scope min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] px-6 space-y-8 relative z-10">
        {/* Brand */}
        <div className="text-center space-y-3">
          <ShimmerText className="text-3xl font-semibold tracking-tighter">
            Audiment
          </ShimmerText>
        </div>

        <Card className="border-border/50 shadow-xl shadow-black/[0.02] backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1.5 pb-6">
            <CardTitle className="text-xl font-medium text-heading">
              {resetMode ? 'Reset Password' : 'Sign in'}
            </CardTitle>
            <CardDescription className="text-muted-text">
              {resetMode ? 'Enter your email to receive a reset link' : 'Enter your email and password to access your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-normal text-body">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 bg-background/50"
                />
              </div>
              {!resetMode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[13px] font-normal text-body">Password</Label>
                    <a href="#" onClick={(e) => { e.preventDefault(); setResetMode(true); setError(''); setResetSuccess(''); }} className="text-[12px] text-primary hover:underline font-normal text-body">Forgot?</a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11 bg-background/50"
                  />
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs font-normal text-destructive">{error}</p>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs font-normal text-green-600">{resetSuccess}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-[14px] font-normal transition-all hover:scale-[1.01]" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {resetMode ? 'Sending...' : 'Signing in…'}
                  </span>
                ) : (
                  resetMode ? 'Send Reset Link' : 'Sign in to Dashboard'
                )}
              </Button>
              {resetMode && (
                <Button type="button" variant="ghost" className="w-full h-11 text-[14px] font-normal" onClick={() => { setResetMode(false); setError(''); setResetSuccess(''); }} disabled={loading}>
                  Back to sign in
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[12px] text-muted-text">
          Don&apos;t have an account? <a href="/#contact" className="text-primary hover:underline font-normal">Contact your administrator</a>
        </p>
      </div>
    </main>
  );
}
