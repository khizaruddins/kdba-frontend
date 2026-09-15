'use client';

import * as React from 'react';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';

export const CONTACT_FORM_VARIANTS = [
  'stacked',
  'compact',
  'inline',
  'two-column',
  'card',
  'minimal',
  'bordered',
  'pill',
] as const;

export type ContactFormVariant = (typeof CONTACT_FORM_VARIANTS)[number];

export type ContactFormFieldId = 'name' | 'email' | 'phone' | 'message';

const FIELD_META: Record<ContactFormFieldId, { label: string; type: string; autoComplete: string; required: boolean }> = {
  name: { label: 'Name', type: 'text', autoComplete: 'name', required: true },
  email: { label: 'Email', type: 'email', autoComplete: 'email', required: true },
  phone: { label: 'Phone', type: 'tel', autoComplete: 'tel', required: false },
  message: { label: 'Message', type: 'textarea', autoComplete: 'off', required: true },
};

export interface ContactFormPrimitiveProps {
  variant?: string;
  headline?: string;
  description?: string;
  fields?: string[];
  submitLabel?: string;
  successMessage?: string;
  isEditing?: boolean;
  tenantSlug?: string | null;
  className?: string;
}

function resolveFields(raw: unknown): ContactFormFieldId[] {
  const allowed: ContactFormFieldId[] = ['name', 'email', 'phone', 'message'];
  if (!Array.isArray(raw) || raw.length === 0) return allowed;
  const next = raw.filter((item): item is ContactFormFieldId => allowed.includes(item as ContactFormFieldId));
  return next.length > 0 ? next : allowed;
}

function resolveVariant(raw: unknown): ContactFormVariant {
  return CONTACT_FORM_VARIANTS.includes(raw as ContactFormVariant) ? (raw as ContactFormVariant) : 'stacked';
}

export function ContactFormPrimitive({
  variant,
  headline,
  description,
  fields,
  submitLabel = 'Send message',
  successMessage = 'Thanks — we received your message and will reply shortly.',
  isEditing = false,
  tenantSlug,
  className,
}: ContactFormPrimitiveProps) {
  const layout = resolveVariant(variant);
  const visibleFields = resolveFields(fields);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const setField = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isEditing) return;
    if (!values.name || !values.email) {
      setError('Name and email are required.');
      setStatus('error');
      return;
    }
    if (!tenantSlug) {
      setError('This form is not connected to a published website yet.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setError(null);
    try {
      await apiClient.post(`/public/sites/${tenantSlug}/leads`, {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        message: values.message || undefined,
      });
      setStatus('success');
      setValues({});
    } catch {
      setStatus('error');
      setError('Could not send your message. Please try again.');
    }
  };

  const fieldClass =
    'w-full rounded-[var(--kdba-radius,0.75rem)] border border-[var(--kdba-border,#334155)] bg-[var(--kdba-surface,#0f172a)] px-3 py-2.5 text-sm text-[var(--kdba-text,#f8fafc)] placeholder:text-[var(--kdba-muted,#94a3b8)] outline-none focus:border-[var(--kdba-primary,#6366f1)]';

  const renderField = (id: ContactFormFieldId) => {
    const meta = FIELD_META[id];
    const value = values[id] ?? '';
    if (meta.type === 'textarea') {
      return (
        <label key={id} className="grid gap-1.5 text-left">
          <span className="text-xs font-medium text-[var(--kdba-muted,#94a3b8)]">{meta.label}</span>
          <textarea
            name={id}
            rows={layout === 'compact' ? 3 : 4}
            required={meta.required}
            disabled={isEditing}
            value={value}
            onChange={(e) => setField(id, e.target.value)}
            className={cn(fieldClass, 'resize-none')}
          />
        </label>
      );
    }
    return (
      <label key={id} className="grid gap-1.5 text-left">
        <span className="text-xs font-medium text-[var(--kdba-muted,#94a3b8)]">{meta.label}</span>
        <input
          name={id}
          type={meta.type}
          autoComplete={meta.autoComplete}
          required={meta.required}
          disabled={isEditing}
          value={value}
          onChange={(e) => setField(id, e.target.value)}
          className={cn(fieldClass, layout === 'pill' && 'rounded-full px-4')}
        />
      </label>
    );
  };

  const fieldsWithoutMessage = visibleFields.filter((id) => id !== 'message');
  const messageField = visibleFields.find((id) => id === 'message');

  const formInner = (
    <>
      {headline ? (
        <h3 className="text-lg font-semibold text-[var(--kdba-text,#f8fafc)]">{headline}</h3>
      ) : null}
      {description ? (
        <p className="text-sm text-[var(--kdba-muted,#94a3b8)]">{description}</p>
      ) : null}
      {status === 'success' ? (
        <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {successMessage}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-rose-400">
          {error}
        </p>
      ) : null}
      {layout === 'inline' ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {fieldsWithoutMessage.map(renderField)}
          <button
            type="submit"
            disabled={isEditing || status === 'submitting'}
            className="h-10 shrink-0 rounded-[var(--kdba-button-radius,var(--kdba-radius,0.75rem))] bg-[var(--kdba-button-bg,var(--kdba-primary,#6366f1))] px-4 text-sm font-semibold text-[var(--kdba-button-fg,#fff)] disabled:opacity-60"
          >
            {status === 'submitting' ? 'Sending…' : submitLabel}
          </button>
        </div>
      ) : layout === 'two-column' ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">{fieldsWithoutMessage.map(renderField)}</div>
          {messageField ? renderField(messageField) : null}
        </>
      ) : (
        <div className={cn('grid gap-3', layout === 'compact' && 'gap-2')}>{visibleFields.map(renderField)}</div>
      )}
      {layout !== 'inline' ? (
        <button
          type="submit"
          disabled={isEditing || status === 'submitting'}
          className={cn(
            'mt-1 font-semibold text-[var(--kdba-button-fg,#fff)] bg-[var(--kdba-button-bg,var(--kdba-primary,#6366f1))] disabled:opacity-60',
            layout === 'pill' ? 'rounded-full px-6 py-2.5 text-sm' : 'w-full rounded-[var(--kdba-button-radius,var(--kdba-radius,0.75rem))] py-2.5 text-sm',
            layout === 'minimal' && 'w-auto px-5',
          )}
        >
          {status === 'submitting' ? 'Sending…' : submitLabel}
        </button>
      ) : null}
    </>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate={isEditing}
      className={cn(
        'grid gap-3 text-left',
        layout === 'card' && 'rounded-2xl border border-[var(--kdba-border,#334155)] bg-[var(--kdba-surface,#0f172a)] p-6 shadow-sm',
        layout === 'bordered' && 'rounded-2xl border border-[var(--kdba-border,#334155)] p-6',
        layout === 'minimal' && 'gap-2',
        layout === 'stacked' && 'p-1',
        className,
      )}
    >
      {formInner}
    </form>
  );
}
