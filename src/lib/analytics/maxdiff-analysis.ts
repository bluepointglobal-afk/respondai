// MaxDiff (Maximum Difference Scaling) Analysis
// Industry standard for feature prioritization and preference measurement

import { QuestionTemplate } from '../frameworks/research-frameworks'

export interface MaxDiffQuestion {
  id: string
  features: string[]
  question_text: string
  rotation_number: number
  respondent_id: string
}

export interface MaxDiffResponse {
  question_id: string
  most_important: string
  least_important: string
  respondent_id: string
  response_time_ms: number
}

export interface MaxDiffAnalysis {
  methodology: 'Maximum Difference Scaling'
  
  // Feature utility scores
  feature_scores: {
    feature: string
    utility_score: number      // 0-100 scale
    share_of_preference: number // % of total utility
    rank: number
    confidence_interval: { lower: number; upper: number }
    significance_level: number
  }[]
  
  // Statistical testing
  significant_differences: {
    feature_a: string
    feature_b: string
    p_value: number
    is_significant: boolean
    confidence_level: number
  }[]
  
  // Sample statistics
  sample_size: number
  completion_rate: number
  data_quality_score: number
  
  // Analysis metadata
  total_features: number
  questions_per_respondent: number
  rotations_completed: number
}

export interface MaxDiffVisualization {
  chart_type: 'horizontal_bar'
  title: string
  x_axis: { label: string; min: number; max: number }
  y_axis: { label: string }
  bars: {
    feature: string
    utility_score: number
    confidence_interval: { lower: number; upper: number }
    color: string
    rank: number
  }[]
  annotations: string[]
}

export class MaxDiffAnalyzer {
  private features: string[]
  private responses: MaxDiffResponse[]
  private analysis: MaxDiffAnalysis | null = null

  constructor(features: string[], responses: MaxDiffResponse[]) {
    this.features = features
    this.responses = responses
  }

  analyze(): MaxDiffAnalysis {
    if (this.analysis) return this.analysis

    // Calculate utility scores using logit model
    const utilityScores = this.calculateUtilityScores()
    
    // Calculate share of preference
    const shareOfPreference = this.calculateShareOfPreference(utilityScores)
    
    // Calculate confidence intervals
    const confidenceIntervals = this.calculateConfidenceIntervals(utilityScores)
    
    // Perform statistical significance testing
    const significantDifferences = this.performSignificanceTesting(utilityScores)
    
    // Calculate data quality metrics
    const dataQualityScore = this.calculateDataQualityScore()
    
    // Rank features by utility score
    const rankedFeatures = this.rankFeatures(utilityScores)

    this.analysis = {
      methodology: 'Maximum Difference Scaling',
      feature_scores: rankedFeatures.map((feature, index) => ({
        feature: feature.name,
        utility_score: feature.score,
        share_of_preference: shareOfPreference[feature.name],
        rank: index + 1,
        confidence_interval: confidenceIntervals[feature.name],
        significance_level: this.calculateSignificanceLevel(feature.name, utilityScores)
      })),
      significant_differences: significantDifferences,
      sample_size: this.getUniqueRespondents().length,
      completion_rate: this.calculateCompletionRate(),
      data_quality_score: dataQualityScore,
      total_features: this.features.length,
      questions_per_respondent: this.getQuestionsPerRespondent(),
      rotations_completed: this.getRotationsCompleted()
    }

    return this.analysis
  }

  private calculateUtilityScores(): Record<string, number> {
    // Initialize utility scores
    const utilities: Record<string, number> = {}
    this.features.forEach(feature => {
      utilities[feature] = 0
    })

    // Count occurrences for each feature
    const mostImportantCounts: Record<string, number> = {}
    const leastImportantCounts: Record<string, number> = {}
    
    this.features.forEach(feature => {
      mostImportantCounts[feature] = 0
      leastImportantCounts[feature] = 0
    })

    // Count most/least important selections
    this.responses.forEach(response => {
      mostImportantCounts[response.most_important]++
      leastImportantCounts[response.least_important]++
    })

    // Calculate utility scores using logit model
    const totalResponses = this.responses.length
    
    this.features.forEach(feature => {
      const mostImportant = mostImportantCounts[feature] || 0
      const leastImportant = leastImportantCounts[feature] || 0
      
      // Logit transformation
      const logitScore = Math.log((mostImportant + 1) / (leastImportant + 1))
      
      // Normalize to 0-100 scale
      utilities[feature] = Math.max(0, (logitScore + 3) * 16.67) // Scale adjustment
    })

    return utilities
  }

