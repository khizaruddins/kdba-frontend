import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Trend } from './trend';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  trend?: number | null;
  trendLabel?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  loading,
  className,
  trend,
  trendLabel,
}: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon ? <span className="text-muted-foreground [&_svg]:size-4">{icon}</span> : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            {trend != null ? <Trend value={trend} label={trendLabel} /> : null}
            {description ? (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
