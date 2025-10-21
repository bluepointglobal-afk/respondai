# RespondAI

AI-powered market research platform. Validate product ideas in hours, not weeks.

## ✨ Features

- 🧠 **AI-Generated Customer Personas** - Let AI create detailed target personas
- 📊 **Synthetic Response Simulation** - Test with 1,000 virtual customers
- 🎯 **Purchase Intent Analysis** - Know who will buy before you build
- 💰 **Optimal Pricing Recommendations** - Find your sweet spot price point
- 🌍 **Geographic & Demographic Patterns** - Discover hidden market segments
- 🚨 **Cultural Risk Assessment** - Avoid costly international mistakes
- 🎨 **Dual Theme Support** - Beautiful light & dark modes

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS + Custom Theme
- **State**: Zustand (with persist)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📦 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd respondai
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Database URL (PostgreSQL)
- OpenAI API Key
- NextAuth Secret

### 3. Database Setup (Optional)

```bash
# Initialize Prisma
npx prisma generate

# Run migrations (if using database)
npx prisma db push

# Seed demo data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**

## 📁 Project Structure

```
respondai/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages
│   │   │   └── login/
│   │   ├── (dashboard)/         # Dashboard pages
│   │   │   └── dashboard/
│   │   │       ├── test/
│   │   │       │   ├── new/     # Test creation flow
│   │   │       │   └── [testId]/ # Test results
│   │   │       └── loading.tsx
│   │   ├── api/                 # API routes
│   │   ├── theme-demo/          # Theme showcase
│   │   ├── components-demo/     # Component showcase
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   ├── error.tsx            # Error boundary
│   │   ├── not-found.tsx        # 404 page
│   │   └── global-error.tsx     # Global error
│   ├── components/
│   │   ├── ui/                  # Base UI components
│   │   ├── features/            # Feature components
│   │   ├── layouts/             # Layout components
│   │   └── theme/               # Theme system
│   ├── lib/
│   │   ├── utils/               # Utility functions
│   │   ├── hooks/               # Custom hooks
│   │   ├── stores/              # Zustand stores
│   │   └── types/               # TypeScript types
│   └── styles/
│       └── globals.css          # Global styles
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── vercel.json                  # Deployment config
```

## 🎨 Theme System

### Features
- 🌓 **Light & Dark Modes** - Plus system preference
- 💾 **localStorage Persistence** - Theme choice saved
- ⚡ **No Flash** - Proper hydration handling
- 🎭 **Smooth Transitions** - 200ms color changes
- ♿ **Accessible** - Keyboard navigation, ARIA labels

### Usage

```tsx
import { ThemeToggle } from '@/components/theme'

// In your component
<ThemeToggle />
```

## 🧩 UI Components

### Button

```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="lg" loading={false}>
  Click me
</Button>
```

**Variants**: `primary`, `secondary`, `ghost`, `danger`, `success`  
**Sizes**: `sm`, `md`, `lg`

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

<Card variant="default" padding="lg">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Your content
  </CardContent>
</Card>
```

**Variants**: `default`, `stat`, `insight`, `risk`

### Form Components

```tsx
import { Input, Textarea, Select } from '@/components/ui'

<Input label="Email" icon={<Mail />} error="Invalid email" />
<Textarea label="Message" rows={4} />
<Select label="Country">
  <option>United States</option>
</Select>
```

### Other Components

- `Badge` - Status indicators (8 variants)
- `Progress` - Progress bars (5 variants, animated)
- `Tooltip` - Hover tooltips (4 positions)
- `Skeleton` - Loading placeholders

## 📱 Responsive Design

- **Mobile-first** approach
- **Custom breakpoints**: `xs` (375px), `safe` (640px)
- **Mobile bottom navigation** for dashboard
- **Touch-optimized** interactive elements
- **Responsive grids** and layouts

## 🛠️ State Management

### Zustand Store

```tsx
import { useTestCreationStore } from '@/lib/stores/test-creation-store'

function Component() {
  const { productInfo, setProductInfo } = useTestCreationStore()
  
  // State persists in localStorage
}
```

## 🎬 Animations

All powered by Framer Motion:

- Page transitions
- Staggered reveals
- Floating particles
- Orbiting elements
- Pulse effects
- Shimmer effects

## 📊 Available Routes

### Public
- `/` - Marketing landing page
- `/theme-demo` - Theme system showcase
- `/components-demo` - UI component library
- `/login` - Authentication

### Dashboard (Protected)
- `/dashboard` - Main dashboard
- `/dashboard/test/new` - Create new test (Step 1)
- `/dashboard/test/new/personas` - Review personas (Step 2)
- `/dashboard/test/new/processing` - Processing state
- `/dashboard/test/[testId]/patterns` - Pattern analysis
- `/dashboard/test/[testId]/cultural-risk` - Cultural assessment

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Database (when using Prisma)
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables

Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` - (Optional) Google OAuth
- `GOOGLE_CLIENT_SECRET` - (Optional) Google OAuth

### Database Options

- **Railway** - PostgreSQL hosting
- **Supabase** - PostgreSQL + Auth
- **Neon** - Serverless PostgreSQL

## 📚 Documentation

- **README.md** - This file
- **QUICK_START.md** - Quick reference
- **PROJECT_STRUCTURE.md** - Architecture details
- **THEME_SYSTEM.md** - Theme documentation
- **THEME_QUICK_REFERENCE.md** - Theme quick ref

## 🔐 Authentication (Optional)

NextAuth.js ready to integrate:
- Credentials provider
- Google OAuth
- JWT sessions
- Protected routes

## 🎯 Features in Detail

### Multi-Step Test Creation
1. **Product Info** - Name, description, industry, audience
2. **AI Personas** - Auto-generated, editable personas
3. **Processing** - Animated loading with real-time progress
4. **Results** - Comprehensive analysis and insights

### Pattern Analysis
- **Geographic Patterns** - Regional preferences by state
- **Demographic Patterns** - Segment-specific insights
- **Revenue Impact** - Calculated opportunity sizes
- **Cultural Risks** - International market assessment

### Theme System
- **3 Theme Options** - Light, Dark, System
- **Dropdown Toggle** - Animated menu with current state
- **Persistent** - Saved to localStorage
- **Accessible** - Full keyboard navigation

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build test
npm run build
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**

Visit **http://localhost:3000** to see it in action!
