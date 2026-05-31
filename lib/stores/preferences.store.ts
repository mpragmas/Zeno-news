'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '@/lib/types/api';

type Theme = 'light' | 'dark' | 'system';
type TextSize = 'sm' | 'md' | 'lg';

interface PreferencesStore {
  language: Lang;
  theme: Theme;
  favoriteTopics: string[];
  favoriteRegions: string[];
  textSize: TextSize;
  compactMode: boolean;
  setLanguage: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  setTextSize: (size: TextSize) => void;
  setCompactMode: (compact: boolean) => void;
  toggleTopic: (topic: string) => void;
  toggleRegion: (region: string) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'system',
      favoriteTopics: [],
      favoriteRegions: [],
      textSize: 'md',
      compactMode: false,

      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      setTextSize: (textSize) => set({ textSize }),
      setCompactMode: (compactMode) => set({ compactMode }),

      toggleTopic: (topic) => {
        const { favoriteTopics } = get();
        set({
          favoriteTopics: favoriteTopics.includes(topic)
            ? favoriteTopics.filter((t) => t !== topic)
            : [...favoriteTopics, topic],
        });
      },

      toggleRegion: (region) => {
        const { favoriteRegions } = get();
        set({
          favoriteRegions: favoriteRegions.includes(region)
            ? favoriteRegions.filter((r) => r !== region)
            : [...favoriteRegions, region],
        });
      },
    }),
    {
      name: 'newssummary-preferences',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        favoriteTopics: state.favoriteTopics,
        favoriteRegions: state.favoriteRegions,
        textSize: state.textSize,
        compactMode: state.compactMode,
      }),
    }
  )
);
