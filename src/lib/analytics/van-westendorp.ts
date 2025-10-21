// Van Westendorp Price Sensitivity Meter
// Industry standard for pricing research - MUST implement properly

import { QuestionTemplate } from '../frameworks/research-frameworks'

export interface VanWestendorpData {
  too_expensive: number[]
  expensive_but_consider: number[]
  good_value: number[]
  too_cheap: number[]
}

export interface VanWestendorpAnalysis {
  // Cumulative frequency curves
  too_expensive_curve: DataPoint[]
  not_cheap_curve: DataPoint[]
  expensive_curve: DataPoint[]
  not_expensive_curve: DataPoint[]
  
  // Key price points (intersections)
  point_of_marginal_cheapness: number
  optimal_price_point: number
  point_of_marginal_expensiveness: number
  indifference_price_point: number
  
  // Acceptable price range
  acceptable_price_range: {
    min: number
    max: number
    optimal: number
  }
  
  // Price sensitivity metrics
  price_sensitivity_index: number
  price_elasticity_estimate: number
  
  // Statistical confidence
  confidence_intervals: {
    optimal_price: { lower: number; upper: number }
    acceptable_range: { min_lower: number; min_upper: number; max_lower: number; max_upper: number }
  }
  
  // Sample statistics
  sample_size: number
  completion_rate: number
  data_quality_score: number
}

export interface DataPoint {
  price: number
  percentage: number
  count: number
}

export interface VanWestendorpVisualization {
  chart_type: 'line_chart'
  title: string
  x_axis: { label: string; min: number; max: number }
  y_axis: { label: string; min: number; max: number }
  lines: {
    name: string
    data: DataPoint[]
    color: string
    style: 'solid' | 'dashed'
  }[]
  intersections: {
    point: { x: number; y: number }
    label: string
    description: string
  }[]
  annotations: string[]
}

export class VanWestendorpAnalyzer {
  private data: VanWestendorpData
  private analysis: VanWestendorpAnalysis | null = null

  constructor(data: VanWestendorpData) {
    this.data = data
  }

  analyze(): VanWestendorpAnalysis {
    if (this.analysis) return this.analysis

    // Calculate cumulative frequencies
    const tooExpensiveCurve = this.calculateCumulativeFrequency(this.data.too_expensive, 'ascending')
    const notCheapCurve = this.calculateCumulativeFrequency(this.data.too_cheap, 'descending')
    const expensiveCurve = this.calculateCumulativeFrequency(this.data.expensive_but_consider, 'ascending')
    const notExpensiveCurve = this.calculateCumulativeFrequency(this.data.expensive_but_consider, 'descending')

    // Find intersection points
    const intersections = this.findIntersections(tooExpensiveCurve, notCheapCurve, expensiveCurve, notExpensiveCurve)

    // Calculate price sensitivity metrics
    const priceSensitivityIndex = this.calculatePriceSensitivityIndex(intersections)
    const priceElasticityEstimate = this.calculatePriceElasticity(intersections)

    // Calculate confidence intervals
    const confidenceIntervals = this.calculateConfidenceIntervals(intersections)

    // Calculate data quality score
    const dataQualityScore = this.calculateDataQualityScore()

    this.analysis = {
      too_expensive_curve: tooExpensiveCurve,
      not_cheap_curve: notCheapCurve,
      expensive_curve: expensiveCurve,
      not_expensive_curve: notExpensiveCurve,
      point_of_marginal_cheapness: intersections.marginalCheapness,
      optimal_price_point: intersections.optimal,
      point_of_marginal_expensiveness: intersections.marginalExpensiveness,
      indifference_price_point: intersections.indifference,
      acceptable_price_range: {
        min: intersections.marginalCheapness,
        max: intersections.marginalExpensiveness,
        optimal: intersections.optimal
      },
      price_sensitivity_index: priceSensitivityIndex,
      price_elasticity_estimate: priceElasticityEstimate,
      confidence_intervals: confidenceIntervals,
      sample_size: this.getSampleSize(),
      completion_rate: this.calculateCompletionRate(),
      data_quality_score: dataQualityScore
    }

    return this.analysis
  }

  private calculateCumulativeFrequency(prices: number[], direction: 'ascending' | 'descending'): DataPoint[] {
    const sortedPrices = [...prices].sort((a, b) => a - b)
    const uniquePrices = [...new Set(sortedPrices)]
    const totalResponses = prices.length

    return uniquePrices.map(price => {
      let count: number
      if (direction === 'ascending') {
        count = prices.filter(p => p <= price).length
      } else {
        count = prices.filter(p => p >= price).length
      }
      
      return {
        price,
        percentage: (count / totalResponses) * 100,
        count
      }
    })
  }

