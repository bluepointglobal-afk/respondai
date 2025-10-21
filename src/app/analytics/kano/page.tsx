'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Download,
  Share2,
  BarChart3,
  Users,
  Star
} from 'lucide-react'

import { 
  KanoAnalyzer, 
  generateKanoQuestions,
  validateKanoData 
} from '@/lib/analytics/kano-model'

export default function KanoPage() {
  const [features, setFeatures] = useState<string[]>([])
  const [responses, setResponses] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const analyzer = new KanoAnalyzer(responses)
    const result = analyzer.analyze()
    setAnalysis(result)
    
    setIsAnalyzing(false)
  }

  const addSampleData = () => {
    const sampleFeatures = [
      'Fast Performance',
      'Easy to Use',
      '24/7 Support',
      'Mobile App',
      'Advanced Analytics'
    ]
    
    setFeatures(sampleFeatures)
    
    // Generate sample responses
    const sampleResponses = []
    const responseOptions = ['like_it', 'expect_it', 'neutral', 'tolerate_it', 'dislike_it']
    
    for (let i = 0; i < 50; i++) {
      sampleFeatures.forEach(feature => {
        // Functional response
        sampleResponses.push({
          feature,
          functional_response: responseOptions[Math.floor(Math.random() * responseOptions.length)],
          dysfunctional_response: responseOptions[Math.floor(Math.random() * responseOptions.length)],
          respondent_id: `respondent_${i}`
        })
      })
    }
    
    setResponses(sampleResponses)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Must-Be': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
      case 'Performance': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
      case 'Attractive': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
      case 'Indifferent': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
      case 'Reverse': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Kano Model Analysis
            </h1>
          </div>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
            Feature classification into Must-Be, Performance, Attractive, Indifferent, and Reverse categories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Methodology Explanation */}
            <Card variant="default" className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Kano Model Methodology
              </h2>
              <div className="space-y-4">
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  The Kano Model classifies features based on how they affect customer satisfaction. 
                  It uses paired questions to understand both positive and negative feature impact.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Question Pairs</h3>
                    <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <li>• "How would you feel if this feature WAS included?"</li>
                      <li>• "How would you feel if this feature WAS NOT included?"</li>
                      <li>• 5-point response scale</li>
                      <li>• Categorization matrix</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Feature Categories</h3>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Must-Be: Dissatisfiers if absent</li>
                      <li>• Performance: More is better</li>
                      <li>• Attractive: Delighters</li>
                      <li>• Indifferent: No impact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Feature Input */}
            <Card variant="default" className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                  Features to Analyze
                </h2>
                <Button variant="secondary" onClick={addSampleData}>
                  <Info className="w-4 h-4 mr-2" />
                  Add Sample Data
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Feature List
                </label>
                <Input
                  placeholder="Enter features separated by commas"
                  value={features.join(', ')}
                  onChange={(e) => {
                    const featureList = e.target.value.split(',').map(f => f.trim()).filter(f => f.length > 0)
                    setFeatures(featureList)
                  }}
                />
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                  {features.length} features • Each feature requires 2 questions (functional + dysfunctional)
                </p>
              </div>

              {features.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Current Features:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || features.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 mr-2" />
                      Analyze Feature Categories
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card variant="default" className="p-6">
                  <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Feature Classification Results
                  </h2>
                  
                  <div className="space-y-4">
                    {analysis.feature_classifications.map((feature: any, index: number) => (
                      <div key={feature.feature} className="p-4 border border-light-border dark:border-dark-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                              {feature.feature}
                            </h3>
                          </div>
                          <Badge className={getCategoryColor(feature.category)}>
                            {feature.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                          {feature.explanation}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                            Strategic Implication: {feature.strategic_implication}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                              Confidence: {feature.confidence_level.toFixed(1)}%
                            </span>
                            <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                              Sample: {feature.sample_size}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Strategic Insights */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Strategic Insights by Category
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">Must-Be Features</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Essential for market entry - must be included
                        </p>
                        <div className="mt-2">
                          {analysis.strategic_insights.must_be_features.map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Performance Features</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Competitive differentiator - invest in excellence
                        </p>
                        <div className="mt-2">
                          {analysis.strategic_insights.performance_features.map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">Attractive Features</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Innovation opportunity - can surprise and delight
                        </p>
                        <div className="mt-2">
                          {analysis.strategic_insights.attractive_features.map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Indifferent Features</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Low priority - avoid unless cost is minimal
                        </p>
                        <div className="mt-2">
                          {analysis.strategic_insights.indifferent_features.map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Sample Statistics */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Analysis Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Total Responses:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.sample_statistics.total_responses}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Unique Respondents:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.sample_statistics.unique_respondents}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Features Analyzed:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.sample_statistics.features_analyzed}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Data Quality Score:</span>
                        <Badge variant={analysis.sample_statistics.data_quality_score > 80 ? "primary" : "secondary"}>
                          {analysis.sample_statistics.data_quality_score.toFixed(1)}/100
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Insights */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Strategic Insights
                  </h3>
                  <div className="space-y-3">
                    {analysis.generateInsights().map((insight: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recommendations */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Development Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysis.generateRecommendations().map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Create Kano Survey
                </Button>
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Analysis
                </Button>
                <Button variant="secondary" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
              </div>
            </Card>

            <Card variant="default" className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Kano Categories
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Must-Be: Dissatisfiers if absent
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Performance: More is better
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Attractive: Delighters
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Indifferent: No impact
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Reverse: Decreases satisfaction
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
