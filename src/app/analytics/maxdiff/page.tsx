'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Target, 
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Download,
  Share2,
  TrendingUp,
  Users
} from 'lucide-react'

import { 
  MaxDiffAnalyzer, 
  generateMaxDiffQuestions,
  validateMaxDiffData 
} from '@/lib/analytics/maxdiff-analysis'

export default function MaxDiffPage() {
  const [features, setFeatures] = useState<string[]>([])
  const [responses, setResponses] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const analyzer = new MaxDiffAnalyzer(features, responses)
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
      'Advanced Analytics',
      'Custom Branding',
      'API Integration',
      'Data Security'
    ]
    
    setFeatures(sampleFeatures)
    
    // Generate sample responses
    const sampleResponses = []
    for (let i = 0; i < 100; i++) {
      const shuffledFeatures = [...sampleFeatures].sort(() => Math.random() - 0.5)
      sampleResponses.push({
        question_id: `maxdiff_${Math.floor(i / 5) + 1}`,
        most_important: shuffledFeatures[0],
        least_important: shuffledFeatures[shuffledFeatures.length - 1],
        respondent_id: `respondent_${i}`,
        response_time_ms: 15000 + Math.random() * 10000
      })
    }
    
    setResponses(sampleResponses)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              MaxDiff Analysis
            </h1>
          </div>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
              Maximum Difference Scaling for feature prioritization and preference measurement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Methodology Explanation */}
            <Card variant="default" className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                MaxDiff Methodology
              </h2>
              <div className="space-y-4">
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  Maximum Difference Scaling (MaxDiff) is a survey technique that asks respondents to choose 
                  the most and least important items from a set, providing robust utility scores for feature prioritization.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How It Works</h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Show 4-5 features at a time</li>
                      <li>• Ask "Most Important" and "Least Important"</li>
                      <li>• Rotate through multiple sets</li>
                      <li>• Calculate utility scores</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Key Benefits</h3>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Statistical significance testing</li>
                      <li>• Robust preference measurement</li>
                      <li>• Clear feature prioritization</li>
                      <li>• Industry standard methodology</li>
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
                  {features.length} features • Minimum 4 features recommended
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
                  disabled={isAnalyzing || features.length < 4}
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
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Analyze Feature Importance
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
                    Feature Importance Analysis
                  </h2>
                  
                  <div className="space-y-4">
                    {analysis.feature_scores.map((feature: any, index: number) => (
                      <div key={feature.feature} className="p-4 border border-light-border dark:border-dark-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                {feature.rank}
                              </span>
                            </div>
                            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                              {feature.feature}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                              {feature.utility_score.toFixed(1)}
                            </div>
                            <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Utility Score
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">
                            Share of Preference: {feature.share_of_preference.toFixed(1)}%
                          </span>
                          <Badge variant={feature.significance_level > 0.7 ? "primary" : "secondary"}>
                            {feature.significance_level > 0.7 ? "High Significance" : "Moderate Significance"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Statistical Summary */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Statistical Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Sample Size:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.sample_size}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Features Analyzed:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.total_features}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Questions per Respondent:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.questions_per_respondent}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Completion Rate:</span>
                        <Badge variant={analysis.completion_rate > 80 ? "primary" : "secondary"}>
                          {analysis.completion_rate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Data Quality Score:</span>
                        <Badge variant={analysis.data_quality_score > 80 ? "primary" : "secondary"}>
                          {analysis.data_quality_score.toFixed(1)}/100
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Significant Differences:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.significant_differences.filter((d: any) => d.is_significant).length}
                        </span>
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
                  Create MaxDiff Survey
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
                Best Practices
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Minimum 4-5 features per question
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    3-5 rotations per respondent
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Minimum 50 respondents
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Randomize feature order
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
