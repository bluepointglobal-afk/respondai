'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Rocket,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  MessageSquare,
  Target,
  Globe
} from 'lucide-react'
import Link from 'next/link'

interface Recommendation {
  id: string
  category: 'brand' | 'product' | 'pricing' | 'strategy' | 'geographic'
  type: 'do' | 'dont'
  action: string
  reasoning: string
  impact: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeline: 'immediate' | 'near-term' | 'mid-term' | 'long-term'
  estimatedLift: string
  priority: number
}

export default function RecommendationsPage() {
  const params = useParams()
  const testId = params.testId as string
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [hasRecommendations, setHasRecommendations] = useState(false)

  useEffect(() => {
    fetchRecommendations()
  }, [testId])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      console.log('Fetching recommendations for test:', testId)
      
      const response = await fetch(`/api/test/${testId}/recommendations`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Recommendations received:', data)
      
      if (data.hasRecommendations && data.recommendations) {
        setRecommendations(data.recommendations)
        setHasRecommendations(true)
      } else {
        setRecommendations([])
        setHasRecommendations(false)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations([])
      setHasRecommendations(false)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory)

  const timeline = {
    immediate: recommendations.filter(r => r.timeline === 'immediate' && r.type === 'do'),
    nearTerm: recommendations.filter(r => r.timeline === 'near-term' && r.type === 'do'),
    midTerm: recommendations.filter(r => r.timeline === 'mid-term' && r.type === 'do'),
    longTerm: recommendations.filter(r => r.timeline === 'long-term' && r.type === 'do')
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'brand': return <MessageSquare className="h-5 w-5" />
      case 'product': return <Package className="h-5 w-5" />
      case 'pricing': return <DollarSign className="h-5 w-5" />
      case 'strategy': return <Target className="h-5 w-5" />
      case 'geographic': return <Globe className="h-5 w-5" />
      default: return <Target className="h-5 w-5" />
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

  const getTimelineColor = (timeline: string) => {
    switch (timeline) {
      case 'immediate': return 'text-red-600 bg-red-50 dark:bg-red-950/20'
      case 'near-term': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20'
      case 'mid-term': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
      case 'long-term': return 'text-purple-600 bg-purple-50 dark:bg-purple-950/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading recommendations...</p>
        </div>
      </div>
    )
  }

  if (!hasRecommendations) {
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
                AI Recommendations
              </h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                Strategic recommendations will appear here after running the simulation
              </p>
            </div>
          </div>
          
          <Card className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Rocket className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Recommendations Generated Yet</h3>
              <p>AI recommendations will be created after running the simulation engine.</p>
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
              AI Recommendations
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Strategic recommendations based on your survey analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All ({recommendations.length})
          </Button>
          {['brand', 'product', 'pricing', 'strategy', 'geographic'].map(category => {
            const count = recommendations.filter(r => r.category === category).length
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

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecommendations.map((rec) => (
            <Card key={rec.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {rec.type === 'do' ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{rec.action}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(rec.category)}
                          <span className="ml-1 capitalize">{rec.category}</span>
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(rec.difficulty)}`}>
                          {rec.difficulty}
                        </Badge>
                        <Badge className={`text-xs ${getTimelineColor(rec.timeline)}`}>
                          {rec.timeline}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{rec.estimatedLift}</div>
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Lift</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Reasoning</h4>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {rec.reasoning}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Expected Impact</h4>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {rec.impact}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Implementation Timeline</CardTitle>
            <CardDescription>
              Recommended actions organized by implementation timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-2">{timeline.immediate.length}</div>
                <div className="text-sm font-medium">Immediate</div>
                <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">0-1 weeks</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-2">{timeline.nearTerm.length}</div>
                <div className="text-sm font-medium">Near-term</div>
                <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">1-4 weeks</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">{timeline.midTerm.length}</div>
                <div className="text-sm font-medium">Mid-term</div>
                <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">1-3 months</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">{timeline.longTerm.length}</div>
                <div className="text-sm font-medium">Long-term</div>
                <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">3+ months</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}