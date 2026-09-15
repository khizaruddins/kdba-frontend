import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function Trend({
  value,
  label = 'vs previous period',
  className,
}: {
  value?: number | null;
  label?: string;
  className?: string;
}) {
  if (value == null || Number.isNaN(value)) return null;
  const up = value > 0;
  const down = value < 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <p
      className={cn(
        'mt-1 inline-flex items-center gap-1 text-xs',
        up && 'text-emerald-600 dark:text-emerald-400',
        down && 'text-red-500 dark:text-red-400',
        !up && !down && 'text-muted-foreground',
        className,
      )}
    >
      {value === 0 ? null : <Icon className="size-3" />}
      {up ? '+' : ''}
      {value.toFixed(1)}% {label}
    </p>
  );
}
