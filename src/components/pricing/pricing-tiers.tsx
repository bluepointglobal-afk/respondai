'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Users, 
  BarChart3,
  Brain,
  Target,
  Shield,
  Clock,
  Download,
  MessageSquare,
  Settings,
  Globe,
  Lock,
  Unlock
} from 'lucide-react'

interface PricingTier {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
    currency: string
  }
  features: PricingFeature[]
  limits: PricingLimits
  popular?: boolean
  icon: React.ReactNode
  color: string
  cta: string
  ctaVariant: 'primary' | 'secondary' | 'outline'
}

interface PricingFeature {
  id: string
  name: string
  description?: string
  included: boolean
  icon?: React.ReactNode
  category: 'core' | 'ai' | 'analytics' | 'collaboration' | 'integrations' | 'support'
}

interface PricingLimits {
  surveys: number | 'unlimited'
  responses: number | 'unlimited'
  teamMembers: number | 'unlimited'
  storage: string
  apiCalls: number | 'unlimited'
  aiCredits: number | 'unlimited'
  exportFormats: string[]
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated'
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for individual researchers and small projects',
    price: {
      monthly: 0,
      yearly: 0,
      currency: 'USD'
    },
    features: [
      {
        id: 'basic_surveys',
        name: 'Basic Surveys',
        description: 'Create simple surveys with standard question types',
        included: true,
        icon: <BarChart3 className="w-4 h-4" />,
        category: 'core'
      },
      {
        id: 'basic_analytics',
        name: 'Basic Analytics',
        description: 'Simple charts and basic statistical analysis',
        included: true,
        icon: <BarChart3 className="w-4 h-4" />,
        category: 'analytics'
      },
      {
        id: 'limited_responses',
        name: '100 Responses/Month',
        description: 'Collect up to 100 responses per month',
        included: true,
        category: 'core'
      },
      {
        id: 'basic_export',
        name: 'CSV Export',
        description: 'Export data in CSV format',
        included: true,
        icon: <Download className="w-4 h-4" />,
        category: 'core'
      },
      {
        id: 'community_support',
        name: 'Community Support',
        description: 'Access to community forums and documentation',
        included: true,
        icon: <MessageSquare className="w-4 h-4" />,
        category: 'support'
      },
      {
        id: 'ai_personas',
        name: 'AI Personas',
        description: 'Generate basic customer personas',
        included: false,
        icon: <Brain className="w-4 h-4" />,
        category: 'ai'
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Statistical significance testing and confidence intervals',
        included: false,
        icon: <Target className="w-4 h-4" />,
        category: 'analytics'
      },
      {
        id: 'team_collaboration',
        name: 'Team Collaboration',
        description: 'Share surveys and collaborate with team members',
        included: false,
        icon: <Users className="w-4 h-4" />,
        category: 'collaboration'
      }
    ],
    limits: {
      surveys: 3,
      responses: 100,
      teamMembers: 1,
      storage: '1GB',
      apiCalls: 1000,
      aiCredits: 0,
      exportFormats: ['CSV'],
      supportLevel: 'community'
    },
    icon: <Zap className="w-6 h-6" />,
    color: 'blue',
    cta: 'Get Started Free',
    ctaVariant: 'outline'
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For growing businesses and serious researchers',
    price: {
      monthly: 29,
      yearly: 290,
      currency: 'USD'
    },
    features: [
      {
        id: 'advanced_surveys',
        name: 'Advanced Surveys',
        description: 'Drag-and-drop builder with custom logic and branching',
        included: true,
        icon: <Settings className="w-4 h-4" />,
        category: 'core'
      },
      {
        id: 'ai_personas',
        name: 'AI Personas',
        description: 'Generate detailed customer personas with AI',
        included: true,
        icon: <Brain className="w-4 h-4" />,
        category: 'ai'
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Statistical significance testing, confidence intervals, and pattern detection',
        included: true,
        icon: <Target className="w-4 h-4" />,
        category: 'analytics'
      },
      {
        id: 'team_collaboration',
        name: 'Team Collaboration',
        description: 'Share surveys and collaborate with up to 5 team members',
        included: true,
        icon: <Users className="w-4 h-4" />,
        category: 'collaboration'
      },
      {
        id: 'unlimited_responses',
        name: '1,000 Responses/Month',
        description: 'Collect up to 1,000 responses per month',
        included: true,
        category: 'core'
      },
      {
        id: 'advanced_export',
        name: 'Advanced Export',
        description: 'Export in CSV, PDF, and Excel formats',
        included: true,
        icon: <Download className="w-4 h-4" />,
        category: 'core'
      },
      {
        id: 'email_support',
        name: 'Email Support',
        description: 'Priority email support with 24-hour response time',
        included: true,
        icon: <MessageSquare className="w-4 h-4" />,
        category: 'support'
      },
      {
        id: 'api_access',
        name: 'API Access',
        description: 'Access to REST API for integrations',
        included: true,
        icon: <Globe className="w-4 h-4" />,
        category: 'integrations'
      },
      {
        id: 'quantum_patterns',
        name: 'Quantum Pattern Detection',
        description: 'Advanced multi-dimensional pattern analysis',
        included: false,
        icon: <Brain className="w-4 h-4" />,
        category: 'ai'
      },
      {
        id: 'neural_pricing',
        name: 'Neural Price Optimization',
        description: 'AI-powered dynamic pricing recommendations',
        included: false,
        icon: <Target className="w-4 h-4" />,
        category: 'ai'
      }
    ],
    limits: {
      surveys: 20,
      responses: 1000,
      teamMembers: 5,
      storage: '10GB',
      apiCalls: 10000,
      aiCredits: 1000,
      exportFormats: ['CSV', 'PDF', 'Excel'],
      supportLevel: 'email'
    },
    popular: true,
    icon: <Star className="w-6 h-6" />,
    color: 'purple',
    cta: 'Start Free Trial',
    ctaVariant: 'primary'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: {
      monthly: 99,
      yearly: 990,
      currency: 'USD'
    },
    features: [
      {
        id: 'unlimited_surveys',
        name: 'Unlimited Surveys',
        description: 'Create unlimited surveys with advanced features',
        included: true,
        icon: <BarChart3 className="w-4 h-4" />,
        category: 'core'
      },
      {
        id: 'quantum_patterns',
        name: 'Quantum Pattern Detection',
        description: 'Advanced multi-dimensional pattern analysis',
        included: true,
        icon: <Brain className="w-4 h-4" />,
        category: 'ai'
      },
      {
        id: 'neural_pricing',
        name: 'Neural Price Optimization',
        description: 'AI-powered dynamic pricing recommendations',
        included: true,
        icon: <Target className="w-4 h-4" />,
        category: 'ai'
      },
      {
        id: 'bayesian_validation',
        name: 'Bayesian Validation',
        description: 'Advanced statistical validation with confidence scoring',
        included: true,
        icon: <Shield className="w-4 h-4" />,
        category: 'analytics'
      },
      {
        id: 'unlimited_responses',
        name: 'Unlimited Responses',
        description: 'Collect unlimited responses',
        included: true,
        category: 'core'
      },
      {
        id: 'unlimited_team',
        name: 'Unlimited Team Members',
        description: 'Collaborate with unlimited team members',
        included: true,
        icon: <Users className="w-4 h-4" />,
        category: 'collaboration'
      },
      {
        id: 'white_label',
        name: 'White Label',
        description: 'Custom branding and domain',
        included: true,
        icon: <Globe className="w-4 h-4" />,
        category: 'core'
      },
      {
        id: 'advanced_integrations',
        name: 'Advanced Integrations',
        description: 'HubSpot, Salesforce, and custom integrations',
        included: true,
        icon: <Settings className="w-4 h-4" />,
        category: 'integrations'
      },
      {
        id: 'dedicated_support',
        name: 'Dedicated Support',
        description: 'Dedicated account manager and priority support',
        included: true,
        icon: <MessageSquare className="w-4 h-4" />,
        category: 'support'
      },
      {
        id: 'sla_guarantee',
        name: 'SLA Guarantee',
        description: '99.9% uptime guarantee with SLA',
        included: true,
        icon: <Shield className="w-4 h-4" />,
        category: 'support'
      }
    ],
    limits: {
      surveys: 'unlimited',
      responses: 'unlimited',
      teamMembers: 'unlimited',
      storage: '100GB',
      apiCalls: 'unlimited',
      aiCredits: 'unlimited',
      exportFormats: ['CSV', 'PDF', 'Excel', 'PowerBI', 'Tableau'],
      supportLevel: 'dedicated'
    },
    icon: <Crown className="w-6 h-6" />,
    color: 'gold',
    cta: 'Contact Sales',
    ctaVariant: 'secondary'
  }
]

