'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/types/auth';

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  /** True once zustand has rehydrated from localStorage (avoids auth flicker). */
  hydrated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'newssummary-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

/** Synchronous token read for the axios interceptor (safe on the server → null). */
export function getAuthToken(): string | null {
  try {
    return useAuthStore.getState().token;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  try {
    return useAuthStore.getState().user?.role === 'admin';
  } catch {
    return false;
  }
}
