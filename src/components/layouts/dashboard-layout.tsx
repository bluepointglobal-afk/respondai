'use client'

import { Search, User, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors">
      {/* Header */}
      <header className="
        sticky top-0 z-50
        h-16 border-b
        bg-light-bg-elevated/80 dark:bg-dark-bg-elevated/80
        backdrop-blur-xl
        border-light-border-primary dark:border-dark-border-primary
      ">
        <div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="
              h-10 w-10 rounded-lg
              bg-gradient-to-br from-primary-500 to-accent-purple
              flex items-center justify-center
              group-hover:scale-105 transition-transform
            ">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="
              font-bold text-xl
              text-light-text-primary dark:text-dark-text-primary
              hidden sm:block
            ">
              RespondAI
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <button className="
              w-full h-10 px-4 rounded-lg
              bg-light-bg-tertiary dark:bg-dark-bg-tertiary
              border border-light-border-primary dark:border-dark-border-primary
              text-left text-sm
              text-light-text-tertiary dark:text-dark-text-tertiary
              hover:border-primary-500
              transition-all duration-200
              flex items-center justify-between
            ">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Search...</span>
              </div>
              <kbd className="
                px-2 py-0.5 rounded
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                border border-light-border-primary dark:border-dark-border-primary
                text-xs font-mono
              ">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile */}
            <button className="
              h-10 w-10 rounded-lg
              bg-gradient-to-br from-primary-500 to-accent-purple
              flex items-center justify-center
              hover:scale-105 transition-transform
            ">
              <User className="h-5 w-5 text-white" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                md:hidden h-10 w-10 rounded-lg
                bg-light-bg-tertiary dark:bg-dark-bg-tertiary
                border border-light-border-primary dark:border-dark-border-primary
                flex items-center justify-center
                hover:border-primary-500
                transition-colors
              "
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="
              md:hidden border-b
              bg-light-bg-elevated dark:bg-dark-bg-elevated
              border-light-border-primary dark:border-dark-border-primary
            "
          >
            <div className="container mx-auto px-4 py-4">
              <button className="
                w-full h-10 px-4 rounded-lg
                bg-light-bg-tertiary dark:bg-dark-bg-tertiary
                border border-light-border-primary dark:border-dark-border-primary
                text-left text-sm
                text-light-text-tertiary dark:text-dark-text-tertiary
                flex items-center gap-2
              ">
                <Search className="h-4 w-4" />
                <span>Search...</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

