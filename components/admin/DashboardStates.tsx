'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { AdminAuthError } from '@/lib/api/admin';

/** Redirects to the login screen when a query fails with an auth error. */
export function useAuthErrorRedirect(error: unknown) {
  const router = useRouter();
  useEffect(() => {
    if (error instanceof AdminAuthError) {
      router.replace('/admin/login');
    }
  }, [error, router]);
}

export function DashboardError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-amber-500" />
      <p className="text-sm text-muted-foreground">
        Couldn&apos;t load analytics. The API may be waking up — try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium hover:bg-accent"
        >
          Retry
        </button>
      )}
    </div>
  );
}
