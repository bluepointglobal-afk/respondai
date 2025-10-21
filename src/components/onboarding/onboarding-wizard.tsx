'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  Users, 
  BarChart3,
  Sparkles,
  Zap,
  Brain
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  component: React.ReactNode
  tips?: string[]
}

interface OnboardingData {
  businessType: 'startup' | 'enterprise' | 'agency' | 'individual'
  industry: string
  productName: string
  productDescription: string
  targetAudience: string
  validationGoals: string[]
  experience: 'beginner' | 'intermediate' | 'expert'
}

export function OnboardingWizard({ onComplete }: { onComplete: (data: OnboardingData) => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    businessType: 'startup',
    industry: '',
    productName: '',
    productDescription: '',
    targetAudience: '',
    validationGoals: [],
    experience: 'beginner'
  })

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to RespondAI! 🎉',
      description: 'Let\'s get you set up with AI-powered market research in just 2 minutes.',
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
              AI-Powered Market Research
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Validate your product ideas with sophisticated analytics and AI insights
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card variant="stat" className="p-4">
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold">Fast Results</h3>
                  <p className="text-sm text-light-text-tertiary">Get insights in minutes</p>
                </div>
              </div>
            </Card>
            <Card variant="stat" className="p-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Professional Analytics</h3>
                  <p className="text-sm text-light-text-tertiary">Statistical rigor</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'business-type',
      title: 'What describes you best?',
      description: 'This helps us customize your experience',
      icon: <Target className="w-6 h-6 text-blue-500" />,
      component: (
        <div className="space-y-4">
          {[
            { value: 'startup', label: '🚀 Startup Founder', desc: 'Validating a new product idea' },
            { value: 'enterprise', label: '🏢 Enterprise Team', desc: 'Testing features for existing products' },
            { value: 'agency', label: '🎯 Marketing Agency', desc: 'Running research for clients' },
            { value: 'individual', label: '👤 Individual Researcher', desc: 'Personal projects and learning' }
          ].map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                variant="default" 
                className={`p-4 cursor-pointer transition-all ${
                  data.businessType === option.value 
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setData(prev => ({ ...prev, businessType: option.value as any }))}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {option.label}
                    </h3>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {option.desc}
                    </p>
                  </div>
                  {data.businessType === option.value && (
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'product-info',
      title: 'Tell us about your product',
      description: 'This helps our AI generate better insights',
      icon: <Lightbulb className="w-6 h-6 text-green-500" />,
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Product Name *
            </label>
            <Input
              placeholder="e.g., EcoFriendly Water Bottle"
              value={data.productName}
              onChange={(e) => setData(prev => ({ ...prev, productName: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Industry *
            </label>
            <Select
              value={data.industry}
              onChange={(e) => setData(prev => ({ ...prev, industry: e.target.value }))}
            >
              <option value="">Select an industry</option>
              <option value="health-wellness">Health & Wellness</option>
              <option value="technology">Technology & Software</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="food-beverage">Food & Beverage</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="education">Education & Courses</option>
              <option value="home-garden">Home & Garden</option>
              <option value="fitness">Fitness Equipment</option>
              <option value="baby-parenting">Baby & Parenting</option>
              <option value="pet-products">Pet Products</option>
              <option value="office-productivity">Office & Productivity</option>
              <option value="custom">Custom/Other</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Product Description *
            </label>
            <Textarea
              placeholder="Describe your product, its key features, and what problem it solves..."
              rows={4}
              value={data.productDescription}
              onChange={(e) => setData(prev => ({ ...prev, productDescription: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Target Audience *
            </label>
            <Textarea
              placeholder="Who is your ideal customer? Include demographics, psychographics, and pain points..."
              rows={3}
              value={data.targetAudience}
              onChange={(e) => setData(prev => ({ ...prev, targetAudience: e.target.value }))}
            />
          </div>
        </div>
      )
    },
    {
      id: 'validation-goals',
      title: 'What do you want to validate?',
      description: 'Select your primary validation goals',
      icon: <Users className="w-6 h-6 text-orange-500" />,
      component: (
        <div className="space-y-4">
          {[
            { id: 'market-demand', label: 'Market Demand', desc: 'Is there real demand for this product?' },
            { id: 'pricing-strategy', label: 'Pricing Strategy', desc: 'What price point maximizes revenue?' },
            { id: 'target-audience', label: 'Target Audience', desc: 'Who are my ideal customers?' },
            { id: 'product-features', label: 'Product Features', desc: 'Which features matter most?' },
            { id: 'brand-positioning', label: 'Brand Positioning', desc: 'How should I position my brand?' },
            { id: 'competitive-advantage', label: 'Competitive Advantage', desc: 'What makes me unique?' }
          ].map((goal) => (
            <motion.div
              key={goal.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                variant="default" 
                className={`p-4 cursor-pointer transition-all ${
                  data.validationGoals.includes(goal.id)
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => {
                  setData(prev => ({
                    ...prev,
                    validationGoals: prev.validationGoals.includes(goal.id)
                      ? prev.validationGoals.filter(g => g !== goal.id)
                      : [...prev.validationGoals, goal.id]
                  }))
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {goal.label}
                    </h3>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {goal.desc}
                    </p>
                  </div>
                  {data.validationGoals.includes(goal.id) && (
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'experience',
      title: 'What\'s your experience level?',
      description: 'This helps us tailor the complexity of insights',
      icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
      component: (
        <div className="space-y-4">
          {[
            { 
              value: 'beginner', 
              label: '🆕 Beginner', 
              desc: 'New to market research, want simple insights',
              features: ['Simple explanations', 'Step-by-step guidance', 'Basic analytics']
            },
            { 
              value: 'intermediate', 
              label: '📈 Intermediate', 
              desc: 'Some experience, want balanced insights',
              features: ['Detailed analysis', 'Statistical context', 'Actionable recommendations']
            },
            { 
              value: 'expert', 
              label: '🎯 Expert', 
              desc: 'Experienced researcher, want advanced analytics',
              features: ['Advanced statistics', 'Raw data access', 'Custom analysis']
            }
          ].map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                variant="default" 
                className={`p-4 cursor-pointer transition-all ${
                  data.experience === option.value
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setData(prev => ({ ...prev, experience: option.value as any }))}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {option.label}
                    </h3>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {option.desc}
                    </p>
                  </div>
                  {data.experience === option.value && (
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re all set! 🎉',
      description: 'Let\'s create your first AI-powered survey',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
              Ready to Validate Your Product!
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              We'll use your information to generate AI-powered personas and survey questions
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI generates 3 target personas based on your audience</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Creates a custom survey with validation questions</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Collects responses and runs statistical analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Provides actionable insights and recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true
      case 1: return !!data.businessType
      case 2: return data.productName && data.industry && data.productDescription && data.targetAudience
      case 3: return data.validationGoals.length > 0
      case 4: return !!data.experience
      case 5: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete(data)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card variant="default" className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              {currentStepData.icon}
              <div>
                <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {currentStepData.title}
                </h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.component}
            </motion.div>
          </AnimatePresence>

          {/* Tips */}
          {currentStepData.tips && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Pro Tips
              </h4>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
