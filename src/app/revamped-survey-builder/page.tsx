'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Target, 
  Users, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Zap,
  Crown,
  Star,
  Lightbulb,
  TrendingUp,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  X,
  ArrowLeft,
  Sparkles
} from 'lucide-react'

interface SurveyGenerationState {
  productDescription: string
  targetAudience: string
  validationGoals: string[]
  industry: string
  generatedSurvey: any[]
  qualityMetrics: any
  isGenerating: boolean
  isSaving: boolean
  currentStep: number
  recommendations: Recommendation[]
  appliedRecommendations: string[]
  showMethodChoice: boolean
}

interface Recommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'methodology' | 'coverage' | 'quality'
  action: 'add_question' | 'modify_question' | 'add_logic' | 'improve_text'
  details: {
    questionType?: string
    questionText?: string
    section?: string
    priority?: string
    options?: any[]
    skipLogic?: any
  }
  scoreImprovement: number
}

const INDUSTRY_OPTIONS = [
  { value: 'supplement', label: 'Supplements & Vitamins' },
  { value: 'beverage', label: 'Food & Beverage' },
  { value: 'saas', label: 'Software & Technology' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'food', label: 'Food Products' },
  { value: 'device', label: 'Health Devices' },
  { value: 'other', label: 'Other' }
]

const VALIDATION_GOALS = [
  'Product-Market Fit',
  'Feature Prioritization',
  'Price Sensitivity',
  'Brand Positioning',
  'Target Audience Validation',
  'Competitive Analysis',
  'Purchase Intent',
  'Customer Journey',
  'Messaging Testing',
  'Market Segmentation'
]

