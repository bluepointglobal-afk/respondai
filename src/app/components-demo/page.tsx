'use client'

import { useState } from 'react'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  Badge,
  Progress,
  Tooltip,
} from '@/components/ui'
import {
  Sparkles,
  Send,
  Download,
  Trash2,
  Check,
  Mail,
  User,
  Lock,
  Search,
  AlertCircle,
  Info,
} from 'lucide-react'
import Link from 'next/link'

export default function ComponentsDemoPage() {
  const [progress, setProgress] = useState(45)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Header */}
      <header className="border-b border-light-border-primary dark:border-dark-border-primary bg-light-bg-elevated dark:bg-dark-bg-elevated sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <div>
                <h1 className="text-xl font-bold text-gradient">UI Components</h1>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  Theme-aware component library
                </p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Intro */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-3 text-light-text-primary dark:text-dark-text-primary">
              Component Showcase
            </h2>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              All components automatically adapt to light and dark themes with smooth transitions.
              Try toggling the theme to see them in action!
            </p>
          </div>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Multiple variants and sizes with loading states and icons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Variants
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Sizes
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  With Icons
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button icon={<Send />}>Send Message</Button>
                  <Button variant="secondary" icon={<Download />}>Download</Button>
                  <Button variant="danger" icon={<Trash2 />}>Delete</Button>
                  <Button variant="success" icon={<Check />}>Confirm</Button>
                </div>
              </div>

              {/* Loading */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Loading State
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button variant="secondary" loading>Processing</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>
                Multiple card variants with different styles and use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Default Card */}
                <Card variant="default" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Default Card</CardTitle>
                    <CardDescription>Standard card style</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Perfect for general content and information display.
                    </p>
                  </CardContent>
                </Card>

                {/* Stat Card */}
                <Card variant="stat" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Stat Card</CardTitle>
                    <CardDescription>With gradient</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary-500">2,847</div>
                    <p className="text-sm text-success-light dark:text-success-dark">+12.5%</p>
                  </CardContent>
                </Card>

                {/* Insight Card */}
                <Card variant="insight" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Insight Card</CardTitle>
                    <CardDescription>Highlighted style</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Use for important insights or featured content.
                    </p>
                  </CardContent>
                </Card>

                {/* Risk Cards */}
                <Card variant="risk" riskLevel="low" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Low Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="success">
                      Safe
                    </Badge>
                  </CardContent>
                </Card>

                <Card variant="risk" riskLevel="medium" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Medium Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="warning">
                      Caution
                    </Badge>
                  </CardContent>
                </Card>

                <Card variant="risk" riskLevel="high" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">High Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="error">
                      Critical
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Form Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Form Inputs</CardTitle>
              <CardDescription>
                Text inputs, textareas, and selects with labels and error states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Examples */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="w-4 h-4" />}
                />
                <Input
                  label="Username"
                  type="text"
                  placeholder="johndoe"
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                />
                <Input
                  label="Search"
                  type="text"
                  placeholder="Search..."
                  icon={<Search className="w-4 h-4" />}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              {/* Input with Error */}
              <Input
                label="Email (with error)"
                type="email"
                placeholder="invalid-email"
                error="Please enter a valid email address"
                icon={<Mail className="w-4 h-4" />}
              />

              {/* Textarea */}
              <Textarea
                label="Message"
                placeholder="Type your message here..."
                rows={4}
              />

              {/* Textarea with Error */}
              <Textarea
                label="Bio (with error)"
                placeholder="Tell us about yourself..."
                error="Bio must be at least 50 characters"
                rows={3}
              />

              {/* Select */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Country">
                  <option value="">Select a country</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                </Select>

                <Select label="Category" icon={<Info className="w-4 h-4" />}>
                  <option value="">Select a category</option>
                  <option value="tech">Technology</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Status indicators and labels with multiple variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Variants
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="purple">Purple</Badge>
                  <Badge variant="cyan">Cyan</Badge>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Sizes
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Small</Badge>
                  <Badge variant="secondary">Medium</Badge>
                  <Badge variant="outline">Large</Badge>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  With Icons
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">
                    Verified
                  </Badge>
                  <Badge variant="error">
                    Failed
                  </Badge>
                  <Badge variant="warning">
                    Pending
                  </Badge>
                  <Badge variant="primary">
                    New
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Bars</CardTitle>
              <CardDescription>
                Visual progress indicators with multiple styles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default Progress */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Default
                </h4>
                <Progress value={progress} />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                    -10%
                  </Button>
                  <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                    +10%
                  </Button>
                </div>
              </div>

              {/* Variants */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Variants
                </h4>
                <div className="space-y-3">
                  <Progress value={75} />
                  <Progress value={50} />
                  <Progress value={25} />
                  <Progress value={60} />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Sizes
                </h4>
                <div className="space-y-3">
                  <Progress value={70} />
                  <Progress value={70} />
                  <Progress value={70} />
                  <Progress value={70} />
                </div>
              </div>

              {/* Animated */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                  Animated
                </h4>
                <Progress value={85} />
              </div>
            </CardContent>
          </Card>

          {/* Tooltips */}
          <Card>
            <CardHeader>
              <CardTitle>Tooltips</CardTitle>
              <CardDescription>
                Hover over the buttons to see tooltips in different positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center py-8">
                <Tooltip content="This is a top tooltip" side="top">
                  <Button variant="secondary">Top</Button>
                </Tooltip>
                <Tooltip content="This is a right tooltip" side="right">
                  <Button variant="secondary">Right</Button>
                </Tooltip>
                <Tooltip content="This is a bottom tooltip" side="bottom">
                  <Button variant="secondary">Bottom</Button>
                </Tooltip>
                <Tooltip content="This is a left tooltip" side="left">
                  <Button variant="secondary">Left</Button>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Theme Features */}
          <Card variant="insight">
            <CardHeader>
              <CardTitle>🎨 Theme-Aware Features</CardTitle>
              <CardDescription>
                All components automatically adapt to the selected theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success-light dark:text-success-dark flex-shrink-0 mt-0.5" />
                  <span>Smooth 200ms transitions between themes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success-light dark:text-success-dark flex-shrink-0 mt-0.5" />
                  <span>Semantic color classes for consistent theming</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success-light dark:text-success-dark flex-shrink-0 mt-0.5" />
                  <span>Accessible contrast ratios in both themes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success-light dark:text-success-dark flex-shrink-0 mt-0.5" />
                  <span>Focus states with proper ring offsets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success-light dark:text-success-dark flex-shrink-0 mt-0.5" />
                  <span>Consistent shadows and elevations</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                Toggle the theme using the button in the top-right corner to see all components adapt instantly!
              </p>
            </CardFooter>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-light-border-primary dark:border-dark-border-primary bg-light-bg-elevated dark:bg-dark-bg-elevated mt-20">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Built with class-variance-authority, Radix UI, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  )
}