  private findIntersections(
    tooExpensiveCurve: DataPoint[],
    notCheapCurve: DataPoint[],
    expensiveCurve: DataPoint[],
    notExpensiveCurve: DataPoint[]
  ) {
    // Find intersection between "too expensive" and "not cheap" curves (optimal price)
    const optimal = this.findCurveIntersection(tooExpensiveCurve, notCheapCurve)
    
    // Find intersection between "expensive but consider" and "not expensive" curves (marginal expensiveness)
    const marginalExpensiveness = this.findCurveIntersection(expensiveCurve, notExpensiveCurve)
    
    // Find intersection between "not cheap" and "expensive but consider" curves (marginal cheapness)
    const marginalCheapness = this.findCurveIntersection(notCheapCurve, expensiveCurve)
    
    // Find intersection between "not expensive" and "too expensive" curves (indifference)
    const indifference = this.findCurveIntersection(notExpensiveCurve, tooExpensiveCurve)

    return {
      optimal: optimal || 0,
      marginalExpensiveness: marginalExpensiveness || 0,
      marginalCheapness: marginalCheapness || 0,
      indifference: indifference || 0
    }
  }

  private findCurveIntersection(curve1: DataPoint[], curve2: DataPoint[]): number | null {
    // Find the price point where the two curves intersect
    for (let i = 0; i < curve1.length - 1; i++) {
      const point1a = curve1[i]
      const point1b = curve1[i + 1]
      
      for (let j = 0; j < curve2.length - 1; j++) {
        const point2a = curve2[j]
        const point2b = curve2[j + 1]
        
        // Check if lines intersect
        const intersection = this.lineIntersection(
          point1a.price, point1a.percentage,
          point1b.price, point1b.percentage,
          point2a.price, point2a.percentage,
          point2b.price, point2b.percentage
        )
        
        if (intersection) {
          return intersection.x
        }
      }
    }
    
    return null
  }