export default function RevampedSurveyBuilder() {
  const router = useRouter()
  const [state, setState] = useState<SurveyGenerationState>({
    productDescription: '',
    targetAudience: '',
    validationGoals: [],
    industry: '',
    generatedSurvey: [],
    qualityMetrics: null,
    isGenerating: false,
    isSaving: false,
    currentStep: 0,
    recommendations: [],
    appliedRecommendations: [],
    showMethodChoice: false
  })

  const [testData, setTestData] = useState<any>(null)
  const [isFromDashboard, setIsFromDashboard] = useState(false)

  useEffect(() => {
    // Check if we have test data from dashboard flow
    const storedTestData = sessionStorage.getItem('currentTestData')
    if (storedTestData) {
      try {
        const parsedData = JSON.parse(storedTestData)
        setTestData(parsedData)
        setIsFromDashboard(true)
        
        // Pre-populate form with test data
        setState(prev => ({
          ...prev,
          productDescription: parsedData.productInfo?.description || '',
          targetAudience: parsedData.productInfo?.targetAudience || '',
          validationGoals: parsedData.validationGoals || [],
          industry: parsedData.productInfo?.industry || ''
        }))
      } catch (error) {
        console.error('Error parsing stored test data:', error)
      }
    }
  }, [])

  const handleGenerateSurvey = async () => {
    // Validate required fields
    if (!state.productDescription?.trim()) {
      alert('Please enter a product description')
      return
    }
    
    if (!state.industry) {
      alert('Please select an industry category')
      return
    }
    
    if (!state.targetAudience?.trim()) {
      alert('Please enter a target audience')
      return
    }
    
    if (!state.validationGoals || state.validationGoals.length === 0) {
      alert('Please select at least one validation goal')
      return
    }
    
    // Show method choice instead of directly generating
    setState(prev => ({ ...prev, showMethodChoice: true, currentStep: 1 }))
  }

  const handleMethodChoice = async (method: 'template' | 'ai') => {
    setState(prev => ({ ...prev, isGenerating: true, showMethodChoice: false, currentStep: 2 }))
    
    try {
      // Simulate AI processing with multiple steps
      await simulateAIGeneration()
      
      let comprehensiveSurvey;
      
      if (method === 'template') {
        // Use template-based generation
        comprehensiveSurvey = generateTemplateSurvey(state.industry, state.validationGoals)
      } else {
        // Generate comprehensive survey using intelligent system
        comprehensiveSurvey = await generateIntelligentSurvey(
          state.productDescription, 
          state.industry, 
          state.targetAudience, 
          state.validationGoals
        )
      }
      
      // Generate intelligent recommendations
      const recommendations = generateIntelligentRecommendations(
        comprehensiveSurvey, 
        state.industry, 
        state.validationGoals
      )
      
      const qualityMetrics = generateMockQualityMetrics(comprehensiveSurvey, recommendations, [])
      
      setState(prev => ({
        ...prev,
        generatedSurvey: comprehensiveSurvey,
        recommendations: recommendations,
        qualityMetrics: qualityMetrics,
        isGenerating: false,
        currentStep: 4
      }))
    } catch (error) {
      console.error('Error generating survey:', error)
      setState(prev => ({ ...prev, isGenerating: false }))
    }
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `custom_${Date.now()}`,
      type: 'multiple-choice-single',
      text: 'New question text',
      section: 'Custom',
      priority: 'medium_priority',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
    }
    
    setState(prev => ({
      ...prev,
      generatedSurvey: [...prev.generatedSurvey, newQuestion]
    }))
  }

  const handleEditQuestion = (questionId: string, field: string, value: any) => {
    setState(prev => ({
      ...prev,
      generatedSurvey: prev.generatedSurvey.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const handleDeleteQuestion = (questionId: string) => {
    setState(prev => ({
      ...prev,
      generatedSurvey: prev.generatedSurvey.filter(q => q.id !== questionId)
    }))
  }

  const handleMoveQuestion = (questionId: string, direction: 'up' | 'down') => {
    setState(prev => {
      const questions = [...prev.generatedSurvey]
      const index = questions.findIndex(q => q.id === questionId)
      
      if (direction === 'up' && index > 0) {
        [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]]
      } else if (direction === 'down' && index < questions.length - 1) {
        [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]]
      }
      
      return { ...prev, generatedSurvey: questions }
    })
  }

  const handleApplyRecommendation = (recommendation: Recommendation) => {
    setState(prev => {
      let newSurvey = [...prev.generatedSurvey]
      
      if (recommendation.action === 'add_question') {
        const newQuestion = {
          id: recommendation.id,
          type: recommendation.details.questionType,
          text: recommendation.details.questionText,
          section: recommendation.details.section,
          priority: recommendation.details.priority,
          options: recommendation.details.options || [],
          items: recommendation.details.items || undefined,
          sets: recommendation.details.sets || undefined,
          items_per_set: recommendation.details.items_per_set || undefined
        }
        newSurvey.push(newQuestion)
      }
      
      const newAppliedRecommendations = [...prev.appliedRecommendations, recommendation.id]
      const newQualityMetrics = generateMockQualityMetrics(newSurvey, prev.recommendations, newAppliedRecommendations)
      
      return {
        ...prev,
        generatedSurvey: newSurvey,
        appliedRecommendations: newAppliedRecommendations,
        qualityMetrics: newQualityMetrics
      }
    })
  }

  const handleReevaluateSurvey = () => {
    setState(prev => {
      const newRecommendations = generateIntelligentRecommendations(
        prev.generatedSurvey, 
        prev.industry, 
        prev.validationGoals
      )
      const newQualityMetrics = generateMockQualityMetrics(
        prev.generatedSurvey, 
        newRecommendations, 
        prev.appliedRecommendations
      )
      
      return {
        ...prev,
        recommendations: newRecommendations,
        qualityMetrics: newQualityMetrics
      }
    })
  }

  const mapQuestionType = (type: string) => {
    // Map advanced question types to standard database types
    switch (type) {
      case 'maxdiff':
        return 'multiple-choice-single' // MaxDiff will be handled by special properties
      case 'kano':
        return 'multiple-choice-single' // Kano will be handled by special properties
      case 'nps':
        return 'scale-1-10' // NPS is essentially a 0-10 scale
      case 'van-westendorp':
        return 'text-number' // Van Westendorp uses number inputs
      case 'text-number':
        return 'text-number'
      case 'text-short':
        return 'text-short'
      case 'text-long':
        return 'text-long'
      case 'multiple-choice-single':
        return 'multiple-choice-single'
      case 'multiple-choice-multiple':
        return 'multiple-choice-multiple'
      case 'scale-1-5':
        return 'scale-1-5'
      case 'scale-1-7':
        return 'scale-1-7'
      case 'scale-1-10':
        return 'scale-1-10'
      default:
        return 'multiple-choice-single' // Default fallback
    }
  }

  const handleUseSurvey = async () => {
    if (state.isSaving) return // Prevent multiple clicks
    
    setState(prev => ({ ...prev, isSaving: true }))
    
    try {
      console.log('=== STARTING SURVEY SAVE ===')
      console.log('Generated Survey:', state.generatedSurvey)
      console.log('Generated Survey Length:', state.generatedSurvey.length)
      console.log('Product Description:', state.productDescription)
      console.log('Industry:', state.industry)
      console.log('Validation Goals:', state.validationGoals)
      console.log('Is From Dashboard:', isFromDashboard)
      console.log('Test Data:', testData)
      
      // Validate required data before creating test
      if (!state.productDescription?.trim()) {
        alert('Product description is required')
        return
      }
      
      if (!state.industry) {
        alert('Industry category is required')
        return
      }
      
      if (!state.validationGoals || state.validationGoals.length === 0) {
        alert('At least one validation goal is required')
        return
      }
      
      if (!state.generatedSurvey || state.generatedSurvey.length === 0) {
        alert('No survey questions generated. Please generate a survey first.')
        return
      }
      
      let testId: string

      if (isFromDashboard && testData?.testId) {
        // Verify existing test from dashboard flow actually exists
        console.log('Checking if existing test ID exists:', testData.testId)
        try {
          const testCheckResponse = await fetch(`/api/test/${testData.testId}/status`, {
            method: 'GET'
          })
          
          if (testCheckResponse.ok) {
            testId = testData.testId
            console.log('Using existing test ID:', testId)
          } else {
            console.log('Existing test ID not found, creating new test instead')
            // Fall through to create new test
          }
        } catch (error) {
          console.log('Error checking existing test, creating new test instead:', error)
          // Fall through to create new test
        }
      }
      
      if (!testId) {
        // Create a new test for standalone flow
        const newTestData = {
          name: `${state.productDescription.substring(0, 50)}... Test`,
          productInfo: {
            name: state.productDescription,
            description: state.productDescription,
            industry: state.industry,
            stage: 'idea',
            productType: 'digital',
            priceRange: { min: 0, max: 100, currency: 'USD' },
            productFeatures: [],
            companyName: 'Your Company',
            companyStory: 'We are building innovative products',
            brandValues: [],
            targetAudience: state.targetAudience || 'General audience',
            competitors: [],
            uniqueValue: '',
            marketGap: ''
          },
          validationGoals: state.validationGoals
        }

        console.log('Creating new test:', newTestData)

        const response = await fetch('/api/test/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTestData)
        })

        console.log('Test Creation Response Status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Test Creation Error:', errorText)
          throw new Error(`Failed to create test: ${errorText}`)
        }

        const result = await response.json()
        console.log('Test Creation Result:', result)
        
        if (!result.testId) {
          throw new Error('Test creation succeeded but no testId returned')
        }
        
        testId = result.testId
        console.log('Test Created Successfully:', testId)
      }

      // Create survey data for the test
      const surveyData = {
        sections: state.generatedSurvey.map((q, index) => ({
          id: `section_${index}`,
          title: q.section || 'Survey Questions',
          questions: [{
            id: q.id,
            type: mapQuestionType(q.type), // Map advanced types to standard types
            text: q.text,
            options: q.options || [],
            required: q.priority === 'must_have',
            order: index,
            // Include special properties for advanced question types
            ...(q.type === 'maxdiff' && { 
              maxdiff: { 
                items: q.items, 
                sets: q.sets, 
                items_per_set: q.items_per_set 
              } 
            }),
            ...(q.type === 'kano' && { 
              kano: { 
                features: q.features 
              } 
            }),
            ...(q.type === 'nps' && { 
              nps: true 
            }),
            ...(q.type === 'van-westendorp' && { 
              van_westendorp: true 
            })
          }]
        })),
        settings: {
          estimatedTime: Math.ceil(state.generatedSurvey.length * 0.5), // 30 seconds per question
          showProgressBar: true,
          allowSaveAndResume: true
        }
      }

      console.log('Survey Data:', surveyData)
      console.log('Survey Data JSON:', JSON.stringify(surveyData, null, 2))

      // Verify testId is valid before proceeding
      if (!testId || typeof testId !== 'string' || testId.trim() === '') {
        throw new Error('Invalid testId: ' + testId)
      }
      
      // Test already verified above, proceed with survey save
      // Save survey to database
      console.log('Sending survey data to API...')
      console.log('Final testId being used:', testId)
      console.log('Final survey data being sent:', JSON.stringify(surveyData, null, 2))
      
      const surveyResponse = await fetch(`/api/test/${testId}/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      })

      console.log('Survey API Response Status:', surveyResponse.status)
      console.log('Survey API Response Headers:', surveyResponse.headers)

      if (!surveyResponse.ok) {
        const errorText = await surveyResponse.text()
        console.error('Survey API Error:', errorText)
        console.error('Survey API Error Details:', {
          status: surveyResponse.status,
          statusText: surveyResponse.statusText,
          headers: Object.fromEntries(surveyResponse.headers.entries()),
          testId: testId,
          surveyData: surveyData
        })
        throw new Error(`Failed to save survey: ${errorText}`)
      }

      const surveyResult = await surveyResponse.json()
      console.log('Survey Saved Successfully:', surveyResult)

      // Create default audiences
      const defaultAudiences = [
        {
          name: 'Primary Target Audience',
          isPrimary: true,
          demographics: {
            age: { min: 25, max: 45 },
            gender: 'any',
            income: 'middle',
            education: 'college',
            location: 'urban'
          },
          psychographics: {
            values: ['innovation', 'quality'],
            lifestyle: 'professional',
            painPoints: ['time constraints', 'quality concerns']
          },
          estimatedSize: 2000000,
          targetSampleSize: 500,
          reasoning: 'Primary demographic based on product positioning'
        }
      ]

      // Save audiences to database
      const audiencesResponse = await fetch(`/api/test/${testId}/audiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audiences: defaultAudiences })
      })

      if (!audiencesResponse.ok) {
        const errorText = await audiencesResponse.text()
        console.error('Audiences API Error:', errorText)
        console.warn('Failed to save audiences, but continuing...')
      }

      // Update test status based on flow
      const newStatus = isFromDashboard ? 'READY_TO_LAUNCH' : 'DEFINING_AUDIENCES'
      const statusResponse = await fetch(`/api/test/${testId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        console.error('Status API Error:', errorText)
        console.warn('Failed to update status, but continuing...')
      }

      // Navigate based on flow
      if (isFromDashboard && testData?.testId) {
        // Coming from dashboard flow - redirect to audience definition
        router.push(`/dashboard/test/${testData.testId}/audience`)
      } else {
        // Coming from standalone flow - redirect to dashboard
        window.location.href = `/dashboard?test=${testId}`
      }
      
    } catch (error) {
      console.error('=== SURVEY SAVE ERROR ===')
      console.error('Error object:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      alert(`Error saving survey: ${error.message}. Check console for details.`)
    }
  }

  const handleExportSurvey = () => {
    const surveyData = {
      title: `${state.productDescription.substring(0, 50)}... Survey`,
      description: `Market research survey for ${state.productDescription}`,
      industry: state.industry,
      targetAudience: state.targetAudience,
      validationGoals: state.validationGoals,
      questions: state.generatedSurvey,
      qualityMetrics: state.qualityMetrics,
      appliedRecommendations: state.appliedRecommendations,
      exportedAt: new Date().toISOString()
    }

    // Create downloadable JSON file
    const dataStr = JSON.stringify(surveyData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `survey_${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const simulateAIGeneration = async () => {
    const steps = [
      { step: 1, message: 'Analyzing product intelligence...', duration: 2000 },
      { step: 2, message: 'Selecting category-specific questions...', duration: 3000 },
      { step: 3, message: 'Customizing questions for your product...', duration: 2000 }
    ]
    
    for (const { step, message, duration } of steps) {
      setState(prev => ({ ...prev, currentStep: step }))
      await new Promise(resolve => setTimeout(resolve, duration))
    }
  }

  const generateIntelligentSurvey = async (description: string, industry: string, targetAudience: string, validationGoals: string[]) => {
    console.log('=== GENERATING INTELLIGENT SURVEY WITH AI ===')
    console.log('Description:', description)
    console.log('Industry:', industry)
    console.log('Target Audience:', targetAudience)
    console.log('Validation Goals:', validationGoals)
    
    try {
      // Call the real AI API endpoint
      console.log('Calling AI survey generation API...')
      const response = await fetch('/api/generate-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productInfo: {
            name: description,
            description: description,
            industry: industry,
            targetAudience: targetAudience,
            stage: 'idea',
            productType: 'digital',
            priceRange: { min: 0, max: 100, currency: 'USD' },
            productFeatures: [],
            companyName: 'Your Company',
            companyStory: 'We are building innovative products',
            brandValues: [],
            competitors: [],
            uniqueValue: '',
            marketGap: ''
          },
          validationGoals: validationGoals.map(goal => ({ 
            category: goal, 
            selected: true, 
            label: goal, 
            description: `Validate ${goal}` 
          })),
          audiences: [{
            name: targetAudience || 'General Audience',
            demographics: { age: '25-45', gender: 'any', income: 'middle' },
            estimatedSize: 1000000,
            targetSampleSize: 500
          }]
        })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('AI API Response:', result)
      
      // Convert AI response to our format
      const formattedQuestions = []
      
      if (result.survey && result.survey.sections) {
        result.survey.sections.forEach((section: any, sectionIndex: number) => {
          section.questions.forEach((question: any, questionIndex: number) => {
            formattedQuestions.push({
              id: question.id || `q_${sectionIndex}_${questionIndex}`,
              type: question.type,
              text: question.text,
              section: section.title || 'General',
              priority: question.required ? 'must_have' : 'medium_priority',
              options: question.options || [],
              analysis_tags: [question.analysisCategory || 'general'],
              benchmarks: null,
              helpText: question.helpText
            })
          })
        })
      }
      
      console.log('Formatted AI questions:', formattedQuestions)
      
      // If AI didn't generate enough questions, add some additional ones
      if (formattedQuestions.length < 10) {
        console.log('Adding additional questions to reach minimum...')
        const additionalQuestions = generateAdditionalQuestions(industry, validationGoals, description, targetAudience)
        formattedQuestions.push(...additionalQuestions.slice(0, 10 - formattedQuestions.length))
      }
      
      console.log('Final AI-generated questions:', formattedQuestions)
      return formattedQuestions
      
    } catch (error) {
      console.error('Error generating AI survey:', error)
      console.log('Falling back to mock survey...')
      // Fallback to mock survey
      return generateMockSurvey(description, industry)
    }
  }

  const generateTemplateSurvey = (industry: string, validationGoals: string[]) => {
    console.log('=== GENERATING TEMPLATE SURVEY ===')
    console.log('Industry:', industry, 'Goals:', validationGoals)
    
    const templateQuestions = [
      {
        id: 'q1',
        type: 'multiple-choice-single',
        text: 'What is your age range?',
        section: 'Demographics',
        priority: 'must_have',
        options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        analysis_tags: ['demographics'],
        benchmarks: null,
        helpText: 'This helps us understand our audience better'
      },
      {
        id: 'q2',
        type: 'multiple-choice-single',
        text: 'How familiar are you with this type of product?',
        section: 'Product Awareness',
        priority: 'must_have',
        options: [
          'Very familiar - I use similar products regularly',
          'Somewhat familiar - I know about them',
          'Not familiar - This is new to me'
        ],
        analysis_tags: ['awareness'],
        benchmarks: null,
        helpText: 'Understanding product awareness is crucial'
      },
      {
        id: 'q3',
        type: 'scale-1-10',
        text: 'How likely would you be to purchase this product?',
        section: 'Purchase Intent',
        priority: 'must_have',
        options: [],
        analysis_tags: ['purchase_intent'],
        benchmarks: null,
        helpText: 'Rate from 1 (not at all likely) to 10 (extremely likely)'
      },
      {
        id: 'q4',
        type: 'multiple-choice-single',
        text: 'What is the most important factor when choosing this type of product?',
        section: 'Feature Prioritization',
        priority: 'medium_priority',
        options: [
          'Quality and effectiveness',
          'Price and value',
          'Brand reputation',
          'Natural/organic ingredients',
          'Convenience and ease of use'
        ],
        analysis_tags: ['feature_priority'],
        benchmarks: null,
        helpText: 'Select the most important factor for you'
      },
      {
        id: 'q5',
        type: 'text-short',
        text: 'What price would you expect to pay for this product?',
        section: 'Pricing',
        priority: 'medium_priority',
        options: [],
        analysis_tags: ['pricing'],
        benchmarks: null,
        helpText: 'Enter your expected price in dollars'
      }
    ]
    
    return templateQuestions
  }

  const generateMockSurvey = (description: string, industry: string) => {
    console.log('=== GENERATING MOCK SURVEY ===')
    console.log('Description:', description)
    console.log('Industry:', industry)
    
    // Extract key terms from description for customization
    const productTerms = extractProductTerms(description)
    console.log('Product terms:', productTerms)
    
    const baseQuestions = [
      {
        id: 'screener_001',
        type: 'multiple-choice-single',
        text: 'Are you 18 years or older?',
        section: 'Screener',
        priority: 'must_have',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'concept_001',
        type: 'scale-1-10',
        text: 'How appealing is this product concept to you overall?',
        section: 'Concept Evaluation',
        priority: 'must_have',
        options: [
          { value: '1', label: 'Not at all appealing' },
          { value: '10', label: 'Extremely appealing' }
        ]
      },
      {
        id: 'price_vw_001',
        type: 'text-number',
        text: `At what price would you consider this ${productTerms.productType || 'product'} too expensive?`,
        section: 'Pricing (Van Westendorp)',
        priority: 'must_have'
      },
      {
        id: 'price_vw_002',
        type: 'text-number',
        text: `At what price would you consider this ${productTerms.productType || 'product'} too cheap?`,
        section: 'Pricing (Van Westendorp)',
        priority: 'must_have'
      },
      {
        id: 'price_vw_003',
        type: 'text-number',
        text: `At what price would you consider this ${productTerms.productType || 'product'} expensive but acceptable?`,
        section: 'Pricing (Van Westendorp)',
        priority: 'must_have'
      },
      {
        id: 'price_vw_004',
        type: 'text-number',
        text: `At what price would you consider this ${productTerms.productType || 'product'} a good value?`,
        section: 'Pricing (Van Westendorp)',
        priority: 'must_have'
      },
      {
        id: 'nps_001',
        type: 'nps',
        text: 'How likely are you to recommend this product to a friend or colleague?',
        section: 'Concept Evaluation',
        priority: 'must_have',
        options: Array.from({length: 11}, (_, i) => ({ value: i.toString(), label: i.toString() }))
      },
      {
        id: 'pmf_001',
        type: 'multiple-choice-single',
        text: 'How disappointed would you be if you could no longer use this product?',
        section: 'Concept Evaluation',
        priority: 'must_have',
        options: [
          { value: 'very_disappointed', label: 'Very disappointed' },
          { value: 'somewhat_disappointed', label: 'Somewhat disappointed' },
          { value: 'not_disappointed', label: 'Not disappointed' },
          { value: 'indifferent', label: 'Indifferent' }
        ]
      }
    ]
    
    const industryQuestions = generateIndustrySpecificQuestions(industry, productTerms)
    
    return [...baseQuestions, ...industryQuestions]
  }

  const extractProductTerms = (description: string) => {
    const desc = description.toLowerCase()
    
    // Extract product type
    let productType = 'product'
    if (desc.includes('supplement') || desc.includes('vitamin')) productType = 'supplement'
    else if (desc.includes('coffee') || desc.includes('beverage')) productType = 'beverage'
    else if (desc.includes('software') || desc.includes('app')) productType = 'software'
    else if (desc.includes('cream') || desc.includes('skincare')) productType = 'skincare product'
    
    // Extract target condition/benefit
    let targetCondition = 'general wellness'
    if (desc.includes('joint pain') || desc.includes('arthritis')) targetCondition = 'joint pain'
    else if (desc.includes('energy') || desc.includes('fatigue')) targetCondition = 'energy levels'
    else if (desc.includes('sleep') || desc.includes('insomnia')) targetCondition = 'sleep quality'
    else if (desc.includes('focus') || desc.includes('concentration')) targetCondition = 'mental focus'
    else if (desc.includes('weight') || desc.includes('metabolism')) targetCondition = 'weight management'
    
    // Extract ingredients
    const ingredients = []
    if (desc.includes('turmeric') || desc.includes('curcumin')) ingredients.push('turmeric')
    if (desc.includes('ginseng')) ingredients.push('ginseng')
    if (desc.includes('caffeine')) ingredients.push('caffeine')
    if (desc.includes('protein')) ingredients.push('protein')
    
    return { productType, targetCondition, ingredients }
  }

  const generateIndustrySpecificQuestions = (industry: string, productTerms: any) => {
    const questions = []
    
    if (industry === 'supplement') {
      questions.push(
        {
          id: 'supp_cond_001',
          type: 'scale-0-10',
          text: `On a scale of 0-10, how would you rate your ${productTerms.targetCondition} on a typical day?`,
          section: 'Condition Assessment',
          priority: 'must_have',
          options: [
            { value: '0', label: 'No issues' },
            { value: '10', label: 'Severe issues' }
          ]
        },
        {
          id: 'supp_treat_001',
          type: 'multiple-choice-multiple',
          text: `What are you currently doing to manage your ${productTerms.targetCondition}?`,
          section: 'Current Treatment',
          priority: 'high_priority',
          options: [
            { value: 'otc', label: 'Over-the-counter medications' },
            { value: 'prescription', label: 'Prescription medications' },
            { value: 'supplements', label: 'Dietary supplements' },
            { value: 'exercise', label: 'Exercise or physical therapy' },
            { value: 'diet', label: 'Diet changes' },
            { value: 'nothing', label: 'Nothing currently' },
            { value: 'other', label: 'Other (please specify)' }
          ]
        },
        {
          id: 'supp_behav_001',
          type: 'multiple-choice-single',
          text: 'How many dietary supplements do you currently take regularly?',
          section: 'Supplement Behavior',
          priority: 'high_priority',
          options: [
            { value: 'none', label: 'None' },
            { value: '1_2', label: '1-2' },
            { value: '3_4', label: '3-4' },
            { value: '5_plus', label: '5 or more' }
          ]
        },
        {
          id: 'supp_ingr_001',
          type: 'multiple-choice-single',
          text: `How familiar are you with ${productTerms.ingredients.join(' and ') || 'the key ingredients'} for ${productTerms.targetCondition}?`,
          section: 'Ingredient Knowledge',
          priority: 'medium_priority',
          options: [
            { value: 'very_familiar', label: 'Very familiar' },
            { value: 'somewhat_familiar', label: 'Somewhat familiar' },
            { value: 'slightly_familiar', label: 'Slightly familiar' },
            { value: 'not_familiar', label: 'Not familiar' }
          ]
        }
      )
    } else if (industry === 'beverage') {
      questions.push(
        {
          id: 'bev_cons_001',
          type: 'multiple-choice-single',
          text: 'How many cups of coffee do you drink per day?',
          section: 'Consumption Profile',
          priority: 'must_have',
          options: [
            { value: 'none', label: 'None' },
            { value: '1', label: '1 cup' },
            { value: '2', label: '2 cups' },
            { value: '3_plus', label: '3 or more cups' }
          ]
        },
        {
          id: 'bev_energy_001',
          type: 'scale-1-10',
          text: 'How would you rate your typical energy levels?',
          section: 'Energy Needs',
          priority: 'high_priority',
          options: [
            { value: '1', label: 'Very low energy' },
            { value: '10', label: 'Very high energy' }
          ]
        }
      )
    } else if (industry === 'saas') {
      questions.push(
        {
          id: 'saas_tools_001',
          type: 'multiple-choice-multiple',
          text: 'What software tools do you currently use for your work?',
          section: 'Current Tools',
          priority: 'must_have',
          options: [
            { value: 'email', label: 'Email (Gmail, Outlook)' },
            { value: 'calendar', label: 'Calendar' },
            { value: 'project_mgmt', label: 'Project management' },
            { value: 'crm', label: 'CRM' },
            { value: 'analytics', label: 'Analytics' },
            { value: 'communication', label: 'Communication tools' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          id: 'saas_pain_001',
          type: 'multiple-choice-multiple',
          text: 'What are your biggest frustrations with your current software tools?',
          section: 'Pain Points',
          priority: 'high_priority',
          options: [
            { value: 'integration', label: 'Poor integration' },
            { value: 'complexity', label: 'Too complex' },
            { value: 'cost', label: 'Too expensive' },
            { value: 'features', label: 'Missing features' },
            { value: 'support', label: 'Poor support' },
            { value: 'other', label: 'Other' }
          ]
        }
      )
    }
    
    console.log('Mock survey questions generated:', questions.length)
    console.log('Mock survey questions:', questions)
    return questions
  }

  const generateAdditionalQuestions = (industry: string, validationGoals: string[], description: string, targetAudience: string) => {
    const questions = []
    
    // Add questions based on validation goals
    validationGoals.forEach(goal => {
      switch (goal) {
        case 'brand':
          // Brand Messaging & Values
          questions.push({
            id: 'brand_values_001',
            type: 'multiple-choice-multiple',
            text: 'Which values resonate most with you?',
            section: 'Brand Messaging',
            priority: 'high_priority',
            options: [
              { value: 'innovation', label: 'Innovation' },
              { value: 'quality', label: 'Quality' },
              { value: 'trust', label: 'Trust' },
              { value: 'sustainability', label: 'Sustainability' },
              { value: 'convenience', label: 'Convenience' }
            ]
          })
          questions.push({
            id: 'brand_trust_001',
            type: 'scale-1-7',
            text: 'How trustworthy does this brand seem to you?',
            section: 'Brand Messaging',
            priority: 'high_priority',
            options: [
              { value: 1, label: 'Not trustworthy at all' },
              { value: 7, label: 'Extremely trustworthy' }
            ]
          })
          questions.push({
            id: 'brand_positioning_001',
            type: 'multiple-choice-single',
            text: 'What comes to mind when you think of this brand?',
            section: 'Brand Positioning',
            priority: 'medium_priority',
            options: [
              { value: 'quality', label: 'High quality' },
              { value: 'affordable', label: 'Affordable' },
              { value: 'innovative', label: 'Innovative' },
              { value: 'trustworthy', label: 'Trustworthy' },
              { value: 'premium', label: 'Premium' }
            ]
          })
          break

        case 'product':
          // Product/Service Concept
          questions.push({
            id: 'feature_priority_001',
            type: 'maxdiff',
            text: 'Which features are most important to you?',
            section: 'Feature Prioritization (MaxDiff)',
            priority: 'must_have',
            items: ['Ease of use', 'Price', 'Quality', 'Brand reputation', 'Customer support'],
            sets: 3,
            items_per_set: 3
          })
          questions.push({
            id: 'kano_001',
            type: 'kano',
            text: 'How would you feel if this product had [FEATURE]?',
            section: 'Feature Classification (Kano)',
            priority: 'high_priority',
            features: ['Easy setup', '24/7 support', 'Mobile app', 'Free updates', 'Customization']
          })
          questions.push({
            id: 'nps_001',
            type: 'nps',
            text: 'How likely are you to recommend this product to a friend?',
            section: 'Product Concept',
            priority: 'high_priority'
          })
          questions.push({
            id: 'product_importance_001',
            type: 'multiple-choice-multiple',
            text: 'Which features are most important to you?',
            section: 'Product Concept',
            priority: 'must_have',
            options: [
              { value: 'ease_of_use', label: 'Ease of use' },
              { value: 'effectiveness', label: 'Effectiveness' },
              { value: 'speed', label: 'Speed' },
              { value: 'reliability', label: 'Reliability' },
              { value: 'cost', label: 'Cost effectiveness' }
            ]
          })
          break

        case 'pricing':
          // Pricing Strategy - Van Westendorp Questions
          questions.push({
            id: 'vw_too_expensive_001',
            type: 'text-number',
            text: 'At what price would you consider this product TOO EXPENSIVE to buy?',
            section: 'Pricing (Van Westendorp)',
            priority: 'must_have'
          })
          questions.push({
            id: 'vw_expensive_consider_001',
            type: 'text-number',
            text: 'At what price would you consider this product EXPENSIVE, but still consider buying?',
            section: 'Pricing (Van Westendorp)',
            priority: 'must_have'
          })
          questions.push({
            id: 'vw_good_value_001',
            type: 'text-number',
            text: 'At what price would you consider this product a GOOD VALUE?',
            section: 'Pricing (Van Westendorp)',
            priority: 'must_have'
          })
          questions.push({
            id: 'vw_too_cheap_001',
            type: 'text-number',
            text: 'At what price would you consider this product TOO CHEAP (quality concerns)?',
            section: 'Pricing (Van Westendorp)',
            priority: 'must_have'
          })
          questions.push({
            id: 'price_importance_001',
            type: 'scale-1-10',
            text: 'How important is price in your purchase decision?',
            section: 'Pricing',
            priority: 'high_priority',
            options: [
              { value: 1, label: 'Not important' },
              { value: 10, label: 'Extremely important' }
            ]
          })
          questions.push({
            id: 'willingness_to_pay_001',
            type: 'scale-1-10',
            text: 'How much would you be willing to pay for this product?',
            section: 'Pricing',
            priority: 'high_priority',
            options: [
              { value: 1, label: 'Under $10' },
              { value: 10, label: 'Over $100' }
            ]
          })
          break

        case 'audience':
          // Target Audience Validation
          questions.push({
            id: 'audience_type_001',
            type: 'multiple-choice-single',
            text: 'Which best describes you?',
            section: 'Target Audience',
            priority: 'medium_priority',
            options: [
              { value: 'early_adopter', label: 'Early adopter' },
              { value: 'mainstream', label: 'Mainstream user' },
              { value: 'late_adopter', label: 'Late adopter' },
              { value: 'skeptic', label: 'Skeptic' }
            ]
          })
          questions.push({
            id: 'lifestyle_001',
            type: 'multiple-choice-single',
            text: 'How would you describe your lifestyle?',
            section: 'Demographics',
            priority: 'medium_priority',
            options: [
              { value: 'busy_professional', label: 'Busy Professional' },
              { value: 'health_conscious', label: 'Health Conscious' },
              { value: 'budget_conscious', label: 'Budget Conscious' },
              { value: 'tech_savvy', label: 'Tech Savvy' },
              { value: 'traditional', label: 'Traditional' }
            ]
          })
          questions.push({
            id: 'pain_points_001',
            type: 'multiple-choice-multiple',
            text: 'What are your biggest pain points?',
            section: 'Target Audience',
            priority: 'high_priority',
            options: [
              { value: 'time_constraints', label: 'Time constraints' },
              { value: 'quality_concerns', label: 'Quality concerns' },
              { value: 'cost_concerns', label: 'Cost concerns' },
              { value: 'complexity', label: 'Complexity' },
              { value: 'reliability', label: 'Reliability issues' }
            ]
          })
          break

        case 'strategy':
          // Market Strategy
          questions.push({
            id: 'discovery_channel_001',
            type: 'multiple-choice-single',
            text: 'Where would you most likely discover this product?',
            section: 'Market Strategy',
            priority: 'high_priority',
            options: [
              { value: 'social_media', label: 'Social Media' },
              { value: 'google_search', label: 'Google Search' },
              { value: 'word_of_mouth', label: 'Word of Mouth' },
              { value: 'retail_store', label: 'Retail Store' },
              { value: 'online_ad', label: 'Online Advertisement' },
              { value: 'influencer', label: 'Influencer Recommendation' }
            ]
          })
          questions.push({
            id: 'trial_motivation_001',
            type: 'multiple-choice-single',
            text: 'What would make you try this product?',
            section: 'Market Strategy',
            priority: 'high_priority',
            options: [
              { value: 'free_trial', label: 'Free Trial' },
              { value: 'money_back', label: 'Money-back Guarantee' },
              { value: 'recommendation', label: 'Friend Recommendation' },
              { value: 'reviews', label: 'Positive Reviews' },
              { value: 'discount', label: 'Discount Offer' }
            ]
          })
          questions.push({
            id: 'competitive_positioning_001',
            type: 'multiple-choice-single',
            text: 'How does this compare to alternatives?',
            section: 'Market Strategy',
            priority: 'medium_priority',
            options: [
              { value: 'much_better', label: 'Much better' },
              { value: 'somewhat_better', label: 'Somewhat better' },
              { value: 'about_same', label: 'About the same' },
              { value: 'somewhat_worse', label: 'Somewhat worse' },
              { value: 'much_worse', label: 'Much worse' }
            ]
          })
          break

        case 'geographic':
          // Geographic Expansion
          questions.push({
            id: 'region_001',
            type: 'multiple-choice-single',
            text: 'What region do you live in?',
            section: 'Demographics',
            priority: 'medium_priority',
            options: [
              { value: 'northeast', label: 'Northeast' },
              { value: 'southeast', label: 'Southeast' },
              { value: 'midwest', label: 'Midwest' },
              { value: 'southwest', label: 'Southwest' },
              { value: 'west', label: 'West' },
              { value: 'international', label: 'International' }
            ]
          })
          questions.push({
            id: 'local_availability_001',
            type: 'multiple-choice-single',
            text: 'How important is local availability?',
            section: 'Geographic',
            priority: 'medium_priority',
            options: [
              { value: 'very_important', label: 'Very Important' },
              { value: 'somewhat_important', label: 'Somewhat Important' },
              { value: 'not_important', label: 'Not Important' }
            ]
          })
          questions.push({
            id: 'cultural_adaptation_001',
            type: 'multiple-choice-single',
            text: 'Would you prefer localized versions?',
            section: 'Geographic',
            priority: 'low_priority',
            options: [
              { value: 'yes', label: 'Yes, definitely' },
              { value: 'maybe', label: 'Maybe' },
              { value: 'no', label: 'No, global version is fine' }
            ]
          })
          break
      }
    })
    
    // Always add core demographic questions
    questions.push(
      {
        id: 'demo_age_001',
        type: 'multiple-choice-single',
        text: 'What is your age range?',
        section: 'Demographics',
        priority: 'low_priority',
        options: [
          { value: '18_24', label: '18-24' },
          { value: '25_34', label: '25-34' },
          { value: '35_44', label: '35-44' },
          { value: '45_54', label: '45-54' },
          { value: '55_64', label: '55-64' },
          { value: '65_plus', label: '65+' }
        ]
      },
      {
        id: 'demo_income_001',
        type: 'multiple-choice-single',
        text: 'What is your annual household income?',
        section: 'Demographics',
        priority: 'low_priority',
        options: [
          { value: 'under_25k', label: 'Under $25,000' },
          { value: '25k_50k', label: '$25,000 - $50,000' },
          { value: '50k_75k', label: '$50,000 - $75,000' },
          { value: '75k_100k', label: '$75,000 - $100,000' },
          { value: '100k_plus', label: '$100,000+' }
        ]
      }
    )
    
    return questions
  }

  const getSectionFromQuestionId = (questionId: string) => {
    if (questionId.includes('screener')) return 'Screener'
    if (questionId.includes('concept')) return 'Concept Evaluation'
    if (questionId.includes('price')) return 'Pricing (Van Westendorp)'
    if (questionId.includes('supp_cond')) return 'Condition Assessment'
    if (questionId.includes('supp_treat')) return 'Current Treatment'
    if (questionId.includes('supp_behav')) return 'Supplement Behavior'
    if (questionId.includes('supp_ingr')) return 'Ingredient Knowledge'
    if (questionId.includes('bev_cons')) return 'Consumption Profile'
    if (questionId.includes('bev_energy')) return 'Energy Needs'
    if (questionId.includes('saas_tools')) return 'Current Tools'
    if (questionId.includes('saas_pain')) return 'Pain Points'
    if (questionId.includes('demo')) return 'Demographics'
    return 'General'
  }

  const getPriorityFromQuestionId = (questionId: string) => {
    if (questionId.includes('screener') || questionId.includes('concept') || questionId.includes('price')) return 'must_have'
    if (questionId.includes('supp_cond') || questionId.includes('supp_treat') || questionId.includes('bev_cons') || questionId.includes('saas_tools')) return 'must_have'
    if (questionId.includes('supp_behav') || questionId.includes('bev_energy') || questionId.includes('saas_pain')) return 'high_priority'
    return 'medium_priority'
  }

  const generateIntelligentRecommendations = (survey: any[], industry: string, validationGoals: string[]) => {
    const recommendations: Recommendation[] = []
    
    // Check for MaxDiff questions
    const hasMaxDiff = survey.some(q => q.type === 'maxdiff')
    if (!hasMaxDiff && validationGoals.includes('Feature Prioritization')) {
      recommendations.push({
        id: 'maxdiff_001',
        title: 'Add MaxDiff Questions for Feature Prioritization',
        description: 'MaxDiff analysis provides statistically robust feature prioritization data',
        impact: 'high',
        category: 'methodology',
        action: 'add_question',
        details: {
          questionType: 'maxdiff',
          questionText: 'Which features are most important to you?',
          section: 'Feature Prioritization',
          priority: 'high_priority',
          items: ['Ease of use', 'Price', 'Quality', 'Brand reputation', 'Customer support'],
          sets: 3,
          items_per_set: 3
        },
        scoreImprovement: 8
      })
    }
    
    // Check for open-ended questions
    const openEndedCount = survey.filter(q => q.type === 'text-short' || q.type === 'text-long').length
    if (openEndedCount < 2) {
      recommendations.push({
        id: 'openended_001',
        title: 'Add More Open-Ended Questions',
        description: 'Qualitative insights provide deeper understanding of customer motivations',
        impact: 'medium',
        category: 'quality',
        action: 'add_question',
        details: {
          questionType: 'text-long',
          questionText: 'What would you change about this product to make it better?',
          section: 'Open Feedback',
          priority: 'medium_priority'
        },
        scoreImprovement: 5
      })
    }
    
    // Check for skip logic
    const hasSkipLogic = survey.some(q => q.skipLogic)
    if (!hasSkipLogic) {
      recommendations.push({
        id: 'skiplogic_001',
        title: 'Add Skip Logic for Personalization',
        description: 'Skip logic creates personalized survey experiences and improves completion rates',
        impact: 'medium',
        category: 'quality',
        action: 'add_logic',
        details: {
          skipLogic: {
            condition: 'if answer = "none"',
            skipTo: 'next_relevant_question'
          }
        },
        scoreImprovement: 6
      })
    }
    
    // Check for Van Westendorp completeness
    const vwQuestions = survey.filter(q => q.section === 'Pricing (Van Westendorp)').length
    if (vwQuestions < 4) {
      recommendations.push({
        id: 'vw_complete_001',
        title: 'Complete Van Westendorp Pricing Analysis',
        description: 'All 4 Van Westendorp questions are needed for accurate price sensitivity analysis',
        impact: 'high',
        category: 'methodology',
        action: 'add_question',
        details: {
          questionType: 'text-number',
          questionText: 'At what price would you consider this product expensive but acceptable?',
          section: 'Pricing (Van Westendorp)',
          priority: 'must_have'
        },
        scoreImprovement: 7
      })
    }
    
    // Check for demographic questions
    const demoQuestions = survey.filter(q => q.section === 'Demographics').length
    if (demoQuestions < 3) {
      recommendations.push({
        id: 'demographics_001',
        title: 'Add More Demographic Questions',
        description: 'Demographics enable better segmentation and analysis',
        impact: 'medium',
        category: 'coverage',
        action: 'add_question',
        details: {
          questionType: 'multiple-choice-single',
          questionText: 'What is your highest level of education?',
          section: 'Demographics',
          priority: 'low_priority',
          options: [
            { value: 'high_school', label: 'High School' },
            { value: 'some_college', label: 'Some College' },
            { value: 'bachelor', label: "Bachelor's Degree" },
            { value: 'master', label: "Master's Degree" },
            { value: 'phd', label: 'PhD/Doctorate' }
          ]
        },
        scoreImprovement: 4
      })
    }
    
    // Industry-specific recommendations
    if (industry === 'supplement') {
      const hasIngredientQuestions = survey.some(q => q.section === 'Ingredient Knowledge')
      if (!hasIngredientQuestions) {
        recommendations.push({
          id: 'ingredient_001',
          title: 'Add Ingredient Knowledge Questions',
          description: 'Understanding ingredient familiarity helps with messaging and education needs',
          impact: 'medium',
          category: 'coverage',
          action: 'add_question',
          details: {
            questionType: 'multiple-choice-single',
            questionText: 'How familiar are you with the key ingredients in this supplement?',
            section: 'Ingredient Knowledge',
            priority: 'medium_priority',
            options: [
              { value: 'very_familiar', label: 'Very familiar' },
              { value: 'somewhat_familiar', label: 'Somewhat familiar' },
              { value: 'slightly_familiar', label: 'Slightly familiar' },
              { value: 'not_familiar', label: 'Not familiar' }
            ]
          },
          scoreImprovement: 5
        })
      }
    }
    
    return recommendations
  }

  const generateMockQualityMetrics = (survey: any[], recommendations: Recommendation[], appliedRecommendations: string[]) => {
    const baseCoverage = Math.min(95, 70 + (survey.length * 2))
    const baseMethodology = Math.min(95, 60 + (survey.filter(q => 
      q.type === 'maxdiff' || q.type === 'nps' || q.section === 'Pricing (Van Westendorp)'
    ).length * 8))
    const baseQuality = Math.min(95, 65 + (survey.filter(q => 
      q.type === 'text-short' || q.type === 'text-long'
    ).length * 5))
    
    // Apply recommendation improvements
    const appliedImprovements = recommendations
      .filter(r => appliedRecommendations.includes(r.id))
      .reduce((acc, r) => {
        if (r.category === 'coverage') acc.coverage += r.scoreImprovement
        if (r.category === 'methodology') acc.methodology += r.scoreImprovement
        if (r.category === 'quality') acc.quality += r.scoreImprovement
        return acc
      }, { coverage: 0, methodology: 0, quality: 0 })
    
    const coverage_score = Math.min(100, baseCoverage + appliedImprovements.coverage)
    const methodology_score = Math.min(100, baseMethodology + appliedImprovements.methodology)
    const question_quality_score = Math.min(100, baseQuality + appliedImprovements.quality)
    const overall_score = Math.round((coverage_score + methodology_score + question_quality_score) / 3)
    
    return {
      coverage_score,
      methodology_score,
      question_quality_score,
      overall_score,
      recommendations: recommendations.map(r => r.title)
    }
  }

  const steps = [
    { id: 1, title: 'Product Analysis', icon: Brain },
    { id: 2, title: 'Question Selection', icon: Target },
    { id: 3, title: 'Customization', icon: Users },
    { id: 4, title: 'Quality Validation', icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          {isFromDashboard && (
            <div className="flex justify-start mb-4">
              <Button 
                onClick={() => router.back()} 
                variant="secondary" 
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <Crown className="w-12 h-12 text-purple-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI-Powered Survey Builder
            </h1>
          </motion.div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Generate comprehensive, industry-specific surveys that cover every angle of your product validation.
            Our AI analyzes your product deeply and creates surveys with professional research methodologies.
          </p>
          
          {isFromDashboard && testData && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Continuing:</strong> {testData.productInfo?.name || 'Your test'} - Survey creation step
              </p>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = state.currentStep >= step.id
              const isCompleted = state.currentStep > step.id
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isActive 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isCompleted ? 'text-green-500' : ''}`} />
                  <span className="font-medium">{step.title}</span>
                </motion.div>
              )
            })}
          </div>
          
          {state.isGenerating && (
            <div className="text-center">
              <Progress value={(state.currentStep / 4) * 100} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {state.currentStep === 1 && 'Analyzing product intelligence...'}
                {state.currentStep === 2 && 'Selecting category-specific questions...'}
                {state.currentStep === 3 && 'Customizing questions for your product...'}
                {state.currentStep === 4 && 'Validating survey quality...'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
                Product Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Description
                  </label>
                  <Textarea
                    value={state.productDescription}
                    onChange={(e) => setState(prev => ({ ...prev, productDescription: e.target.value }))}
                    placeholder="Describe your product in detail. Include ingredients, benefits, target audience, and any claims..."
                    rows={4}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <Input
                    value={state.targetAudience}
                    onChange={(e) => setState(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="e.g., Men 40-65 with joint pain"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry Category
                  </label>
                  <Select
                    value={state.industry}
                    onValueChange={(value) => setState(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select industry..." />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Validation Goals
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {VALIDATION_GOALS.map(goal => (
                      <label key={goal} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={state.validationGoals.includes(goal)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setState(prev => ({ ...prev, validationGoals: [...prev.validationGoals, goal] }))
                            } else {
                              setState(prev => ({ 
                                ...prev, 
                                validationGoals: prev.validationGoals.filter(g => g !== goal) 
                              }))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={handleGenerateSurvey}
                  disabled={!state.productDescription || !state.industry || state.isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {state.isGenerating ? (
                    <>
                      <Zap className="w-5 h-5 mr-2 animate-pulse" />
                      Generating Survey...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Generate Comprehensive Survey
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Method Choice */}
          {state.showMethodChoice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Choose Survey Method
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Select how you'd like to create your market research survey
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Quick Template Option */}
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500"
                        onClick={() => handleMethodChoice('template')}>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Zap className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Quick Template</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Use our pre-built, industry-tested survey template for fast results
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Ready in seconds</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Battle-tested questions</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Can still customize</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleMethodChoice('template')}
                          className="w-full"
                          variant="outline"
                        >
                          Use Template
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                  
                  {/* AI Generation Option */}
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500"
                        onClick={() => handleMethodChoice('ai')}>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">AI-Generated</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Let AI create a custom survey tailored specifically to your product
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Fully customized questions</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Adapts to your product</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Best for unique products</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleMethodChoice('ai')}
                          className="w-full"
                        >
                          Generate with AI
                          <Sparkles className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
                
                {/* Comparison Table */}
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h3 className="font-semibold mb-4">Comparison</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2"></th>
                        <th className="text-center py-2">Quick Template</th>
                        <th className="text-center py-2">AI-Generated</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Generation Time</td>
                        <td className="text-center">~5 seconds</td>
                        <td className="text-center">~30 seconds</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"># of Questions</td>
                        <td className="text-center">5 questions</td>
                        <td className="text-center">10-15 questions</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Customization</td>
                        <td className="text-center">Medium</td>
                        <td className="text-center">High</td>
                      </tr>
                      <tr>
                        <td className="py-2">Best For</td>
                        <td className="text-center">Quick validation</td>
                        <td className="text-center">Unique products</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {state.generatedSurvey.length > 0 && (
              <>
                {/* Quality Metrics */}
                {state.qualityMetrics && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Survey Quality Score
                      </h3>
                      <Button onClick={handleReevaluateSurvey} variant="secondary" size="sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Re-evaluate
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {state.qualityMetrics.overall_score}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Overall Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {state.qualityMetrics.coverage_score}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Coverage
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {state.qualityMetrics.methodology_score}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Methodology
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {state.qualityMetrics.question_quality_score}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Quality
                        </div>
                      </div>
                    </div>
                    
                    {/* Interactive Recommendations */}
                    {state.recommendations.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                          <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                          Smart Recommendations ({state.recommendations.length})
                        </h4>
                        <div className="space-y-3">
                          {state.recommendations.map((rec) => (
                            <div key={rec.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-gray-900 dark:text-white">
                                    {rec.title}
                                  </h5>
                                  <Badge 
                                    variant={rec.impact === 'high' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {rec.impact} impact
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    +{rec.scoreImprovement}%
                                  </Badge>
                                </div>
                                {state.appliedRecommendations.includes(rec.id) ? (
                                  <Badge variant="default" className="text-xs">
                                    Applied
                                  </Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => handleApplyRecommendation(rec)}
                                  >
                                    Apply
                                  </Button>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                {rec.description}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Category: {rec.category} • Action: {rec.action.replace('_', ' ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Generated Survey Preview */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                      Generated Survey Preview
                    </h3>
                    <Button onClick={handleAddQuestion} variant="secondary" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Questions: {state.generatedSurvey.length}
                      </span>
                      <Badge variant="secondary">Professional Grade</Badge>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {state.generatedSurvey.map((question, index) => (
                        <div key={question.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Q{index + 1}
                              </span>
                              <div className="flex space-x-1">
                                <Badge 
                                  variant={question.priority === 'must_have' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {question.priority.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.section}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMoveQuestion(question.id, 'up')}
                                disabled={index === 0}
                              >
                                <ArrowUp className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMoveQuestion(question.id, 'down')}
                                disabled={index === state.generatedSurvey.length - 1}
                              >
                                <ArrowDown className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Question Text
                              </label>
                              <Textarea
                                value={question.text}
                                onChange={(e) => handleEditQuestion(question.id, 'text', e.target.value)}
                                className="text-sm"
                                rows={2}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Type
                                </label>
                                <Select
                                  value={question.type}
                                  onValueChange={(value) => handleEditQuestion(question.id, 'type', value)}
                                >
                                  <SelectTrigger className="text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="multiple-choice-single">Single Choice</SelectItem>
                                    <SelectItem value="multiple-choice-multiple">Multiple Choice</SelectItem>
                                    <SelectItem value="scale-1-10">Scale 1-10</SelectItem>
                                    <SelectItem value="scale-0-10">Scale 0-10</SelectItem>
                                    <SelectItem value="text-short">Short Text</SelectItem>
                                    <SelectItem value="text-long">Long Text</SelectItem>
                                    <SelectItem value="nps">NPS</SelectItem>
                                    <SelectItem value="maxdiff">MaxDiff</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Priority
                                </label>
                                <Select
                                  value={question.priority}
                                  onValueChange={(value) => handleEditQuestion(question.id, 'priority', value)}
                                >
                                  <SelectTrigger className="text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="must_have">Must Have</SelectItem>
                                    <SelectItem value="high_priority">High Priority</SelectItem>
                                    <SelectItem value="medium_priority">Medium Priority</SelectItem>
                                    <SelectItem value="low_priority">Low Priority</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            {question.options && question.options.length > 0 && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Options
                                </label>
                                <div className="space-y-1">
                                  {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center space-x-2">
                                      <Input
                                        value={option.label}
                                        onChange={(e) => {
                                          const newOptions = [...question.options]
                                          newOptions[optIndex] = { ...option, label: e.target.value }
                                          handleEditQuestion(question.id, 'options', newOptions)
                                        }}
                                        className="text-xs"
                                        placeholder="Option text"
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          const newOptions = question.options.filter((_, i) => i !== optIndex)
                                          handleEditQuestion(question.id, 'options', newOptions)
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const newOptions = [...question.options, { value: `option_${Date.now()}`, label: 'New option' }]
                                      handleEditQuestion(question.id, 'options', newOptions)
                                    }}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Option
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={handleUseSurvey}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Use This Survey
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={handleExportSurvey}
                      >
                        Export
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}
            
            {state.generatedSurvey.length === 0 && !state.isGenerating && (
              <Card className="p-6 text-center">
                <div className="text-gray-400 dark:text-gray-500">
                  <Brain className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Generate Your Survey</h3>
                  <p className="text-sm">
                    Fill in the product information and click "Generate Comprehensive Survey" to create a professional-grade survey tailored to your product.
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
