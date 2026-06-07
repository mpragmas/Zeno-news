'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { SearchDialog } from '@/components/search/SearchDialog';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboard';

interface AppShellProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export function AppShell({ children, showRightSidebar = true }: AppShellProps) {
  useKeyboardShortcuts();
  const pathname = usePathname();
  const isStoryPage = /\/story\/[^/]+$/.test(pathname);
  const rightSidebar = showRightSidebar && !isStoryPage;

  return (
    <div className="min-h-screen bg-background">
      {/* Search dialog — global, rendered at root */}
      <SearchDialog />

      {/* Desktop layout: 3 columns */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Left sidebar */}
        <div className="shrink-0">
          <Sidebar />
        </div>

        {/* Center: main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Right sidebar */}
        {rightSidebar && (
          <div className="shrink-0 border-l border-border">
            <RightSidebar />
          </div>
        )}
      </div>

      {/* Tablet layout: 2 columns */}
      <div className="hidden md:flex lg:hidden h-screen overflow-hidden">
        {/* Left sidebar — collapsed */}
        <div className="shrink-0">
          <Sidebar />
        </div>

        {/* Center: main content */}
        <main className="flex-1 overflow-y-auto">
          <TopBar showMenuButton />
          {children}
        </main>
      </div>

      {/* Mobile layout: 1 column + bottom nav */}
      <div className="md:hidden flex flex-col min-h-screen">
        <TopBar showMenuButton />
        <main className="flex-1 pb-16">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
