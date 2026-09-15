'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MAX_WIDTH: Record<NonNullable<SimpleDialogProps['maxWidth']>, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '4xl': 'sm:max-w-4xl',
  full: 'sm:max-w-[min(96vw,1400px)]',
};

export interface SimpleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  className?: string;
  /** Removes the default body padding so custom layouts can own the content area. */
  bare?: boolean;
}

/**
 * Controlled dialog with a compact API for CRUD forms and previews.
 * Built on the shadcn/Radix Dialog so focus trapping, escape handling and
 * scroll locking come for free.
 */
export function SimpleDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'lg',
  className,
  bare = false,
}: SimpleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn(MAX_WIDTH[maxWidth], bare && 'gap-0 p-0', className)}>
        {title || description ? (
          <DialogHeader className={cn(bare && 'p-4 pb-0')}>
            {title ? <DialogTitle>{title}</DialogTitle> : <DialogTitle className="sr-only">Dialog</DialogTitle>}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        ) : (
          <DialogTitle className="sr-only">Dialog</DialogTitle>
        )}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
