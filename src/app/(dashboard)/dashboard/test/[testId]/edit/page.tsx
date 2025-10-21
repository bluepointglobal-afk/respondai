'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

interface Test {
  id: string
  name: string
  productInfo: any
  validationGoals: string[]
}

export default function EditTestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestData()
  }, [testId])

  const fetchTestData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/test/${testId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch test data')
      }
      
      const data = await response.json()
      setTest(data)
    } catch (err) {
      console.error('Error fetching test data:', err)
      setError('Failed to load test data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!test) return

    try {
      setSaving(true)
      const response = await fetch(`/api/test/${testId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test)
      })

      if (!response.ok) {
        throw new Error('Failed to save test')
      }

      router.push('/dashboard')
    } catch (err) {
      console.error('Error saving test:', err)
      alert('Failed to save test. Please try again.')
    } finally {
      setSaving(false)
    }
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
              Edit Test
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Update your test information
            </p>
          </div>
          <Button onClick={handleBack} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Form */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Test Name</Label>
              <Input
                id="name"
                value={test.name}
                onChange={(e) => setTest(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Enter test name"
              />
            </div>

            <div>
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                value={test.productInfo?.description || ''}
                onChange={(e) => setTest(prev => prev ? {
                  ...prev,
                  productInfo: { ...prev.productInfo, description: e.target.value }
                } : null)}
                placeholder="Describe your product"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={test.productInfo?.industry || ''}
                onChange={(e) => setTest(prev => prev ? {
                  ...prev,
                  productInfo: { ...prev.productInfo, industry: e.target.value }
                } : null)}
                placeholder="e.g., Health & Wellness"
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={test.productInfo?.targetAudience || ''}
                onChange={(e) => setTest(prev => prev ? {
                  ...prev,
                  productInfo: { ...prev.productInfo, targetAudience: e.target.value }
                } : null)}
                placeholder="e.g., Men 30-55 with joint pain"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-8">
          <Button onClick={handleBack} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            variant="primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
