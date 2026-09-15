'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FieldChromeProps {
  id: string;
  label?: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

function FieldChrome({ id, label, error, helperText, required, className, children }: FieldChromeProps) {
  return (
    <div className={cn('grid w-full gap-1.5', className)}>
      {label ? (
        <Label htmlFor={id} className="text-[13px]">
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </Label>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-help`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export interface TextFieldProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  label?: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function TextField({
  id,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  containerClassName,
  required,
  ...props
}: TextFieldProps) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  return (
    <FieldChrome id={fieldId} label={label} error={error} helperText={helperText} required={required} className={containerClassName}>
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </span>
        ) : null}
        <Input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : helperText ? `${fieldId}-help` : undefined}
          required={required}
          className={cn('h-9', leftIcon && 'pl-8', rightIcon && 'pr-8', className)}
          {...props}
        />
        {rightIcon ? (
          <span className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground [&_svg]:size-4">
            {rightIcon}
          </span>
        ) : null}
      </div>
    </FieldChrome>
  );
}

export interface TextareaFieldProps extends React.ComponentProps<'textarea'> {
  label?: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
  containerClassName?: string;
}

export function TextareaField({
  id,
  label,
  error,
  helperText,
  className,
  containerClassName,
  required,
  ...props
}: TextareaFieldProps) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  return (
    <FieldChrome id={fieldId} label={label} error={error} helperText={helperText} required={required} className={containerClassName}>
      <Textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : helperText ? `${fieldId}-help` : undefined}
        required={required}
        className={className}
        {...props}
      />
    </FieldChrome>
  );
}
