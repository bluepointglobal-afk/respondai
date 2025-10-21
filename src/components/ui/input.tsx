'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: React.ReactNode
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-light-text-primary dark:text-dark-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              `
                flex h-12 w-full rounded-lg
                bg-light-bg-tertiary dark:bg-dark-bg-tertiary
                border border-light-border-primary dark:border-dark-border-primary
                px-4 py-2 text-base
                text-light-text-primary dark:text-dark-text-primary
                placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary
                transition-all duration-200
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-primary-500
                focus-visible:border-primary-500
                disabled:cursor-not-allowed disabled:opacity-50
              `,
              icon && 'pl-10',
              error && 'border-error-light dark:border-error-dark focus-visible:ring-error-light dark:focus-visible:ring-error-dark',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error-light dark:text-error-dark">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
