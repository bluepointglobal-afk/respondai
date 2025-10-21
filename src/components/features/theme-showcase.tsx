'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/components/ui'
import { Sun, Moon, Monitor, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function ThemeShowcase() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-pulse">Loading theme info...</div>
        </CardContent>
      </Card>
    )
  }

  const currentTheme = resolvedTheme || theme

  return (
    <div className="space-y-6">
      {/* Current Theme Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <CardTitle>Theme System Status</CardTitle>
          </div>
          <CardDescription>
            Current theme settings and system preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Selected Theme */}
            <div className="p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
              <div className="flex items-center gap-2 mb-2">
                {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
                {theme === 'dark' && <Moon className="w-4 h-4 text-primary-400" />}
                {theme === 'system' && <Monitor className="w-4 h-4 text-info-light dark:text-info-dark" />}
                <span className="text-sm font-medium text-secondary">Selected Theme</span>
              </div>
              <div className="text-2xl font-bold text-primary capitalize">{theme}</div>
            </div>

            {/* Resolved Theme */}
            <div className="p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
              <div className="flex items-center gap-2 mb-2">
                {currentTheme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-primary-400" />
                )}
                <span className="text-sm font-medium text-secondary">Active Theme</span>
              </div>
              <div className="text-2xl font-bold text-primary capitalize">{currentTheme}</div>
            </div>

            {/* Persistence */}
            <div className="p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">Enabled</Badge>
              </div>
              <span className="text-sm font-medium text-secondary">localStorage Persistence</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Features */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Features</CardTitle>
          <CardDescription>
            All the capabilities of the theme system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'System Preference Detection',
                description: 'Automatically detects OS theme preference',
                status: 'active'
              },
              {
                title: 'No Flash of Wrong Theme',
                description: 'Prevents theme flashing on page load',
                status: 'active'
              },
              {
                title: 'Smooth Transitions',
                description: '200ms transitions between themes',
                status: 'active'
              },
              {
                title: 'localStorage Persistence',
                description: 'Theme preference saved locally',
                status: 'active'
              },
              {
                title: 'Three Theme Options',
                description: 'Light, Dark, and System themes',
                status: 'active'
              },
              {
                title: 'Accessible Controls',
                description: 'Keyboard navigation & ARIA labels',
                status: 'active'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-light-border-primary dark:border-dark-border-primary"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-primary">{feature.title}</h4>
                  <Badge variant="success">✓</Badge>
                </div>
                <p className="text-sm text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Palette Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
          <CardDescription>
            Colors automatically adapt to the current theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Backgrounds */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Backgrounds</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="h-16 rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-primary dark:border-dark-border-primary" />
                  <p className="text-xs text-tertiary mt-1">Primary</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary" />
                  <p className="text-xs text-tertiary mt-1">Secondary</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary" />
                  <p className="text-xs text-tertiary mt-1">Tertiary</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-light-bg-elevated dark:bg-dark-bg-elevated border border-light-border-primary dark:border-dark-border-primary" />
                  <p className="text-xs text-tertiary mt-1">Elevated</p>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Text Colors</h4>
              <div className="space-y-2">
                <p className="text-light-text-primary dark:text-dark-text-primary">
                  Primary text - Used for headings and main content
                </p>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  Secondary text - Used for descriptions and labels
                </p>
                <p className="text-light-text-tertiary dark:text-dark-text-tertiary">
                  Tertiary text - Used for captions and metadata
                </p>
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Semantic Colors</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="primary">Primary</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>
            Try out the theme system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Click the theme toggle button</p>
                <p className="text-sm text-secondary">
                  Located in the top-right corner of the page
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Select a theme</p>
                <p className="text-sm text-secondary">
                  Choose between Light, Dark, or System preference
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Watch the magic happen</p>
                <p className="text-sm text-secondary">
                  All colors, backgrounds, and components update instantly
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

