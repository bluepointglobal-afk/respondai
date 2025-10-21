'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Target, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Brain,
  BarChart3,
  Crown,
  Zap,
  Star,
  Home
} from 'lucide-react'
import Link from 'next/link'

interface OnboardingData {
  businessType: string
  industry: string
  experience: string
  productName: string
  productDescription: string
  targetAudience: string
  validationGoals: string[]
  teamSize: string
  budget: string
  timeline: string
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    businessType: '',
    industry: '',
    experience: '',
    productName: '',
    productDescription: '',
    targetAudience: '',
    validationGoals: [],
    teamSize: '',
    budget: '',
    timeline: ''
  })

  const steps = [
    {
      title: 'Welcome to RespondAI',
      subtitle: 'Let\'s get you set up for success',
      icon: <Star className="w-8 h-8" />
    },
    {
      title: 'Tell us about your business',
      subtitle: 'Help us understand your context',
      icon: <Users className="w-8 h-8" />
    },
    {
      title: 'Describe your product',
      subtitle: 'What are you validating?',
      icon: <Target className="w-8 h-8" />
    },
    {
      title: 'Choose your research goals',
      subtitle: 'What do you want to learn?',
      icon: <Brain className="w-8 h-8" />
    },
    {
      title: 'Your experience level',
      subtitle: 'How familiar are you with market research?',
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      title: 'Project details',
      subtitle: 'Timeline and resources',
      icon: <Crown className="w-8 h-8" />
    },
    {
      title: 'You\'re all set!',
      subtitle: 'Let\'s create your first survey',
      icon: <Zap className="w-8 h-8" />
    }
  ]

  const businessTypes = [
    { value: 'startup', label: 'Startup', description: 'Early-stage company' },
    { value: 'enterprise', label: 'Enterprise', description: 'Large organization' },
    { value: 'agency', label: 'Agency', description: 'Marketing/research agency' },
    { value: 'individual', label: 'Individual', description: 'Solo entrepreneur' }
  ]

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Real Estate', 'Travel', 'Food & Beverage', 'Automotive', 'Entertainment', 'Other'
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to market research' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced professional' },
    { value: 'expert', label: 'Expert', description: 'Market research expert' }
  ]

  const validationGoals = [
    { id: 'concept-testing', label: 'Concept Testing', description: 'Test if your idea resonates' },
    { id: 'product-market-fit', label: 'Product-Market Fit', description: 'Measure PMF score' },
    { id: 'feature-prioritization', label: 'Feature Prioritization', description: 'MaxDiff, Kano Model' },
    { id: 'price-sensitivity', label: 'Price Sensitivity', description: 'Van Westendorp pricing' },
    { id: 'brand-positioning', label: 'Brand Positioning', description: 'Perceptual mapping' },
    { id: 'target-audience', label: 'Target Audience', description: 'ICP validation' },
    { id: 'competitive-analysis', label: 'Competitive Analysis', description: 'Brand switching' },
    { id: 'customer-journey', label: 'Customer Journey', description: 'Touchpoint mapping' }
  ]

  const teamSizes = [
    { value: '1', label: 'Just me' },
    { value: '2-5', label: '2-5 people' },
    { value: '6-20', label: '6-20 people' },
    { value: '21-50', label: '21-50 people' },
    { value: '50+', label: '50+ people' }
  ]

  const budgets = [
    { value: 'free', label: 'Free tier' },
    { value: '99', label: '$99/month' },
    { value: '299', label: '$299/month' },
    { value: 'custom', label: 'Custom enterprise' }
  ]

  const timelines = [
    { value: '1-week', label: '1 week' },
    { value: '2-weeks', label: '2 weeks' },
    { value: '1-month', label: '1 month' },
    { value: '3-months', label: '3 months' },
    { value: 'ongoing', label: 'Ongoing' }
  ]

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true
      case 1: return !!data.businessType && !!data.industry
      case 2: return !!data.productName && !!data.productDescription && !!data.targetAudience
      case 3: return data.validationGoals.length > 0
      case 4: return !!data.experience
      case 5: return !!data.teamSize && !!data.budget && !!data.timeline
      case 6: return true
      default: return false
    }
  }

  const nextStep = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleValidationGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      validationGoals: prev.validationGoals.includes(goalId)
        ? prev.validationGoals.filter(id => id !== goalId)
        : [...prev.validationGoals, goalId]
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                Welcome to RespondAI
              </h2>
              <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                The professional market research platform trusted by Fortune 500 companies. 
                Let's set up your account for maximum success.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">AI-Powered</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Intelligent survey generation</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">Professional</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Industry-standard methodologies</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">Enterprise-Ready</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">Scalable and secure</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
                  Business Type
                </label>
                <div className="space-y-2">
                  {businessTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        data.businessType === type.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-light-border dark:border-dark-border hover:border-purple-300'
                      }`}
                      onClick={() => setData(prev => ({ ...prev, businessType: type.value }))}
                    >
                      <div className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {type.label}
                      </div>
                      <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {type.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
                  Industry
                </label>
                <select
                  className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary"
                  value={data.industry}
                  onChange={(e) => setData(prev => ({ ...prev, industry: e.target.value }))}
                >
                  <option value="">Select your industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Product/Service Name
                </label>
                <Input
                  placeholder="e.g., AI-Powered CRM"
                  value={data.productName}
                  onChange={(e) => setData(prev => ({ ...prev, productName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Target Audience
                </label>
                <Input
                  placeholder="e.g., Small business owners"
                  value={data.targetAudience}
                  onChange={(e) => setData(prev => ({ ...prev, targetAudience: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Product Description
              </label>
              <textarea
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary h-24 resize-none"
                placeholder="Describe your product or service..."
                value={data.productDescription}
                onChange={(e) => setData(prev => ({ ...prev, productDescription: e.target.value }))}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Select all research goals that apply to your project:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {validationGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    data.validationGoals.includes(goal.id)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-light-border dark:border-dark-border hover:border-purple-300'
                  }`}
                  onClick={() => toggleValidationGoal(goal.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                      data.validationGoals.includes(goal.id)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {data.validationGoals.includes(goal.id) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {goal.label}
                      </h3>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              How familiar are you with market research methodologies?
            </p>
            
            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <div
                  key={level.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    data.experience === level.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-light-border dark:border-dark-border hover:border-purple-300'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, experience: level.value }))}
                >
                  <div className="font-medium text-light-text-primary dark:text-dark-text-primary">
                    {level.label}
                  </div>
                  <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {level.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
                  Team Size
                </label>
                <div className="space-y-2">
                  {teamSizes.map((size) => (
                    <div
                      key={size.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        data.teamSize === size.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-light-border dark:border-dark-border hover:border-purple-300'
                      }`}
                      onClick={() => setData(prev => ({ ...prev, teamSize: size.value }))}
                    >
                      {size.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
                  Budget
                </label>
                <div className="space-y-2">
                  {budgets.map((budget) => (
                    <div
                      key={budget.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        data.budget === budget.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-light-border dark:border-dark-border hover:border-purple-300'
                      }`}
                      onClick={() => setData(prev => ({ ...prev, budget: budget.value }))}
                    >
                      {budget.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
                  Timeline
                </label>
                <div className="space-y-2">
                  {timelines.map((timeline) => (
                    <div
                      key={timeline.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        data.timeline === timeline.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-light-border dark:border-dark-border hover:border-purple-300'
                      }`}
                      onClick={() => setData(prev => ({ ...prev, timeline: timeline.value }))}
                    >
                      {timeline.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                Perfect! You're all set up
              </h2>
              <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                Based on your profile, we've customized RespondAI for your specific needs. 
                You're ready to create professional market research surveys.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card variant="default" className="p-6">
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                  Recommended Next Steps
                </h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Create your first survey
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Set up your analytics dashboard
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Invite team members
                    </span>
                  </div>
                </div>
              </Card>

              <Card variant="default" className="p-6">
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                  Your Profile Summary
                </h3>
                <div className="space-y-2 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Business:</span>
                    <span className="text-light-text-primary dark:text-dark-text-primary">{data.businessType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Industry:</span>
                    <span className="text-light-text-primary dark:text-dark-text-primary">{data.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Goals:</span>
                    <span className="text-light-text-primary dark:text-dark-text-primary">{data.validationGoals.length}</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/professional-survey-builder">
                <Button variant="primary" size="lg">
                  <Brain className="w-5 h-5 mr-2" />
                  Create Your First Survey
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
              RespondAI
            </span>
          </Link>
          
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
              Setup Progress
            </span>
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-white">
              {steps[currentStep].icon}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Step Content */}
        <Card variant="default" className="p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-purple-500'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Link href="/professional-survey-builder">
              <Button variant="primary">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
