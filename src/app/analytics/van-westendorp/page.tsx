'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Calculator, 
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Download,
  Share2,
  BarChart3
} from 'lucide-react'

import { 
  VanWestendorpAnalyzer, 
  generateVanWestendorpQuestions,
  validateVanWestendorpData 
} from '@/lib/analytics/van-westendorp'

export default function VanWestendorpPage() {
  const [responses, setResponses] = useState({
    too_expensive: [] as number[],
    expensive_but_consider: [] as number[],
    good_value: [] as number[],
    too_cheap: [] as number[]
  })

  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const analyzer = new VanWestendorpAnalyzer(responses)
    const result = analyzer.analyze()
    setAnalysis(result)
    
    setIsAnalyzing(false)
  }

  const addSampleData = () => {
    // Add sample data for demonstration
    const sampleData = {
      too_expensive: [150, 120, 180, 200, 160, 140, 170, 190, 130, 110],
      expensive_but_consider: [100, 80, 120, 140, 90, 110, 130, 95, 85, 105],
      good_value: [60, 50, 70, 80, 55, 65, 75, 45, 40, 58],
      too_cheap: [20, 15, 25, 30, 18, 22, 28, 12, 10, 16]
    }
    
    setResponses(sampleData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Van Westendorp Price Sensitivity Meter
            </h1>
          </div>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
            Industry standard for pricing research and price sensitivity analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Methodology Explanation */}
            <Card variant="default" className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Methodology Overview
              </h2>
              <div className="space-y-4">
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  The Van Westendorp Price Sensitivity Meter is the industry standard for pricing research. 
                  It uses four key questions to determine optimal pricing points and acceptable price ranges.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">The Four Questions</h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Too Expensive</li>
                      <li>• Expensive but Consider</li>
                      <li>• Good Value</li>
                      <li>• Too Cheap</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Key Outputs</h3>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Optimal Price Point</li>
                      <li>• Acceptable Price Range</li>
                      <li>• Price Sensitivity Index</li>
                      <li>• Confidence Intervals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Data Input */}
            <Card variant="default" className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                  Price Response Data
                </h2>
                <Button variant="secondary" onClick={addSampleData}>
                  <Info className="w-4 h-4 mr-2" />
                  Add Sample Data
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Too Expensive Prices
                  </label>
                  <Input
                    placeholder="Enter prices separated by commas"
                    value={responses.too_expensive.join(', ')}
                    onChange={(e) => {
                      const prices = e.target.value.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p))
                      setResponses(prev => ({ ...prev, too_expensive: prices }))
                    }}
                  />
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    {responses.too_expensive.length} responses
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Expensive but Consider Prices
                  </label>
                  <Input
                    placeholder="Enter prices separated by commas"
                    value={responses.expensive_but_consider.join(', ')}
                    onChange={(e) => {
                      const prices = e.target.value.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p))
                      setResponses(prev => ({ ...prev, expensive_but_consider: prices }))
                    }}
                  />
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    {responses.expensive_but_consider.length} responses
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Good Value Prices
                  </label>
                  <Input
                    placeholder="Enter prices separated by commas"
                    value={responses.good_value.join(', ')}
                    onChange={(e) => {
                      const prices = e.target.value.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p))
                      setResponses(prev => ({ ...prev, good_value: prices }))
                    }}
                  />
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    {responses.good_value.length} responses
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Too Cheap Prices
                  </label>
                  <Input
                    placeholder="Enter prices separated by commas"
                    value={responses.too_cheap.join(', ')}
                    onChange={(e) => {
                      const prices = e.target.value.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p))
                      setResponses(prev => ({ ...prev, too_cheap: prices }))
                    }}
                  />
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    {responses.too_cheap.length} responses
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || Object.values(responses).some(arr => arr.length === 0)}
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
                      <Calculator className="w-5 h-5 mr-2" />
                      Analyze Price Sensitivity
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
                    Price Sensitivity Analysis
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          ${analysis.optimal_price_point.toFixed(2)}
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">
                          Optimal Price Point
                        </div>
                      </div>

                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${analysis.acceptable_price_range.min.toFixed(2)} - ${analysis.acceptable_price_range.max.toFixed(2)}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          Acceptable Price Range
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Price Sensitivity Index:</span>
                        <Badge variant={analysis.price_sensitivity_index < 0.3 ? "primary" : "secondary"}>
                          {analysis.price_sensitivity_index.toFixed(2)}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Sample Size:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.sample_size}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Data Quality Score:</span>
                        <Badge variant={analysis.data_quality_score > 80 ? "primary" : "secondary"}>
                          {analysis.data_quality_score.toFixed(1)}/100
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Completion Rate:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.completion_rate.toFixed(1)}%
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
                    Pricing Recommendations
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
                  Create Survey
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
                Industry Standards
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Minimum 50 responses per question
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    95% confidence level standard
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Used by Fortune 500 companies
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
