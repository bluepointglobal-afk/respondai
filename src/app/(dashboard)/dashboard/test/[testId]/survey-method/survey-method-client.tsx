'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Zap, ArrowRight, ArrowLeft, Target, Brain } from 'lucide-react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

interface Test {
  id: string
  name: string
  productInfo: any
  validationGoals: string[]
}

interface SurveyMethodClientProps {
  test: Test
}

export function SurveyMethodClient({ test }: SurveyMethodClientProps) {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<string | null>(null)

  async function handleTemplateChoice() {
    setLoading(true)
    setLoadingType('template')
    
    try {
      // Load predefined template
      const response = await fetch(`/api/test/${test.id}/survey/template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industryCategory: test.productInfo?.industry || 'general',
          validationGoals: test.validationGoals || []
        })
      })
      
      if (!response.ok) throw new Error('Failed to load template')
      
      // Redirect to survey page
      router.push(`/dashboard/test/${test.id}/survey`)
      
    } catch (error) {
      console.error('Failed to load template:', error)
      alert('Failed to load template')
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }
  
  async function handleAIGeneration() {
    setLoading(true)
    setLoadingType('ai')
    
    try {
      // Generate with AI
      const response = await fetch(`/api/test/${test.id}/survey/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productInfo: test.productInfo || {},
          validationGoals: test.validationGoals || []
        })
      })
      
      if (!response.ok) throw new Error('Failed to generate survey')
      
      // Redirect to survey page
      router.push(`/dashboard/test/${test.id}/survey`)
      
    } catch (error) {
      console.error('Failed to generate survey:', error)
      alert('Failed to generate survey')
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }
  
  return (
    <DashboardLayout>
      <div className="container max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Survey Method</h1>
          <p className="text-muted-foreground">
            Select how you'd like to create your market research survey
          </p>
          
          {/* Product Info Display */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  {test.name}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {test.productInfo?.description || test.productInfo?.name || 'Product details'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* OPTION 1: QUICK TEMPLATE */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500"
                onClick={handleTemplateChoice}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-green-100 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Template</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pre-built, industry-tested questions
              </p>
              
              <div className="space-y-1 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Ready in seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Battle-tested</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Customizable</span>
                </div>
              </div>
              
              <Button 
                onClick={handleTemplateChoice}
                disabled={loading}
                className="w-full"
                variant="outline"
                size="sm"
              >
                {loading && loadingType === 'template' ? 'Loading...' : 'Use Template'}
              </Button>
            </div>
          </Card>
          
          {/* OPTION 2: AI GENERATION */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500"
                onClick={handleAIGeneration}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 rounded-lg mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Generated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Custom survey tailored to your product
              </p>
              
              <div className="space-y-1 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  <span>Fully customized</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  <span>Product-specific</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  <span>Intelligent</span>
                </div>
              </div>
              
              <Button 
                onClick={handleAIGeneration}
                disabled={loading}
                className="w-full"
                size="sm"
              >
                {loading && loadingType === 'ai' ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
          </Card>

          {/* OPTION 3: PROFESSIONAL SURVEY BUILDER */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500"
                onClick={() => router.push(`/professional-survey-builder?testId=${test.id}`)}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-lg mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Builder</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Industry-standard methodologies
              </p>
              
              <div className="space-y-1 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Van Westendorp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>MaxDiff Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Kano Model</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                variant="outline"
                size="sm"
              >
                Open Professional
              </Button>
            </div>
          </Card>

          {/* OPTION 4: REVAMPED SURVEY BUILDER */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-500"
                onClick={() => {
                  // Store test data for revamped survey builder
                  sessionStorage.setItem('currentTestData', JSON.stringify({
                    testId: test.id,
                    productInfo: test.productInfo || {},
                    validationGoals: test.validationGoals || [],
                    audiences: [],
                    returnUrl: `/dashboard/test/${test.id}/audience`
                  }))
                  router.push('/revamped-survey-builder')
                }}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-orange-100 rounded-lg mb-4">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Revamped Builder</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Deep, industry-specific surveys
              </p>
              
              <div className="space-y-1 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  <span>Product intelligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  <span>Category-specific</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  <span>Quality validation</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                variant="outline"
                size="sm"
              >
                Open Revamped
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Comparison Table */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-4">Survey Builder Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2"></th>
                  <th className="text-center py-2">Quick Template</th>
                  <th className="text-center py-2">AI-Generated</th>
                  <th className="text-center py-2">Professional</th>
                  <th className="text-center py-2">Revamped</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Generation Time</td>
                  <td className="text-center">~5 seconds</td>
                  <td className="text-center">~30 seconds</td>
                  <td className="text-center">Manual</td>
                  <td className="text-center">~45 seconds</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Customization</td>
                  <td className="text-center">Medium</td>
                  <td className="text-center">High</td>
                  <td className="text-center">Full Control</td>
                  <td className="text-center">Maximum</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Methodologies</td>
                  <td className="text-center">Standard</td>
                  <td className="text-center">AI-Optimized</td>
                  <td className="text-center">Van Westendorp, MaxDiff, Kano</td>
                  <td className="text-center">Industry-Specific</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Best For</td>
                  <td className="text-center">Quick validation</td>
                  <td className="text-center">Unique products</td>
                  <td className="text-center">Research professionals</td>
                  <td className="text-center">Deep insights</td>
                </tr>
                <tr>
                  <td className="py-2">Complexity</td>
                  <td className="text-center">Simple</td>
                  <td className="text-center">Medium</td>
                  <td className="text-center">Advanced</td>
                  <td className="text-center">Expert</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={() => router.push(`/dashboard/test/${test.id}/product`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product Setup
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
