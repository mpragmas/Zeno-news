'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Story, BookmarkedStory, BookmarkFolder } from '@/lib/types/story';

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
      },

      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
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

      clearAll: () => set({ bookmarks: [], folders: [] }),
    }),
    {
      name: 'newssummary-bookmarks',
    }
  )
);
