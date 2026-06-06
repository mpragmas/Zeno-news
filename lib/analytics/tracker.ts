/**
 * Client-side analytics tracker.
 *
 * Design goals (mirrors the backend contract):
 *   • never block the UI — events are buffered and flushed in batches
 *   • survive navigation/tab-close — flush via `sendBeacon` on pagehide
 *   • privacy-first — only an anonymous, device-local id is stored; no PII
 *
 * The same anonymous id doubles as the backend "sessionId"; the server splits
 * it into time-bounded sessions, so a single stable id per device is enough.
 */

import type { AnalyticsEventType, TrackEvent } from '@/lib/types/analytics';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://newssummaryapp-api.onrender.com/api/v1';

/** Origin without the /api/v1 suffix — where the /out tracker is mounted. */
export const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, '');

const ANON_ID_KEY = 'newssummary-anon-id';
const FLUSH_INTERVAL_MS = 4000;
const MAX_QUEUE = 20;

let queue: TrackEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let listenersBound = false;

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Stable per-device anonymous id (created lazily, persisted in localStorage). */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

/** Optional bearer token, if the app ever stores one. Safe no-op otherwise. */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return (
      localStorage.getItem('newssummary-token') ||
      localStorage.getItem('auth-token') ||
      null
    );
  } catch {
    return null;
  }
}

function ensureListeners() {
  if (listenersBound || typeof window === 'undefined') return;
  listenersBound = true;
  const flushHidden = () => {
    if (document.visibilityState === 'hidden') flush();
  };
  document.addEventListener('visibilitychange', flushHidden);
  window.addEventListener('pagehide', () => flush());
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, FLUSH_INTERVAL_MS);
}

/** Send everything currently queued. Uses sendBeacon when possible. */
export function flush(): void {
  if (typeof window === 'undefined' || queue.length === 0) return;

  const events = queue;
  queue = [];
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  const url = `${API_BASE}/analytics/events`;
  const payload = JSON.stringify({ events });
  const token = getAuthToken();

  // sendBeacon can't set Authorization, so authenticated users go via fetch.
  if (!token && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    } catch {
      // fall through to fetch
    }
  }

  try {
    void fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Analytics must never throw into product code.
  }
}

/** Queue a single event. */
export function track(
  type: AnalyticsEventType,
  props: Omit<TrackEvent, 'type' | 'sessionId'> = {},
): void {
  if (typeof window === 'undefined') return;
  ensureListeners();
  queue.push({ type, sessionId: getSessionId(), ...props });
  if (queue.length >= MAX_QUEUE) flush();
  else scheduleFlush();
}

// ── Convenience helpers ────────────────────────────────────────────────────

export const trackImpression = (p: {
  clusterId?: string;
  articleId?: string;
  source?: string;
  category?: string;
  language?: string;
}) => track('STORY_IMPRESSION', p);

export const trackArticleOpen = (p: {
  clusterId?: string;
  articleId?: string;
  category?: string;
  language?: string;
}) => track('ARTICLE_OPEN', p);

export const trackSourceSwitch = (p: {
  clusterId?: string;
  articleId?: string;
  source?: string;
}) => track('SOURCE_SWITCH', p);

export const trackBookmark = (p: { clusterId?: string; category?: string }) =>
  track('BOOKMARK', p);

export const trackUnbookmark = (p: { clusterId?: string }) =>
  track('UNBOOKMARK', p);

export const trackShare = (p: { clusterId?: string; source?: string }) =>
  track('SHARE', p);

export const trackSearch = (p: {
  query: string;
  resultCount?: number;
  language?: string;
}) => track('SEARCH', p);

export const trackSessionStart = (language?: string) =>
  track('SESSION_START', { language });

/**
 * Build the outbound-tracking href for a publisher link. Navigating here records
 * the click server-side and 302-redirects to the real article.
 */
export function outboundHref(articleId: string): string {
  return `${API_ORIGIN}/out/${articleId}?s=${encodeURIComponent(getSessionId())}`;
}
