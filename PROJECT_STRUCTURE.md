# RespondAI Project Structure

## Overview
Complete Next.js 14 application with dual theme support, built using TypeScript, Tailwind CSS, and modern React patterns.

## Directory Structure

```
respondai/
│
├── src/                          # Source code directory
│   │
│   ├── app/                      # Next.js 14 App Router
│   │   ├── (auth)/              # Auth route group (doesn't affect URL)
│   │   │   └── login/           # Login page (/login)
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/         # Dashboard route group
│   │   │   └── dashboard/       # Dashboard page (/dashboard)
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                 # API routes
│   │   │   └── example/         # Example API endpoint
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx           # Root layout (wraps all pages)
│   │   └── page.tsx             # Home page (/)
│   │
│   ├── components/              # React components
│   │   │
│   │   ├── ui/                  # Base/reusable UI components
│   │   │   ├── button.tsx       # Animated button with variants
│   │   │   ├── card.tsx         # Card container + subcomponents
│   │   │   ├── input.tsx        # Form input with label/error
│   │   │   ├── badge.tsx        # Status badges with variants
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   ├── features/            # Feature-specific components
│   │   │   └── theme-demo.tsx   # Theme color showcase
│   │   │
│   │   ├── layouts/             # Layout components
│   │   │   └── main-layout.tsx  # Main app layout wrapper
│   │   │
│   │   └── theme/               # Theme management
│   │       ├── theme-provider.tsx   # next-themes wrapper
│   │       ├── theme-toggle.tsx     # Animated theme toggle button
│   │       └── index.ts             # Barrel export
│   │
│   ├── lib/                     # Utility functions and configurations
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   ├── cn.ts            # Class name merger (clsx + tailwind-merge)
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── use-mounted.ts   # Client-side mount detection
│   │   │   └── index.ts
│   │   │
│   │   ├── stores/              # Zustand state stores
│   │   │   └── example-store.ts # Example Zustand store
│   │   │
│   │   └── types/               # TypeScript type definitions
│   │       └── index.ts         # Common types
│   │
│   └── styles/                  # Global styles
│       └── globals.css          # Tailwind + custom CSS
│
├── public/                       # Static assets (not created yet)
│
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration (strict mode)
├── next.config.js               # Next.js configuration
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Dependencies and scripts
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment variables template
├── README.md                    # Project documentation
└── PROJECT_STRUCTURE.md        # This file

```

## Key Files Explained

### Configuration Files

- **tailwind.config.ts**: Custom theme with light/dark color palettes, animations, shadows
- **tsconfig.json**: TypeScript strict mode, path aliases (@/*)
- **next.config.js**: Next.js settings (React strict mode, SWC minification)
- **postcss.config.js**: PostCSS plugins (Tailwind + Autoprefixer)

### App Directory (Next.js 14 App Router)

- **layout.tsx**: Root layout with ThemeProvider, imports global CSS
- **page.tsx**: Landing page with hero, features, CTA sections
- **(auth)/login/page.tsx**: Authentication page with form
- **(dashboard)/dashboard/page.tsx**: Dashboard with stats and charts
- **api/example/route.ts**: Example API endpoint (GET/POST)

### Components

#### UI Components (`components/ui/`)
- Reusable, generic components
- Styled with Tailwind CSS
- Support theme variants
- Include animations with Framer Motion
- TypeScript typed with forwardRef support

#### Theme Components (`components/theme/`)
- **theme-provider.tsx**: Wraps app with next-themes context
- **theme-toggle.tsx**: Animated sun/moon toggle button

#### Feature Components (`components/features/`)
- Domain-specific, feature-focused components
- Built using UI components

### Library (`lib/`)

#### Utils
- **cn()**: Merges class names intelligently (handles Tailwind conflicts)

#### Hooks
- **useMounted()**: Prevents hydration mismatch for client-only features

#### Stores
- Zustand stores for global state management
- Type-safe with TypeScript

#### Types
- Shared TypeScript interfaces and types
- API response types, user types, etc.

### Styles

- **globals.css**: 
  - Tailwind directives
  - CSS custom properties for theme colors
  - Custom scrollbar styles
  - Utility classes

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework | 14.x |
| React | UI library | 18.x |
| TypeScript | Type safety | 5.x |
| Tailwind CSS | Styling | 3.x |
| next-themes | Theme management | 0.4.x |
| Framer Motion | Animations | 12.x |
| Zustand | State management | 5.x |
| React Hook Form | Form handling | 7.x |
| Recharts | Data visualization | 3.x |
| Lucide React | Icons | Latest |
| Headless UI | Accessible components | 2.x |

## Theme System

### Color Palettes

**Light Theme:**
- Backgrounds: Pure whites, soft grays
- Text: Dark grays to black
- Borders: Light grays

**Dark Theme:**
- Backgrounds: Deep blacks, charcoal grays
- Text: Bright whites, light grays
- Borders: Medium grays

**Brand Colors:**
- Primary: Blue-purple gradient (50-950 scale)
- Accents: Purple, Cyan, Emerald, Amber, Rose

**Semantic Colors:**
- Success, Warning, Error, Info
- Theme-aware (different shades for light/dark)

### Theme Usage

```tsx
// Direct Tailwind classes
<div className="bg-light-bg-primary dark:bg-dark-bg-primary" />

// Utility classes (defined in globals.css)
<div className="bg-card text-primary" />

// Component variants handle themes automatically
<Button variant="primary">Click me</Button>
```

## Component Patterns

### Basic Component Structure
```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface Props extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'primary'
}

export const Component = React.forwardRef<HTMLElement, Props>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn('base-classes', variantClasses[variant], className)}
        {...props}
      />
    )
  }
)
```

## Naming Conventions

- **Files**: kebab-case (`theme-toggle.tsx`)
- **Components**: PascalCase (`ThemeToggle`)
- **Functions**: camelCase (`useTheme`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Types**: PascalCase (`ThemeProviderProps`)

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes**: Hot reload active
3. **Check types**: Automatic via IDE/editor
4. **Build**: `npm run build`
5. **Preview**: `npm start`

## Adding New Features

### New Page
1. Create folder in `src/app/`
2. Add `page.tsx` file
3. Automatic routing by folder structure

### New Component
1. Create in appropriate folder (`ui/`, `features/`, `layouts/`)
2. Export from `index.ts` barrel file
3. Import using `@/components/*`

### New API Route
1. Create folder in `src/app/api/`
2. Add `route.ts` with GET/POST/etc exports
3. Access at `/api/[folder-name]`

### New Store
1. Create file in `src/lib/stores/`
2. Define interface and create store
3. Import and use in components

## Best Practices

✅ Use TypeScript for all new files
✅ Use `cn()` helper for conditional classes
✅ Export components from `index.ts` files
✅ Use path aliases (`@/*`) for imports
✅ Theme-aware: support light and dark modes
✅ Animate with Framer Motion for polish
✅ Use semantic HTML elements
✅ Add proper accessibility attributes

## Future Enhancements

- [ ] Add authentication (NextAuth.js)
- [ ] Database integration (Prisma + PostgreSQL)
- [ ] More UI components (Modal, Dropdown, Tabs, etc.)
- [ ] Form validation with Zod
- [ ] API client with React Query
- [ ] Testing setup (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Storybook for component documentation
- [ ] Deployment configuration (Vercel)

---

**Last Updated**: October 2025  
**Maintainer**: RespondAI Team

