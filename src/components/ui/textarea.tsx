import * as React from "react"
import { cn } from "cn"

export type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: React.ReactNode
  error?: string
  helperText?: React.ReactNode
}

function Textarea({
  className,
  label,
  error,
  helperText,
  id,
  ...props
}: TextareaProps) {
  const autoId = React.useId()
  const fieldId = id ?? (label ? autoId : undefined)
  const textarea = (
    <textarea
      id={fieldId}
      data-slot="textarea"
      aria-invalid={error ? true : undefined}
      aria-describedby={
        error ? `${fieldId}-error` : helperText ? `${fieldId}-help` : undefined
      }
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )

  if (!label && !error && !helperText) {
    return textarea
  }

  return (
    <div className="grid w-full gap-1.5">
      {label ? (
        <label htmlFor={fieldId} className="text-[13px] font-medium leading-none">
          {label}
        </label>
      ) : null}
      {textarea}
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${fieldId}-help`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export { Textarea }
