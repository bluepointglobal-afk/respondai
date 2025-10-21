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
  Eye,
  Crown,
  Star,
  Lightbulb,
  Calculator,
  FileText,
  Download,
  Share2
} from 'lucide-react'

// Import our professional methodologies
import { 
  ResearchObjective, 
  ValidationFramework, 
  getFrameworkByObjective,
  getAllObjectives,
  getObjectivesByCategory,
  BEST_PRACTICE_SURVEY_FLOW,
  QuestionType,
  QuestionTemplate,
  validateQuestionQuality,
  DEFAULT_QUALITY_RULES
} from '@/lib/frameworks/research-frameworks'

import { 
  VanWestendorpAnalyzer, 
  generateVanWestendorpQuestions,
  validateVanWestendorpData 
} from '@/lib/analytics/van-westendorp'

import { 
  MaxDiffAnalyzer, 
  generateMaxDiffQuestions,
  validateMaxDiffData 
} from '@/lib/analytics/maxdiff-analysis'

import { 
  KanoAnalyzer, 
  generateKanoQuestions,
  validateKanoData 
} from '@/lib/analytics/kano-model'

import { 
  SampleSizeCalculator,
  validateSampleSizeInputs,
  getRecommendedSampleSize,
  SAMPLE_SIZE_GUIDELINES
} from '@/lib/analytics/sample-size-calculator'

interface ProfessionalSurveyData {
  // Basic Information
  productName: string
  industry: string
  targetAudience: string
  companyName: string
  
  // Research Framework
  researchObjective: ResearchObjective
  validationFramework: ValidationFramework
  
  // Sample Size Planning
  sampleSizeInputs: {
    population_size: number
    confidence_level: number
    margin_of_error: number
    expected_proportion: number
    response_rate: number
  }
  
  // Survey Design
  questions: QuestionTemplate[]
  surveyStructure: any[]
  
  // Analysis Methods
  analysisMethods: {
    vanWestendorp: boolean
    maxDiff: boolean
    kano: boolean
    basicAnalytics: boolean
  }
  
  // Quality Metrics
  qualityScore: number
  estimatedCompletionTime: number
  estimatedCost: number
}

