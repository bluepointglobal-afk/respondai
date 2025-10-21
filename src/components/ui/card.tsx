'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  // Base styles - theme aware
  `
    rounded-lg
    transition-all duration-200
    border
  `,
  {
    variants: {
      variant: {
        default: `
          bg-light-bg-elevated dark:bg-dark-bg-elevated
          border-light-border-primary dark:border-dark-border-primary
          shadow-light-md dark:shadow-md
          hover:shadow-light-lg dark:hover:shadow-lg
          hover:border-light-border-secondary dark:hover:border-dark-border-secondary
          hover:-translate-y-1
        `,
        stat: `
          bg-gradient-to-br from-light-bg-elevated to-light-bg-secondary
          dark:from-dark-bg-elevated dark:to-dark-bg-secondary
          border-light-border-primary dark:border-dark-border-primary
          shadow-light-lg dark:shadow-lg
          hover:shadow-light-xl dark:hover:shadow-xl
          hover:-translate-y-1
        `,
        insight: `
          bg-light-bg-elevated dark:bg-gradient-to-br dark:from-dark-bg-elevated dark:to-primary-950/10
          border-2 border-primary-200 dark:border-primary-700/30
          shadow-light-lg dark:shadow-lg dark:shadow-primary-500/10
          hover:shadow-light-xl dark:hover:shadow-glow-primary
        `,
        risk: `
          border-2
        `,
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  riskLevel?: 'low' | 'medium' | 'high'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, riskLevel, ...props }, ref) => {
    // Risk level specific styles
    let riskStyles = ''
    if (variant === 'risk' && riskLevel) {
      const riskClasses = {
        low: 'border-success-light dark:border-success-dark bg-emerald-50/50 dark:bg-emerald-950/20',
        medium: 'border-warning-light dark:border-warning-dark bg-amber-50/50 dark:bg-amber-950/20',
        high: 'border-error-light dark:border-error-dark bg-red-50/50 dark:bg-red-950/20',
      }
      riskStyles = riskClasses[riskLevel]
    }
    
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), riskStyles, className)}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 mb-4', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        'text-light-text-primary dark:text-dark-text-primary',
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm',
        'text-light-text-secondary dark:text-dark-text-secondary',
        className
      )}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 mt-4 border-t border-light-border-primary dark:border-dark-border-primary', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants }
