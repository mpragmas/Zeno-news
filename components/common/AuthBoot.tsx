'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { getMe } from '@/lib/api/auth';

/**
 * Refreshes the cached user from /me once the persisted session rehydrates.
 * Keeps role / avatar / preferences in sync and lets the response interceptor
 * sign the user out if the stored token has expired.
 */
export function AuthBoot() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (!hydrated || !token) return;
    let cancelled = false;
    getMe()
      .then((p) => {
        if (cancelled) return;
        setUser({
          id: p.id,
          email: p.email,
          name: p.name,
          role: p.role,
          avatarUrl: p.avatarUrl,
          preferredAppLanguage: p.preferredAppLanguage,
          preferredNewsLanguage: p.preferredNewsLanguage,
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [hydrated, token, setUser]);

  return null;
}
