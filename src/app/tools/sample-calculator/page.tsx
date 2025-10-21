'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react'

import { 
  SampleSizeCalculator,
  validateSampleSizeInputs,
  getRecommendedSampleSize,
  SAMPLE_SIZE_GUIDELINES
} from '@/lib/analytics/sample-size-calculator'

export default function SampleCalculatorPage() {
  const [inputs, setInputs] = useState({
    population_size: 10000,
    confidence_level: 0.95,
    margin_of_error: 0.05,
    expected_proportion: 0.5,
    response_rate: 0.20
  })

  const [calculation, setCalculation] = useState<any>(null)
  const [validation, setValidation] = useState<any>(null)

  const handleCalculate = () => {
    const validationResult = validateSampleSizeInputs(inputs)
    setValidation(validationResult)

    if (validationResult.isValid) {
      const calculator = new SampleSizeCalculator(inputs)
      const result = calculator.calculate()
      setCalculation(result)
    }
  }

  const researchTypes = [
    { type: 'exploratory', label: 'Exploratory Research', description: 'Initial exploration and hypothesis generation' },
    { type: 'quantitative', label: 'Quantitative Research', description: 'Standard quantitative research' },
    { type: 'segmentation', label: 'Segmentation Analysis', description: 'Market segmentation analysis' },
    { type: 'national', label: 'National Representative', description: 'Nationally representative studies' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Sample Size Calculator
            </h1>
          </div>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
            Calculate optimal sample size for statistical reliability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card variant="default" className="p-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">
                Sample Parameters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Population Size
                  </label>
                  <Input
                    type="number"
                    value={inputs.population_size}
                    onChange={(e) => setInputs(prev => ({ ...prev, population_size: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 10000"
                  />
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    Total addressable market size
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Confidence Level
                  </label>
                  <select
                    className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary"
                    value={inputs.confidence_level}
                    onChange={(e) => setInputs(prev => ({ ...prev, confidence_level: parseFloat(e.target.value) }))}
                  >
                    <option value={0.90}>90% (Exploratory)</option>
                    <option value={0.95}>95% (Standard)</option>
                    <option value={0.99}>99% (High Stakes)</option>
                  </select>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    Statistical confidence level
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Margin of Error
                  </label>
                  <select
                    className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary"
                    value={inputs.margin_of_error}
                    onChange={(e) => setInputs(prev => ({ ...prev, margin_of_error: parseFloat(e.target.value) }))}
                  >
                    <option value={0.03}>±3% (High Precision)</option>
                    <option value={0.05}>±5% (Standard)</option>
                    <option value={0.10}>±10% (Acceptable)</option>
                  </select>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    Acceptable margin of error
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Expected Response Rate
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1"
                    value={inputs.response_rate}
                    onChange={(e) => setInputs(prev => ({ ...prev, response_rate: parseFloat(e.target.value) || 0.2 }))}
                    placeholder="0.20"
                  />
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    Expected survey response rate
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleCalculate}
                  className="w-full"
                  size="lg"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Sample Size
                </Button>
              </div>

              {/* Validation Errors */}
              {validation && !validation.isValid && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-semibold text-red-800 dark:text-red-200">
                      Validation Errors
                    </h3>
                  </div>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {validation.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </Card>

            {/* Research Type Guidelines */}
            <Card variant="default" className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Industry Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researchTypes.map((type) => (
                  <div key={type.type} className="p-4 border border-light-border dark:border-dark-border rounded-lg">
                    <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
                      {type.label}
                    </h4>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                      {type.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {SAMPLE_SIZE_GUIDELINES[type.type as keyof typeof SAMPLE_SIZE_GUIDELINES]?.min}-{SAMPLE_SIZE_GUIDELINES[type.type as keyof typeof SAMPLE_SIZE_GUIDELINES]?.max} respondents
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-1">
            {calculation ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Main Results */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Sample Size Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {calculation.recommended_sample.toLocaleString()}
                      </div>
                      <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Recommended Sample Size
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Statistical Power:</span>
                        <Badge variant="primary">
                          {Math.round(calculation.statistical_power.power * 100)}%
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Reliability Level:</span>
                        <Badge variant="secondary">
                          {calculation.quality_metrics.reliability_level}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Estimated Cost:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          ${calculation.cost_estimate.total_cost.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Segments Possible:</span>
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {calculation.subgroup_analysis.segments_possible}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quality Metrics */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Quality Metrics
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Data Quality Score</span>
                        <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {calculation.quality_metrics.expected_data_quality_score}/100
                        </span>
                      </div>
                      <Progress value={calculation.quality_metrics.expected_data_quality_score} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Completion Rate</span>
                        <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {Math.round(calculation.quality_metrics.expected_completion_rate * 100)}%
                        </span>
                      </div>
                      <Progress value={calculation.quality_metrics.expected_completion_rate * 100} className="h-2" />
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Next Steps
                  </h3>
                  
                  <div className="space-y-3">
                    <Button variant="primary" className="w-full">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Create Survey
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Calculation
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card variant="default" className="p-6">
                <div className="text-center">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Enter your parameters and click calculate to see the optimal sample size for your research.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
