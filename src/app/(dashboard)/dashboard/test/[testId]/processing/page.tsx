'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle, Clock, BarChart3 } from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

interface Test {
  id: string
  name: string
  productInfo: any
  validationGoals: string[]
  audiences: any[]
}

export default function ProcessingPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Starting simulation...')

  useEffect(() => {
    fetchTestData()
    startSimulation()
  }, [testId])

  const fetchTestData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/test/${testId}/audiences`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch test data')
      }
      
      const data = await response.json()
      setTest(data.test)
    } catch (err) {
      console.error('Error fetching test data:', err)
      setError('Failed to load test data')
    } finally {
      setLoading(false)
    }
  }

  const startSimulation = () => {
    const steps = [
      { progress: 20, status: 'Generating responses...' },
      { progress: 40, status: 'Analyzing patterns...' },
      { progress: 60, status: 'Creating personas...' },
      { progress: 80, status: 'Generating insights...' },
      { progress: 100, status: 'Simulation complete!' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress)
        setStatus(steps[currentStep].status)
        currentStep++
      } else {
        clearInterval(interval)
        // Navigate to results after completion
        setTimeout(() => {
          router.push(`/dashboard/test/${testId}/results`)
        }, 2000)
      }
    }, 2000)
  }

  const handleBack = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !test) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">Error: {error || 'Test not found'}</div>
            <Button onClick={handleBack} variant="primary">
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Processing Simulation
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              AI is analyzing your market research data
            </p>
          </div>
          <Button onClick={handleBack} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Test Info */}
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-bold text-lg">⚡</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {test.name}
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Simulation in progress
              </p>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-primary-500/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-primary-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{status}</h2>
            <p className="text-muted-foreground">
              Please wait while we process your data...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-primary-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {progress}% Complete
          </div>
        </Card>

        {/* Processing Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                progress >= 20 ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Response Generation</div>
                <div className="text-sm text-muted-foreground">Creating realistic survey responses</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                progress >= 40 ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Pattern Analysis</div>
                <div className="text-sm text-muted-foreground">Identifying key trends and insights</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                progress >= 60 ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Persona Creation</div>
                <div className="text-sm text-muted-foreground">Building customer personas</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                progress >= 80 ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Insight Generation</div>
                <div className="text-sm text-muted-foreground">Creating actionable recommendations</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
