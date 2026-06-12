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
  { value: 'politics', key: 'catPolitics' },
  { value: 'technology', key: 'catTechnology' },
  { value: 'business', key: 'catBusiness' },
  { value: 'sports', key: 'catSports' },
  { value: 'health', key: 'catHealth' },
  { value: 'entertainment', key: 'catEntertainment' },
];

// Region is simplified to the three audiences Zeno serves. Each maps to a
// different backend geo column (resolved by the explore page).
const REGIONS = [
  { value: 'africa', key: 'regionAfrica' },
  { value: 'rwanda', key: 'regionRwanda' },
  { value: 'global', key: 'regionGlobal' },
];

interface SearchFiltersProps {
  category: string;
  region: string;
  onCategoryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onClear: () => void;
}

export function SearchFilters({
  category,
  region,
  onCategoryChange,
  onRegionChange,
  onClear,
}: SearchFiltersProps) {
  const t = useTranslations('search');
  const hasFilters = !!(category || region);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>{t('filters')}</span>
      </div>

      <Select
        value={region || 'all-region'}
        onValueChange={(v) => onRegionChange(v === 'all-region' ? '' : v)}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t('region')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-region">{t('allRegions')}</SelectItem>
          {REGIONS.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {t(r.key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={category || 'all-cat'}
        onValueChange={(v) => onCategoryChange(v === 'all-cat' ? '' : v)}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t('category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-cat">{t('allCategories')}</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {t(c.key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-9 gap-1 text-xs">
          <X className="h-3.5 w-3.5" />
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );
}