const featureCategories = {
  core: { name: 'Core Features', icon: <BarChart3 className="w-4 h-4" /> },
  ai: { name: 'AI Features', icon: <Brain className="w-4 h-4" /> },
  analytics: { name: 'Analytics', icon: <Target className="w-4 h-4" /> },
  collaboration: { name: 'Collaboration', icon: <Users className="w-4 h-4" /> },
  integrations: { name: 'Integrations', icon: <Settings className="w-4 h-4" /> },
  support: { name: 'Support', icon: <MessageSquare className="w-4 h-4" /> }
}

export function PricingTiers() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedTier, setSelectedTier] = useState<string>('pro')

  const getPrice = (tier: PricingTier) => {
    const price = billingPeriod === 'yearly' ? tier.price.yearly : tier.price.monthly
    const period = billingPeriod === 'yearly' ? 'year' : 'month'
    return { price, period }
  }

  const getSavings = (tier: PricingTier) => {
    if (billingPeriod === 'yearly') {
      const monthlyTotal = tier.price.monthly * 12
      const yearlyPrice = tier.price.yearly
      return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100)
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8">
            Start validating your product ideas with AI-powered market research
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-light-text-primary dark:text-dark-text-primary' : 'text-light-text-tertiary dark:text-dark-text-tertiary'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-light-border dark:bg-dark-border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-light-text-primary dark:text-dark-text-primary' : 'text-light-text-tertiary dark:text-dark-text-tertiary'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <Badge variant="secondary" className="ml-2">
                Save up to 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => {
            const { price, period } = getPrice(tier)
            const savings = getSavings(tier)
            const isSelected = selectedTier === tier.id

            return (
              <motion.div
                key={tier.id}
                whileHover={{ scale: 1.02 }}
                className={`relative ${tier.popular ? 'lg:scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary" className="px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card 
                  variant="default" 
                  className={`p-8 h-full transition-all ${
                    isSelected 
                      ? 'ring-2 ring-purple-500 shadow-lg' 
                      : tier.popular 
                        ? 'border-purple-200 dark:border-purple-800' 
                        : ''
                  }`}
                >
                  {/* Tier Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                      tier.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      tier.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      'bg-yellow-100 dark:bg-yellow-900/20'
                    }`}>
                      <div className={`${
                        tier.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        tier.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {tier.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                      {tier.description}
                    </p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        ${price}
                      </span>
                      <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                        /{period}
                      </span>
                      {savings > 0 && (
                        <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Save {savings}% with yearly billing
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {Object.entries(featureCategories).map(([categoryKey, category]) => {
                      const categoryFeatures = tier.features.filter(f => f.category === categoryKey)
                      if (categoryFeatures.length === 0) return null

                      return (
                        <div key={categoryKey}>
                          <div className="flex items-center space-x-2 mb-2">
                            {category.icon}
                            <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary">
                              {category.name}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {categoryFeatures.map((feature) => (
                              <div key={feature.id} className="flex items-start space-x-3">
                                <div className={`mt-0.5 ${feature.included ? 'text-green-500' : 'text-light-text-tertiary dark:text-dark-text-tertiary'}`}>
                                  {feature.included ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <X className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    {feature.icon && (
                                      <div className="text-light-text-tertiary dark:text-dark-text-tertiary">
                                        {feature.icon}
                                      </div>
                                    )}
                                    <span className={`text-sm ${feature.included ? 'text-light-text-primary dark:text-dark-text-primary' : 'text-light-text-tertiary dark:text-dark-text-tertiary'}`}>
                                      {feature.name}
                                    </span>
                                  </div>
                                  {feature.description && (
                                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                                      {feature.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={tier.ctaVariant as any}
                    className="w-full"
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    {tier.cta}
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary text-center mb-8">
            Feature Comparison
          </h2>
          
          <Card variant="default" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Features
                    </th>
                    {pricingTiers.map((tier) => (
                      <th key={tier.id} className="px-6 py-4 text-center text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {Object.entries(featureCategories).map(([categoryKey, category]) => {
                    const allFeatures = pricingTiers.flatMap(tier => 
                      tier.features.filter(f => f.category === categoryKey)
                    )
                    const uniqueFeatures = Array.from(
                      new Map(allFeatures.map(f => [f.id, f])).values()
                    )

                    return (
                      <tr key={categoryKey}>
                        <td className="px-6 py-4 font-medium text-light-text-primary dark:text-dark-text-primary">
                          {category.name}
                        </td>
                        {pricingTiers.map((tier) => (
                          <td key={tier.id} className="px-6 py-4 text-center">
                            <div className="space-y-1">
                              {uniqueFeatures.map((feature) => {
                                const tierFeature = tier.features.find(f => f.id === feature.id)
                                return (
                                  <div key={feature.id} className="flex items-center justify-center">
                                    {tierFeature?.included ? (
                                      <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <X className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card variant="default" className="p-6 text-left">
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
              </p>
            </Card>
            
            <Card variant="default" className="p-6 text-left">
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Your data is always yours. You can export all your surveys and responses before canceling, and we'll keep your data for 30 days after cancellation.
              </p>
            </Card>
            
            <Card variant="default" className="p-6 text-left">
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Do you offer custom enterprise plans?
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Yes, we offer custom enterprise plans with dedicated support, custom integrations, and volume discounts. Contact our sales team for more information.
              </p>
            </Card>
            
            <Card variant="default" className="p-6 text-left">
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Is there a free trial?
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start. You can also use our free plan indefinitely.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
