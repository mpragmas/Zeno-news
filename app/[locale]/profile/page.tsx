'use client';

import { useTranslations } from 'next-intl';
import { User, Star, MapPin, BookOpen, Globe2 } from 'lucide-react';
import { usePreferencesStore } from '@/lib/stores/preferences.store';
import { useBookmarksStore } from '@/lib/stores/bookmarks.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const TOPICS = ['Politics', 'Technology', 'Business', 'Sports', 'Health', 'Entertainment'];
const REGIONS = ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa', 'Global'];

export default function ProfilePage() {
  const t = useTranslations('profile');
  const { favoriteTopics, favoriteRegions, toggleTopic, toggleRegion } = usePreferencesStore();
  const { bookmarks } = useBookmarksStore();

  return (
    <div className="px-4 lg:px-6 py-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">Personalize your news experience</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('storiesRead'), value: bookmarks.length * 3, icon: BookOpen },
          { label: t('sourcesExplored'), value: bookmarks.length * 2, icon: Globe2 },
          { label: 'Bookmarks', value: bookmarks.length, icon: Star },
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
              const active = favoriteTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
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
          {favoriteTopics.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Selected: {favoriteTopics.join(', ')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Favorite regions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-live" />
            {t('favoriteRegions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((region) => {
              const active = favoriteRegions.includes(region);
              return (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
          {favoriteRegions.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Selected: {favoriteRegions.join(', ')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Bookmarks summary */}
      {bookmarks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('readingHistory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bookmarks.slice(0, 5).map((story) => (
                <div key={story.id} className="flex items-start gap-3">
                  {story.category && (
                    <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">
                      {story.category}
                    </Badge>
                  )}
                  <p className="text-sm text-foreground line-clamp-1">{story.canonicalTitle}</p>
                </div>
              ))}
              {bookmarks.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{bookmarks.length - 5} more bookmarked stories
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
