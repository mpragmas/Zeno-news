'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Star,
  BookOpen,
  Bookmark as BookmarkIcon,
  Loader2,
  LogOut,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  getMe,
  getSavedArticles,
  getReadingHistory,
  updateMe,
} from '@/lib/api/auth';
import type { UpdateProfileInput, UserProfile } from '@/lib/types/auth';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TOPICS = ['Politics', 'Technology', 'Business', 'Sports', 'Health', 'Entertainment'];

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tAuth = useTranslations('auth');
  const { isAuthenticated, hydrated, signIn, signOut } = useAuth();

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignedOut signIn={signIn} t={tAuth} />;
  }

  return <SignedInProfile t={t} signOut={signOut} />;
}

function SignedOut({
  signIn,
  t,
}: {
  signIn: (idToken: string) => Promise<unknown>;
  t: ReturnType<typeof useTranslations>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCredential(idToken: string) {
    setLoading(true);
    try {
      await signIn(idToken);
      toast.success(t('signedIn'));
    } catch {
      toast.error(t('signInFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t('signInTitle')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('signInSubtitle')}</p>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('signingIn')}
            </div>
          ) : (
            <GoogleSignInButton onCredential={handleCredential} />
          )}
          <p className="text-xs text-muted-foreground">{t('privacyNote')}</p>
          <Link
            href="/admin/login"
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {t('adminSignIn')}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function SignedInProfile({
  t,
  signOut,
}: {
  t: ReturnType<typeof useTranslations>;
  signOut: () => void;
}) {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });
  const { data: saved } = useQuery({
    queryKey: ['me', 'saved'],
    queryFn: () => getSavedArticles(),
  });
  const { data: history } = useQuery({
    queryKey: ['me', 'history'],
    queryFn: () => getReadingHistory(),
  });

  const [name, setName] = useState('');
  useEffect(() => {
    if (profile) setName(profile.name ?? '');
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateMe(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(['me'], updated);
      setUser({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        avatarUrl: updated.avatarUrl,
        preferredAppLanguage: updated.preferredAppLanguage,
        preferredNewsLanguage: updated.preferredNewsLanguage,
      });
    },
    onError: () => toast.error(t('updateFailed')),
  });

  function save(input: UpdateProfileInput, successMsg?: string) {
    mutation.mutate(input, {
      onSuccess: () => successMsg && toast.success(successMsg),
    });
  }

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const topics = profile.favoriteTopics ?? [];
  const nameChanged = name.trim() !== (profile.name ?? '').trim();

  function toggleTopic(topic: string) {
    const next = topics.includes(topic)
      ? topics.filter((x) => x !== topic)
      : [...topics, topic];
    save({ favoriteTopics: next });
  }

  return (
    <div className="px-4 lg:px-6 py-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name ?? ''} />}
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
            {(profile.name ?? profile.email).slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl font-black text-foreground">
              {profile.name ?? profile.email}
            </h1>
            {profile.role === 'admin' && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Admin
              </span>
            )}
          </div>
          <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          {t('signOut')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('storiesRead'), value: history?.length ?? 0, icon: BookOpen },
          { label: t('saved'), value: saved?.length ?? 0, icon: BookmarkIcon },
          { label: t('favoriteTopics'), value: topics.length, icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6 text-center">
              <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-black text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Account details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('accountDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">{t('displayName')}</span>
            <div className="flex gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('displayName')} />
              <Button
                onClick={() => save({ name: name.trim() }, t('saved'))}
                disabled={!nameChanged || mutation.isPending}
                className="shrink-0 gap-1.5"
              >
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {t('save')}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('newsLanguage')}</p>
              <p className="text-xs text-muted-foreground">{t('newsLanguageHint')}</p>
            </div>
            <Select
              value={profile.preferredNewsLanguage}
              onValueChange={(v) => save({ preferredNewsLanguage: v as 'en' | 'fr' | 'rw' }, t('saved'))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="rw">🇷🇼 Kinyarwanda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Favorite topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="h-4 w-4 text-trending" />
            {t('favoriteTopics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => {
              const active = topics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  disabled={mutation.isPending}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors disabled:opacity-60 ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('notifications')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('dailyDigest')}</p>
              <p className="text-xs text-muted-foreground">{t('dailyDigestHint')}</p>
            </div>
            <Switch
              checked={profile.notificationPreferences.dailyDigest}
              onCheckedChange={(v) => save({ dailyDigest: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('breakingNews')}</p>
              <p className="text-xs text-muted-foreground">{t('breakingNewsHint')}</p>
            </div>
            <Switch
              checked={profile.notificationPreferences.breakingNews}
              onCheckedChange={(v) => save({ breakingNews: v })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
