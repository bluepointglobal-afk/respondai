# 🎨 Theme System Documentation

Complete guide to the dual theme system in RespondAI.

---

## Overview

RespondAI features a sophisticated dual theme system powered by `next-themes` with support for:
- ✅ **Light Mode** - Clean, bright interface
- ✅ **Dark Mode** - Easy on the eyes
- ✅ **System Preference** - Auto-detects OS theme

---

## Features

### Core Capabilities

1. **No Flash of Wrong Theme (FOUT)**
   - Theme is applied before page render
   - Prevents theme flashing on initial load
   - Uses `suppressHydrationWarning` on HTML element

2. **localStorage Persistence**
   - Theme preference saved automatically
   - Persists across browser sessions
   - Falls back to system preference if not set

3. **System Preference Detection**
   - Automatically detects OS theme
   - Updates when system theme changes
   - Respects user's accessibility settings

4. **Smooth Transitions**
   - 200ms color transitions
   - Applies to all theme-aware properties
   - No jarring color changes

5. **Accessibility**
   - Keyboard navigation support
   - Proper ARIA labels
   - Focus management in dropdown
   - Screen reader friendly

6. **Mobile-Friendly**
   - Touch-optimized controls
   - Responsive dropdown menu
   - Works on all screen sizes

---

## Architecture

### File Structure

```
src/
├── components/
│   └── theme/
│       ├── theme-provider.tsx    # next-themes wrapper
│       ├── theme-toggle.tsx      # Theme switcher UI
│       └── index.ts              # Barrel exports
├── app/
│   ├── layout.tsx                # Root layout with provider
│   └── theme-demo/               # Interactive demo page
│       └── page.tsx
└── styles/
    └── globals.css               # Theme CSS variables
```

### Components

#### ThemeProvider

Wraps the entire application with theme context.

```tsx
// src/components/theme/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
```

**Props:**
- `attribute="class"` - Uses class-based theme switching
- `defaultTheme="system"` - Defaults to OS preference
- `enableSystem` - Enables system theme detection
- `disableTransitionOnChange={false}` - Allows smooth transitions

#### ThemeToggle

Interactive dropdown menu for theme selection.

```tsx
// Usage
import { ThemeToggle } from '@/components/theme'

<ThemeToggle />
```

**Features:**
- Shows current theme icon (Sun/Moon/Monitor)
- Dropdown with 3 theme options
- Animated transitions with Framer Motion
- Active theme indicator dot
- Click outside to close

---

## Implementation

### 1. Root Layout Setup

```tsx
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Key Points:**
- `suppressHydrationWarning` prevents hydration warnings
- Font variables for Inter and JetBrains Mono
- ThemeProvider wraps all children

### 2. CSS Variables

```css
/* src/styles/globals.css */
@layer base {
  :root {
    /* Light theme (default) */
    --bg-primary: 255 255 255;
    --bg-secondary: 248 249 250;
    --text-primary: 26 26 26;
    --text-secondary: 74 85 104;
  }
  
  .dark {
    /* Dark theme */
    --bg-primary: 12 13 18;
    --bg-secondary: 24 24 27;
    --text-primary: 244 244 245;
    --text-secondary: 161 161 170;
  }
}
```

### 3. Theme-Aware Components

Use Tailwind's dark mode variants:

```tsx
// Direct classes
<div className="bg-light-bg-primary dark:bg-dark-bg-primary">
  <h1 className="text-light-text-primary dark:text-dark-text-primary">
    Hello World
  </h1>
</div>

// Utility classes (from globals.css)
<div className="bg-card text-primary">
  Content adapts automatically
</div>
```

---

## Color System

### Theme-Specific Colors

**Light Theme:**
```css
bg-light-bg-primary      /* #FFFFFF */
bg-light-bg-secondary    /* #F8F9FA */
bg-light-bg-tertiary     /* #F1F3F5 */
text-light-text-primary  /* #1A1A1A */
text-light-text-secondary /* #4A5568 */
```

**Dark Theme:**
```css
bg-dark-bg-primary       /* #0C0D12 */
bg-dark-bg-secondary     /* #18181B */
bg-dark-bg-tertiary      /* #27272A */
text-dark-text-primary   /* #F4F4F5 */
text-dark-text-secondary /* #A1A1AA */
```

### Brand Colors (Same in Both Themes)

```css
bg-primary-500     /* #6B7AB8 - Main brand */
bg-accent-purple   /* #8B5CF6 */
bg-accent-cyan     /* #06B6D4 */
bg-accent-emerald  /* #10B981 */
bg-accent-amber    /* #F59E0B */
bg-accent-rose     /* #F43F5E */
```

### Semantic Colors (Theme-Aware)

```tsx
// Success
text-success-light  /* Light mode: #059669 */
text-success-dark   /* Dark mode: #10B981 */

// Warning
text-warning-light  /* Light mode: #D97706 */
text-warning-dark   /* Dark mode: #F59E0B */

// Error
text-error-light    /* Light mode: #DC2626 */
text-error-dark     /* Dark mode: #EF4444 */

