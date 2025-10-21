'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, 
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  Target,
  Brain,
  Calculator,
  TrendingUp
} from 'lucide-react'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      period: 'month',
      description: 'Perfect for individuals and small teams getting started',
      features: [
        'Up to 3 surveys per month',
        '100 responses per survey',
        'Basic question types',
        'Standard analytics',
        'Email support',
        'Basic templates'
      ],
      limitations: [
        'Limited to basic question types',
        'No advanced analytics',
        'Basic reporting only'
      ],
      cta: 'Start Free',
      popular: false,
      icon: <Users className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      period: 'month',
      description: 'For growing businesses and market research professionals',
      features: [
        'Unlimited surveys',
        '1,000 responses per survey',
        'All question types (25+)',
        'Van Westendorp pricing analysis',
        'MaxDiff feature prioritization',
        'Kano Model classification',
        'Advanced analytics dashboard',
        'Statistical rigor tools',
        'Sample size calculator',
        'Professional templates',
        'Priority support',
        'Data export (CSV, PDF)',
        'Custom branding',
        'API access'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      period: 'month',
      description: 'For large organizations and research agencies',
      features: [
        'Everything in Professional',
        'Unlimited responses',
        'Quantum pattern detection',
        'Neural price optimization',
        'Bayesian validation models',
        'Advanced segmentation',
        'Perceptual mapping',
        'Brand equity tracking',
        'Jobs-to-be-Done analysis',
        'Executive report generation',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment option',
        'Advanced security features',
        'Multi-user collaboration',
        'Custom analytics workflows'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      icon: <Star className="w-6 h-6" />,
      color: 'gold'
    }
  ]

  const features = [
    {
      category: 'Survey Creation',
      items: [
        { name: 'Professional Survey Builder', description: 'Industry-standard methodologies', icon: <Brain className="w-5 h-5" /> },
        { name: 'AI-Guided Builder', description: 'AI-powered question generation', icon: <Zap className="w-5 h-5" /> },
        { name: 'Drag & Drop Builder', description: 'Visual survey creation', icon: <Target className="w-5 h-5" /> },
        { name: '25+ Question Types', description: 'NPS, MaxDiff, Van Westendorp, Kano', icon: <BarChart3 className="w-5 h-5" /> }
      ]
    },
    {
      category: 'Advanced Analytics',
      items: [
        { name: 'Van Westendorp Pricing', description: 'Price sensitivity analysis', icon: <TrendingUp className="w-5 h-5" /> },
        { name: 'MaxDiff Analysis', description: 'Feature prioritization', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Kano Model', description: 'Feature classification', icon: <Target className="w-5 h-5" /> },
        { name: 'Quantum Patterns', description: 'Multi-dimensional analysis', icon: <Zap className="w-5 h-5" /> }
      ]
    },
    {
      category: 'Professional Tools',
      items: [
        { name: 'Sample Size Calculator', description: 'Statistical sample planning', icon: <Calculator className="w-5 h-5" /> },
        { name: 'Statistical Rigor', description: 'Confidence intervals & significance', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Executive Reports', description: 'Professional report generation', icon: <Crown className="w-5 h-5" /> },
        { name: 'Brand Equity Tracking', description: 'Brand health measurement', icon: <Star className="w-5 h-5" /> }
      ]
    }
  ]

  const getPlanColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
      case 'purple': return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
      case 'gold': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20'
    }
  }

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 dark:text-blue-400'
      case 'purple': return 'text-purple-600 dark:text-purple-400'
      case 'gold': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Professional Pricing Plans
            </h1>
          </div>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
            Choose the perfect plan for your market research needs. All plans include industry-standard methodologies 
            and professional-grade analytics.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`relative ${plan.popular ? 'scale-105' : ''}`}
              whileHover={{ scale: plan.popular ? 1.05 : 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge variant="primary" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card 
                variant="default" 
                className={`h-full p-8 ${getPlanColor(plan.color)} ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    plan.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/40' :
                    plan.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/40' :
                    'bg-yellow-100 dark:bg-yellow-900/40'
                  }`}>
                    <div className={getIconColor(plan.color)}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
                      ${plan.price}
                    </span>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">
                      /{plan.period}
                    </span>
                  </div>
                  
                  <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {feature}
                      </span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-light-border dark:border-dark-border">
                      <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                        Limitations:
                      </h4>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                  size="lg"
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-light-text-primary dark:text-dark-text-primary mb-12">
            Complete Feature Comparison
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((category, categoryIndex) => (
              <Card key={categoryIndex} variant="default" className="p-6">
                <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">
                  {category.category}
                </h3>
                
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-purple-600 dark:text-purple-400">
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary">
                          {item.name}
                        </h4>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card variant="default" className="p-8">
          <h2 className="text-2xl font-bold text-center text-light-text-primary dark:text-dark-text-primary mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Is there a free trial?
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Professional and Enterprise plans include a 14-day free trial with full access to all features.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                We accept all major credit cards, PayPal, and for Enterprise plans, we can arrange invoicing.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Do you offer custom solutions?
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Yes, Enterprise customers can request custom integrations, white-label solutions, and on-premise deployment.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card variant="default" className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of professionals using RespondAI for market research
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="secondary" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600">
                <Crown className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
