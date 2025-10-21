// Kano Model Analysis
// Classifies features into Must-Be, Performance, Attractive, Indifferent, and Reverse categories

import { QuestionTemplate } from '../frameworks/research-frameworks'

export interface KanoResponse {
  feature: string
  functional_response: 'like_it' | 'expect_it' | 'neutral' | 'tolerate_it' | 'dislike_it'
  dysfunctional_response: 'like_it' | 'expect_it' | 'neutral' | 'tolerate_it' | 'dislike_it'
  respondent_id: string
}

export interface KanoAnalysis {
  methodology: 'Kano Model'
  
  feature_classifications: {
    feature: string
    category: 'Must-Be' | 'Performance' | 'Attractive' | 'Indifferent' | 'Reverse'
    explanation: string
    strategic_implication: string
    confidence_level: number
    sample_size: number
  }[]
  
  strategic_insights: {
    must_be_features: string[]
    performance_features: string[]
    attractive_features: string[]
    indifferent_features: string[]
    reverse_features: string[]
  }
  
  satisfaction_impact: {
    feature: string
    category: string
    satisfaction_if_present: number
    dissatisfaction_if_absent: number
    net_impact: number
  }[]
  
  sample_statistics: {
    total_responses: number
    unique_respondents: number
    features_analyzed: number
    data_quality_score: number
  }
}

export interface KanoVisualization {
  chart_type: 'kano_matrix'
  title: string
  x_axis: { label: string; min: number; max: number }
  y_axis: { label: string; min: number; max: number }
  quadrants: {
    top_right: { label: 'Attractive'; description: 'Delighters - differentiate from competition' }
    top_left: { label: 'Performance'; description: 'More is better - linear satisfaction' }
    bottom_right: { label: 'Indifferent'; description: 'No impact on satisfaction' }
    bottom_left: { label: 'Must-Be'; description: 'Dissatisfiers if absent' }
  }
  features: {
    feature: string
    x_coordinate: number
    y_coordinate: number
    category: string
    color: string
  }[]
  annotations: string[]
}

export class KanoAnalyzer {
  private responses: KanoResponse[]
  private analysis: KanoAnalysis | null = null

  constructor(responses: KanoResponse[]) {
    this.responses = responses
  }

  analyze(): KanoAnalysis {
    if (this.analysis) return this.analysis

    // Group responses by feature
    const featureGroups = this.groupResponsesByFeature()
    
    // Classify each feature
    const featureClassifications = this.classifyFeatures(featureGroups)
    
    // Generate strategic insights
    const strategicInsights = this.generateStrategicInsights(featureClassifications)
    
    // Calculate satisfaction impact
    const satisfactionImpact = this.calculateSatisfactionImpact(featureClassifications)
    
    // Calculate sample statistics
    const sampleStatistics = this.calculateSampleStatistics()

    this.analysis = {
      methodology: 'Kano Model',
      feature_classifications: featureClassifications,
      strategic_insights: strategicInsights,
      satisfaction_impact: satisfactionImpact,
      sample_statistics: sampleStatistics
    }

    return this.analysis
  }

  private groupResponsesByFeature(): Record<string, KanoResponse[]> {
    const groups: Record<string, KanoResponse[]> = {}
    
    this.responses.forEach(response => {
      if (!groups[response.feature]) {
        groups[response.feature] = []
      }
      groups[response.feature].push(response)
    })

    return groups
  }

  private classifyFeatures(featureGroups: Record<string, KanoResponse[]>): any[] {
    const classifications: any[] = []

    Object.entries(featureGroups).forEach(([feature, responses]) => {
      const classification = this.classifyFeature(feature, responses)
      classifications.push(classification)
    })

    return classifications
  }

