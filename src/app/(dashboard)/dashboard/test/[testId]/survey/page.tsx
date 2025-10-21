'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Sparkles, Brain, Target } from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

interface Test {
  id: string
  name: string
  productInfo: any
  validationGoals: string[]
  audiences: any[]
}

export default function SurveyPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestData()
  }, [testId])

  const fetchTestData = async () => {
    try {
      setLoading(true)
      console.log('Fetching test data for:', testId)
      
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(`/api/test/${testId}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch test data: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('=== SURVEY PAGE DEBUG ===')
      console.log('Test ID:', testId)
      console.log('Test Name:', data.name)
      console.log('Test Status:', data.status)
      console.log('Test data received:', data)
      console.log('Survey object:', data.survey)
      console.log('Survey exists check:', !!data.survey)
      console.log('Survey sections count:', data.survey?.sections?.length)
      
      // If no survey exists, redirect to survey method choice
      if (!data.survey || !data.survey.sections || data.survey.sections.length === 0) {
        console.log('❌ No survey found, redirecting to survey method choice')
        router.push(`/dashboard/test/${testId}/survey-method`)
        return
      }
      
      // If survey exists but test status is not ready for survey editing, redirect appropriately
      if (data.status === 'DRAFT' || data.status === 'SURVEY_BUILDING') {
        console.log('✅ Survey exists and ready for editing')
      } else if (data.status === 'AUDIENCE_SETUP') {
        console.log('ℹ️ Survey complete, redirecting to audience setup')
        router.push(`/dashboard/test/${testId}/audience`)
        return
      }
      
      console.log('✅ Survey found, setting test data')
      setTest(data)
    } catch (err) {
      console.error('Error fetching test data:', err)
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError(`Failed to load test data: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/test/${testId}/survey-method`)
  }

  const handleOpenSurveyBuilder = () => {
    // Store test data in sessionStorage for the Revamped Survey Builder
    if (test) {
      sessionStorage.setItem('currentTestData', JSON.stringify({
        testId: test.id,
        productInfo: test.productInfo || {},
        validationGoals: test.validationGoals || [],
        audiences: test.audiences || [],
        returnUrl: `/dashboard/test/${testId}/audience`
      }))
    }
    
    // Navigate to Revamped Survey Builder
    router.push('/revamped-survey-builder')
  }

  const handleSkipToLaunch = () => {
    router.push(`/dashboard/test/${testId}/audience`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading survey builder...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Card className="p-8 text-center max-w-md">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Button onClick={() => router.push('/dashboard')} variant="primary">
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!test) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Card className="p-8 text-center max-w-md">
            <div className="text-gray-600 mb-4">Test not found</div>
            <Button onClick={() => router.push('/dashboard')} variant="primary">
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Survey Builder
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Create intelligent survey questions with AI
            </p>
          </div>
          <Button onClick={handleBack} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audience
          </Button>
        </div>

        {/* Test Info */}
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-bold text-lg">📝</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {test.name}
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                {test.productInfo?.name || test.name || 'Product validation test'}
              </p>
            </div>
          </div>
        </Card>

        {/* Survey Builder Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI-Powered Survey Builder */}
          <Card className="p-8 border-2 border-primary/20 hover:border-primary/40 transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Survey Builder</h3>
              <p className="text-muted-foreground mb-6">
                Generate intelligent, industry-specific survey questions tailored to your product and audience.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  <span>Industry-specific question banks</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>Audience-targeted questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span>AI quality validation</span>
                </div>
              </div>
              
              <Button onClick={handleOpenSurveyBuilder} variant="primary" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Open AI Survey Builder
              </Button>
            </div>
          </Card>

          {/* Quick Launch Option */}
          <Card className="p-8 border-2 border-gray-200 hover:border-gray-300 transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Launch</h3>
              <p className="text-muted-foreground mb-6">
                Skip survey customization and proceed directly to launch with default questions.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <span>Use default survey template</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <span>Faster setup process</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <span>Basic validation questions</span>
                </div>
              </div>
              
              <Button onClick={handleSkipToLaunch} variant="secondary" className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Skip to Launch
              </Button>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-8 border-t border-light-border-primary dark:border-dark-border-primary">
          <Button onClick={handleBack} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audience
          </Button>
          <div className="text-sm text-muted-foreground">
            Choose your survey creation method above
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
