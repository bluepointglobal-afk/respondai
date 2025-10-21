'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabaseAuth } from '@/components/auth/supabase-auth-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Target, 
  Users, 
  BarChart3,
  Zap,
  Crown,
  Home,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Settings,
  FileText,
  Calculator,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  Eye,
  Download,
  Share2,
  Play,
  Star,
  LogIn,
  User,
  LogOut
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  description: string
  badge?: string
  children?: NavigationItem[]
}

export function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { user, session, loading, signOut, isConfigured } = useSupabaseAuth()

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: <Home className="w-4 h-4" />,
      description: 'Platform overview and demos'
    },
    {
      id: 'builders',
      label: 'Survey Builders',
      href: '#',
      icon: <Brain className="w-4 h-4" />,
      description: 'Create professional surveys',
      children: [
        {
          id: 'revamped-builder',
          label: 'Revamped Builder',
          href: '/revamped-survey-builder',
          icon: <Crown className="w-4 h-4" />,
          description: 'Deep, industry-specific surveys',
          badge: 'NEW'
        },
        {
          id: 'professional-builder',
          label: 'Professional Builder',
          href: '/professional-survey-builder',
          icon: <Star className="w-4 h-4" />,
          description: 'Industry-standard methodologies',
          badge: 'Professional'
        },
        {
          id: 'ai-builder',
          label: 'AI-Guided Builder',
          href: '/ai-survey-builder',
          icon: <Brain className="w-4 h-4" />,
          description: 'AI-powered question generation',
          badge: 'AI-Powered'
        },
        {
          id: 'drag-drop',
          label: 'Drag & Drop Builder',
          href: '/survey-builder',
          icon: <Settings className="w-4 h-4" />,
          description: 'Visual survey creation',
          badge: 'Visual'
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '#',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'Advanced analysis tools',
      children: [
        {
          id: 'van-westendorp',
          label: 'Van Westendorp Pricing',
          href: '/analytics/van-westendorp',
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Price sensitivity analysis',
          badge: 'Industry Standard'
        },
        {
          id: 'maxdiff',
          label: 'MaxDiff Analysis',
          href: '/analytics/maxdiff',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Feature prioritization',
          badge: 'Statistical'
        },
        {
          id: 'kano',
          label: 'Kano Model',
          href: '/analytics/kano',
          icon: <Target className="w-4 h-4" />,
          description: 'Feature classification',
          badge: 'Strategic'
        },
        {
          id: 'quantum',
          label: 'Quantum Patterns',
          href: '/analytics/quantum',
          icon: <Zap className="w-4 h-4" />,
          description: 'Multi-dimensional analysis',
          badge: 'Advanced'
        }
      ]
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Users className="w-4 h-4" />,
      description: 'Manage your surveys and tests'
    },
    {
      id: 'tools',
      label: 'Tools',
      href: '#',
      icon: <Settings className="w-4 h-4" />,
      description: 'Utility tools and calculators',
      children: [
        {
          id: 'sample-calculator',
          label: 'Sample Size Calculator',
          href: '/tools/sample-calculator',
          icon: <Calculator className="w-4 h-4" />,
          description: 'Statistical sample planning',
          badge: 'Essential'
        },
        {
          id: 'onboarding',
          label: 'Onboarding Wizard',
          href: '/onboarding',
          icon: <Users className="w-4 h-4" />,
          description: 'Guided setup process',
          badge: 'Guided'
        },
        {
          id: 'pricing',
          label: 'Pricing Plans',
          href: '/pricing',
          icon: <Crown className="w-4 h-4" />,
          description: 'Professional pricing tiers',
          badge: 'Professional'
        }
      ]
    },
    {
      id: 'hub',
      label: 'Feature Hub',
      href: '/hub',
      icon: <Lightbulb className="w-4 h-4" />,
      description: 'Explore all capabilities'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleDropdownToggle = (itemId: string) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              RespondAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                {item.children ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => handleDropdownToggle(item.id)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(item.href) || activeDropdown === item.id
                          ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>

                    <AnimatePresence>
                      {activeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                        >
                          <div className="p-2">
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-2">
                              {item.description}
                            </div>
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                href={child.href}
                                className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  isActive(child.href) 
                                    ? 'bg-purple-100 dark:bg-purple-900/40' 
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <div className={`${
                                    isActive(child.href)
                                      ? 'text-purple-600 dark:text-purple-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {child.icon}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <p className={`text-sm font-medium ${
                                      isActive(child.href)
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                      {child.label}
                                    </p>
                                    {child.badge && (
                                      <Badge variant="secondary" className="text-xs">
                                        {child.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {child.description}
                                  </p>
                                </div>
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded"></div>
            ) : !isConfigured ? (
              <>
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Demo Dashboard
                  </Button>
                </Link>
                <Link href="/revamped-survey-builder">
                  <Button variant="primary" size="sm">
                    <Star className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                </Link>
              </>
            ) : user ? (
              <div className="relative">
                <Button
                  variant="secondary"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>{user.user_metadata?.name || user.email}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          {user.email}
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/pricing"
                          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Crown className="w-4 h-4" />
                          <span>Upgrade Plan</span>
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-1">
                          <button
                            onClick={() => {
                              signOut()
                              setUserDropdownOpen(false)
                            }}
                            className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="secondary" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    <Star className="w-4 h-4 mr-2" />
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="py-4 space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.id}>
                    {item.children ? (
                      <div>
                        <Button
                          variant="ghost"
                          onClick={() => handleDropdownToggle(item.id)}
                          className="w-full justify-start text-left"
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                          <ChevronDown className="w-4 h-4 ml-auto" />
                        </Button>
                        {activeDropdown === item.id && (
                          <div className="ml-6 mt-2 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                href={child.href}
                                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => {
                                  setActiveDropdown(null)
                                  setIsMobileMenuOpen(false)
                                }}
                              >
                                {child.icon}
                                <span className="text-sm">{child.label}</span>
                                {child.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {child.badge}
                                  </Badge>
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col space-y-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Demo
                    </Button>
                    <Button variant="primary" size="sm" className="w-full">
                      <Star className="w-4 h-4 mr-2" />
                      Start Free Trial
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

// Breadcrumb Navigation Component
export function BreadcrumbNavigation() {
  const pathname = usePathname()
  
  const pathSegments = pathname.split('/').filter(Boolean)
  
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    return {
      href,
      label,
      isLast: index === pathSegments.length - 1
    }
  })

  if (pathname === '/') return null

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center space-x-2 text-sm">
          <Link 
            href="/" 
            className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className="flex items-center space-x-2">
              <span className="text-gray-400 dark:text-gray-500">/</span>
              {item.isLast ? (
                <span className="text-gray-900 dark:text-white font-medium">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

// Quick Access Sidebar Component
export function QuickAccessSidebar() {
  const quickActions = [
    {
      title: 'Create Survey',
      description: 'Start building your survey',
      href: '/professional-survey-builder',
      icon: <Brain className="w-5 h-5" />,
      color: 'purple'
    },
    {
      title: 'Sample Calculator',
      description: 'Calculate optimal sample size',
      href: '/tools/sample-calculator',
      icon: <Calculator className="w-5 h-5" />,
      color: 'blue'
    },
    {
      title: 'View Dashboard',
      description: 'Manage your surveys',
      href: '/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'green'
    },
    {
      title: 'Explore Features',
      description: 'See all capabilities',
      href: '/hub',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'orange'
    }
  ]

  return (
    <Card variant="default" className="p-4">
      <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <div className={`p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
              action.color === 'purple' ? 'border-purple-200 hover:border-purple-300 bg-purple-50 dark:bg-purple-900/20' :
              action.color === 'blue' ? 'border-blue-200 hover:border-blue-300 bg-blue-50 dark:bg-blue-900/20' :
              action.color === 'green' ? 'border-green-200 hover:border-green-300 bg-green-50 dark:bg-green-900/20' :
              'border-orange-200 hover:border-orange-300 bg-orange-50 dark:bg-orange-900/20'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/40' :
                  action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/40' :
                  action.color === 'green' ? 'bg-green-100 dark:bg-green-900/40' :
                  'bg-orange-100 dark:bg-orange-900/40'
                }`}>
                  <div className={`${
                    action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    action.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`}>
                    {action.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary text-sm">
                    {action.title}
                  </h4>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
