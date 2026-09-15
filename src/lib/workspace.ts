import { format, parseISO } from 'date-fns';
import { LeadStatus } from '@/types';
import { badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

export const LEAD_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'LOST',
];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  CONVERTED: 'Converted',
  LOST: 'Lost',
};

export function leadStatusVariant(status: LeadStatus): BadgeVariant {
  switch (status) {
    case 'NEW':
      return 'info';
    case 'CONTACTED':
      return 'warning';
    case 'QUALIFIED':
      return 'default';
    case 'CONVERTED':
      return 'success';
    case 'LOST':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export function shortRef(id: string, prefix = '#'): string {
  return `${prefix}${id.slice(-5).toUpperCase()}`;
}

export function formatChartDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'MMM d');
  } catch {
    return isoDate;
  }
}

export function formatPeriodRange(from?: string, to?: string): string {
  if (!from || !to) return 'Last 28 days';
  try {
    const start = parseISO(from);
    const endExclusive = parseISO(to);
    const end = new Date(endExclusive.getTime() - 24 * 60 * 60 * 1000);
    const fmt = (d: Date) =>
      new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(d);
    return `${fmt(start)} – ${fmt(end)}`;
  } catch {
    return 'Last 28 days';
  }
}

export function productNumber(value: number | string | null | undefined): number {
  if (value == null || value === '') return 0;
  return typeof value === 'number' ? value : parseFloat(value) || 0;
}

export function discountPercent(
  price: number | string | null | undefined,
  compareAt: number | string | null | undefined,
): number | null {
  const current = productNumber(price);
  const listed = productNumber(compareAt);
  if (!listed || listed <= current) return null;
  return Math.round(((listed - current) / listed) * 1000) / 10;
}
