'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  `
    inline-flex items-center justify-center gap-2
    rounded-lg font-semibold
    transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-primary-500 focus-visible:ring-offset-2
    focus-visible:ring-offset-light-bg-primary dark:focus-visible:ring-offset-dark-bg-primary
    disabled:pointer-events-none disabled:opacity-50
    active:scale-[0.98]
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-primary-500 to-accent-purple
          text-white
          shadow-md
          hover:shadow-lg hover:shadow-primary-500/30
          hover:-translate-y-0.5
        `,
        secondary: `
          bg-transparent
          border-2 border-light-border-secondary dark:border-dark-border-secondary
          text-light-text-primary dark:text-dark-text-primary
          hover:border-primary-500
          hover:shadow-glow-primary
        `,
        ghost: `
          bg-transparent
          text-light-text-secondary dark:text-dark-text-secondary
          hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
          hover:text-light-text-primary dark:hover:text-dark-text-primary
        `,
        danger: `
          bg-error-light dark:bg-error-dark
          text-white
          shadow-md
          hover:shadow-lg hover:opacity-90
        `,
        success: `
          bg-success-light dark:bg-success-dark
          text-white
          shadow-md
          hover:shadow-lg hover:opacity-90
        `,
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
