'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function SimpleSurveyPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  
  const [test, setTest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('SimpleSurveyPage: Starting fetch for testId:', testId)
    fetchTestData()
  }, [testId])

  const fetchTestData = async () => {
    try {
      setLoading(true)
      console.log('SimpleSurveyPage: Fetching test data...')
      
      const response = await fetch(`/api/test/${testId}`)
      console.log('SimpleSurveyPage: Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('SimpleSurveyPage: Data received:', data)
      setTest(data)
    } catch (err) {
      console.error('SimpleSurveyPage: Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading test data...</p>
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Simple Survey Page</h1>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Data</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {test?.id}</p>
            <p><strong>Name:</strong> {test?.name}</p>
            <p><strong>Status:</strong> {test?.status}</p>
            <p><strong>Product:</strong> {test?.productInfo?.name}</p>
          </div>
          
          <div className="mt-6">
            <Button onClick={() => router.push('/dashboard')} variant="primary">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
