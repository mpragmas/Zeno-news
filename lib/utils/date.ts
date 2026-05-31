import { formatDistanceToNow, format, parseISO, differenceInMinutes } from 'date-fns';
import { enUS, fr, type Locale } from 'date-fns/locale';
import type { Lang } from '@/lib/types/api';

const localeMap: Record<Lang, Locale> = {
  en: enUS,
  fr: fr,
  rw: enUS, // fallback to en for Kinyarwanda
};

export function getRelativeTime(dateString: string, lang: Lang = 'en'): string {
  try {
    const date = parseISO(dateString);
    const locale = localeMap[lang];
    const minutesAgo = differenceInMinutes(new Date(), date);

    if (minutesAgo < 1) {
      return lang === 'fr' ? "À l'instant" : lang === 'rw' ? 'Nonaha' : 'Just now';
    }

    return formatDistanceToNow(date, { addSuffix: true, locale });
  } catch {
    return dateString;
  }
}

export function formatDate(dateString: string, lang: Lang = 'en', formatStr = 'PPP'): string {
  try {
    const date = parseISO(dateString);
    const locale = localeMap[lang];
    return format(date, formatStr, { locale });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function isRecent(dateString: string, hoursThreshold = 2): boolean {
  try {
    const date = parseISO(dateString);
    const minutesAgo = differenceInMinutes(new Date(), date);
    return minutesAgo <= hoursThreshold * 60;
  } catch {
    return false;
  }
}
