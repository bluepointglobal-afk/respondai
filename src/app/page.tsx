'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Sparkles, 
  Target, 
  Users, 
  BarChart3,
  Zap,
  ArrowRight,
  Play,
  Settings,
  MessageSquare,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Star,
  Crown,
  Rocket,
  LogIn,
  UserPlus
} from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (status === 'authenticated' && session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      title: 'Unified Survey Platform',
      description: 'Complete survey creation platform with multiple builder options',
      link: '/auth/register',
      status: 'unified',
      highlights: ['Quick templates', 'AI generation', 'Professional methodologies', 'Industry-specific builders']
    },
    {
      icon: <Star className="w-8 h-8 text-blue-500" />,
      title: 'Professional Survey Builder',
      description: 'Industry-standard market research with Van Westendorp, MaxDiff, Kano Model',
      link: '/professional-survey-builder',
      status: 'professional',
      highlights: ['Van Westendorp pricing', 'MaxDiff prioritization', 'Kano classification', 'Statistical rigor']
    },
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: 'Quantum Pattern Detection',
      description: 'Advanced multi-dimensional analysis using quantum-inspired algorithms',
      link: '/quantum-patterns',
      status: 'advanced',
      highlights: ['Superposition patterns', 'Entanglement analysis', 'Interference detection']
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      title: 'Neural Price Optimization',
      description: 'AI-powered dynamic pricing recommendations with TensorFlow.js',
      link: '/neural-pricing',
      status: 'ai-powered',
      highlights: ['Dynamic pricing', 'Demand curve analysis', 'Conversion prediction']
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      title: 'Bayesian Validation',
      description: 'Sophisticated confidence scoring using Bayesian inference',
      link: '/bayesian-validation',
      status: 'enterprise',
      highlights: ['Credible intervals', 'Prior knowledge integration', 'Robustness testing']
    },
    {
      icon: <Users className="w-8 h-8 text-pink-500" />,
      title: 'Interactive Onboarding',
      description: '6-step guided setup with AI-assisted configuration',
      link: '/auth/register',
      status: 'guided',
      highlights: ['Business type detection', 'Smart recommendations', 'Seamless integration']
    },
    {
      icon: <Crown className="w-8 h-8 text-yellow-500" />,
      title: 'Tiered Pricing Model',
      description: 'Professional pricing structure with freemium options',
      link: '/pricing',
      status: 'professional',
      highlights: ['Freemium strategy', 'Enterprise features', 'Clear differentiation']
    }
  ]

  const demos = [
    {
      id: 'revamped-builder',
      title: 'Revamped Survey Builder',
      description: 'Deep, industry-specific surveys with AI intelligence',
      component: <RevampedSurveyBuilderDemo />
    },
    {
      id: 'professional-builder',
      title: 'Professional Survey Builder',
      description: 'Industry-standard methodologies with statistical rigor',
      component: <ProfessionalSurveyBuilderDemo />
    },
    {
      id: 'quantum-analysis',
      title: 'Quantum Pattern Analysis',
      description: 'See advanced multi-dimensional pattern detection in action',
      component: <QuantumAnalysisDemo />
    },
    {
      id: 'neural-pricing',
      title: 'Neural Price Optimization',
      description: 'Watch AI optimize pricing strategies in real-time',
      component: <NeuralPricingDemo />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                RespondAI
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg mb-6">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  AI-Powered Market Research Platform
            </span>
          </div>
              
              <h1 className="text-5xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
                Validate Your Product Ideas with
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {' '}AI Intelligence
                </span>
              </h1>
              
              <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-3xl mx-auto">
                Create sophisticated validation surveys in minutes, not weeks. 
                Our AI analyzes your product, generates intelligent questions, 
                and provides enterprise-grade insights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link href="/auth/register">
                <Button size="lg" variant="primary" className="text-lg px-8 py-4">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-40 right-20 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"
          />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 3, 0]
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute bottom-40 left-20 w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20"
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
            Advanced AI Features
          </h2>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
            Enterprise-grade capabilities that set you apart from basic survey tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card variant="default" className="p-6 h-full cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                        {feature.title}
                      </h3>
                      <Badge 
                        variant={
                          feature.status === 'new' ? 'primary' :
                          feature.status === 'advanced' ? 'secondary' :
                          feature.status === 'ai-powered' ? 'outline' :
                          'default'
                        }
                        className="text-xs"
                      >
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                      {feature.description}
                    </p>
                    <div className="space-y-1">
                      {feature.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
        </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              Try It Live
            </h2>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
              Experience our AI features in action
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {demos.map((demo) => (
              <Card 
                key={demo.id}
                variant="default" 
                className={`p-6 cursor-pointer transition-all ${
                  activeDemo === demo.id ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                    {demo.title}
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                    {demo.description}
                  </p>
                  <Button variant="secondary" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    {activeDemo === demo.id ? 'Hide Demo' : 'Show Demo'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Demo Content */}
          <AnimatePresence>
            {activeDemo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card variant="default" className="p-6">
                  {demos.find(d => d.id === activeDemo)?.component}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Validate Your Product Ideas?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of entrepreneurs using AI to make data-driven decisions
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Star className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-purple-600">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
    </div>
    </div>
  )
}

// Demo Components
function RevampedSurveyBuilderDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Revamped Survey Builder
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Deep, industry-specific surveys with AI intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="default" className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              Product Intelligence
            </h4>
          </div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            AI analyzes your product description to understand category, claims, and target audience
          </p>
        </Card>

        <Card variant="default" className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              Category-Specific Questions
            </h4>
          </div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Generates 200+ validated questions tailored to supplements, beverages, SaaS, and more
          </p>
        </Card>

        <Card variant="default" className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              Quality Validation
            </h4>
          </div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Real-time scoring ensures professional-grade surveys with 85%+ quality scores
          </p>
        </Card>

        <Card variant="default" className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              Professional Methodologies
            </h4>
          </div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Includes Van Westendorp pricing, MaxDiff analysis, NPS, and Product-Market Fit questions
          </p>
        </Card>
      </div>

      <div className="text-center">
        <Link href="/revamped-survey-builder">
          <Button variant="primary">
            <ArrowRight className="w-4 h-4 mr-2" />
            Try Revamped Builder
          </Button>
        </Link>
      </div>
    </div>
  )
}

function AISurveyBuilderDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          AI Survey Builder
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Watch AI create intelligent validation questions
        </p>
          </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">1</span>
          </div>
            <div>
              <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                How often do you face this problem?
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                AI Reasoning: Validates problem frequency - key indicator of market demand
              </p>
        </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <div>
              <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                What's your biggest frustration with current solutions?
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                AI Reasoning: Identifies pain points to position your product against
              </p>
                </div>
              </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                How much would you pay for a solution?
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                AI Reasoning: Price sensitivity analysis for optimal pricing strategy
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button variant="primary">
          <ArrowRight className="w-4 h-4 mr-2" />
          Try AI Builder
        </Button>
      </div>
    </div>
  )
}

function QuantumAnalysisDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Quantum Pattern Analysis
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Advanced multi-dimensional pattern detection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="default" className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Superposition Patterns
          </h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Multi-state demographic combinations
          </p>
        </Card>

        <Card variant="default" className="p-4 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Entanglement Analysis
          </h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Cross-dimensional correlations
          </p>
        </Card>

        <Card variant="default" className="p-4 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Interference Detection
          </h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Segment interaction patterns
          </p>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="primary">
          <ArrowRight className="w-4 h-4 mr-2" />
          Explore Patterns
        </Button>
      </div>
    </div>
  )
}

function NeuralPricingDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Neural Price Optimization
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          AI-powered dynamic pricing recommendations
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-light-text-primary dark:text-dark-text-primary">Price Sensitive Segment</span>
            <Badge variant="secondary">$29 - $45</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-light-text-primary dark:text-dark-text-primary">Premium Seekers</span>
            <Badge variant="primary">$75 - $99</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-light-text-primary dark:text-dark-text-primary">Brand Loyal</span>
            <Badge variant="outline">$55 - $75</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-light-text-primary dark:text-dark-text-primary">Early Adopters</span>
            <Badge variant="secondary">$65 - $85</Badge>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button variant="primary">
          <ArrowRight className="w-4 h-4 mr-2" />
          Optimize Pricing
        </Button>
      </div>
    </div>
  )
}

function ProfessionalSurveyBuilderDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Professional Survey Builder
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Industry-standard market research methodologies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="default" className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Van Westendorp Pricing
          </h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Industry standard for price sensitivity analysis
          </p>
        </Card>

        <Card variant="default" className="p-4 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            MaxDiff Analysis
          </h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Feature prioritization with statistical significance
          </p>
        </Card>

        <Card variant="default" className="p-4 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Kano Model
          </h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Must-Be, Performance, Attractive classification
          </p>
        </Card>

        <Card variant="default" className="p-4 text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Statistical Rigor
          </h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Sample size calculator with confidence intervals
          </p>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="primary">
          <ArrowRight className="w-4 h-4 mr-2" />
          Try Professional Builder
        </Button>
      </div>
    </div>
  )
}