'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { track, trackSessionStart, flush } from '@/lib/analytics/tracker';

/**
 * Fires a session-start event on first load and a lightweight heartbeat while
 * the tab is visible. The heartbeat keeps the "live users" gauge and average
 * session-time metric accurate without any per-interaction cost.
 */
const HEARTBEAT_MS = 60_000;

export function AnalyticsBoot() {
  const locale = useLocale();
  const started = useRef(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startedAt.current = Date.now();
    trackSessionStart(locale);

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        return;
      }
      track('SESSION_HEARTBEAT', {
        durationMs: Date.now() - startedAt.current,
        language: locale,
      });
    }, HEARTBEAT_MS);

    const onHide = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        track('SESSION_HEARTBEAT', {
          durationMs: Date.now() - startedAt.current,
          language: locale,
        });
        flush();
      }
    };
    document.addEventListener('visibilitychange', onHide);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onHide);
    };
    // locale intentionally read once at boot; language changes don't restart the session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
