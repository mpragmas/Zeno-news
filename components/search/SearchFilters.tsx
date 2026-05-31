'use client';

import { useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORIES = [
  { value: 'politics', label: 'Politics' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'sports', label: 'Sports' },
  { value: 'health', label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
];

const REGIONS = [
  { value: 'East Africa', label: 'East Africa' },
  { value: 'West Africa', label: 'West Africa' },
  { value: 'North Africa', label: 'North Africa' },
  { value: 'Central Africa', label: 'Central Africa' },
  { value: 'Southern Africa', label: 'Southern Africa' },
  { value: 'Global', label: 'Global' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'rw', label: 'Kinyarwanda' },
];

interface SearchFiltersProps {
  category: string;
  region: string;
  lang: string;
  onCategoryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onLangChange: (value: string) => void;
  onClear: () => void;
}

export function SearchFilters({
  category,
  region,
  lang,
  onCategoryChange,
  onRegionChange,
  onLangChange,
  onClear,
}: SearchFiltersProps) {
  const t = useTranslations('search');
  const hasFilters = !!(category || region || lang);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>{t('filters')}</span>
      </div>

      <Select value={lang || 'all-lang'} onValueChange={(v) => onLangChange(v === 'all-lang' ? '' : v)}>
        <SelectTrigger className="h-8 w-36 text-sm">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-lang">All languages</SelectItem>
          {LANGUAGES.map((l) => (
            <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={category || 'all-cat'} onValueChange={(v) => onCategoryChange(v === 'all-cat' ? '' : v)}>
        <SelectTrigger className="h-8 w-36 text-sm">
          <SelectValue placeholder={t('category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-cat">All categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={region || 'all-region'} onValueChange={(v) => onRegionChange(v === 'all-region' ? '' : v)}>
        <SelectTrigger className="h-8 w-36 text-sm">
          <SelectValue placeholder={t('region')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-region">All regions</SelectItem>
          {REGIONS.map((r) => (
            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-8 gap-1 text-xs">
          <X className="h-3.5 w-3.5" />
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );
}
