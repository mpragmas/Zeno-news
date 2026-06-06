'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, KeyRound, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { setAdminKey, verifyAdminKey } from '@/lib/api/admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    const ok = await verifyAdminKey(key.trim());
    setLoading(false);
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
            NewsSummary Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your admin key to access the dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Admin key
            </span>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                autoFocus
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Verifying…' : 'Access dashboard'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          The key is stored locally and sent as <code>X-Admin-Key</code> on each request.
        </p>
      </div>
    </div>
  );
}
