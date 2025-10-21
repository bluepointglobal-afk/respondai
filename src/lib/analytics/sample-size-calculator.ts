// Sample Size Calculator with Statistical Rigor
// Industry-standard calculations for market research

export interface SampleSizeInputs {
  population_size: number       // Total addressable market
  confidence_level: number      // 90%, 95%, 99%
  margin_of_error: number       // ±3%, ±5%, ±10%
  expected_proportion: number   // 50% if unknown (worst case)
  response_rate?: number        // Expected response rate
  design_effect?: number        // For complex sampling
}

export interface SampleSizeCalculation {
  inputs: SampleSizeInputs
  
  // Basic calculations
  z_score: number              // Based on confidence level
  sample_size_infinite: number // For large populations
  sample_size_adjusted: number // Adjusted for finite population
  recommended_sample: number   // Add buffer for incompletes
  
  // For segment analysis
  subgroup_analysis: {
    min_per_segment: number      // Minimum 100 per segment
    total_needed: number
    segments_possible: number
  }
  
  // Statistical power
  statistical_power: {
    power: number                // Typically 80%
    effect_size: number         // Cohen's d
    alpha: number              // Typically 0.05
    beta: number               // 1 - power
  }
  
  // Cost implications
  cost_estimate: {
    cost_per_response: number
    total_cost: number
    cost_per_segment: number
  }
  
  // Quality metrics
  quality_metrics: {
    expected_completion_rate: number
    expected_data_quality_score: number
    reliability_level: string
  }
}

export interface SegmentationAnalysis {
  segments: Segment[]
  total_sample_needed: number
  feasibility_score: number
  recommendations: string[]
}

export interface Segment {
  name: string
  size_percentage: number
  min_sample_size: number
  recommended_sample_size: number
  confidence_level: number
  margin_of_error: number
}

export class SampleSizeCalculator {
  private inputs: SampleSizeInputs

  constructor(inputs: SampleSizeInputs) {
    this.inputs = inputs
  }

  calculate(): SampleSizeCalculation {
    // Calculate Z-score based on confidence level
    const zScore = this.calculateZScore(this.inputs.confidence_level)
    
    // Calculate sample size for infinite population
    const sampleSizeInfinite = this.calculateInfiniteSampleSize(zScore, this.inputs.margin_of_error, this.inputs.expected_proportion)
    
    // Adjust for finite population
    const sampleSizeAdjusted = this.adjustForFinitePopulation(sampleSizeInfinite, this.inputs.population_size)
    
    // Add buffer for incomplete responses
    const recommendedSample = this.addBuffer(sampleSizeAdjusted, this.inputs.response_rate)
    
    // Calculate subgroup analysis
    const subgroupAnalysis = this.calculateSubgroupAnalysis(recommendedSample)
    
    // Calculate statistical power
    const statisticalPower = this.calculateStatisticalPower(recommendedSample)
    
    // Calculate cost implications
    const costEstimate = this.calculateCostEstimate(recommendedSample)
    
    // Calculate quality metrics
    const qualityMetrics = this.calculateQualityMetrics(recommendedSample)

    return {
      inputs: this.inputs,
      z_score: zScore,
      sample_size_infinite: sampleSizeInfinite,
      sample_size_adjusted: sampleSizeAdjusted,
      recommended_sample: recommendedSample,
      subgroup_analysis: subgroupAnalysis,
      statistical_power: statisticalPower,
      cost_estimate: costEstimate,
      quality_metrics: qualityMetrics
    }
  }

  private calculateZScore(confidenceLevel: number): number {
    const zScores: Record<number, number> = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    }
    
