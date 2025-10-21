'use client'

import * as React from 'react'
import { ThemeToggle } from '@/components/theme'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  showNav?: boolean
}

export function MainLayout({ children, className, showNav = true }: MainLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors', className)}>
      {showNav && (
        <header className="
          sticky top-0 z-50
          border-b
          bg-light-bg-elevated/80 dark:bg-dark-bg-elevated/80
          backdrop-blur-xl
          border-light-border-primary dark:border-dark-border-primary
        ">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">RespondAI</h1>
            </Link>
            <ThemeToggle />
          </div>
        </header>
      )}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

