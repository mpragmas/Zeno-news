/** Auth/guest session reads safe for both server and client bundles. */

const AUTH_KEY = 'newssummary-auth';
const GUEST_KEY = 'newssummary-guest-session';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(GUEST_KEY);
  } catch {
    return null;
  }
}

export function setGuestSessionId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_KEY, id);
  } catch {
    // ignore
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
