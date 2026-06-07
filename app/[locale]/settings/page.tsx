'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Settings, Globe2, Palette, Type, Layout, Info } from 'lucide-react';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const locale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    language,
    textSize,
    compactMode,
    setLanguage,
    setTextSize,
    setCompactMode,
  } = usePreferencesStore();

  function handleLanguageChange(newLang: string) {
    setLanguage(newLang as 'en' | 'fr' | 'rw');
    // Navigate to same path with new locale
    const segments = window.location.pathname.split('/');
    segments[1] = newLang;
    router.push(segments.join('/'));
  }

  return (
    <div className="px-4 lg:px-6 py-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-black text-foreground">{t('title')}</h1>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4 text-primary" />
            {t('appearance')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('theme')}</p>
              <p className="text-xs text-muted-foreground">Choose your color scheme</p>
            </div>
            <Select value={theme || 'system'} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">☀️ Light</SelectItem>
                <SelectItem value="dark">🌙 Dark</SelectItem>
                <SelectItem value="system">💻 System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-4 w-4 text-primary" />
            {t('language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Interface language</p>
              <p className="text-xs text-muted-foreground">Change the app display language</p>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
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

      {/* Reading preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Type className="h-4 w-4 text-primary" />
            {t('reading')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Text size */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('textSize')}</p>
              <p className="text-xs text-muted-foreground">Article reading font size</p>
            </div>
            <Select value={textSize} onValueChange={(v) => setTextSize(v as 'sm' | 'md' | 'lg')}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Compact mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t('compactMode')}</p>
              <p className="text-xs text-muted-foreground">Show more stories with less spacing</p>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-primary" />
            {t('about')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('version')}</span>
            <span className="font-medium text-foreground">1.0.0</span>
          </div>
          <Separator />
          <div className="flex gap-4 text-sm">
            <button className="text-primary hover:underline">{t('privacyPolicy')}</button>
            <button className="text-primary hover:underline">{t('termsOfService')}</button>
          </div>
          <p className="text-xs text-muted-foreground">
            Zeno News uses AI to aggregate and summarize news from multiple sources across Africa and the world.
            Available in English, French, and Kinyarwanda.
          </p>
        </CardContent>
      </Card>

      {/* Keyboard shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { key: '/', action: 'Open search' },
              { key: 'Cmd+K', action: 'Open search' },
              { key: 'Esc', action: 'Close search / dialog' },
              { key: 'D', action: 'Toggle dark mode' },
              { key: '1', action: 'Switch to English' },
              { key: '2', action: 'Switch to French' },
              { key: '3', action: 'Switch to Kinyarwanda' },
            ].map(({ key, action }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-muted-foreground">{action}</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">{key}</kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
