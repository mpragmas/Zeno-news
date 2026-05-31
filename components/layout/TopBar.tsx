'use client';

import { Menu, Search } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui.store';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

interface TopBarProps {
  showMenuButton?: boolean;
}

export function TopBar({ showMenuButton = false }: TopBarProps) {
  const { openSearch, toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/85 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search bar */}
      <button
        onClick={openSearch}
        className="flex h-10 max-w-md flex-1 cursor-pointer items-center gap-2.5 rounded-full border border-input bg-secondary/60 px-4 text-sm text-muted-foreground transition-colors hover:border-foreground/15 hover:bg-secondary"
        aria-label="Search"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search news, topics, sources…</span>
        <div className="hidden shrink-0 items-center gap-1 sm:flex">
          <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">⌘</kbd>
          <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">K</kbd>
        </div>
      </button>

      <div className="flex items-center gap-1 shrink-0">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