  private lineIntersection(
    x1: number, y1: number, x2: number, y2: number,
    x3: number, y3: number, x4: number, y4: number
  ): { x: number; y: number } | null {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    
    if (Math.abs(denom) < 1e-10) {
      return null // Lines are parallel
    }
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
    
    if (t < 0 || t > 1) {
      return null // Intersection is outside line segments
    }
    
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    }
  }

  private calculatePriceSensitivityIndex(intersections: any): number {
    const range = intersections.marginalExpensiveness - intersections.marginalCheapness
    const optimal = intersections.optimal
    
    if (optimal === 0) return 0
    
    return range / optimal
  }

  private calculatePriceElasticity(intersections: any): number {
    // Simplified elasticity calculation based on price range
    const range = intersections.marginalExpensiveness - intersections.marginalCheapness
    const optimal = intersections.optimal
    
    if (optimal === 0) return 0
    
    // Higher range relative to optimal price indicates higher elasticity
    return (range / optimal) * 100
  }

  private calculateConfidenceIntervals(intersections: any): any {
    const sampleSize = this.getSampleSize()
    const standardError = 1.96 * Math.sqrt((0.5 * 0.5) / sampleSize) // 95% confidence
    
    return {
      optimal_price: {
        lower: intersections.optimal * (1 - standardError),
        upper: intersections.optimal * (1 + standardError)
      },
      acceptable_range: {
        min_lower: intersections.marginalCheapness * (1 - standardError),
        min_upper: intersections.marginalCheapness * (1 + standardError),
        max_lower: intersections.marginalExpensiveness * (1 - standardError),
        max_upper: intersections.marginalExpensiveness * (1 + standardError)
      }
    }
  }

  private calculateDataQualityScore(): number {
    const totalResponses = this.getSampleSize()
    const validResponses = this.countValidResponses()
    
    // Base score on completion rate and response validity
    const completionScore = Math.min(100, (validResponses / totalResponses) * 100)
    
    // Penalize for outliers (responses that are too extreme)
    const outlierPenalty = this.calculateOutlierPenalty()
    
    return Math.max(0, completionScore - outlierPenalty)
  }

  private countValidResponses(): number {
    const allPrices = [
      ...this.data.too_expensive,
      ...this.data.expensive_but_consider,
      ...this.data.good_value,
      ...this.data.too_cheap
    ]
    
    return allPrices.filter(price => price > 0 && price < 10000).length
  }

  private calculateOutlierPenalty(): number {
    const allPrices = [
      ...this.data.too_expensive,
      ...this.data.expensive_but_consider,
      ...this.data.good_value,
      ...this.data.too_cheap
    ]
    
    const validPrices = allPrices.filter(price => price > 0 && price < 10000)
    const mean = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
    const stdDev = Math.sqrt(validPrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / validPrices.length)
    
    const outliers = validPrices.filter(price => Math.abs(price - mean) > 3 * stdDev)
    
    return (outliers.length / validPrices.length) * 50 // Up to 50 point penalty
  }

  private getSampleSize(): number {
    return Math.max(
      this.data.too_expensive.length,
      this.data.expensive_but_consider.length,
      this.data.good_value.length,
      this.data.too_cheap.length
    )
  }

  private calculateCompletionRate(): number {
    const totalPossible = this.getSampleSize() * 4 // 4 questions per respondent
    const actualResponses = this.countValidResponses()
    
    return (actualResponses / totalPossible) * 100
  }

  generateVisualization(): VanWestendorpVisualization {
    const analysis = this.analyze()
    
    return {
      chart_type: 'line_chart',
      title: 'Van Westendorp Price Sensitivity Analysis',
      x_axis: {
        label: 'Price ($)',
        min: Math.min(...analysis.too_expensive_curve.map(p => p.price)),
        max: Math.max(...analysis.too_expensive_curve.map(p => p.price))
      },
      y_axis: {
        label: 'Cumulative Percentage (%)',
        min: 0,
        max: 100
      },
      lines: [
        {
          name: 'Too Expensive',
          data: analysis.too_expensive_curve,
          color: '#ef4444',
          style: 'solid'
        },
        {
          name: 'Not Cheap',
          data: analysis.not_cheap_curve,
          color: '#22c55e',
          style: 'solid'
        },
        {
          name: 'Expensive but Consider',
          data: analysis.expensive_curve,
          color: '#f59e0b',
          style: 'dashed'
        },
        {
          name: 'Not Expensive',
          data: analysis.not_expensive_curve,
          color: '#3b82f6',
          style: 'dashed'
        }
      ],
      intersections: [
        {
          point: { x: analysis.optimal_price_point, y: 50 },
          label: 'Optimal Price',
          description: `$${analysis.optimal_price_point.toFixed(2)} - Maximum market acceptance`
        },
        {
          point: { x: analysis.point_of_marginal_cheapness, y: 50 },
          label: 'Marginal Cheapness',
          description: `$${analysis.point_of_marginal_cheapness.toFixed(2)} - Below this price, quality concerns arise`
        },
        {
          point: { x: analysis.point_of_marginal_expensiveness, y: 50 },
          label: 'Marginal Expensiveness',
          description: `$${analysis.point_of_marginal_expensiveness.toFixed(2)} - Above this price, too expensive`
        }
      ],
      annotations: [
        `Acceptable Price Range: $${analysis.acceptable_price_range.min.toFixed(2)} - $${analysis.acceptable_price_range.max.toFixed(2)}`,
        `Price Sensitivity Index: ${analysis.price_sensitivity_index.toFixed(2)}`,
        `Sample Size: ${analysis.sample_size} respondents`,
        `Data Quality Score: ${analysis.data_quality_score.toFixed(1)}/100`
      ]
    }
  }

  generateInsights(): string[] {
    const analysis = this.analyze()
    const insights: string[] = []

    // Price positioning insights
    if (analysis.price_sensitivity_index < 0.3) {
      insights.push('Low price sensitivity - customers are less price-conscious, allowing for premium positioning')
    } else if (analysis.price_sensitivity_index > 0.7) {
      insights.push('High price sensitivity - customers are very price-conscious, consider competitive pricing')
    } else {
      insights.push('Moderate price sensitivity - balanced approach to pricing recommended')
    }

    // Price range insights
    const rangeWidth = analysis.acceptable_price_range.max - analysis.acceptable_price_range.min
    const rangePercentage = (rangeWidth / analysis.optimal_price_point) * 100

    if (rangePercentage > 50) {
      insights.push('Wide acceptable price range - flexibility in pricing strategy')
    } else {
      insights.push('Narrow acceptable price range - pricing precision is critical')
    }

    // Optimal price insights
    if (analysis.optimal_price_point > analysis.acceptable_price_range.max * 0.8) {
      insights.push('Optimal price near upper range - premium positioning opportunity')
    } else if (analysis.optimal_price_point < analysis.acceptable_price_range.min * 1.2) {
      insights.push('Optimal price near lower range - value positioning recommended')
    }

    // Data quality insights
    if (analysis.data_quality_score > 80) {
      insights.push('High data quality - results are reliable for decision making')
    } else if (analysis.data_quality_score < 60) {
      insights.push('Low data quality - consider increasing sample size or improving data collection')
    }

    return insights
  }

  generateRecommendations(): string[] {
    const analysis = this.analyze()
    const recommendations: string[] = []

    // Pricing recommendations
    recommendations.push(`Set initial price at $${analysis.optimal_price_point.toFixed(2)} for maximum market acceptance`)
    
    recommendations.push(`Test prices between $${analysis.acceptable_price_range.min.toFixed(2)} and $${analysis.acceptable_price_range.max.toFixed(2)} in A/B tests`)

    // Strategy recommendations
    if (analysis.price_sensitivity_index < 0.3) {
      recommendations.push('Consider premium pricing strategy - customers are less price-sensitive')
      recommendations.push('Focus on value communication rather than price competition')
    } else {
      recommendations.push('Emphasize competitive pricing in marketing messages')
      recommendations.push('Consider bundle pricing to increase perceived value')
    }

    // Testing recommendations
    recommendations.push('Conduct follow-up pricing tests with actual purchase behavior')
    recommendations.push('Monitor price sensitivity changes over time as market matures')

    return recommendations
  }
}

