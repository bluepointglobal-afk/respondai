'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Users, TrendingUp, Target, AlertTriangle } from 'lucide-react'

export default function ComprehensiveResultsPage() {
  const params = useParams()
  const testId = params.testId as string
  
  const [testData, setTestData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestData()
  }, [testId])

  const fetchTestData = async () => {
    try {
      console.log('🔍 Fetching test data for:', testId)
      const response = await fetch(`/api/test/${testId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 Raw API data:', data)
      setTestData(data)
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Analysis...</h2>
            <p className="text-gray-600">Fetching your AI-generated insights</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={fetchTestData} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  if (!testData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Found</h2>
          <p className="text-gray-600">Unable to load test data.</p>
        </div>
      </div>
    )
  }

  const analysis = testData.analysis

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive Analysis Results</h1>
        <p className="text-gray-600">AI-generated insights for: {testData.name}</p>
      </div>

      {/* Executive Summary */}
      {analysis?.executiveSummary && (
        <Card className="mb-6 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Executive Summary</h2>
              <p className="text-gray-700 mb-4">{analysis.executiveSummary.launchReasoning || 'Analysis completed'}</p>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-green-600">
                  Confidence: {analysis.confidence || 0}%
                </Badge>
                <Badge variant="outline" className="text-blue-600">
                  Sample Size: {analysis.sampleSize || 0}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Purchase Intent</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysis?.purchaseIntent?.avgIntent || 0}%
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Sample Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysis?.sampleSize || 0}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Confidence</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysis?.confidence || 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Insights */}
      {analysis?.insights && analysis.insights.length > 0 && (
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
          <div className="space-y-4">
            {analysis.insights.map((insight: any, index: number) => (
              <div key={insight.id || index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                <p className="text-gray-600 mt-1">{insight.summary}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {insight.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {insight.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Key Findings */}
      {analysis?.keyFindings && analysis.keyFindings.length > 0 && (
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Findings</h2>
          <div className="space-y-3">
            {analysis.keyFindings.map((finding: any, index: number) => (
              <div key={finding.id || index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{finding.title}</h3>
                  <p className="text-gray-600 text-sm">{finding.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Raw Data Debug */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Raw Analysis Data</h2>
        <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
          {JSON.stringify(analysis, null, 2)}
        </pre>
      </Card>
    </div>
  )
}