export function ProfessionalSurveyBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState<ProfessionalSurveyData>({
    productName: '',
    industry: '',
    targetAudience: '',
    companyName: '',
    researchObjective: ResearchObjective.CONCEPT_TESTING,
    validationFramework: getFrameworkByObjective(ResearchObjective.CONCEPT_TESTING),
    sampleSizeInputs: {
      population_size: 10000,
      confidence_level: 0.95,
      margin_of_error: 0.05,
      expected_proportion: 0.5,
      response_rate: 0.20
    },
    questions: [],
    surveyStructure: [],
    analysisMethods: {
      vanWestendorp: false,
      maxDiff: false,
      kano: false,
      basicAnalytics: true
    },
    qualityScore: 0,
    estimatedCompletionTime: 0,
    estimatedCost: 0
  })

  const [isAIThinking, setIsAIThinking] = useState(false)
  const [aiInsights, setAIInsights] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])

  const steps = [
    { id: 'framework', title: 'Research Framework', icon: <Target className="w-5 h-5" />, description: 'Select your research objective and methodology' },
    { id: 'sample', title: 'Sample Planning', icon: <Calculator className="w-5 h-5" />, description: 'Calculate optimal sample size' },
    { id: 'design', title: 'Survey Design', icon: <Settings className="w-5 h-5" />, description: 'Design questions and structure' },
    { id: 'analysis', title: 'Analysis Methods', icon: <BarChart3 className="w-5 h-5" />, description: 'Select analysis methodologies' },
    { id: 'quality', title: 'Quality Check', icon: <CheckCircle className="w-5 h-5" />, description: 'Validate survey quality' },
    { id: 'preview', title: 'Final Preview', icon: <Eye className="w-5 h-5" />, description: 'Review and launch' }
  ]

  // AI-powered framework analysis
  const analyzeFramework = useCallback(async (data: ProfessionalSurveyData) => {
    setIsAIThinking(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const insights: string[] = []
    const recs: string[] = []
    
    // Framework-specific insights
    const framework = data.validationFramework
    
    insights.push(`Selected ${framework.primary_goal} methodology with ${framework.methodology} approach`)
    insights.push(`Target completion time: ${framework.completion_time_target} minutes`)
    insights.push(`Required sample size: ${framework.sample_size_guidelines.recommended} respondents`)
    
    // Sample size validation
    const sampleCalc = new SampleSizeCalculator(data.sampleSizeInputs)
    const sampleResult = sampleCalc.calculate()
    
    if (sampleResult.recommended_sample < framework.sample_size_guidelines.minimum) {
      recs.push(`Increase sample size to at least ${framework.sample_size_guidelines.minimum} for reliable results`)
    }
    
    if (sampleResult.quality_metrics.reliability_level === 'Fair') {
      recs.push('Consider increasing sample size for better statistical reliability')
    }
    
    // Industry-specific recommendations
    if (data.industry === 'technology') {
      recs.push('Include technical feature questions for tech-savvy audience')
    } else if (data.industry === 'health-wellness') {
      recs.push('Add trust and safety questions for health-conscious consumers')
    }
    
    setAIInsights(insights)
    setRecommendations(recs)
    setIsAIThinking(false)
  }, [])

  // Generate professional survey questions
  const generateSurveyQuestions = useCallback(async (data: ProfessionalSurveyData) => {
    setIsAIThinking(true)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const questions: QuestionTemplate[] = []
    const framework = data.validationFramework
    
    // Add framework-specific questions
    questions.push(...framework.recommended_questions)
    
    // Add methodology-specific questions
    if (data.analysisMethods.vanWestendorp) {
      questions.push(...generateVanWestendorpQuestions())
    }
    
    if (data.analysisMethods.maxDiff && data.productName) {
      const features = ['Feature A', 'Feature B', 'Feature C', 'Feature D'] // Would be dynamic
      questions.push(...generateMaxDiffQuestions(features))
    }
    
    if (data.analysisMethods.kano && data.productName) {
      const features = ['Feature A', 'Feature B', 'Feature C'] // Would be dynamic
      questions.push(...generateKanoQuestions(features))
    }
    
    // Add best practice flow questions
    questions.push(...BEST_PRACTICE_SURVEY_FLOW.flatMap(section => section.questions))
    
    // Calculate quality score
    const qualityIssues = questions.flatMap(q => validateQuestionQuality(q, DEFAULT_QUALITY_RULES))
    const qualityScore = Math.max(0, 100 - (qualityIssues.length * 10))
    
    // Calculate estimates
    const estimatedTime = questions.length * 0.5 // 30 seconds per question
    const sampleCalc = new SampleSizeCalculator(data.sampleSizeInputs)
    const sampleResult = sampleCalc.calculate()
    const estimatedCost = sampleResult.cost_estimate.total_cost
    
    setSurveyData(prev => ({
      ...prev,
      questions,
      qualityScore,
      estimatedCompletionTime: estimatedTime,
      estimatedCost
    }))
    
    setIsAIThinking(false)
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      
      // Trigger AI analysis at specific steps
      if (currentStep === 0) {
        analyzeFramework(surveyData)
      } else if (currentStep === 2) {
        generateSurveyQuestions(surveyData)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const updateFramework = (objective: ResearchObjective) => {
    const framework = getFrameworkByObjective(objective)
    setSurveyData(prev => ({
      ...prev,
      researchObjective: objective,
      validationFramework: framework
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Professional Survey Builder
            </h1>
          </div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Industry-standard market research with AI-powered insights
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
                      <div className="text-center">
                        <div className="text-sm font-medium">{step.title}</div>
                        <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          {step.description}
                        </div>
                      </div>
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
                    <FrameworkSelectionStep 
                      data={surveyData} 
                      onUpdate={updateFramework}
                    />
                  )}
                  
                  {currentStep === 1 && (
                    <SamplePlanningStep 
                      data={surveyData}
                      onUpdate={setSurveyData}
                    />
                  )}
                  
                  {currentStep === 2 && (
                    <SurveyDesignStep 
                      data={surveyData}
                      onUpdate={setSurveyData}
                      isAIThinking={isAIThinking}
                    />
                  )}
                  
                  {currentStep === 3 && (
                    <AnalysisMethodsStep 
                      data={surveyData}
                      onUpdate={setSurveyData}
                    />
                  )}
                  
                  {currentStep === 4 && (
                    <QualityCheckStep 
                      data={surveyData}
                      insights={aiInsights}
                      recommendations={recommendations}
                    />
                  )}
                  
                  {currentStep === 5 && (
                    <FinalPreviewStep 
                      data={surveyData}
                    />
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

                <div className="flex items-center space-x-4">
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Button variant="secondary" className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </Button>
                      <Button variant="primary" className="flex items-center space-x-2">
                        <Share2 className="w-4 h-4" />
                        <span>Launch Survey</span>
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      className="flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            <ProfessionalAIAssistant 
              currentStep={currentStep}
              insights={aiInsights}
              recommendations={recommendations}
              isAIThinking={isAIThinking}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Framework Selection Step
function FrameworkSelectionStep({ data, onUpdate }: {
  data: ProfessionalSurveyData
  onUpdate: (objective: ResearchObjective) => void
}) {
  const categories = [
    { name: 'Product Validation', objectives: getObjectivesByCategory('product') },
    { name: 'Brand & Messaging', objectives: getObjectivesByCategory('brand') },
    { name: 'Pricing Strategy', objectives: getObjectivesByCategory('pricing') },
    { name: 'Market Strategy', objectives: getObjectivesByCategory('market') },
    { name: 'Customer Insights', objectives: getObjectivesByCategory('customer') }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Target className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Select Research Framework
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Choose your research objective to get industry-standard methodology
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name}>
            <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
              {category.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.objectives.map((objective) => {
                const framework = getFrameworkByObjective(objective)
                const isSelected = data.researchObjective === objective
                
                return (
                  <Card 
                    key={objective}
                    variant={isSelected ? "default" : "default"}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'hover:shadow-md'
                    }`}
                    onClick={() => onUpdate(objective)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-purple-100 dark:bg-purple-900/40' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <Target className={`w-4 h-4 ${
                          isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {framework.primary_goal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                          {framework.methodology} • {framework.completion_time_target} min • {framework.sample_size_guidelines.recommended} respondents
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {framework.required_metrics.slice(0, 2).map((metric) => (
                            <Badge key={metric.name} variant="secondary" className="text-xs">
                              {metric.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {data.researchObjective && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              Framework Selected
            </h3>
          </div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {data.validationFramework.required_metrics.length} metrics • {data.validationFramework.recommended_questions.length} questions • {data.validationFramework.analysis_outputs.length} analysis outputs
          </p>
        </motion.div>
      )}
    </div>
  )
}

// Sample Planning Step
function SamplePlanningStep({ data, onUpdate }: {
  data: ProfessionalSurveyData
  onUpdate: (updater: (prev: ProfessionalSurveyData) => ProfessionalSurveyData) => void
}) {
  const sampleCalc = new SampleSizeCalculator(data.sampleSizeInputs)
  const calculation = sampleCalc.calculate()

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Calculator className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Sample Size Planning
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Calculate optimal sample size for statistical reliability
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Sample Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Population Size
              </label>
              <Input
                type="number"
                value={data.sampleSizeInputs.population_size}
                onChange={(e) => onUpdate(prev => ({
                  ...prev,
                  sampleSizeInputs: { ...prev.sampleSizeInputs, population_size: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Confidence Level
              </label>
              <select
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary"
                value={data.sampleSizeInputs.confidence_level}
                onChange={(e) => onUpdate(prev => ({
                  ...prev,
                  sampleSizeInputs: { ...prev.sampleSizeInputs, confidence_level: parseFloat(e.target.value) }
                }))}
              >
                <option value={0.90}>90% (Exploratory)</option>
                <option value={0.95}>95% (Standard)</option>
                <option value={0.99}>99% (High Stakes)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Margin of Error
              </label>
              <select
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary"
                value={data.sampleSizeInputs.margin_of_error}
                onChange={(e) => onUpdate(prev => ({
                  ...prev,
                  sampleSizeInputs: { ...prev.sampleSizeInputs, margin_of_error: parseFloat(e.target.value) }
                }))}
              >
                <option value={0.03}>±3% (High Precision)</option>
                <option value={0.05}>±5% (Standard)</option>
                <option value={0.10}>±10% (Acceptable)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Expected Response Rate
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                value={data.sampleSizeInputs.response_rate}
                onChange={(e) => onUpdate(prev => ({
                  ...prev,
                  sampleSizeInputs: { ...prev.sampleSizeInputs, response_rate: parseFloat(e.target.value) || 0.2 }
                }))}
              />
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Sample Size Results
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Recommended Sample:</span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {calculation.recommended_sample.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Statistical Power:</span>
              <Badge variant="primary">
                {Math.round(calculation.statistical_power.power * 100)}%
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Reliability Level:</span>
              <Badge variant="secondary">
                {calculation.quality_metrics.reliability_level}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Estimated Cost:</span>
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                ${calculation.cost_estimate.total_cost.toLocaleString()}
              </span>
            </div>

            <div className="pt-4 border-t border-light-border dark:border-dark-border">
              <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Segments Possible
              </h4>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Up to {calculation.subgroup_analysis.segments_possible} segments with {calculation.subgroup_analysis.min_per_segment} respondents each
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Survey Design Step
function SurveyDesignStep({ data, onUpdate, isAIThinking }: {
  data: ProfessionalSurveyData
  onUpdate: (updater: (prev: ProfessionalSurveyData) => ProfessionalSurveyData) => void
  isAIThinking: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Settings className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Survey Design
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          AI will generate professional questions based on your framework
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
            AI is Designing Your Survey...
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Generating {data.validationFramework.recommended_questions.length} professional questions
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <Card variant="default" className="p-4">
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              Survey Structure Preview
            </h3>
            <div className="space-y-2">
              {BEST_PRACTICE_SURVEY_FLOW.map((section, index) => (
                <div key={section.name} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-light-text-primary dark:text-dark-text-primary">
                      {section.name}
                    </div>
                    <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {section.purpose} • {section.timing_seconds}s
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="default" className="p-4">
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              Quality Metrics
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {data.questions.length}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Questions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.qualityScore}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Quality Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(data.estimatedCompletionTime)}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Minutes
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// Analysis Methods Step
function AnalysisMethodsStep({ data, onUpdate }: {
  data: ProfessionalSurveyData
  onUpdate: (updater: (prev: ProfessionalSurveyData) => ProfessionalSurveyData) => void
}) {
  const analysisMethods = [
    {
      id: 'vanWestendorp',
      name: 'Van Westendorp Price Sensitivity',
      description: 'Industry standard for pricing research',
      icon: <TrendingUp className="w-5 h-5" />,
      required: data.researchObjective === ResearchObjective.PRICE_SENSITIVITY
    },
    {
      id: 'maxDiff',
      name: 'MaxDiff Feature Prioritization',
      description: 'Maximum difference scaling for feature importance',
      icon: <BarChart3 className="w-5 h-5" />,
      required: data.researchObjective === ResearchObjective.FEATURE_PRIORITIZATION
    },
    {
      id: 'kano',
      name: 'Kano Model Classification',
      description: 'Must-Be, Performance, Attractive categorization',
      icon: <Target className="w-5 h-5" />,
      required: data.researchObjective === ResearchObjective.FEATURE_PRIORITIZATION
    },
    {
      id: 'basicAnalytics',
      name: 'Basic Analytics',
      description: 'Standard statistical analysis and reporting',
      icon: <BarChart3 className="w-5 h-5" />,
      required: true
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <BarChart3 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Analysis Methods
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Select advanced analysis methodologies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysisMethods.map((method) => {
          const isSelected = data.analysisMethods[method.id as keyof typeof data.analysisMethods]
          const isRequired = method.required
          
          return (
            <Card 
              key={method.id}
              variant={isSelected ? "default" : "default"}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : 
                isRequired ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' : 'hover:shadow-md'
              }`}
              onClick={() => {
                if (!isRequired) {
                  onUpdate(prev => ({
                    ...prev,
                    analysisMethods: {
                      ...prev.analysisMethods,
                      [method.id]: !isSelected
                    }
                  }))
                }
              }}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-purple-100 dark:bg-purple-900/40' :
                  isRequired ? 'bg-orange-100 dark:bg-orange-900/40' :
                  'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <div className={`${
                    isSelected ? 'text-purple-600 dark:text-purple-400' :
                    isRequired ? 'text-orange-600 dark:text-orange-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {method.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {method.name}
                    </h4>
                    {isRequired && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {isSelected && (
                      <Badge variant="primary" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {method.description}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Quality Check Step
function QualityCheckStep({ data, insights, recommendations }: {
  data: ProfessionalSurveyData
  insights: string[]
  recommendations: string[]
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Quality Check
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          AI validation and recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            AI Insights
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quality Score */}
      <Card variant="default" className="p-6">
        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
          Survey Quality Score
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {data.qualityScore}/100
          </div>
          <div className="flex-1">
            <Progress value={data.qualityScore} className="h-3" />
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
              {data.qualityScore >= 90 ? 'Excellent quality - ready for launch' :
               data.qualityScore >= 80 ? 'Good quality - minor improvements suggested' :
               data.qualityScore >= 70 ? 'Fair quality - consider improvements' :
               'Poor quality - significant improvements needed'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Final Preview Step
function FinalPreviewStep({ data }: { data: ProfessionalSurveyData }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Eye className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Final Preview
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Review your professional survey before launch
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Survey Summary */}
        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Survey Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Framework:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">
                {data.researchObjective.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Questions:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">{data.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Sample Size:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">
                {data.sampleSizeInputs.population_size.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Completion Time:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">
                {Math.round(data.estimatedCompletionTime)} minutes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Estimated Cost:</span>
              <span className="text-light-text-primary dark:text-dark-text-primary">
                ${data.estimatedCost.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Analysis Methods */}
        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Analysis Methods
          </h3>
          <div className="space-y-2">
            {Object.entries(data.analysisMethods).map(([method, enabled]) => (
              <div key={method} className="flex items-center space-x-2">
                <CheckCircle className={`w-4 h-4 ${enabled ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                  {method.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Launch Actions */}
      <Card variant="default" className="p-6">
        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
          Ready to Launch
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="text-center sm:text-left">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Your professional survey is ready for deployment
            </p>
            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              Quality Score: {data.qualityScore}/100 • {data.questions.length} questions • {Math.round(data.estimatedCompletionTime)} min
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Preview Survey</span>
            </Button>
            <Button variant="primary" className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Launch Now</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Professional AI Assistant
function ProfessionalAIAssistant({ 
  currentStep, 
  insights, 
  recommendations, 
  isAIThinking 
}: {
  currentStep: number
  insights: string[]
  recommendations: string[]
  isAIThinking: boolean
}) {
  const stepAdvice = [
    "Choose a research framework that matches your business goals",
    "Ensure sample size provides statistical reliability",
    "AI will generate professional questions automatically",
    "Select analysis methods based on your research needs",
    "Review AI recommendations for survey quality",
    "Your survey is ready for professional deployment"
  ]

  return (
    <Card variant="default" className="p-4 h-fit">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
          AI Research Assistant
        </h3>
      </div>

      {/* Current Step Advice */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
          Step {currentStep + 1} Advice
        </h4>
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          {stepAdvice[currentStep]}
        </p>
      </div>

      {/* AI Thinking Indicator */}
      {isAIThinking && (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full"
            />
            <span className="text-sm text-purple-600 dark:text-purple-400">
              AI is analyzing...
            </span>
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            AI Insights
          </h4>
          <div className="space-y-1">
            {insights.slice(0, 3).map((insight, index) => (
              <div key={index} className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                • {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            Recommendations
          </h4>
          <div className="space-y-1">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                • {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="pt-4 border-t border-light-border dark:border-dark-border">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold text-purple-600 dark:text-purple-400">95%</div>
            <div className="text-light-text-tertiary dark:text-dark-text-tertiary">Confidence</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600 dark:text-green-400">±5%</div>
            <div className="text-light-text-tertiary dark:text-dark-text-tertiary">Margin</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
