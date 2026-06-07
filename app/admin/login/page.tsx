'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, KeyRound, Loader2, ShieldAlert, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { setAdminKey, verifyAdminKey } from '@/lib/api/admin';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInWithCredentials } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showKey, setShowKey] = useState(false);
  const [key, setKey] = useState('');
  const [keyLoading, setKeyLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    try {
      await signInWithCredentials(username.trim(), password);
      toast.success('Welcome back');
      router.replace('/admin');
    } catch (err: unknown) {
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 404) {
        toast.error(
          'Admin login is not available on this API yet. Redeploy the backend, or point NEXT_PUBLIC_API_BASE_URL to a local server (http://localhost:4000/api/v1).',
          { duration: 8000 },
        );
      } else {
        toast.error('Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleKeySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setKeyLoading(true);
    const ok = await verifyAdminKey(key.trim());
    setKeyLoading(false);
    if (ok) {
      setAdminKey(key.trim());
      toast.success('Welcome back');
      router.replace('/admin');
    } else {
      toast.error('Invalid admin key');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-xl font-semibold text-foreground">
            Zeno News Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your admin username and password
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-border bg-card p-6"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" />
            Admin accounts are pre-provisioned — there is no signup.
          </p>
        </form>

        {/* Break-glass: manual admin key */}
        <div className="mt-4 text-center">
          {!showKey ? (
            <button
              onClick={() => setShowKey(true)}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Use an admin key instead
            </button>
          ) : (
            <form
              onSubmit={handleKeySubmit}
              className="mt-2 space-y-3 rounded-2xl border border-border bg-card p-5 text-left"
            >
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  autoFocus
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Admin key"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={keyLoading || !key.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {keyLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {keyLoading ? 'Verifying…' : 'Access dashboard'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
