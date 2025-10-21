# 🎨 Theme System - Quick Reference

## 🚀 Quick Start

### Import Theme Toggle
```tsx
import { ThemeToggle } from '@/components/theme'

<ThemeToggle />
```

### Use Theme Hook
```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <div>Theme: {theme}</div>
}
```

---

## 🎨 Theme Classes

### Backgrounds
```tsx
bg-light-bg-primary dark:bg-dark-bg-primary       // Main background
bg-light-bg-secondary dark:bg-dark-bg-secondary   // Secondary
bg-light-bg-tertiary dark:bg-dark-bg-tertiary     // Tertiary
bg-light-bg-elevated dark:bg-dark-bg-elevated     // Cards

// Utility classes
bg-card      // Auto-adapts
bg-input     // Auto-adapts
```

### Text
```tsx
text-light-text-primary dark:text-dark-text-primary     // Headings
text-light-text-secondary dark:text-dark-text-secondary // Body
text-light-text-tertiary dark:text-dark-text-tertiary   // Captions

// Utility classes
text-primary    // Auto-adapts
text-secondary  // Auto-adapts
text-tertiary   // Auto-adapts
```

### Borders
```tsx
border-light-border-primary dark:border-dark-border-primary
border-light-border-secondary dark:border-dark-border-secondary
```

---

## 🌈 Colors

### Brand Colors (Same in both themes)
```tsx
bg-primary-500      // Main brand: #6B7AB8
bg-primary-600      // Darker
bg-primary-400      // Lighter

text-primary-500
```

### Accent Colors
```tsx
bg-accent-purple    // #8B5CF6
bg-accent-cyan      // #06B6D4
bg-accent-emerald   // #10B981
bg-accent-amber     // #F59E0B
bg-accent-rose      // #F43F5E
```

### Semantic Colors (Theme-aware)
```tsx
// Success
text-success-light dark:text-success-dark
bg-success-light dark:bg-success-dark

// Warning
text-warning-light dark:text-warning-dark

// Error
text-error-light dark:text-error-dark

// Info
text-info-light dark:text-info-dark
```

---

## 🧩 Components

### Button
```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="md">Click</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

### Badge
```tsx
import { Badge } from '@/components/ui'

<Badge variant="success">Active</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="primary">Primary</Badge>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

<Card hover padding="md">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

---

## ⚡ Common Patterns

### Theme-Aware Div
```tsx
<div className="bg-card text-primary p-4 rounded-lg">
  Content adapts to theme
</div>
```

### Conditional Styling
```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  'bg-light-bg-primary dark:bg-dark-bg-primary',
  'text-light-text-primary dark:text-dark-text-primary',
  isActive && 'border-primary-500'
)}>
```

### Gradient Text
```tsx
<h1 className="text-gradient">
  Beautiful Gradient
</h1>
```

---

## 🔧 API

### useTheme Hook
```tsx
const {
  theme,          // 'light' | 'dark' | 'system'
  setTheme,       // (theme: string) => void
  resolvedTheme,  // 'light' | 'dark' (actual theme)
  themes,         // ['light', 'dark', 'system']
  systemTheme,    // 'light' | 'dark'
} = useTheme()
```

### Set Theme
```tsx
setTheme('light')   // Light mode
setTheme('dark')    // Dark mode
setTheme('system')  // System preference
```

---

## 📍 Routes

- `/` - Home page
- `/theme-demo` - Interactive theme showcase
- `/login` - Login page
- `/dashboard` - Dashboard

---

## 🐛 Common Issues

### Hydration Mismatch
```tsx
// ❌ Wrong
const { theme } = useTheme()
return <div>{theme}</div>

// ✅ Correct
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

### Flash of Wrong Theme
```tsx
// Add to <html> element
<html lang="en" suppressHydrationWarning>
```

---

## 📚 Documentation

- **THEME_SYSTEM.md** - Complete guide (650+ lines)
- **THEME_SYSTEM_COMPLETE.md** - Implementation summary
- **README.md** - Project overview

---

## 💡 Tips

1. Always check `mounted` state when reading theme
2. Use utility classes (`bg-card`, `text-primary`)
3. Test in both themes before deploying
4. Use semantic colors for status indicators
5. Add transitions for smooth theme changes

---

**Quick Access:** http://localhost:3000/theme-demo