    return zScores[confidenceLevel] || 1.96
  }

  private calculateInfiniteSampleSize(zScore: number, marginOfError: number, proportion: number): number {
    const marginDecimal = marginOfError / 100
    const numerator = Math.pow(zScore, 2) * proportion * (1 - proportion)
    const denominator = Math.pow(marginDecimal, 2)
    
    return Math.ceil(numerator / denominator)
  }

  private adjustForFinitePopulation(sampleSize: number, populationSize: number): number {
    if (populationSize <= 0) return sampleSize
    
    const adjustmentFactor = populationSize / (populationSize + sampleSize - 1)
    return Math.ceil(sampleSize * adjustmentFactor)
  }

  private addBuffer(sampleSize: number, responseRate?: number): number {
    const defaultResponseRate = 0.20 // 20% default
    const actualResponseRate = responseRate || defaultResponseRate
    
    // Add 20% buffer for incomplete responses
    const buffer = 1.2
    const adjustedForResponseRate = sampleSize / actualResponseRate
    
    return Math.ceil(adjustedForResponseRate * buffer)
  }

  private calculateSubgroupAnalysis(totalSample: number): any {
    const minPerSegment = 100
    const segmentsPossible = Math.floor(totalSample / minPerSegment)
    
    return {
      min_per_segment: minPerSegment,
      total_needed: segmentsPossible * minPerSegment,
      segments_possible: segmentsPossible
    }
  }

  private calculateStatisticalPower(sampleSize: number): any {
    const alpha = 0.05
    const power = 0.80
    const beta = 1 - power
    
    // Simplified effect size calculation
    const effectSize = Math.sqrt(2 / sampleSize) // Cohen's d approximation
    
    return {
      power: power,
      effect_size: effectSize,
      alpha: alpha,
      beta: beta
    }
  }

  private calculateCostEstimate(sampleSize: number): any {
    const costPerResponse = 5.00 // $5 per response average
    const totalCost = sampleSize * costPerResponse
    const costPerSegment = totalCost / Math.max(1, Math.floor(sampleSize / 100))
    
    return {
      cost_per_response: costPerResponse,
      total_cost: totalCost,
      cost_per_segment: costPerSegment
    }
  }

  private calculateQualityMetrics(sampleSize: number): any {
    let expectedCompletionRate = 0.85
    let expectedDataQualityScore = 80
    let reliabilityLevel = 'Good'
    
    if (sampleSize >= 1000) {
      expectedCompletionRate = 0.90
      expectedDataQualityScore = 90
      reliabilityLevel = 'Excellent'
    } else if (sampleSize >= 400) {
      expectedCompletionRate = 0.88
      expectedDataQualityScore = 85
      reliabilityLevel = 'Very Good'
    } else if (sampleSize < 200) {
      expectedCompletionRate = 0.80
      expectedDataQualityScore = 75
      reliabilityLevel = 'Fair'
    }
    
    return {
      expected_completion_rate: expectedCompletionRate,
      expected_data_quality_score: expectedDataQualityScore,
      reliability_level: reliabilityLevel
    }
  }

  generateInsights(): string[] {
    const calculation = this.calculate()
    const insights: string[] = []

    // Sample size insights
    if (calculation.recommended_sample >= 1000) {
      insights.push('Large sample size enables robust statistical analysis and reliable insights')
    } else if (calculation.recommended_sample >= 400) {
      insights.push('Good sample size for most statistical analyses and segmentation')
    } else if (calculation.recommended_sample >= 200) {
      insights.push('Adequate sample size for basic analysis, consider increasing for segmentation')
    } else {
      insights.push('Small sample size - results may not be statistically reliable')
    }

    // Confidence level insights
    if (this.inputs.confidence_level >= 0.95) {
      insights.push('High confidence level provides reliable results for decision making')
    } else {
      insights.push('Lower confidence level - consider increasing for critical decisions')
    }

    // Margin of error insights
    if (this.inputs.margin_of_error <= 0.03) {
      insights.push('Low margin of error provides precise estimates')
    } else if (this.inputs.margin_of_error > 0.10) {
      insights.push('High margin of error - consider increasing sample size for precision')
    }

    // Subgroup analysis insights
    if (calculation.subgroup_analysis.segments_possible >= 4) {
      insights.push(`Can analyze up to ${calculation.subgroup_analysis.segments_possible} segments reliably`)
    } else {
      insights.push('Limited segmentation capability - consider increasing sample size')
    }

    return insights
  }

  generateRecommendations(): string[] {
    const calculation = this.calculate()
    const recommendations: string[] = []

    // Sample size recommendations
    if (calculation.recommended_sample < 200) {
      recommendations.push('Increase sample size to at least 200 for basic reliability')
    }

    if (calculation.subgroup_analysis.segments_possible < 3) {
      recommendations.push('Increase sample size to enable meaningful segmentation analysis')
    }

    // Cost optimization recommendations
    if (calculation.cost_estimate.total_cost > 10000) {
      recommendations.push('Consider reducing sample size or using more cost-effective methods')
    }

    // Quality recommendations
    if (calculation.quality_metrics.expected_data_quality_score < 80) {
      recommendations.push('Improve data collection methods to increase quality score')
    }

    // Response rate recommendations
    if (this.inputs.response_rate && this.inputs.response_rate < 0.15) {
      recommendations.push('Improve response rate through better targeting and incentives')
    }

    return recommendations
  }
}

// Segmentation Sample Size Calculator
export class SegmentationSampleCalculator {
  private segments: Segment[]
  private totalPopulation: number

  constructor(segments: Segment[], totalPopulation: number) {
    this.segments = segments
    this.totalPopulation = totalPopulation
  }