  private classifyFeature(feature: string, responses: KanoResponse[]): any {
    // Count response combinations
    const responseCounts: Record<string, number> = {}
    
    responses.forEach(response => {
      const key = `${response.functional_response}_${response.dysfunctional_response}`
      responseCounts[key] = (responseCounts[key] || 0) + 1
    })

    // Determine dominant classification using Kano evaluation table
    const totalResponses = responses.length
    let maxCount = 0
    let dominantCategory = 'Indifferent'
    let confidenceLevel = 0

    // Kano evaluation matrix
    const kanoMatrix: Record<string, string> = {
      'like_it_like_it': 'Questionable',
      'like_it_expect_it': 'Attractive',
      'like_it_neutral': 'Attractive',
      'like_it_tolerate_it': 'Attractive',
      'like_it_dislike_it': 'One-Dimensional',
      'expect_it_like_it': 'Must-Be',
      'expect_it_expect_it': 'Indifferent',
      'expect_it_neutral': 'Must-Be',
      'expect_it_tolerate_it': 'Must-Be',
      'expect_it_dislike_it': 'Reverse',
      'neutral_like_it': 'Must-Be',
      'neutral_expect_it': 'Must-Be',
      'neutral_neutral': 'Indifferent',
      'neutral_tolerate_it': 'Indifferent',
      'neutral_dislike_it': 'Reverse',
      'tolerate_it_like_it': 'Must-Be',
      'tolerate_it_expect_it': 'Must-Be',
      'tolerate_it_neutral': 'Indifferent',
      'tolerate_it_tolerate_it': 'Indifferent',
      'tolerate_it_dislike_it': 'Reverse',
      'dislike_it_like_it': 'Reverse',
      'dislike_it_expect_it': 'Reverse',
      'dislike_it_neutral': 'Reverse',
      'dislike_it_tolerate_it': 'Reverse',
      'dislike_it_dislike_it': 'Questionable'
    }

    // Find dominant response pattern
    Object.entries(responseCounts).forEach(([pattern, count]) => {
      if (count > maxCount) {
        maxCount = count
        dominantCategory = kanoMatrix[pattern] || 'Indifferent'
        confidenceLevel = (count / totalResponses) * 100
      }
    })

    // Map Kano categories to business categories
    const businessCategory = this.mapToBusinessCategory(dominantCategory)
    
    return {
      feature,
      category: businessCategory,
      explanation: this.getCategoryExplanation(businessCategory),
      strategic_implication: this.getStrategicImplication(businessCategory),
      confidence_level: confidenceLevel,
      sample_size: totalResponses
    }
  }

  private mapToBusinessCategory(kanoCategory: string): string {
    const mapping: Record<string, string> = {
      'Must-Be': 'Must-Be',
      'One-Dimensional': 'Performance',
      'Attractive': 'Attractive',
      'Indifferent': 'Indifferent',
      'Reverse': 'Reverse',
      'Questionable': 'Indifferent'
    }

    return mapping[kanoCategory] || 'Indifferent'
  }

  private getCategoryExplanation(category: string): string {
    const explanations: Record<string, string> = {
      'Must-Be': 'Customers expect this feature and will be dissatisfied if it\'s missing',
      'Performance': 'Customer satisfaction increases linearly with feature performance',
      'Attractive': 'Customers don\'t expect this feature but will be delighted if present',
      'Indifferent': 'This feature has minimal impact on customer satisfaction',
      'Reverse': 'This feature actually decreases customer satisfaction'
    }

    return explanations[category] || 'Feature impact unclear'
  }

  private getStrategicImplication(category: string): string {
    const implications: Record<string, string> = {
      'Must-Be': 'Essential for market entry - must be included',
      'Performance': 'Competitive differentiator - invest in excellence',
      'Attractive': 'Innovation opportunity - can surprise and delight',
      'Indifferent': 'Low priority - avoid unless cost is minimal',
      'Reverse': 'Avoid this feature - it hurts customer satisfaction'
    }

    return implications[category] || 'Further analysis needed'
  }

  private generateStrategicInsights(classifications: any[]): any {
    const insights = {
      must_be_features: [] as string[],
      performance_features: [] as string[],
      attractive_features: [] as string[],
      indifferent_features: [] as string[],
      reverse_features: [] as string[]
    }

    classifications.forEach(classification => {
      switch (classification.category) {
        case 'Must-Be':
          insights.must_be_features.push(classification.feature)
          break
        case 'Performance':
          insights.performance_features.push(classification.feature)
          break
        case 'Attractive':
          insights.attractive_features.push(classification.feature)
          break
        case 'Indifferent':
          insights.indifferent_features.push(classification.feature)
          break
        case 'Reverse':
          insights.reverse_features.push(classification.feature)
          break
      }
    })

    return insights
  }

