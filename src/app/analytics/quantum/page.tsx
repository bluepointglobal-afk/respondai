'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Target, 
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Download,
  Share2,
  BarChart3,
  Users,
  Brain,
  Atom
} from 'lucide-react'

import { 
  QuantumPatternDetector,
  convertQuantumPatternsToStandard,
  QuantumPattern
} from '@/lib/analytics/quantum/quantum-pattern-detector'

export default function QuantumPatternsPage() {
  const [responses, setResponses] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const detector = new QuantumPatternDetector()
    const result = await detector.detectPatterns(responses)
    setAnalysis(result)
    
    setIsAnalyzing(false)
  }

  const addSampleData = () => {
    // Generate sample response data
    const sampleResponses = []
    for (let i = 0; i < 200; i++) {
      sampleResponses.push({
        respondent_id: `respondent_${i}`,
        demographics: {
          age: 25 + Math.floor(Math.random() * 40),
          income: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          education: ['high_school', 'college', 'graduate'][Math.floor(Math.random() * 3)],
          location: ['urban', 'suburban', 'rural'][Math.floor(Math.random() * 3)]
        },
        responses: {
          purchase_intent: Math.random() * 10,
          price_sensitivity: Math.random() * 10,
          brand_loyalty: Math.random() * 10,
          feature_importance: {
            'performance': Math.random() * 10,
            'price': Math.random() * 10,
            'brand': Math.random() * 10,
            'convenience': Math.random() * 10
          }
        },
        behavioral_data: {
          time_spent: 120 + Math.random() * 300,
          pages_viewed: 3 + Math.floor(Math.random() * 10),
          interactions: Math.floor(Math.random() * 20)
        }
      })
    }
    
    setResponses(sampleResponses)
  }

  const getPatternTypeColor = (type: string) => {
    switch (type) {
      case 'quantum_superposition': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
      case 'quantum_entanglement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
      case 'quantum_tunneling': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Quantum Pattern Detection
            </h1>
          </div>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
            Multi-dimensional pattern analysis using quantum computing concepts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Methodology Explanation */}
            <Card variant="default" className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Quantum Pattern Detection Methodology
              </h2>
              <div className="space-y-4">
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  Our quantum-inspired pattern detection algorithm analyzes complex multi-dimensional relationships 
                  in survey data that traditional statistical methods might miss.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Quantum Concepts</h3>
                    <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <li>• Quantum Superposition</li>
                      <li>• Quantum Entanglement</li>
                      <li>• Quantum Tunneling</li>
                      <li>• Multi-dimensional Analysis</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Pattern Types</h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Demographic Clusters</li>
                      <li>• Psychographic Segments</li>
                      <li>• Behavioral Patterns</li>
                      <li>• Cross-dimensional Correlations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Data Input */}
            <Card variant="default" className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                  Response Data
                </h2>
                <Button variant="secondary" onClick={addSampleData}>
                  <Info className="w-4 h-4 mr-2" />
                  Add Sample Data
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Current Dataset
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {responses.length} responses loaded
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          Includes demographics, behavioral data, and survey responses
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {responses.length > 0 ? 'Ready' : 'Empty'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                      {responses.length}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      Respondents
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-green-800 dark:text-green-200">
                      {responses.length > 0 ? 'Multi-dimensional' : '0'}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      Data Points
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                      {responses.length > 50 ? 'High' : responses.length > 20 ? 'Medium' : 'Low'}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">
                      Confidence
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || responses.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Detecting Patterns...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Detect Quantum Patterns
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
                    Detected Quantum Patterns
                  </h2>
                  
                  <div className="space-y-4">
                    {analysis.patterns.map((pattern: QuantumPattern, index: number) => (
                      <div key={pattern.id} className="p-4 border border-light-border dark:border-dark-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                              <Atom className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                              {pattern.title}
                            </h3>
                          </div>
                          <Badge className={getPatternTypeColor(pattern.type)}>
                            {pattern.type.replace('quantum_', '').replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">
                          {pattern.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                              Segments ({pattern.segments.length})
                            </h4>
                            <div className="space-y-1">
                              {pattern.segments.slice(0, 3).map((segment, idx) => (
                                <div key={idx} className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                  • {segment.name}: {segment.size}% ({segment.description})
                                </div>
                              ))}
                              {pattern.segments.length > 3 && (
                                <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                  • ... and {pattern.segments.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                              Revenue Impact
                            </h4>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {pattern.revenueImpact > 0 ? '+' : ''}{pattern.revenueImpact.toFixed(1)}%
                            </div>
                            <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Expected revenue change
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Analysis Summary */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Analysis Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Patterns Detected:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.patterns.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Total Segments:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.patterns.reduce((sum: number, p: QuantumPattern) => sum + p.segments.length, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Analysis Confidence:</span>
                        <Badge variant={analysis.confidence > 0.8 ? "primary" : "secondary"}>
                          {Math.round(analysis.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Processing Time:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.processing_time_ms}ms
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Data Quality:</span>
                        <Badge variant={analysis.data_quality_score > 80 ? "primary" : "secondary"}>
                          {analysis.data_quality_score.toFixed(1)}/100
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">Quantum Complexity:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {analysis.quantum_complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Insights */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Quantum Insights
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
                    Strategic Recommendations
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
                  Create Advanced Survey
                </Button>
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Patterns
                </Button>
                <Button variant="secondary" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Analysis
                </Button>
              </div>
            </Card>

            <Card variant="default" className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Quantum Concepts
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Superposition: Multiple states simultaneously
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Entanglement: Correlated behaviors
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Tunneling: Unexpected connections
                  </span>
                </div>
              </div>
            </Card>

            <Card variant="default" className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Requirements
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Minimum 50 responses
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Multi-dimensional data
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Behavioral metrics
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