// Info
text-info-light     /* Light mode: #2563EB */
text-info-dark      /* Dark mode: #3B82F6 */
```

---

## Usage Examples

### Basic Theme Toggle

```tsx
import { ThemeToggle } from '@/components/theme'

function Header() {
  return (
    <header>
      <nav>
        <Logo />
        <ThemeToggle />
      </nav>
    </header>
  )
}
```

### Reading Current Theme

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

  return (
    <div>
      <p>Selected: {theme}</p>
      <p>Active: {resolvedTheme}</p>
      
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

**Important:** Always check `mounted` state to prevent hydration mismatches.

### Creating Theme-Aware Components

```tsx
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated'
}

function Card({ children, variant = 'default' }: CardProps) {
  return (
    <div className={cn(
      'rounded-lg p-4',
      variant === 'default' && 'bg-light-bg-primary dark:bg-dark-bg-primary',
      variant === 'elevated' && 'bg-light-bg-elevated dark:bg-dark-bg-elevated',
      'text-light-text-primary dark:text-dark-text-primary'
    )}>
      {children}
    </div>
  )
}
```

---

## Best Practices

### ✅ DO

1. **Use theme-specific colors**
   ```tsx
   <div className="bg-light-bg-primary dark:bg-dark-bg-primary">
   ```

2. **Check mounted state for client-side theme reading**
   ```tsx
   if (!mounted) return null
   ```

3. **Use utility classes for common patterns**
   ```tsx
   <div className="bg-card text-primary">
   ```

4. **Add transitions for smooth theme changes**
   ```tsx
   className="transition-colors duration-200"
   ```

5. **Test both themes**
   - Always check components in light and dark mode
   - Verify color contrast ratios

### ❌ DON'T

1. **Don't read theme on server**
   ```tsx
   // ❌ Will cause hydration mismatch
   export default function ServerComponent() {
     const { theme } = useTheme() // Wrong!
   }
   ```

2. **Don't forget suppressHydrationWarning**
   ```tsx
   // ❌ Missing suppressHydrationWarning
   <html lang="en">
   
   // ✅ Correct
   <html lang="en" suppressHydrationWarning>
   ```

3. **Don't use fixed colors for backgrounds**
   ```tsx
   // ❌ Won't adapt to theme
   <div className="bg-white text-black">
   
   // ✅ Theme-aware
   <div className="bg-card text-primary">
   ```

4. **Don't skip accessibility**
   ```tsx
   // ❌ Not accessible
   <button onClick={toggleTheme}>
   
   // ✅ Accessible
   <button onClick={toggleTheme} aria-label="Toggle theme">
   ```

---

## Troubleshooting

### Flash of Wrong Theme on Load

**Problem:** Page briefly shows wrong theme before correcting

**Solution:**
```tsx
// Add suppressHydrationWarning to html element
<html lang="en" suppressHydrationWarning>
```

### Hydration Mismatch Errors

**Problem:** React hydration errors related to theme

**Solution:**
```tsx
// Always check mounted state in client components
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null
```

### Theme Not Persisting

**Problem:** Theme resets on page reload

**Solution:**
- Ensure localStorage is available
- Check browser privacy settings
- Verify ThemeProvider is in root layout

### Colors Not Changing

**Problem:** Some elements don't change with theme

**Solution:**
1. Use `dark:` variant classes
2. Check if colors are theme-aware
3. Verify component is inside ThemeProvider

---

## Testing

### Manual Testing

1. **Light Mode:**
   - Click theme toggle → Select "Light"
   - Verify all colors are light theme
   - Check contrast ratios

2. **Dark Mode:**
   - Click theme toggle → Select "Dark"
   - Verify all colors are dark theme
   - Check no bright flashes

3. **System Mode:**
   - Click theme toggle → Select "System"
   - Change OS theme
   - Verify app updates automatically

4. **Persistence:**
   - Select a theme
   - Refresh page
   - Verify theme is remembered

5. **Transitions:**
   - Switch between themes
   - Verify smooth color transitions
   - No jarring changes

### Automated Testing

```tsx
// Example test with React Testing Library
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme'
import MyComponent from './MyComponent'

test('renders in light mode', () => {
  render(
    <ThemeProvider defaultTheme="light">
      <MyComponent />
    </ThemeProvider>
  )
  
  // Your assertions
})
```

---

## Performance

### Optimizations

1. **CSS Variables:** O(1) theme switching
2. **No JS for Styles:** Pure CSS theme changes
3. **LocalStorage:** Instant theme restoration
4. **No Flash:** Theme applied before render

### Metrics

- **Theme Switch Time:** < 200ms
- **Initial Load:** No additional overhead
- **Bundle Size:** ~3KB (next-themes)

---

## Resources

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Framer Motion](https://www.framer.com/motion/)

---

## Demo Page

Visit the interactive demo: **http://localhost:3000/theme-demo**

Try:
- Switching between Light, Dark, and System themes
- Viewing theme colors and features
- Testing on different devices

---

**Last Updated:** October 2025  
**Version:** 1.0.0

