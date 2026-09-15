import * as React from "react"
import { cn } from "cn"

export type InputProps = React.ComponentProps<"input"> & {
  label?: React.ReactNode
  error?: string
  helperText?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Input({
  className,
  type,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  ...props
}: InputProps) {
  const autoId = React.useId()
  const inputId = id ?? (label ? autoId : undefined)
  const input = (
    <input
      type={type}
      id={inputId}
      data-slot="input"
      aria-invalid={error ? true : undefined}
      aria-describedby={
        error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined
      }
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        leftIcon && "pl-8",
        rightIcon && "pr-8",
        className
      )}
      {...props}
    />
  )

  if (!label && !error && !helperText && !leftIcon && !rightIcon) {
    return input
  }

  return (
    <div className="grid w-full gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-[13px] font-medium leading-none">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </span>
        ) : null}
        {input}
        {rightIcon ? (
          <span className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground [&_svg]:size-4">
            {rightIcon}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-help`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export { Input }
