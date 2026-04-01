'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, UserRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      router.push(ROLE_ROUTES[user.role]);
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.message || 'Invalid credentials. Please try again.';
      // Keep the specific check for user record not found, but otherwise show the actual error to help debugging
      setError(message.includes('User record not found') ? message : (err.code || message));
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
          <div className="inline-flex w-12 h-12 rounded-2xl bg-primary items-center justify-center mb-2 shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-medium text-xl leading-none">A</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tighter text-heading">Audiment</h1>
          <p className="text-[14px] text-body leading-relaxed">
            Audit smarter. Manage better. <br />
            Sign in to your dashboard to continue.
          </p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-black/[0.02] backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1.5 pb-6">
            <CardTitle className="text-xl font-medium text-heading">Sign in</CardTitle>
            <CardDescription className="text-muted-text">Enter your email and password to access your account</CardDescription>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[13px] font-normal text-body">Password</Label>
                  <a href="#" className="text-[12px] text-primary hover:underline font-normal text-body">Forgot?</a>
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

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs font-normal text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-[14px] font-normal transition-all hover:scale-[1.01]" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign in to Dashboard'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[12px] text-muted-text">
          Don&apos;t have an account? <a href="#" className="text-primary hover:underline font-normal">Contact your administrator</a>
        </p>
      </div>
    </main>
  );
}