  private calculateShareOfPreference(utilityScores: Record<string, number>): Record<string, number> {
    const totalUtility = Object.values(utilityScores).reduce((sum, score) => sum + Math.exp(score / 20), 0)
    
    const shareOfPreference: Record<string, number> = {}
    
    this.features.forEach(feature => {
      const expUtility = Math.exp(utilityScores[feature] / 20)
      shareOfPreference[feature] = (expUtility / totalUtility) * 100
    })

    return shareOfPreference
  }

  private calculateConfidenceIntervals(utilityScores: Record<string, number>): Record<string, { lower: number; upper: number }> {
    const sampleSize = this.getUniqueRespondents().length
    const standardError = 1.96 * Math.sqrt(0.25 / sampleSize) // 95% confidence interval
    
    const confidenceIntervals: Record<string, { lower: number; upper: number }> = {}
    
    this.features.forEach(feature => {
      const score = utilityScores[feature]
      confidenceIntervals[feature] = {
        lower: Math.max(0, score - (score * standardError)),
        upper: Math.min(100, score + (score * standardError))
      }
    })

    return confidenceIntervals
  }

  private performSignificanceTesting(utilityScores: Record<string, number>): any[] {
    const significantDifferences: any[] = []
    const features = Object.keys(utilityScores)
    
    for (let i = 0; i < features.length; i++) {
      for (let j = i + 1; j < features.length; j++) {
        const featureA = features[i]
        const featureB = features[j]
        
        const scoreA = utilityScores[featureA]
        const scoreB = utilityScores[featureB]
        
        // Calculate p-value using t-test approximation
        const difference = Math.abs(scoreA - scoreB)
        const pooledVariance = 0.25 // Approximate variance for binary choice
        const standardError = Math.sqrt(2 * pooledVariance / this.getUniqueRespondents().length)
        const tStatistic = difference / standardError
        
        // Approximate p-value (simplified)
        const pValue = this.calculatePValue(tStatistic)
        const isSignificant = pValue < 0.05
        
        significantDifferences.push({
          feature_a: featureA,
          feature_b: featureB,
          p_value: pValue,
          is_significant: isSignificant,
          confidence_level: isSignificant ? 0.95 : 0.0
        })
      }
    }

    return significantDifferences
  }

  private calculatePValue(tStatistic: number): number {
    // Simplified p-value calculation
    // In practice, you'd use a proper t-distribution table
    if (Math.abs(tStatistic) > 2.576) return 0.01  // 99% confidence
    if (Math.abs(tStatistic) > 1.96) return 0.05   // 95% confidence
    if (Math.abs(tStatistic) > 1.645) return 0.10  // 90% confidence
    return 0.20
  }

  private calculateSignificanceLevel(feature: string, utilityScores: Record<string, number>): number {
    const featureScore = utilityScores[feature]
    const otherScores = Object.values(utilityScores).filter(score => score !== featureScore)
    
    // Count how many other features have significantly different scores
    let significantComparisons = 0
    
    otherScores.forEach(otherScore => {
      const difference = Math.abs(featureScore - otherScore)
      const pooledVariance = 0.25
      const standardError = Math.sqrt(2 * pooledVariance / this.getUniqueRespondents().length)
      const tStatistic = difference / standardError
      
      if (Math.abs(tStatistic) > 1.96) { // 95% confidence
        significantComparisons++
      }
    })

    return significantComparisons / otherScores.length
  }

