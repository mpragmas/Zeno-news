'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { STORIES_QUERY_KEY } from './useStories';
import toast from 'react-hot-toast';

interface LiveUpdateState {
  isConnected: boolean;
  hasNewStories: boolean;
  newCount: number;
}

export function useLiveUpdates() {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const [state, setState] = useState<LiveUpdateState>({
    isConnected: false,
    hasNewStories: false,
    newCount: 0,
  });

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      try {
        const es = new EventSource('/api/stream');
        eventSourceRef.current = es;

        es.onopen = () => {
          setState((prev) => ({ ...prev, isConnected: true }));
        };

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data as string) as { type: string; count?: number };
            if (data.type === 'new_stories' && data.count && data.count > 0) {
              setState((prev) => ({
                ...prev,
                hasNewStories: true,
                newCount: prev.newCount + data.count!,
              }));
              toast(
                `${data.count} new ${data.count === 1 ? 'story' : 'stories'} available`,
                {
                  icon: '🔔',
                  duration: 5000,
                  id: 'new-stories',
                }
              );
            }
          } catch {
            // ignore parse errors
          }
        };

        es.onerror = () => {
          setState((prev) => ({ ...prev, isConnected: false }));
          es.close();
          reconnectTimer = setTimeout(connect, 30000);
        };
      } catch {
        reconnectTimer = setTimeout(connect, 30000);
      }
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      eventSourceRef.current?.close();
    };
  }, []);

  function refreshFeed() {
    setState((prev) => ({ ...prev, hasNewStories: false, newCount: 0 }));
    queryClient.invalidateQueries({ queryKey: [STORIES_QUERY_KEY] });
  }

  return { ...state, refreshFeed };
}
