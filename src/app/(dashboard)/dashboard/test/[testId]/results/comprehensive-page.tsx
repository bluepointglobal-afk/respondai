/**
 * COMPREHENSIVE RESULTS PAGE
 * Displays marketing-grade analytics with expandable components
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  Target, 
  Lightbulb, 
  BarChart3, 
  Download,
  Share,
  Settings,
  Brain,
  Zap,
  Star
} from 'lucide-react'

// Import our new comprehensive components
import { ExpandableInsightCard } from '@/components/results/expandable-insight-card'
import { PersonaCard } from '@/components/results/persona-card'
import { RecommendationsTimeline } from '@/components/results/recommendations-timeline'
import { ExecutiveSummaryCard } from '@/components/results/executive-summary-card'
import { ResponsesDataTable } from '@/components/results/responses-data-table'

// Types for comprehensive analysis
interface ComprehensiveAnalysisData {
  executiveSummary: {
    bottomLine: string
    marketOpportunity: string
    keyFinding: string
    strategicImplications: string[]
    recommendedActions: string[]
    risks: string[]
    confidence: number
    methodology: string
  }
  purchaseIntent: {
    overall: { mean: number; median: number; stdDev: number }
    bySegment: Array<{
      segment: string
      intent: number
      size: number
      lift: number
    }>
    drivers: string[]
    barriers: string[]
  }
  insights: Array<{
    id: string
    type: 'opportunity' | 'risk' | 'strategy' | 'finding'
    category: 'market' | 'pricing' | 'positioning' | 'segmentation' | 'channel' | 'timing' | 'product'
    priority: 'high' | 'medium' | 'low'
    title: string
    summary: string
    description: string
    evidence: {
      dataPoints: string[]
      sampleSize: number
      confidence: number
      methodology?: string
    }
    impact: {
      revenue: string
      timeframe: 'short' | 'medium' | 'long'
      effort: 'low' | 'medium' | 'high'
      priority: 'critical' | 'important' | 'nice-to-have'
    }
    recommendations: Array<{
      action: string
      rationale: string
      timeline: string
      owner: string
      kpis: string[]
    }>
    relatedPatterns?: string[]
  }>
  personas: Array<{
    id: string
    name: string
    tagline: string
    demographics: any
    narrative: string
    jobsToBeDone: any
    motivations: string[]
    painPoints: string[]
    purchaseDrivers: any
    decisionProcess: any
    messaging: any
    quotableQuotes: string[]
    dayInLife: string
    marketingGuidance: any
    sizeAndValue: any
  }>
  recommendations: Array<{
    id: string
    category: 'brand' | 'product' | 'pricing' | 'distribution' | 'marketing' | 'positioning'
    timeframe: 'immediate' | 'near-term' | 'long-term'
    priority: 'critical' | 'high' | 'medium' | 'low'
    title: string
    description: string
    rationale: any
    implementation: any
    metrics: any
    risks: any
    estimatedImpact: any
  }>
  surveyResponses?: Array<{
    id: string
    testId: string
    audienceId?: string
    responseData: any
    demographics: any
    psychographics: any
    behaviors: any
    purchaseIntent: number
    priceAcceptance: any
    brandFit: number
    featurePreferences: any
    metadata: any
    createdAt: string
  }>
}

interface TestData {
  id: string
  name: string
  productInfo: any
  status: string
  audiences: any[]
  analysis: ComprehensiveAnalysisData
}

export default function ComprehensiveResultsPage() {
  const params = useParams()
  const testId = params.testId as string
  
  const [testData, setTestData] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  useEffect(() => {
    fetchTestData()
  }, [testId])
  
  const fetchTestData = async () => {
    try {
      console.log('🔍 Fetching comprehensive test data for:', testId)
      const response = await fetch(`/api/test/${testId}/results`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch test: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 Comprehensive test data received:', data)
      
      // Transform the data to match our comprehensive structure
      const transformedData: TestData = {
        id: data.test.id,
        name: data.test.name,
        productInfo: data.test.productInfo,
        status: data.test.status,
        audiences: data.test.audiences || [],
        analysis: data.analysis || {
          executiveSummary: {
            bottomLine: 'Analysis in progress...',
            marketOpportunity: 'Market opportunity being analyzed...',
            keyFinding: 'Key findings being generated...',
            strategicImplications: [],
            recommendedActions: [],
            risks: [],
            confidence: 0,
            methodology: 'Analysis in progress'
          },
          purchaseIntent: {
            overall: { mean: 0, median: 0, stdDev: 0 },
            bySegment: [],
            drivers: [],
            barriers: []
          },
          insights: [],
          personas: [],
          recommendations: []
        }
      }
      
      setTestData(transformedData)
    } catch (error) {
      console.error('❌ Error fetching test data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRunAnalysis = async () => {
    try {
      console.log('🚀 Running comprehensive analysis...')
      const response = await fetch(`/api/test/${testId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`)
      }
      
      console.log('✅ Analysis completed, refreshing data...')
      await fetchTestData()
    } catch (error) {
      console.error('❌ Analysis error:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Analysis...</h2>
            <p className="text-gray-600">Preparing your marketing-grade insights</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!testData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Not Found</h2>
          <p className="text-gray-600">The requested test could not be found.</p>
        </div>
      </div>
    )
  }
  
  if (!testData.analysis || testData.analysis.insights.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Available</h2>
          <p className="text-gray-600 mb-6">
            This test hasn't been analyzed yet. Run a comprehensive analysis to see detailed insights, patterns, and recommendations.
          </p>
          <Button onClick={handleRunAnalysis} size="lg" className="px-8">
            <Brain className="w-5 h-5 mr-2" />
            Run Marketing-Grade Analysis
          </Button>
        </div>
      </div>
    )
  }
  
  const analysis = testData.analysis
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{testData.name}</h1>
          <p className="text-gray-600 mt-1">Marketing-Grade Analysis Results</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Purchase Intent</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.purchaseIntent.overall.mean}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Insights</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.insights.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Personas</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.personas.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Recommendations</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.recommendations.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
          <TabsTrigger value="responses">Data</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <ExecutiveSummaryCard summary={analysis.executiveSummary} />
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Strategic Insights</h2>
            <div className="flex gap-2">
              <Badge variant="outline">{analysis.insights.filter(i => i.priority === 'high').length} High Priority</Badge>
              <Badge variant="outline">{analysis.insights.filter(i => i.type === 'opportunity').length} Opportunities</Badge>
              <Badge variant="outline">{analysis.insights.filter(i => i.type === 'risk').length} Risks</Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            {analysis.insights.map((insight) => (
              <ExpandableInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </TabsContent>
        
        {/* Personas Tab */}
        <TabsContent value="personas" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Customer Personas</h2>
            <div className="flex gap-2">
              <Badge variant="outline">{analysis.personas.length} Personas</Badge>
              <Badge variant="outline">Total Market: {analysis.personas.reduce((sum, p) => sum + (p.sizeAndValue?.estimatedSize || 0), 0).toLocaleString()}</Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            {analysis.personas.map((persona) => (
              <PersonaCard key={persona.id} persona={persona} />
            ))}
          </div>
        </TabsContent>
        
        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <RecommendationsTimeline recommendations={analysis.recommendations} />
        </TabsContent>
        
        {/* Responses Tab */}
        <TabsContent value="responses" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Response Data</h2>
            <div className="flex gap-2">
              <Badge variant="outline">{analysis.surveyResponses?.length || 0} Responses</Badge>
              <Badge variant="outline">Synthetic Data</Badge>
            </div>
          </div>
          
          {analysis.surveyResponses && analysis.surveyResponses.length > 0 ? (
            <ResponsesDataTable responses={analysis.surveyResponses} testId={testId} />
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Response Data</h3>
              <p className="text-gray-500">Response data will be available after running the analysis.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-500">MaxDiff, Kano, TURF, and other advanced analyses coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