  private calculateSatisfactionImpact(classifications: any[]): any[] {
    return classifications.map(classification => {
      let satisfactionIfPresent = 0
      let dissatisfactionIfAbsent = 0

      switch (classification.category) {
        case 'Must-Be':
          satisfactionIfPresent = 0
          dissatisfactionIfAbsent = -80
          break
        case 'Performance':
          satisfactionIfPresent = 60
          dissatisfactionIfAbsent = -40
          break
        case 'Attractive':
          satisfactionIfPresent = 80
          dissatisfactionIfAbsent = 0
          break
        case 'Indifferent':
          satisfactionIfPresent = 0
          dissatisfactionIfAbsent = 0
          break
        case 'Reverse':
          satisfactionIfPresent = -60
          dissatisfactionIfAbsent = 20
          break
      }

      return {
        feature: classification.feature,
        category: classification.category,
        satisfaction_if_present: satisfactionIfPresent,
        dissatisfaction_if_absent: dissatisfactionIfAbsent,
        net_impact: satisfactionIfPresent + Math.abs(dissatisfactionIfAbsent)
      }
    })
  }

  private calculateSampleStatistics(): any {
    const uniqueRespondents = new Set(this.responses.map(r => r.respondent_id)).size
    const uniqueFeatures = new Set(this.responses.map(r => r.feature)).size
    
    // Calculate data quality score
    const totalPossibleResponses = uniqueRespondents * uniqueFeatures * 2 // 2 questions per feature
    const actualResponses = this.responses.length
    const completionRate = (actualResponses / totalPossibleResponses) * 100

    return {
      total_responses: this.responses.length,
      unique_respondents: uniqueRespondents,
      features_analyzed: uniqueFeatures,
      data_quality_score: Math.min(100, completionRate)
    }
  }

  generateVisualization(): KanoVisualization {
    const analysis = this.analyze()
    
    return {
      chart_type: 'kano_matrix',
      title: 'Kano Model Feature Classification',
      x_axis: { label: 'Implementation Level', min: 0, max: 100 },
      y_axis: { label: 'Customer Satisfaction', min: -100, max: 100 },
      quadrants: {
        top_right: { 
          label: 'Attractive', 
          description: 'Delighters - differentiate from competition' 
        },
        top_left: { 
          label: 'Performance', 
          description: 'More is better - linear satisfaction' 
        },
        bottom_right: { 
          label: 'Indifferent', 
          description: 'No impact on satisfaction' 
        },
        bottom_left: { 
          label: 'Must-Be', 
          description: 'Dissatisfiers if absent' 
        }
      },
      features: analysis.feature_classifications.map(classification => ({
        feature: classification.feature,
        x_coordinate: this.getXCoordinate(classification.category),
        y_coordinate: this.getYCoordinate(classification.category),
        category: classification.category,
        color: this.getCategoryColor(classification.category)
      })),
      annotations: [
        `Total Features Analyzed: ${analysis.sample_statistics.features_analyzed}`,
        `Sample Size: ${analysis.sample_statistics.unique_respondents} respondents`,
        `Data Quality Score: ${analysis.sample_statistics.data_quality_score.toFixed(1)}/100`
      ]
    }
  }

  private getXCoordinate(category: string): number {
    const coordinates: Record<string, number> = {
      'Must-Be': 20,
      'Performance': 50,
      'Attractive': 80,
      'Indifferent': 50,
      'Reverse': 20
    }
    return coordinates[category] || 50
  }

