'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StoryCard } from './StoryCard';
import type { Story } from '@/lib/types/story';
import { cn } from '@/lib/utils/cn';

type LayoutMode = 'grid' | 'list';

interface StoryGridProps {
  stories: Story[];
  className?: string;
}

export function StoryGrid({ stories, className }: StoryGridProps) {
  const [layout, setLayout] = useState<LayoutMode>('grid');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Layout switcher */}
      <div className="flex justify-end gap-1">
        <Button
          variant={layout === 'grid' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => setLayout('grid')}
          className="h-8 w-8"
          aria-label="Grid layout"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={layout === 'list' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => setLayout('list')}
          className="h-8 w-8"
          aria-label="List layout"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} className="flex" />
          ))}
        </div>
      )}
    </div>
  );
}
