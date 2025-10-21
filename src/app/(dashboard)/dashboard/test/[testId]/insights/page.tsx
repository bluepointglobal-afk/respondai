'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Users,
  Target,
  MessageSquare,
  Download,
  Filter,
  ChevronDown,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface Insight {
  id: string
  title: string
  category: 'opportunity' | 'risk' | 'messaging' | 'pricing' | 'segment'
  priority: 'critical' | 'high' | 'medium' | 'low'
  insight: string
  evidence: {
    metric: string
    value: string
    comparison?: string
    significance: string
  }[]
  impact: {
    revenueImpact: string
    marketShareImpact: string
    confidence: number
  }
  recommendations: {
    action: string
    difficulty: 'easy' | 'medium' | 'hard'
    timeline: string
    estimatedLift: string
  }[]
  relatedPatterns: string[]
  relatedPersonas: string[]
}

export default function InsightsPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)

  useEffect(() => {
    fetchInsights()
  }, [testId])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      console.log('Fetching insights for test:', testId)
      
      const response = await fetch(`/api/test/${testId}/insights`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch insights: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Insights received:', data)
      
      if (data.hasInsights && data.insights) {
        setInsights(data.insights)
      } else {
        // No insights yet, show empty state
        setInsights([])
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
      // Fallback to empty state
      setInsights([])
    } finally {
      setLoading(false)
    }
  }

  const filteredInsights = insights.filter(insight => {
    if (selectedCategory !== 'all' && insight.category !== selectedCategory) return false
    if (selectedPriority !== 'all' && insight.priority !== selectedPriority) return false
    return true
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'risk': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'messaging': return <MessageSquare className="h-5 w-5 text-blue-600" />
      case 'pricing': return <DollarSign className="h-5 w-5 text-purple-600" />
      case 'segment': return <Users className="h-5 w-5 text-orange-600" />
      default: return <Lightbulb className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-950/20'
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20'
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-950/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 dark:bg-green-950/20'
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
      case 'hard': return 'text-red-600 bg-red-50 dark:bg-red-950/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading insights...</p>
        </div>
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href={`/dashboard/test/${testId}/results`}>
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                AI Insights
              </h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                AI-generated insights will appear here after running the simulation
              </p>
            </div>
          </div>
          
          <Card className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Lightbulb className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Insights Generated Yet</h3>
              <p>AI insights will be created after running the simulation engine.</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/dashboard/test/${testId}/results`}>
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              AI Insights
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Strategic insights based on your survey analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Categories ({insights.length})
          </Button>
          {['opportunity', 'risk', 'messaging', 'pricing', 'segment'].map(category => {
            const count = insights.filter(i => i.category === category).length
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)}
                <span className="ml-2 capitalize">{category} ({count})</span>
              </Button>
            )
          })}
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedPriority === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedPriority('all')}
          >
            All Priorities
          </Button>
          {['critical', 'high', 'medium', 'low'].map(priority => {
            const count = insights.filter(i => i.priority === priority).length
            return (
              <Button
                key={priority}
                variant={selectedPriority === priority ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedPriority(priority)}
              >
                <span className="capitalize">{priority} ({count})</span>
              </Button>
            )
          })}
        </div>

        {/* Insights Grid */}
        <div className="space-y-6">
          {filteredInsights.map((insight) => (
            <Card key={insight.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getCategoryIcon(insight.category)}
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                          {insight.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.impact.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        {insight.insight}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {insight.impact.revenueImpact}
                    </div>
                    <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                      Revenue Impact
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Evidence */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Evidence
                    </h4>
                    <div className="space-y-2">
                      {insight.evidence.map((evidence, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-sm">{evidence.metric}</div>
                              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                {evidence.value}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {evidence.significance}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      {insight.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm">{rec.action}</div>
                            <div className="text-sm font-bold text-green-600">{rec.estimatedLift}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getDifficultyColor(rec.difficulty)}`}>
                              {rec.difficulty}
                            </Badge>
                            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              {rec.timeline}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}