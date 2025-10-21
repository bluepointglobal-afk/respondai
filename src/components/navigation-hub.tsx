'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Target, 
  Users, 
  BarChart3,
  Zap,
  Settings,
  Home,
  ArrowRight,
  Sparkles,
  Crown,
  Star,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  Play,
  Eye,
  Download
} from 'lucide-react'

export function NavigationHub() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const sections = [
    {
      id: 'ai-features',
      title: 'AI-Powered Features',
      icon: <Brain className="w-6 h-6" />,
      color: 'purple',
      items: [
        {
          title: 'AI Survey Builder',
          description: 'Intelligent question generation with AI reasoning',
          link: '/ai-survey-builder',
          status: 'new',
          icon: <Brain className="w-5 h-5" />
        },
        {
          title: 'Quantum Pattern Detection',
          description: 'Multi-dimensional analysis using quantum algorithms',
          link: '/quantum-patterns',
          status: 'advanced',
          icon: <Target className="w-5 h-5" />
        },
        {
          title: 'Neural Price Optimization',
          description: 'AI-powered dynamic pricing recommendations',
          link: '/neural-pricing',
          status: 'ai-powered',
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          title: 'Bayesian Validation',
          description: 'Sophisticated confidence scoring',
          link: '/bayesian-validation',
          status: 'enterprise',
          icon: <BarChart3 className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'user-experience',
      title: 'User Experience',
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
      items: [
        {
          title: 'Interactive Onboarding',
          description: '6-step guided setup with AI assistance',
          link: '/onboarding',
          status: 'guided',
          icon: <Users className="w-5 h-5" />
        },
        {
          title: 'Drag & Drop Builder',
          description: 'Visual survey creation with templates',
          link: '/survey-builder',
          status: 'visual',
          icon: <Settings className="w-5 h-5" />
        },
        {
          title: 'Real-time AI Chat',
          description: 'Chat with AI for survey optimization',
          link: '/ai-chat',
          status: 'interactive',
          icon: <MessageSquare className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'business',
      title: 'Business Features',
      icon: <Crown className="w-6 h-6" />,
      color: 'gold',
      items: [
        {
          title: 'Tiered Pricing',
          description: 'Professional pricing with freemium options',
          link: '/pricing',
          status: 'professional',
          icon: <Crown className="w-5 h-5" />
        },
        {
          title: 'Enterprise Analytics',
          description: 'Advanced reporting and insights',
          link: '/analytics',
          status: 'enterprise',
          icon: <BarChart3 className="w-5 h-5" />
        },
        {
          title: 'API Integration',
          description: 'Connect with your existing tools',
          link: '/integrations',
          status: 'technical',
          icon: <Settings className="w-5 h-5" />
        }
      ]
    }
  ]

  const quickActions = [
    {
      title: 'Start Building Survey',
      description: 'Create your first AI-powered validation survey',
      link: '/ai-survey-builder',
      icon: <Play className="w-5 h-5" />,
      color: 'purple'
    },
    {
      title: 'View Pricing',
      description: 'See our professional pricing tiers',
      link: '/pricing',
      icon: <Crown className="w-5 h-5" />,
      color: 'gold'
    },
    {
      title: 'Try Onboarding',
      description: 'Experience our guided setup process',
      link: '/onboarding',
      icon: <Users className="w-5 h-5" />,
      color: 'blue'
    },
    {
      title: 'Demo Features',
      description: 'Explore all our AI capabilities',
      link: '/demo',
      icon: <Eye className="w-5 h-5" />,
      color: 'green'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                RespondAI Platform Hub
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              Explore Your AI-Powered
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {' '}Market Research Platform
              </span>
            </h1>
            
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Navigate through all the advanced features we've built for you. 
              Each section showcases cutting-edge AI capabilities and professional tools.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={action.link}>
                  <Card variant="default" className="p-4 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/40' :
                        action.color === 'gold' ? 'bg-yellow-100 dark:bg-yellow-900/40' :
                        action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/40' :
                        'bg-green-100 dark:bg-green-900/40'
                      }`}>
                        <div className={`${
                          action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                          action.color === 'gold' ? 'text-yellow-600 dark:text-yellow-400' :
                          action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {action.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary text-sm">
                          {action.title}
                        </h3>
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Navigation Sections */}
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  section.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/40' :
                  section.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/40' :
                  'bg-yellow-100 dark:bg-yellow-900/40'
                }`}>
                  <div className={`${
                    section.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    section.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {section.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                    {section.title}
                  </h2>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Explore {section.title.toLowerCase()} capabilities
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Link href={item.link}>
                      <Card variant="default" className="p-6 h-full cursor-pointer hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              section.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/40' :
                              section.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/40' :
                              'bg-yellow-100 dark:bg-yellow-900/40'
                            }`}>
                              <div className={`${
                                section.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                section.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                'text-yellow-600 dark:text-yellow-400'
                              }`}>
                                {item.icon}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                                {item.title}
                              </h3>
                              <Badge 
                                variant={
                                  item.status === 'new' ? 'primary' :
                                  item.status === 'advanced' ? 'secondary' :
                                  item.status === 'ai-powered' ? 'outline' :
                                  item.status === 'enterprise' ? 'default' :
                                  'secondary'
                                }
                                className="text-xs"
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                              {item.description}
                            </p>
                            <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                              <span>Explore Feature</span>
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card variant="default" className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              Ready to Start Building?
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
              Choose any feature above to begin exploring, or start with our AI Survey Builder for the full experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/ai-survey-builder">
                <Button size="lg" variant="primary" className="text-lg px-8 py-4">
                  <Brain className="w-5 h-5 mr-2" />
                  Start AI Survey Builder
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  <Crown className="w-5 h-5 mr-2" />
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
