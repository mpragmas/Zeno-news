'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

/** Refined category-tinted gradients for the branded fallback. */
const CATEGORY_GRADIENTS: Record<string, string> = {
  politics: 'from-violet-600 to-indigo-800',
  technology: 'from-sky-600 to-blue-800',
  sports: 'from-emerald-600 to-teal-800',
  business: 'from-amber-600 to-orange-800',
  health: 'from-rose-600 to-red-800',
  entertainment: 'from-pink-600 to-fuchsia-800',
  science: 'from-cyan-600 to-sky-800',
  conflict: 'from-orange-700 to-red-900',
  general: 'from-stone-600 to-stone-800',
};

const FALLBACK_GRADIENTS = Object.values(CATEGORY_GRADIENTS);

function pickGradient(category: string | null | undefined, seed: string): string {
  const key = category?.toLowerCase();
  if (key && CATEGORY_GRADIENTS[key]) return CATEGORY_GRADIENTS[key];
  // Deterministic gradient from the seed (story id) so cards stay stable.
  const n = seed ? parseInt(seed.slice(-1), 36) : 0;
  return FALLBACK_GRADIENTS[Number.isNaN(n) ? 0 : n % FALLBACK_GRADIENTS.length];
}

interface StoryImageProps {
  src: string | null | undefined;
  alt: string;
  /** Story id — used for deterministic fallback gradient. */
  seed: string;
  category?: string | null;
  /** Primary source name — first letter shown on the placeholder. */
  source?: string | null;
  priority?: boolean;
  className?: string;
  /** Extra classes for the <img> itself (e.g. group-hover scale). */
  imgClassName?: string;
}

/**
 * Story image with graceful, on-brand fallback.
 * Renders the real image when available (and not errored); otherwise an
 * elegant category-tinted placeholder with the category word + source initial.
 */
export function StoryImage({
  src,
  alt,
  seed,
  category,
  source,
  priority,
  className,
  imgClassName,
}: StoryImageProps) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;

  if (showImage) {
    return (
      <div className={cn('relative overflow-hidden bg-muted', className)}>
        <Image
          src={src!}
          alt={alt}
          fill
          priority={priority}
          unoptimized
          onError={() => setErrored(true)}
          className={cn('object-cover', imgClassName)}
        />
      </div>
    );
  }

  const gradient = pickGradient(category, seed);
  const initial = source?.trim()?.[0]?.toUpperCase() ?? '';

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br',
        gradient,
        className,
      )}
      aria-label={alt}
    >
      {/* dotted texture */}
      <div className="absolute inset-0 placeholder-texture opacity-60" />
      {/* soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5" />

      {/* source monogram */}
      {initial && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-white/85 leading-none text-[clamp(2.5rem,6vw,4.5rem)] font-semibold drop-shadow-sm">
            {initial}
          </span>
        </div>
      )}

      {/* category eyebrow */}
      {category && (
        <span className="absolute bottom-3 left-3 eyebrow text-white/80">
          {category}
        </span>
      )}
    </div>
  );
}