  private getYCoordinate(category: string): number {
    const coordinates: Record<string, number> = {
      'Must-Be': -60,
      'Performance': 0,
      'Attractive': 60,
      'Indifferent': 0,
      'Reverse': -30
    }
    return coordinates[category] || 0
  }

  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Must-Be': '#ef4444',      // Red
      'Performance': '#3b82f6',  // Blue
      'Attractive': '#22c55e',   // Green
      'Indifferent': '#6b7280',  // Gray
      'Reverse': '#f59e0b'       // Orange
    }
    return colors[category] || '#6b7280'
  }

  generateInsights(): string[] {
    const analysis = this.analyze()
    const insights: string[] = []

    // Category distribution insights
    const categoryCounts = {
      'Must-Be': analysis.strategic_insights.must_be_features.length,
      'Performance': analysis.strategic_insights.performance_features.length,
      'Attractive': analysis.strategic_insights.attractive_features.length,
      'Indifferent': analysis.strategic_insights.indifferent_features.length,
      'Reverse': analysis.strategic_insights.reverse_features.length
    }

    insights.push(`Feature Distribution: ${categoryCounts['Must-Be']} Must-Be, ${categoryCounts['Performance']} Performance, ${categoryCounts['Attractive']} Attractive`)

    // High confidence insights
    const highConfidenceFeatures = analysis.feature_classifications.filter(f => f.confidence_level > 70)
    insights.push(`${highConfidenceFeatures.length} features have high confidence classification (>70%)`)

    // Strategic insights
    if (analysis.strategic_insights.must_be_features.length > 0) {
      insights.push(`Must-have features identified: ${analysis.strategic_insights.must_be_features.join(', ')}`)
    }

    if (analysis.strategic_insights.attractive_features.length > 0) {
      insights.push(`Innovation opportunities: ${analysis.strategic_insights.attractive_features.join(', ')}`)
    }

    if (analysis.strategic_insights.reverse_features.length > 0) {
      insights.push(`Features to avoid: ${analysis.strategic_insights.reverse_features.join(', ')}`)
    }

    return insights
  }

  generateRecommendations(): string[] {
    const analysis = this.analyze()
    const recommendations: string[] = []

    // Development priority recommendations
    if (analysis.strategic_insights.must_be_features.length > 0) {
      recommendations.push('Development Priority 1: Implement all Must-Be features first')
      recommendations.push(`Must-Be features: ${analysis.strategic_insights.must_be_features.join(', ')}`)
    }

    if (analysis.strategic_insights.performance_features.length > 0) {
      recommendations.push('Development Priority 2: Excel at Performance features')
      recommendations.push(`Performance features: ${analysis.strategic_insights.performance_features.join(', ')}`)
    }

    if (analysis.strategic_insights.attractive_features.length > 0) {
      recommendations.push('Development Priority 3: Innovate with Attractive features')
      recommendations.push(`Attractive features: ${analysis.strategic_insights.attractive_features.join(', ')}`)
    }

    // Resource allocation recommendations
    recommendations.push('Resource Allocation:')
    recommendations.push('- 40% resources to Must-Be features (table stakes)')
    recommendations.push('- 40% resources to Performance features (competitive advantage)')
    recommendations.push('- 20% resources to Attractive features (innovation)')

    // Avoid recommendations
    if (analysis.strategic_insights.reverse_features.length > 0) {
      recommendations.push(`Avoid these features: ${analysis.strategic_insights.reverse_features.join(', ')}`)
    }

    if (analysis.strategic_insights.indifferent_features.length > 0) {
      recommendations.push(`Low priority features: ${analysis.strategic_insights.indifferent_features.join(', ')}`)
    }

    return recommendations
  }
}

// Kano Question Generation
export function generateKanoQuestions(features: string[]): QuestionTemplate[] {
  const questions: QuestionTemplate[] = []

  features.forEach(feature => {
    // Functional question
    questions.push({
      id: `kano_functional_${feature.toLowerCase().replace(/\s+/g, '_')}`,
      type: 'kano' as any,
      text: `How would you feel if this product HAD the feature: "${feature}"?`,
      options: [
        'I like it',
        'I expect it',
        'I am neutral',
        'I can tolerate it',
        'I dislike it'
      ],
      required: true
    })

    // Dysfunctional question
    questions.push({
      id: `kano_dysfunctional_${feature.toLowerCase().replace(/\s+/g, '_')}`,
      type: 'kano' as any,
      text: `How would you feel if this product DID NOT HAVE the feature: "${feature}"?`,
      options: [
        'I like it',
        'I expect it',
        'I am neutral',
        'I can tolerate it',
        'I dislike it'
      ],
      required: true
    })
  })

  return questions
}

// Utility functions
export function validateKanoData(responses: KanoResponse[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check minimum sample size
  const uniqueRespondents = new Set(responses.map(r => r.respondent_id)).size
  if (uniqueRespondents < 30) {
    errors.push(`Sample size too small: ${uniqueRespondents}. Minimum recommended: 30`)
  }

  // Check response completeness
  const features = new Set(responses.map(r => r.feature))
  const expectedResponsesPerFeature = uniqueRespondents * 2 // functional + dysfunctional
  
  features.forEach(feature => {
    const featureResponses = responses.filter(r => r.feature === feature)
    if (featureResponses.length < expectedResponsesPerFeature * 0.8) {
      errors.push(`Incomplete responses for feature: ${feature}`)
    }
  })

  // Check for invalid responses
  const validResponses = ['like_it', 'expect_it', 'neutral', 'tolerate_it', 'dislike_it']
  const invalidResponses = responses.filter(r => 
    !validResponses.includes(r.functional_response) || 
    !validResponses.includes(r.dysfunctional_response)
  )

  if (invalidResponses.length > 0) {
    errors.push(`${invalidResponses.length} invalid responses found`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
