import { cn } from '@/lib/utils/cn';

interface LiveBadgeProps {
  className?: string;
  label?: string;
}

export function LiveBadge({ className, label = 'LIVE' }: LiveBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-live',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-live" />
      {label}
    </div>
  );
}
