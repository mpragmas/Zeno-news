'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  Newspaper,
  Search,
  LogOut,
  Download,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import {
  AdminFilterProvider,
  RANGE_PRESETS,
  useAdminFilter,
} from './AdminFilterContext';
import { clearAdminKey, getAdminKey } from '@/lib/api/admin';
import { useAuth } from '@/lib/hooks/useAuth';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/publishers', label: 'Publishers', icon: Building2 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/stories', label: 'Stories', icon: Newspaper },
  { href: '/admin/search', label: 'Search', icon: Search },
];

interface AdminShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Lets a page register an export handler from inside the data context. The
 * top-bar Export button appears only when a handler is registered.
 */
const ExportContext = createContext<(fn: (() => void) | null) => void>(() => {});

export function useRegisterExport(fn: () => void) {
  const register = useContext(ExportContext);
  useEffect(() => {
    register(() => fn());
    return () => register(null);
  }, [register, fn]);
}

export function AdminShell(props: AdminShellProps) {
  const router = useRouter();
  const { isAdmin, hydrated } = useAuth();
  const [legacyKey, setLegacyKey] = useState(false);

  useEffect(() => {
    setLegacyKey(!!getAdminKey());
  }, []);

  // Client-side gate — the API still enforces admin access on every request.
  const authorized = isAdmin || legacyKey;
  useEffect(() => {
    if (hydrated && !authorized) {
      router.replace('/admin/login');
    }
  }, [hydrated, authorized, router]);

  if (!hydrated || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <AdminFilterProvider>
      <ShellInner {...props} />
    </AdminFilterProvider>
  );
}

function ShellInner({ title, description, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [exporter, setExporter] = useState<(() => void) | null>(null);
  const register = useCallback((fn: (() => void) | null) => setExporter(() => fn), []);
  const exportCtx = useMemo(() => register, [register]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function logout() {
    signOut();
    clearAdminKey();
    router.replace('/admin/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
          <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <BarChart3 className="h-[18px] w-[18px] text-white" />
            </div>
            <div>
              <span className="font-display text-base font-semibold leading-none text-foreground">
                Analytics
              </span>
              <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Zeno News Admin
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary" />
                  )}
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-3">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-5 py-3 backdrop-blur">
            <div className="min-w-0">
              <h1 className="font-display text-lg font-semibold text-foreground">{title}</h1>
              {description && (
                <p className="truncate text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <DateRangePicker />
              {exporter && (
                <button
                  onClick={exporter}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              )}
              <ThemeToggle />
            </div>
          </header>

          {/* Mobile nav */}
          <nav className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
            {NAV.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <main className="mx-auto max-w-7xl p-4 sm:p-6">
            <ExportContext.Provider value={exportCtx}>{children}</ExportContext.Provider>
          </main>
        </div>
      </div>
    </div>
  );
}

function DateRangePicker() {
  const { preset, setPresetKey } = useAdminFilter();
  return (
    <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
      {RANGE_PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => setPresetKey(p.key)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            preset.key === p.key
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {p.label.replace('Last ', '')}
        </button>
      ))}
    </div>
  );
}