  calculate(): SegmentationAnalysis {
    let totalSampleNeeded = 0
    const feasibilityScore = this.calculateFeasibilityScore()
    const recommendations: string[] = []

    // Calculate sample size for each segment
    this.segments.forEach(segment => {
      const segmentPopulation = (segment.size_percentage / 100) * this.totalPopulation
      
      const calculator = new SampleSizeCalculator({
        population_size: segmentPopulation,
        confidence_level: segment.confidence_level,
        margin_of_error: segment.margin_of_error,
        expected_proportion: 0.5
      })
      
      const calculation = calculator.calculate()
      segment.recommended_sample_size = calculation.recommended_sample
      
      totalSampleNeeded += segment.recommended_sample_size
    })

    // Generate recommendations
    if (totalSampleNeeded > 5000) {
      recommendations.push('Consider reducing number of segments or increasing budget')
    }

    if (feasibilityScore < 70) {
      recommendations.push('Segmentation plan may not be feasible - revise approach')
    }

    const segmentsWithSmallSamples = this.segments.filter(s => s.recommended_sample_size < 100)
    if (segmentsWithSmallSamples.length > 0) {
      recommendations.push('Some segments have insufficient sample sizes for reliable analysis')
    }

    return {
      segments: this.segments,
      total_sample_needed: totalSampleNeeded,
      feasibility_score: feasibilityScore,
      recommendations
    }
  }

  private calculateFeasibilityScore(): number {
    let score = 100

    // Penalize for too many segments
    if (this.segments.length > 5) {
      score -= (this.segments.length - 5) * 10
    }

    // Penalize for small segments
    const smallSegments = this.segments.filter(s => s.size_percentage < 10)
    score -= smallSegments.length * 15

    // Penalize for high precision requirements
    const highPrecisionSegments = this.segments.filter(s => s.margin_of_error < 0.05)
    score -= highPrecisionSegments.length * 10

    return Math.max(0, score)
  }
}

// Industry Standard Guidelines
export const SAMPLE_SIZE_GUIDELINES = {
  exploratory: { min: 50, max: 100, description: 'Initial exploration and hypothesis generation' },
  quantitative: { min: 200, max: 400, description: 'Standard quantitative research' },
  segmentation: { min: 400, max: 1000, description: 'Market segmentation analysis' },
  national_representative: { min: 1000, max: 2000, description: 'Nationally representative studies' },
  per_segment_minimum: 100,
  per_subgroup_minimum: 30,
  confidence_levels: {
    0.90: { z_score: 1.645, description: '90% confidence - exploratory' },
    0.95: { z_score: 1.96, description: '95% confidence - standard' },
    0.99: { z_score: 2.576, description: '99% confidence - high stakes' }
  },
  margin_of_error: {
    0.03: { description: '±3% - High precision' },
    0.05: { description: '±5% - Standard precision' },
    0.10: { description: '±10% - Acceptable precision' }
  }
}

// Utility Functions
export function validateSampleSizeInputs(inputs: SampleSizeInputs): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate confidence level
  if (![0.90, 0.95, 0.99].includes(inputs.confidence_level)) {
    errors.push('Confidence level must be 0.90, 0.95, or 0.99')
  }

  // Validate margin of error
  if (inputs.margin_of_error <= 0 || inputs.margin_of_error > 0.5) {
    errors.push('Margin of error must be between 0 and 50%')
  }

  // Validate expected proportion
  if (inputs.expected_proportion < 0 || inputs.expected_proportion > 1) {
    errors.push('Expected proportion must be between 0 and 1')
  }

  // Validate population size
  if (inputs.population_size < 0) {
    errors.push('Population size must be positive')
  }

  // Validate response rate
  if (inputs.response_rate && (inputs.response_rate <= 0 || inputs.response_rate > 1)) {
    errors.push('Response rate must be between 0 and 1')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function getRecommendedSampleSize(researchType: 'exploratory' | 'quantitative' | 'segmentation' | 'national'): number {
  const guidelines = SAMPLE_SIZE_GUIDELINES
  
  switch (researchType) {
    case 'exploratory':
      return guidelines.exploratory.max
    case 'quantitative':
      return guidelines.quantitative.max
    case 'segmentation':
      return guidelines.segmentation.max
    case 'national':
      return guidelines.national_representative.max
    default:
      return guidelines.quantitative.max
  }
}

export function calculateMinimumSampleForSegments(segmentCount: number): number {
  return segmentCount * SAMPLE_SIZE_GUIDELINES.per_segment_minimum
}

// Power Analysis Functions
export function calculatePowerAnalysis(
  sampleSize: number,
  effectSize: number,
  alpha: number = 0.05
): { power: number; beta: number; recommendation: string } {
  // Simplified power calculation
  const zAlpha = 1.96 // For alpha = 0.05
  const zBeta = Math.sqrt(sampleSize) * effectSize - zAlpha
  
  // Convert to power (simplified)
  const power = Math.max(0, Math.min(1, 0.5 + zBeta * 0.2))
  const beta = 1 - power
  
  let recommendation = 'Adequate power for detecting effects'
  if (power < 0.8) {
    recommendation = 'Low power - consider increasing sample size'
  } else if (power > 0.95) {
    recommendation = 'Very high power - may be over-sampling'
  }

  return {
    power,
    beta,
    recommendation
  }
}
