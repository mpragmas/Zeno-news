'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Story, BookmarkedStory, BookmarkFolder } from '@/lib/types/story';
import { getAuthToken } from '@/lib/stores/auth.store';
import { saveArticle, unsaveArticle } from '@/lib/api/auth';

/**
 * Bookmarks are kept locally (full Story objects power the cards) and mirrored
 * to the backend when signed in. The backend is article-scoped, so we sync via
 * each story's `leadArticleId`. Network errors are swallowed — the local store
 * stays the source of truth for the UI.
 */
function pushSave(story: Pick<Story, 'leadArticleId'>) {
  if (!getAuthToken() || !story.leadArticleId) return;
  void saveArticle(story.leadArticleId).catch(() => undefined);
}

function pushUnsave(leadArticleId: string | null | undefined) {
  if (!getAuthToken() || !leadArticleId) return;
  void unsaveArticle(leadArticleId).catch(() => undefined);
}

interface BookmarksStore {
  bookmarks: BookmarkedStory[];
  folders: BookmarkFolder[];
  addBookmark: (story: Story, folderId?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  addFolder: (name: string) => void;
  removeFolder: (id: string) => void;
  moveToFolder: (storyId: string, folderId: string) => void;
  clearAll: () => void;
  /** Upload all locally-saved bookmarks to the account (called after sign-in). */
  syncToBackend: () => Promise<void>;
}

export const useBookmarksStore = create<BookmarksStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      folders: [],

      addBookmark: (story, folderId) => {
        const { bookmarks } = get();
        if (bookmarks.some((b) => b.id === story.id)) return;

        const bookmarked: BookmarkedStory = {
          ...story,
          bookmarkedAt: new Date().toISOString(),
          folderId,
        };
        set({ bookmarks: [bookmarked, ...bookmarks] });
        pushSave(story);
      },

      removeBookmark: (id) => {
        const target = get().bookmarks.find((b) => b.id === id);
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
        pushUnsave(target?.leadArticleId);
      },

      isBookmarked: (id) => {
        return get().bookmarks.some((b) => b.id === id);
      },

      addFolder: (name) => {
        const folder: BookmarkFolder = {
          id: `folder-${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
          count: 0,
        };
        set((state) => ({ folders: [...state.folders, folder] }));
      },

      removeFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          bookmarks: state.bookmarks.map((b) =>
            b.folderId === id ? { ...b, folderId: undefined } : b
          ),
        }));
      },

      moveToFolder: (storyId, folderId) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === storyId ? { ...b, folderId } : b
          ),
        }));
      },

      clearAll: () => {
        const { bookmarks } = get();
        set({ bookmarks: [], folders: [] });
        bookmarks.forEach((b) => pushUnsave(b.leadArticleId));
      },

      syncToBackend: async () => {
        if (!getAuthToken()) return;
        const { bookmarks } = get();
        await Promise.all(
          bookmarks
            .filter((b) => b.leadArticleId)
            .map((b) => saveArticle(b.leadArticleId as string).catch(() => undefined)),
        );
      },
    }),
    {
      name: 'newssummary-bookmarks',
    }
  )
);