// Utility functions for Van Westendorp analysis
export function validateVanWestendorpData(data: VanWestendorpData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check minimum sample size
  const minSampleSize = 50
  const sampleSize = Math.max(
    data.too_expensive.length,
    data.expensive_but_consider.length,
    data.good_value.length,
    data.too_cheap.length
  )

  if (sampleSize < minSampleSize) {
    errors.push(`Sample size too small: ${sampleSize}. Minimum recommended: ${minSampleSize}`)
  }

  // Check for reasonable price ranges
  const allPrices = [
    ...data.too_expensive,
    ...data.expensive_but_consider,
    ...data.good_value,
    ...data.too_cheap
  ]

  const validPrices = allPrices.filter(price => price > 0 && price < 10000)
  const invalidPercentage = ((allPrices.length - validPrices.length) / allPrices.length) * 100

  if (invalidPercentage > 10) {
    errors.push(`Too many invalid price responses: ${invalidPercentage.toFixed(1)}%`)
  }

  // Check for logical consistency
  const avgTooExpensive = data.too_expensive.reduce((sum, price) => sum + price, 0) / data.too_expensive.length
  const avgTooCheap = data.too_cheap.reduce((sum, price) => sum + price, 0) / data.too_cheap.length

  if (avgTooCheap >= avgTooExpensive) {
    errors.push('Logical inconsistency: average "too cheap" price >= average "too expensive" price')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function generateVanWestendorpQuestions(): QuestionTemplate[] {
  return [
    {
      id: 'van_westendorp_1',
      type: 'text-short' as any,
      text: 'At what price would you consider this product TOO EXPENSIVE to buy?',
      required: true,
      validation_rules: [
        {
          type: 'pattern',
          value: '^\\$?\\d+(\\.\\d{2})?$',
          message: 'Please enter a valid price (e.g., $25.99 or 25.99)'
        }
      ]
    },
    {
      id: 'van_westendorp_2',
      type: 'text-short' as any,
      text: 'At what price would you consider this product EXPENSIVE, but still consider buying?',
      required: true,
      validation_rules: [
        {
          type: 'pattern',
          value: '^\\$?\\d+(\\.\\d{2})?$',
          message: 'Please enter a valid price (e.g., $25.99 or 25.99)'
        }
      ]
    },
    {
      id: 'van_westendorp_3',
      type: 'text-short' as any,
      text: 'At what price would you consider this product a GOOD VALUE?',
      required: true,
      validation_rules: [
        {
          type: 'pattern',
          value: '^\\$?\\d+(\\.\\d{2})?$',
          message: 'Please enter a valid price (e.g., $25.99 or 25.99)'
        }
      ]
    },
    {
      id: 'van_westendorp_4',
      type: 'text-short' as any,
      text: 'At what price would you consider this product TOO CHEAP (quality concerns)?',
      required: true,
      validation_rules: [
        {
          type: 'pattern',
          value: '^\\$?\\d+(\\.\\d{2})?$',
          message: 'Please enter a valid price (e.g., $25.99 or 25.99)'
        }
      ]
    }
  ]
}
