'use client';

import axios from 'axios';
import type { ApiResponse } from '@/lib/types/api';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://newssummaryapp-api.onrender.com/api/v1';

const GUEST_KEY = 'newssummary-guest-session';

export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(GUEST_KEY);
  } catch {
    return null;
  }
}

export function clearGuestSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GUEST_KEY);
  } catch {
    // ignore
  }
}

/**
 * Returns the existing guest session id or lazily creates one on the server.
 * Used to persist guest bookmarks before sign-in (merged into the account on login).
 */
export async function getOrCreateGuestSession(): Promise<string | null> {
  const existing = getGuestSessionId();
  if (existing) return existing;
  try {
    const res = await axios.post<ApiResponse<{ guestSessionId: string }>>(
      `${BASE_URL}/guest/sessions`,
    );
    const id = res.data.data.guestSessionId;
    if (id) localStorage.setItem(GUEST_KEY, id);
    return id;
  } catch {
    return null;
  }
}
