'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          relative h-10 w-10 rounded-lg
          bg-light-bg-tertiary dark:bg-dark-bg-tertiary
          border border-light-border-primary dark:border-dark-border-primary
          hover:border-primary-500
          transition-all duration-200
          flex items-center justify-center
          group
        "
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {theme === 'light' && (
          <Sun className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary group-hover:text-primary-500 transition-colors" />
        )}
        {theme === 'dark' && (
          <Moon className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary group-hover:text-primary-500 transition-colors" />
        )}
        {theme === 'system' && (
          <Monitor className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary group-hover:text-primary-500 transition-colors" />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="
                absolute right-0 top-12 z-50
                w-48 rounded-lg
                bg-light-bg-elevated dark:bg-dark-bg-elevated
                border border-light-border-primary dark:border-dark-border-primary
                shadow-xl dark:shadow-2xl
                overflow-hidden
              "
              role="menu"
              aria-orientation="vertical"
            >
              {themes.map((themeOption) => {
                const Icon = themeOption.icon
                const isActive = theme === themeOption.value
                
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full px-4 py-3 flex items-center gap-3
                      text-left text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                      }
                    `}
                    role="menuitem"
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{themeOption.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-theme"
                        className="ml-auto h-2 w-2 rounded-full bg-primary-500"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
