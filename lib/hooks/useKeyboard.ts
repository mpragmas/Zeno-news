'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/lib/stores/ui.store';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { useTheme } from 'next-themes';

export function useKeyboardShortcuts() {
  const { openSearch, closeSearch, searchOpen } = useUIStore();
  const { setLanguage } = usePreferencesStore();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // CMD+K or Ctrl+K or /  → open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
        return;
      }

      if (!isInput) {
        // / → open search
        if (e.key === '/') {
          e.preventDefault();
          openSearch();
          return;
        }

        // Esc → close search
        if (e.key === 'Escape') {
          closeSearch();
          return;
        }

        // D → toggle dark mode
        if (e.key === 'd' || e.key === 'D') {
          setTheme(theme === 'dark' ? 'light' : 'dark');
          return;
        }

        // 1 → English, 2 → French, 3 → Kinyarwanda
        if (e.key === '1') { setLanguage('en'); return; }
        if (e.key === '2') { setLanguage('fr'); return; }
        if (e.key === '3') { setLanguage('rw'); return; }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, closeSearch, searchOpen, setLanguage, setTheme, theme]);
}

export function useEscapeKey(callback: () => void) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') callback();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
}
