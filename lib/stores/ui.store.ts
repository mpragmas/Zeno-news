import { create } from 'zustand';

type LayoutMode = 'comfortable' | 'compact';

interface UIStore {
  sidebarOpen: boolean;
  layoutMode: LayoutMode;
  searchOpen: boolean;
  mobileNavOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  layoutMode: 'comfortable',
  searchOpen: false,
  mobileNavOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setLayoutMode: (mode) => set({ layoutMode: mode }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}));
