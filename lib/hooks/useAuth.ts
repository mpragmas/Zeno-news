'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useBookmarksStore } from '@/lib/stores/bookmarks.store';
import { loginWithGoogle, loginWithCredentials } from '@/lib/api/auth';
import { getGuestSessionId, clearGuestSession } from '@/lib/auth/guest';
import type { AuthResponse } from '@/lib/types/auth';

/**
 * Central auth actions. Sign-in exchanges a Google ID token for an API JWT,
 * merges any guest reading history, and uploads locally-saved bookmarks to the
 * account so nothing is lost when moving from guest to signed-in.
 */
export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const signIn = useCallback(
    async (idToken: string): Promise<AuthResponse> => {
      const guestId = getGuestSessionId() ?? undefined;
      const res = await loginWithGoogle(idToken, guestId);
      setSession(res.accessToken, res.user);
      clearGuestSession();
      // Push guest bookmarks (captured locally) up to the new account.
      void useBookmarksStore.getState().syncToBackend();
      return res;
    },
    [setSession],
  );

  /** Admin-only username/password sign-in (no Google, no signup). */
  const signInWithCredentials = useCallback(
    async (username: string, password: string): Promise<AuthResponse> => {
      const res = await loginWithCredentials(username, password);
      setSession(res.accessToken, res.user);
      return res;
    },
    [setSession],
  );

  const signOut = useCallback(() => {
    logout();
    try {
      window.google?.accounts.id.disableAutoSelect();
    } catch {
      // GIS not loaded — nothing to disable
    }
  }, [logout]);

  return {
    token,
    user,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    hydrated,
    signIn,
    signInWithCredentials,
    signOut,
    setUser,
  };
}
