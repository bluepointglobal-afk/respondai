'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Play, Settings } from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

interface Test {
  id: string
  name: string
  productInfo: any
  validationGoals: string[]
  audiences: any[]
}

export default function LaunchPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [launching, setLaunching] = useState(false)

  useEffect(() => {
    // Clear browser localStorage to ensure fresh data
    console.log('🧹 Clearing browser localStorage...')
    localStorage.removeItem('test-creation-store')
    localStorage.removeItem('test-creation')
    
    // Clear any other test-related localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.includes('test') || key.includes('survey') || key.includes('cache')) {
        localStorage.removeItem(key)
      }
    })
    
    fetchTestData()
  }, [testId])

  const fetchTestData = async () => {
    try {
      setLoading(true)
      
      // Clear cache first to ensure fresh data
      console.log('🧹 Clearing cache for fresh data...')
      await fetch('/api/admin/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testId })
      }).catch(err => console.log('Cache clear failed:', err))
      
      // Fetch test data with cache-busting
      const response = await fetch(`/api/test/${testId}/audiences?t=${Date.now()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch test data')
      }
      
      const data = await response.json()
      console.log('📊 Fetched test data:', data.test)
      setTest(data.test)
    } catch (err) {
      console.error('Error fetching test data:', err)
      setError('Failed to load test data')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/test/${testId}/survey`)
  }

  const handleLaunch = async () => {
    try {
      setLaunching(true)
      
      // Clear cache before launching to ensure fresh processing
      console.log('🧹 Clearing cache before launch...')
      await fetch('/api/admin/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testId })
      }).catch(err => console.log('Cache clear failed:', err))
      
      // Update test status to RUNNING
      await fetch(`/api/test/${testId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'RUNNING' })
      })

      // Navigate to processing page
      router.push(`/dashboard/test/${testId}/processing`)
    } catch (err) {
      console.error('Error launching test:', err)
      alert('Failed to launch test. Please try again.')
    } finally {
      setLaunching(false)
    }
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
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Launch Simulation
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Configure and launch your market research simulation
            </p>
          </div>
          <Button onClick={handleBack} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Survey
          </Button>
        </div>

        {/* Test Info */}
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-bold text-lg">🚀</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {test.name}
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Ready to launch simulation
              </p>
            </div>
          </div>
        </Card>

        {/* Launch Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Audience Segments</h3>
            <div className="space-y-2">
              {test.audiences?.map((audience, index) => (
                <div key={audience.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">{audience.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {audience.targetSampleSize || 0} responses
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Simulation Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Responses:</span>
                <span className="font-medium">
                  {test.audiences?.reduce((sum, a) => sum + (a.targetSampleSize || 0), 0) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Duration:</span>
                <span className="font-medium">2-3 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence Level:</span>
                <span className="font-medium">95%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Launch Button */}
        <div className="text-center">
          <Button 
            onClick={handleLaunch} 
            disabled={launching}
            size="lg"
            variant="primary"
            className="px-8 py-4 text-lg"
          >
            <Play className="w-6 h-6 mr-3" />
            {launching ? 'Launching...' : 'Launch Simulation'}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            This will start the AI-powered market research simulation
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
