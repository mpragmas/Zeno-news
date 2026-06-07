'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LogIn, LogOut, User, LayoutDashboard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function initials(name: string | null, email: string): string {
  const base = name?.trim() || email;
  const parts = base.split(/[\s@.]+/).filter(Boolean);
  return (parts[0]?.[0] ?? 'U').concat(parts[1]?.[0] ?? '').toUpperCase();
}

export function AccountMenu() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const { isAuthenticated, user, hydrated, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCredential(idToken: string) {
    setLoading(true);
    try {
      const res = await signIn(idToken);
      toast.success(t('welcome', { name: res.user.name ?? res.user.email }));
      setOpen(false);
    } catch {
      toast.error(t('signInFailed'));
    } finally {
      setLoading(false);
    }
  }

  // Avoid flicker before the persisted session rehydrates.
  if (!hydrated) {
    return <div className="h-10 rounded-lg bg-muted/40 animate-pulse" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <LogIn className="h-[18px] w-[18px] text-primary" />
          {t('signIn')}
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{t('signInTitle')}</DialogTitle>
              <DialogDescription>{t('signInSubtitle')}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 py-2">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('signingIn')}
                </div>
              ) : (
                <GoogleSignInButton onCredential={handleCredential} />
              )}
              <p className="text-center text-xs text-muted-foreground">
                {t('privacyNote')}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent">
          <Avatar className="h-8 w-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name ?? ''} />}
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name ?? user.email}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {t('profile')}
          </Link>
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t('adminDashboard')}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
