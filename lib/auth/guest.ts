'use client';

import axios from 'axios';
import type { ApiResponse } from '@/lib/types/api';
import {
  clearGuestSession,
  getGuestSessionId,
  setGuestSessionId,
} from '@/lib/auth/session';

export { clearGuestSession, getGuestSessionId };

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://newssummaryapp-api.onrender.com/api/v1';

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
    if (id) setGuestSessionId(id);
    return id;
  } catch {
    return null;
  }
}
