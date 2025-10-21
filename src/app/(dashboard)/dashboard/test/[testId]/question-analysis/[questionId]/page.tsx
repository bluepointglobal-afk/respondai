'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  TrendingUp, 
  Users,
  BarChart3,
  Download,
  Share2,
  Target,
  DollarSign,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface QuestionAnalysis {
  questionId: string
  questionText: string
  questionType: string
  totalResponses: number
  skipped: number
  mean?: number
  median?: number
  mode?: number
  stdDev?: number
  confidenceInterval?: { lower: number; upper: number }
  distribution?: any
  insights: string[]
  crossTabs: any[]
}

export default function QuestionAnalysisPage() {
  const params = useParams()
  const testId = params.testId as string
  const questionId = params.questionId as string
  const [data, setData] = useState<QuestionAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestionAnalysis()
  }, [testId, questionId])

  const fetchQuestionAnalysis = async () => {
    try {
      // Fetch real question analysis data
      const response = await fetch(`/api/test/${testId}/question-analysis/${questionId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch question analysis: ${response.status}`)
      }
      
      const questionData = await response.json()
      
      if (questionData.analysis) {
        setData(questionData.analysis)
      } else {
        // Show empty state if no analysis available
        setData(null)
      }
    } catch (error) {
      console.error('Error fetching question analysis:', error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const createMockData = (): QuestionAnalysis => {
    // Only create mock data as fallback for development
    return {
        questionId,
        questionText: getQuestionText(questionId),
        questionType: "scale",
        totalResponses: 487,
        skipped: 13,
        mean: 6.8,
        median: 7,
        mode: 8,
        stdDev: 2.1,
        confidenceInterval: { lower: 6.6, upper: 7.0 },
        distribution: {
          "10": 87, "9": 69, "8": 89, "7": 100, "6": 94, "5": 78, "4": 32, "3": 16, "2": 8, "1": 4
        },
        insights: [
          "Strong bimodal distribution with peaks at 5 and 8",
          "Age 45-54 segment shows 16% higher intent than baseline",
          "Clear income sensitivity with 0.61 correlation",
          "Urban preference suggests lifestyle fit",
          "Statistical significance confirmed with p<0.001"
        ],
        crossTabs: [
          {
            demographic: "Age Group",
            breakdown: [
              { segment: "45-54", value: 7.9, n: 127, significance: "p<0.001" },
              { segment: "35-44", value: 6.8, n: 156, significance: "p=0.234" },
              { segment: "55-64", value: 6.5, n: 98, significance: "p=0.156" },
              { segment: "25-34", value: 5.9, n: 106, significance: "p=0.089" }
            ]
          },
          {
            demographic: "Income",
            breakdown: [
              { segment: "$100K+", value: 8.2, n: 89, significance: "p<0.001" },
              { segment: "$75-100K", value: 7.1, n: 142, significance: "p=0.023" },
              { segment: "$50-75K", value: 6.4, n: 163, significance: "p=0.067" },
              { segment: "<$50K", value: 5.8, n: 93, significance: "p<0.001" }
            ]
          }
        ]
      }
      // Only use mock data in development mode
      if (process.env.NODE_ENV === 'development') {
        setData(createMockData())
      } else {
        setData(null)
      }
    } catch (error) {
      console.error('Error fetching question analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const getQuestionText = (questionId: string) => {
    const questions = {
      'purchase-intent': 'How likely are you to purchase this product? (Scale 1-10, where 10 = Very Likely)',
      'pricing': 'What price would you expect to pay for this product?',
      'benefits': 'Which benefits are most important to you?',
      'brand-fit': 'How well does this brand fit your values? (Scale 1-10)'
    }
    return questions[questionId as keyof typeof questions] || 'Question Analysis'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading detailed analysis...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Analysis</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Unable to load question analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/dashboard/test/${testId}/results`}>
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                Detailed Question Analysis
              </h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                {data.questionText}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="secondary" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Analysis
            </Button>
          </div>
        </div>

        {/* Response Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Response Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{data.totalResponses}</div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">Total Responses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{data.totalResponses - data.skipped}</div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">Valid Responses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{data.skipped}</div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">Skipped</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(((data.totalResponses - data.skipped) / data.totalResponses) * 100)}%
                </div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistical Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Statistical Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{data.mean?.toFixed(1)}</div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Mean</p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Average response</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.median}</div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Median</p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Middle value</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.mode}</div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Mode</p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Most frequent</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{data.stdDev?.toFixed(1)}</div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Std Dev</p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Variability</p>
              </div>
            </div>
            
            {data.confidenceInterval && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">95% Confidence Interval</h3>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-green-600">
                    {data.confidenceInterval.lower.toFixed(1)} - {data.confidenceInterval.upper.toFixed(1)}
                  </span>
                  <Badge variant="success">Statistically Significant</Badge>
                </div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
                  We are 95% confident the true population mean falls within this range
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Response Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.distribution || {}).map(([value, count]) => {
                const percentage = Math.round((count as number / data.totalResponses) * 100)
                return (
                  <div key={value} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{value}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Progress value={percentage} className="flex-1" />
                        <span className="text-sm font-medium w-16 text-right">{percentage}%</span>
                      </div>
                      <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        {count as number} responses
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cross-Tabulation Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cross-Tabulation by Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.crossTabs.map((crossTab, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-4">{crossTab.demographic}</h3>
                  <div className="space-y-3">
                    {crossTab.breakdown.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.segment}</span>
                          <Badge variant={item.significance.includes('<0.001') ? 'success' : 'outline'}>
                            n={item.n}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold">{item.value.toFixed(1)}</span>
                          <Badge variant={item.significance.includes('<0.001') ? 'success' : 'secondary'}>
                            {item.significance}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-light-text-primary dark:text-dark-text-primary">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}