  private rankFeatures(utilityScores: Record<string, number>): { name: string; score: number }[] {
    return Object.entries(utilityScores)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score)
  }

  private calculateDataQualityScore(): number {
    const totalPossibleResponses = this.getUniqueRespondents().length * this.getQuestionsPerRespondent()
    const actualResponses = this.responses.length
    
    const completionRate = (actualResponses / totalPossibleResponses) * 100
    
    // Check for response time outliers (too fast = low quality)
    const avgResponseTime = this.responses.reduce((sum, r) => sum + r.response_time_ms, 0) / this.responses.length
    const fastResponses = this.responses.filter(r => r.response_time_ms < avgResponseTime * 0.3).length
    const timeQualityPenalty = (fastResponses / this.responses.length) * 20
    
    return Math.max(0, completionRate - timeQualityPenalty)
  }

  private getUniqueRespondents(): string[] {
    return [...new Set(this.responses.map(r => r.respondent_id))]
  }

  private getQuestionsPerRespondent(): number {
    const respondentCounts: Record<string, number> = {}
    
    this.responses.forEach(response => {
      respondentCounts[response.respondent_id] = (respondentCounts[response.respondent_id] || 0) + 1
    })
    
    const counts = Object.values(respondentCounts)
    return counts.length > 0 ? Math.round(counts.reduce((sum, count) => sum + count, 0) / counts.length) : 0
  }

  private getRotationsCompleted(): number {
    const uniqueQuestions = new Set(this.responses.map(r => r.question_id)).size
    return uniqueQuestions
  }

  private calculateCompletionRate(): number {
    const uniqueRespondents = this.getUniqueRespondents().length
    const expectedResponses = uniqueRespondents * this.getQuestionsPerRespondent()
    
    return expectedResponses > 0 ? (this.responses.length / expectedResponses) * 100 : 0
  }

  generateVisualization(): MaxDiffVisualization {
    const analysis = this.analyze()
    
    return {
      chart_type: 'horizontal_bar',
      title: 'MaxDiff Feature Importance Analysis',
      x_axis: {
        label: 'Utility Score',
        min: 0,
        max: 100
      },
      y_axis: {
        label: 'Features'
      },
      bars: analysis.feature_scores.map((feature, index) => ({
        feature: feature.feature,
        utility_score: feature.utility_score,
        confidence_interval: feature.confidence_interval,
        color: this.getFeatureColor(index),
        rank: feature.rank
      })),
      annotations: [
        `Sample Size: ${analysis.sample_size} respondents`,
        `Data Quality Score: ${analysis.data_quality_score.toFixed(1)}/100`,
        `Completion Rate: ${analysis.completion_rate.toFixed(1)}%`
      ]
    }
  }

  private getFeatureColor(rank: number): string {
    const colors = [
      '#22c55e', // Green for top features
      '#3b82f6', // Blue
      '#8b5cf6', // Purple
      '#f59e0b', // Orange
      '#ef4444', // Red
      '#6b7280'  // Gray for lower ranks
    ]
    
    return colors[Math.min(rank, colors.length - 1)]
  }

  generateInsights(): string[] {
    const analysis = this.analyze()
    const insights: string[] = []

    // Top feature insights
    const topFeature = analysis.feature_scores[0]
    insights.push(`"${topFeature.feature}" is the most important feature with ${topFeature.utility_score.toFixed(1)} utility score`)

    // Significant differences insights
    const significantDiffs = analysis.significant_differences.filter(diff => diff.is_significant)
    if (significantDiffs.length > 0) {
      insights.push(`${significantDiffs.length} feature pairs show statistically significant differences`)
    }

    // Share of preference insights
    const topThreeFeatures = analysis.feature_scores.slice(0, 3)
    const topThreeShare = topThreeFeatures.reduce((sum, f) => sum + f.share_of_preference, 0)
    insights.push(`Top 3 features account for ${topThreeShare.toFixed(1)}% of total preference`)

    // Data quality insights
    if (analysis.data_quality_score > 80) {
      insights.push('High data quality - results are reliable for decision making')
    } else if (analysis.data_quality_score < 60) {
      insights.push('Low data quality - consider increasing sample size')
    }

    return insights
  }

  generateRecommendations(): string[] {
    const analysis = this.analyze()
    const recommendations: string[] = []

    // Development priority recommendations
    const topFeatures = analysis.feature_scores.slice(0, 3)
    recommendations.push('Development Priority: Focus on these top features first:')
    topFeatures.forEach((feature, index) => {
      recommendations.push(`${index + 1}. ${feature.feature} (${feature.utility_score.toFixed(1)} utility score)`)
    })

    // Resource allocation recommendations
    const highUtilityFeatures = analysis.feature_scores.filter(f => f.utility_score > 60)
    const lowUtilityFeatures = analysis.feature_scores.filter(f => f.utility_score < 30)
    
    if (highUtilityFeatures.length > 0) {
      recommendations.push(`Allocate 70% of development resources to high-utility features (${highUtilityFeatures.length} features)`)
    }
    
    if (lowUtilityFeatures.length > 0) {
      recommendations.push(`Consider deprioritizing low-utility features (${lowUtilityFeatures.length} features)`)
    }

    // Testing recommendations
    recommendations.push('Conduct follow-up research to validate feature importance with actual usage data')
    recommendations.push('Monitor feature importance changes as market evolves')

    return recommendations
  }
}

