'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Sparkles, 
  Lightbulb, 
  Target, 
  Users, 
  BarChart3,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Eye
} from 'lucide-react'

interface AIInsight {
  id: string
  type: 'suggestion' | 'warning' | 'optimization' | 'prediction'
  title: string
  description: string
  confidence: number
  action?: string
  impact?: 'high' | 'medium' | 'low'
}

interface DynamicQuestion {
  id: string
  text: string
  type: 'multiple_choice' | 'scale' | 'text' | 'yes_no' | 'ranking'
  options?: string[]
  scale?: { min: number; max: number; labels: { min: string; max: string } }
  aiReasoning?: string
  followUpQuestions?: string[]
  skipLogic?: {
    condition: string
    skipTo: string
  }
}

interface AIRecommendation {
  category: 'question' | 'flow' | 'analysis' | 'optimization'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action: string
  expectedImpact: string
}

export function AIGuidedSurveyBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState({
    productName: '',
    industry: '',
    targetAudience: '',
    validationGoals: [] as string[],
    questions: [] as DynamicQuestion[],
    aiInsights: [] as AIInsight[],
    recommendations: [] as AIRecommendation[]
  })
  
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [aiSuggestions, setAISuggestions] = useState<AIRecommendation[]>([])
  const [conversationHistory, setConversationHistory] = useState<{
    user: string
    ai: string
    timestamp: Date
  }[]>([])

  const steps = [
    { id: 'product', title: 'Product Setup', icon: <Target className="w-5 h-5" /> },
    { id: 'audience', title: 'AI Audience Analysis', icon: <Users className="w-5 h-5" /> },
    { id: 'questions', title: 'Dynamic Question Generation', icon: <Brain className="w-5 h-5" /> },
    { id: 'optimization', title: 'AI Optimization', icon: <Zap className="w-5 h-5" /> },
    { id: 'preview', title: 'Smart Preview', icon: <Eye className="w-5 h-5" /> }
  ]

  // AI-powered product analysis
  const analyzeProduct = useCallback(async (productData: any) => {
    setIsAIThinking(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const insights: AIInsight[] = [
      {
        id: 'market_size',
        type: 'prediction',
        title: 'Market Opportunity Detected',
        description: `Based on your product description, I've identified a ${productData.industry} market opportunity with high growth potential.`,
        confidence: 0.87,
        impact: 'high'
      },
      {
        id: 'competition',
        type: 'warning',
        title: 'Competitive Landscape',
        description: 'I found 3 direct competitors in your space. Consider highlighting unique differentiators.',
        confidence: 0.92,
        action: 'Add differentiation questions',
        impact: 'medium'
      },
      {
        id: 'pricing',
        type: 'optimization',
        title: 'Pricing Strategy Suggestion',
        description: 'Based on similar products, I recommend testing multiple price points between $29-$99.',
        confidence: 0.78,
        action: 'Include price sensitivity questions',
        impact: 'high'
      }
    ]

    const recommendations: AIRecommendation[] = [
      {
        category: 'question',
        title: 'Add Problem Validation Questions',
        description: 'Validate the core problem your product solves',
        priority: 'high',
        action: 'Add 3 problem validation questions',
        expectedImpact: 'Increase validation accuracy by 40%'
      },
      {
        category: 'flow',
        title: 'Optimize Question Flow',
        description: 'Reorder questions for better completion rates',
        priority: 'medium',
        action: 'Reorder questions by engagement level',
        expectedImpact: 'Improve completion rate by 25%'
      }
    ]

    setSurveyData(prev => ({
      ...prev,
      aiInsights: insights,
      recommendations: recommendations
    }))
    
    setIsAIThinking(false)
  }, [])

  // AI-powered question generation
  const generateQuestions = useCallback(async (context: any) => {
    setIsAIThinking(true)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const dynamicQuestions: DynamicQuestion[] = [
      {
        id: 'q1',
        text: 'How often do you currently face this problem?',
        type: 'scale',
        scale: { min: 1, max: 5, labels: { min: 'Never', max: 'Daily' } },
        aiReasoning: 'This validates problem frequency - a key indicator of market demand',
        followUpQuestions: ['What\'s your current solution?', 'How much does it cost you?']
      },
      {
        id: 'q2',
        text: 'What\'s your biggest frustration with current solutions?',
        type: 'multiple_choice',
        options: ['Too expensive', 'Poor quality', 'Hard to use', 'Slow delivery', 'Poor support'],
        aiReasoning: 'Identifies pain points to position your product against',
        skipLogic: {
          condition: 'if q1 < 3',
          skipTo: 'q4'
        }
      },
      {
        id: 'q3',
        text: 'How much would you pay for a solution that addresses these issues?',
        type: 'multiple_choice',
        options: ['Under $25', '$25-$50', '$50-$100', '$100-$200', 'Over $200'],
        aiReasoning: 'Price sensitivity analysis for optimal pricing strategy'
      },
      {
        id: 'q4',
        text: 'What would convince you to try a new solution?',
        type: 'ranking',
        options: ['Free trial', 'Money-back guarantee', 'Customer reviews', 'Demo video', 'Expert recommendation'],
        aiReasoning: 'Identifies conversion drivers for marketing strategy'
      }
    ]

    setSurveyData(prev => ({
      ...prev,
      questions: dynamicQuestions
    }))
    
    setIsAIThinking(false)
  }, [])

  // AI conversation interface
  const chatWithAI = useCallback(async (userMessage: string) => {
    const newHistory = [...conversationHistory, {
      user: userMessage,
      ai: '',
      timestamp: new Date()
    }]
    setConversationHistory(newHistory)

    setIsAIThinking(true)
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const aiResponse = generateAIResponse(userMessage, surveyData)
    
    setConversationHistory(prev => prev.map((item, index) => 
      index === prev.length - 1 ? { ...item, ai: aiResponse } : item
    ))
    
    setIsAIThinking(false)
  }, [conversationHistory, surveyData])

  const generateAIResponse = (userMessage: string, context: any): string => {
    const responses = [
      "Based on your product description, I'd recommend focusing on problem validation first. Would you like me to generate specific questions for that?",
      "I notice you haven't included pricing questions yet. This is crucial for validation. Should I add some price sensitivity questions?",
      "Your target audience seems broad. Would you like me to help you narrow it down with demographic questions?",
      "I can see potential for A/B testing different value propositions. Would you like me to create variant questions?",
      "Based on similar products in your industry, I suggest adding feature prioritization questions. Shall I generate those?"
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      
      // Trigger AI analysis at specific steps
      if (currentStep === 0) {
        analyzeProduct(surveyData)
      } else if (currentStep === 2) {
        generateQuestions(surveyData)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const addAISuggestion = (suggestion: AIRecommendation) => {
    setSurveyData(prev => ({
      ...prev,
      recommendations: [...prev.recommendations, suggestion]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              AI-Guided Survey Builder
            </h1>
          </div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Let AI guide you through creating the perfect validation survey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card variant="default" className="p-6">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
                  </span>
                </div>
                <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
                
                <div className="flex items-center justify-between mt-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className={`flex items-center space-x-2 ${
                      index <= currentStep ? 'text-purple-600 dark:text-purple-400' : 'text-light-text-tertiary dark:text-dark-text-tertiary'
                    }`}>
                      {step.icon}
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                  ))}
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
                  {currentStep === 0 && (
                    <ProductSetupStep 
                      data={surveyData} 
                      onUpdate={setSurveyData}
                      onAnalyze={analyzeProduct}
                    />
                  )}
                  
                  {currentStep === 1 && (
                    <AudienceAnalysisStep 
                      data={surveyData}
                      insights={surveyData.aiInsights}
                      isAIThinking={isAIThinking}
                    />
                  )}
                  
                  {currentStep === 2 && (
                    <QuestionGenerationStep 
                      data={surveyData}
                      questions={surveyData.questions}
                      isAIThinking={isAIThinking}
                    />
                  )}
                  
                  {currentStep === 3 && (
                    <OptimizationStep 
                      data={surveyData}
                      recommendations={surveyData.recommendations}
                      onAddSuggestion={addAISuggestion}
                    />
                  )}
                  
                  {currentStep === 4 && (
                    <PreviewStep data={surveyData} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
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
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center space-x-2"
                >
                  <span>{currentStep === steps.length - 1 ? 'Launch Survey' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            <AIAssistant 
              conversationHistory={conversationHistory}
              onSendMessage={chatWithAI}
              isAIThinking={isAIThinking}
              suggestions={aiSuggestions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Product Setup Step Component
function ProductSetupStep({ data, onUpdate, onAnalyze }: {
  data: any
  onUpdate: (updater: (prev: any) => any) => void
  onAnalyze: (data: any) => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Target className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Tell AI About Your Product
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          AI will analyze your product and suggest optimal validation questions
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            Product Name *
          </label>
          <Input
            placeholder="e.g., EcoFriendly Water Bottle"
            value={data.productName}
            onChange={(e) => onUpdate(prev => ({ ...prev, productName: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            Industry *
          </label>
          <select
            className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary"
            value={data.industry}
            onChange={(e) => onUpdate(prev => ({ ...prev, industry: e.target.value }))}
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
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            Target Audience *
          </label>
          <Textarea
            placeholder="Describe your ideal customer - demographics, psychographics, pain points..."
            rows={4}
            value={data.targetAudience}
            onChange={(e) => onUpdate(prev => ({ ...prev, targetAudience: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            Validation Goals
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Market Demand', 'Pricing Strategy', 'Target Audience', 
              'Product Features', 'Brand Positioning', 'Competitive Advantage'
            ].map((goal) => (
              <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.validationGoals.includes(goal)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onUpdate(prev => ({ ...prev, validationGoals: [...prev.validationGoals, goal] }))
                    } else {
                      onUpdate(prev => ({ ...prev, validationGoals: prev.validationGoals.filter((g: string) => g !== goal) }))
                    }
                  }}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm text-light-text-primary dark:text-dark-text-primary">{goal}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {data.productName && data.industry && data.targetAudience && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              AI Ready to Analyze
            </h3>
          </div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Click "Next" to let AI analyze your product and generate intelligent validation questions.
          </p>
        </motion.div>
      )}
    </div>
  )
}

// Audience Analysis Step Component
function AudienceAnalysisStep({ data, insights, isAIThinking }: {
  data: any
  insights: AIInsight[]
  isAIThinking: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          AI Audience Analysis
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          AI is analyzing your target audience and market opportunity
        </p>
      </div>

      {isAIThinking ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            AI is Thinking...
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Analyzing market data, competitor landscape, and audience patterns
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight: AIInsight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                insight.type === 'prediction' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  insight.type === 'prediction' ? 'bg-green-100 dark:bg-green-900/40' :
                  insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/40' :
                  'bg-blue-100 dark:bg-blue-900/40'
                }`}>
                  {insight.type === 'prediction' ? <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                   insight.type === 'warning' ? <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" /> :
                   <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {insight.title}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        Suggested action:
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {insight.action}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Question Generation Step Component
function QuestionGenerationStep({ data, questions, isAIThinking }: {
  data: any
  questions: DynamicQuestion[]
  isAIThinking: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          AI-Generated Questions
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          AI has created intelligent questions based on your product and goals
        </p>
      </div>

      {isAIThinking ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            AI is Generating Questions...
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Creating intelligent questions based on your validation goals
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question: DynamicQuestion, index: number) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-light-border dark:border-dark-border rounded-lg"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                    {question.text}
                  </h4>
                  
                  {question.aiReasoning && (
                    <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
                      <strong>AI Reasoning:</strong> {question.aiReasoning}
                    </div>
                  )}

                  {question.type === 'multiple_choice' && question.options && (
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <div className="w-2 h-2 bg-purple-400 rounded-full" />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'scale' && question.scale && (
                    <div className="flex items-center space-x-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      <span>{question.scale.labels.min}</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: question.scale.max - question.scale.min + 1 }, (_, i) => (
                          <div key={i} className="w-6 h-6 border border-light-border dark:border-dark-border rounded flex items-center justify-center">
                            {i + question.scale!.min}
                          </div>
                        ))}
                      </div>
                      <span>{question.scale.labels.max}</span>
                    </div>
                  )}

                  {question.skipLogic && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-200">
                      <strong>Skip Logic:</strong> {question.skipLogic.condition} → Skip to {question.skipLogic.skipTo}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Optimization Step Component
function OptimizationStep({ data, recommendations, onAddSuggestion }: {
  data: any
  recommendations: AIRecommendation[]
  onAddSuggestion: (suggestion: AIRecommendation) => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          AI Optimization Recommendations
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          AI suggestions to improve your survey's effectiveness
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec: AIRecommendation) => (
          <Card key={rec.title} variant="default" className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {rec.title}
                  </h4>
                  <Badge variant={rec.priority === 'high' ? 'primary' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  {rec.description}
                </p>
                <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  <strong>Expected Impact:</strong> {rec.expectedImpact}
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => onAddSuggestion(rec)}>
                Apply
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Preview Step Component
function PreviewStep({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Survey Preview
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Review your AI-optimized survey before launching
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="default" className="p-4">
          <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
            Survey Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Product:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">{data.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Industry:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">{data.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Questions:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">{data.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">AI Insights:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">{data.aiInsights.length}</span>
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4">
          <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
            Validation Goals
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.validationGoals.map((goal: string) => (
              <Badge key={goal} variant="secondary" className="text-xs">
                {goal}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="default" className="p-4">
        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
          AI-Generated Questions Preview
        </h3>
        <div className="space-y-3">
          {data.questions.map((question: DynamicQuestion, index: number) => (
            <div key={question.id} className="p-3 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Q{index + 1}:
                </span>
                <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                  {question.text}
                </span>
              </div>
              <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Type: {question.type} | AI Reasoning: {question.aiReasoning}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// AI Assistant Component
function AIAssistant({ conversationHistory, onSendMessage, isAIThinking, suggestions }: {
  conversationHistory: { user: string; ai: string; timestamp: Date }[]
  onSendMessage: (message: string) => void
  isAIThinking: boolean
  suggestions: AIRecommendation[]
}) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <Card variant="default" className="p-4 h-fit">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
          AI Assistant
        </h3>
      </div>

      {/* Conversation History */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {conversationHistory.map((msg: any, index: number) => (
          <div key={index} className="space-y-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
              <strong>You:</strong> {msg.user}
            </div>
            {msg.ai && (
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                <strong>AI:</strong> {msg.ai}
              </div>
            )}
          </div>
        ))}
        
        {isAIThinking && (
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full"
              />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Ask AI for help with your survey..."
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <Button size="sm" onClick={handleSend} disabled={!message.trim() || isAIThinking} className="w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
          Quick Questions
        </h4>
        <div className="space-y-1">
          {[
            "Add pricing questions",
            "Optimize question order",
            "Add demographic questions",
            "Improve completion rate"
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSendMessage(suggestion)}
              className="block w-full text-left text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary p-1 rounded hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
