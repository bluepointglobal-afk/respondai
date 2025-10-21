'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, side = 'top', className }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const sideStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  }

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm rounded-lg whitespace-nowrap',
            'bg-light-text-primary dark:bg-dark-text-primary',
            'text-light-bg-primary dark:text-dark-bg-primary',
            'shadow-lg border border-light-border-secondary dark:border-dark-border-secondary',
            'animate-fade-in',
            sideStyles[side],
            className
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              'absolute w-0 h-0',
              'border-4',
              'border-light-text-primary dark:border-dark-text-primary',
              arrowStyles[side]
            )}
          />
        </div>
      )}
    </div>
  )
}
Tooltip.displayName = 'Tooltip'

export { Tooltip }

