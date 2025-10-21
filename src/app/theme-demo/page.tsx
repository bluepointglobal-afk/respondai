'use client'

import { ThemeToggle } from '@/components/theme/theme-toggle'
import { ThemeShowcase } from '@/components/features/theme-showcase'
import { Button } from '@/components/ui'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Header */}
      <header className="border-b border-light-border-primary dark:border-dark-border-primary bg-light-bg-elevated dark:bg-dark-bg-elevated">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Theme Demo</h1>
                <p className="text-xs text-secondary">Interactive theme showcase</p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold mb-3 text-primary">
              Dual Theme System
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Experience seamless theme switching with Light, Dark, and System preferences.
              All components automatically adapt to your chosen theme.
            </p>
          </div>

          <ThemeShowcase />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-light-border-primary dark:border-dark-border-primary bg-light-bg-elevated dark:bg-dark-bg-elevated mt-20">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-secondary">
            Built with Next.js 14, next-themes, and Framer Motion
          </p>
        </div>
      </footer>
    </div>
  )
}