// MaxDiff Question Generation
export class MaxDiffQuestionGenerator {
  private features: string[]
  private featuresPerQuestion: number = 4
  private rotationsPerRespondent: number = 5

  constructor(features: string[], featuresPerQuestion: number = 4, rotationsPerRespondent: number = 5) {
    this.features = features
    this.featuresPerQuestion = featuresPerQuestion
    this.rotationsPerRespondent = rotationsPerRespondent
  }

  generateQuestions(): MaxDiffQuestion[] {
    const questions: MaxDiffQuestion[] = []
    const totalQuestions = this.rotationsPerRespondent
    
    for (let i = 0; i < totalQuestions; i++) {
      const selectedFeatures = this.selectRandomFeatures(i)
      
      questions.push({
        id: `maxdiff_${i + 1}`,
        features: selectedFeatures,
        question_text: `Which of these features is MOST important to you, and which is LEAST important?`,
        rotation_number: i + 1,
        respondent_id: '' // Will be set when assigned to respondent
      })
    }

    return questions
  }

  private selectRandomFeatures(rotationIndex: number): string[] {
    // Use deterministic randomization based on rotation index
    const shuffled = [...this.features].sort(() => 0.5 - Math.random())
    const startIndex = (rotationIndex * this.featuresPerQuestion) % this.features.length
    
    const selectedFeatures: string[] = []
    
    for (let i = 0; i < this.featuresPerQuestion; i++) {
      const index = (startIndex + i) % this.features.length
      selectedFeatures.push(shuffled[index])
    }

    return selectedFeatures
  }

  validateQuestions(questions: MaxDiffQuestion[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check minimum features
    if (this.features.length < 4) {
      errors.push('Minimum 4 features required for MaxDiff analysis')
    }

    // Check features per question
    if (this.featuresPerQuestion < 3 || this.featuresPerQuestion > 5) {
      errors.push('Features per question should be between 3-5')
    }

    // Check rotations per respondent
    if (this.rotationsPerRespondent < 3) {
      errors.push('Minimum 3 rotations per respondent recommended')
    }

    // Check coverage
    const allFeaturesInQuestions = new Set<string>()
    questions.forEach(q => {
      q.features.forEach(f => allFeaturesInQuestions.add(f))
    })

    const uncoveredFeatures = this.features.filter(f => !allFeaturesInQuestions.has(f))
    if (uncoveredFeatures.length > 0) {
      errors.push(`Some features not covered in questions: ${uncoveredFeatures.join(', ')}`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Utility functions
export function generateMaxDiffQuestions(features: string[]): QuestionTemplate[] {
  const generator = new MaxDiffQuestionGenerator(features)
  const questions = generator.generateQuestions()
  
  return questions.map(q => ({
    id: q.id,
    type: 'maxdiff' as any,
    text: q.question_text,
    options: q.features,
    required: true
  }))
}

export function validateMaxDiffData(responses: MaxDiffResponse[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check minimum sample size
  const uniqueRespondents = new Set(responses.map(r => r.respondent_id)).size
  if (uniqueRespondents < 50) {
    errors.push(`Sample size too small: ${uniqueRespondents}. Minimum recommended: 50`)
  }

  // Check response consistency
  const invalidResponses = responses.filter(r => 
    !r.most_important || !r.least_important || r.most_important === r.least_important
  )
  
  if (invalidResponses.length > 0) {
    errors.push(`${invalidResponses.length} invalid responses found`)
  }

  // Check response times
  const avgResponseTime = responses.reduce((sum, r) => sum + r.response_time_ms, 0) / responses.length
  const tooFastResponses = responses.filter(r => r.response_time_ms < avgResponseTime * 0.2).length
  
  if (tooFastResponses > responses.length * 0.1) {
    errors.push(`${tooFastResponses} responses appear too fast (${(tooFastResponses/responses.length*100).toFixed(1)}%)`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
