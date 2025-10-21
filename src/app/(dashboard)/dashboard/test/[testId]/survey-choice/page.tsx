'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Sparkles, Brain, Target, Zap, FileText } from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

interface Test {
  id: string
  name: string
  productInfo: any
  validationGoals: string[]
}

export default function SurveyChoicePage() {
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
      console.log('Test data received:', data)
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
    router.push('/dashboard/test/new/product')
  }

  const handleOpenSurveyBuilder = () => {
    // Store test data in sessionStorage for the Revamped Survey Builder
    if (test) {
      sessionStorage.setItem('currentTestData', JSON.stringify({
        testId: test.id,
        productInfo: test.productInfo || {},
        validationGoals: test.validationGoals || [],
        audiences: [],
        returnUrl: `/dashboard/test/${testId}/audience`
      }))
    }
    
    // Navigate to Revamped Survey Builder
    router.push('/revamped-survey-builder')
  }

  const handleSkipToAudience = () => {
    router.push(`/dashboard/test/${testId}/audience`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading survey options...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchTestData} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
            Step 3 of 5
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-12 rounded-full ${
                  i <= 2 ? 'bg-primary-500' : 'bg-light-border dark:bg-dark-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
            Create intelligent survey questions with AI
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Choose how you'd like to create your survey questions for {test?.productInfo?.name || 'your product'}
          </p>
        </div>

        {/* Current Test Info */}
        {test && (
          <Card className="mb-8 p-6 bg-light-bg-secondary dark:bg-dark-bg-secondary">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {test.name}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {test.productInfo?.name || 'Product validation test'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Survey Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI-Powered Survey Builder */}
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleOpenSurveyBuilder}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                AI-Powered Survey Builder
              </h3>
              
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Generate intelligent, industry-specific survey questions tailored to your product and audience.
              </p>
              
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Industry-specific question banks
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Target className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Audience-targeted questions
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    AI quality validation
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleOpenSurveyBuilder}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Open AI Survey Builder
              </Button>
            </div>
          </Card>

          {/* Quick Launch */}
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleSkipToAudience}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                Quick Launch
              </h3>
              
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Skip survey customization and proceed directly to launch with default questions.
              </p>
              
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Use default survey template
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Faster setup process
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Basic validation questions
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleSkipToAudience}
              >
                → Skip to Launch
              </Button>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product Setup
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
