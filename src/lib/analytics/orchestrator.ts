/**
 * ANALYSIS ORCHESTRATOR
 * Single entry point for running all RespondAI analyses
 * Coordinates: Response Generation → Pattern Detection → Pricing → Insights
 * 
 * Pipeline: Load Config → Generate Responses → Analyze (parallel) → Generate Insights → Finalize
 * Performance: ~30 seconds for 500 responses
 */

import { generateSyntheticResponses, SyntheticResponse, ResponseGeneratorConfig } from './response-generator'
import { generateSurveyResponses, SurveyResponse, SurveyResponseConfig } from './survey-response-generator'
import { detectPatterns, Pattern } from './pattern-detector'
import { generateInsights, Insight, AnalysisBundle } from './insight-generator'
import { calculateStats } from './stats'
import { IndustryCategory, getIndustryConfig } from '../config/industries'
import { Persona } from '../types/test'
import { DemographicProfile, generateDemographicSample } from './demographics'
import _ from 'lodash'

export interface AnalysisConfig {
  productName: string
  productDescription: string
  industry: IndustryCategory
  targetAudience?: string
  personas: Persona[]
  sampleSize?: number
  survey?: any // Survey data with questions
}

export interface AnalysisResults {
  testId?: string
  status: 'success' | 'partial' | 'failed'
  
  // Core metrics
  overview: {
    avgPurchaseIntent: number
    optimalPrice: number
    topBenefit: string
    brandFit: number
    sampleSize: number
    confidence: number
  }
  
  // Detailed analysis
  patterns: Pattern[]
  segments: SegmentAnalysis[]
  pricing: PricingRecommendation
  insights: Insight[]
  
  // Raw data (optional - can be large)
  syntheticResponses?: SyntheticResponse[]
  
  // Summaries
  executiveSummary: string
  keyMetrics: {
    avgPurchaseIntent: number
    optimalPrice: number
    estimatedRevenue: number
    topInsight: string
  }
  
  // Metadata
  analysisDate: string
  processingTime: number
  errors?: string[]
}

export interface SegmentAnalysis {
  name: string
  size: number
  purchaseIntent: number
  lift: number
  topBenefits: string[]
  concerns: string[]
  recommendations: string[]
}

export interface PricingRecommendation {
  optimal: number
  range: { min: number; max: number }
  premium: number
  segments: {
    segment: string
    price: number
    reasoning: string
  }[]
}

export interface ProgressUpdate {
  stage: string
  percent: number
  message: string
}

export type ProgressCallback = (progress: ProgressUpdate) => void

/**
 * MAIN ORCHESTRATOR FUNCTION
 * Runs complete analysis pipeline with progress tracking
 */
export async function runCompleteAnalysis(
  config: AnalysisConfig,
  onProgress?: ProgressCallback
): Promise<AnalysisResults> {
  const startTime = Date.now()
  const errors: string[] = []
  
  console.log('🚀 Starting complete analysis pipeline...')
  
  try {
    // PHASE 1: PREPARATION (0-10%)
    onProgress?.({ stage: 'preparation', percent: 5, message: 'Loading industry configuration' })
    
    // STAGE 1: Generate Responses (10-40%)
    onProgress?.({ stage: 'responses', percent: 10, message: 'Generating responses' })
    
    const industryConfig = getIndustryConfig(config.industry)
    const sampleSize = config.sampleSize || 500
    
    let responses: any[]
    
    if (config.survey) {
      // Use survey-specific response generator
      onProgress?.({ stage: 'responses', percent: 15, message: 'Generating demographic sample' })
      
      const demographics = generateDemographicSample(sampleSize)
      
      const surveyResponseConfig: SurveyResponseConfig = {
        survey: config.survey,
        productInfo: {
          name: config.productName,
          description: config.productDescription,
          industry: config.industry,
          targetAudience: config.targetAudience
        },
        personas: config.personas,
        sampleSize,
        demographics
      }
      
      onProgress?.({ stage: 'responses', percent: 20, message: 'Running survey through AI profiles' })
      responses = await generateSurveyResponses(surveyResponseConfig)
    } else {
      // Use generic response generator
      const responseConfig: ResponseGeneratorConfig = {
        productName: config.productName,
        productDescription: config.productDescription,
        industryCategory: config.industry,
        targetAudience: config.targetAudience,
        personas: config.personas,
        sampleSize,
      }
      
      responses = await generateSyntheticResponses(responseConfig)
    }
    
    onProgress?.({ stage: 'responses', percent: 40, message: `Generated ${responses.length} responses` })
    
    // STAGE 2: Calculate Overview Metrics (40-50%)
    onProgress?.({ stage: 'metrics', percent: 45, message: 'Calculating overview metrics' })
    
    const intents = responses.map(r => r.purchaseIntent)
    const intentStats = calculateStats(intents)
    
    const overview = {
      avgPurchaseIntent: Math.round(intentStats.mean * 10) / 10,
      optimalPrice: 29.99, // Will be replaced by pricing optimizer
      topBenefit: getTopBenefit(responses),
      brandFit: Math.round(_.mean(responses.map(r => r.brandFit)) * 10) / 10,
      sampleSize: responses.length,
      confidence: responses.length >= 500 ? 95 : responses.length >= 300 ? 90 : 85,
    }
    
    onProgress?.({ stage: 'metrics', percent: 50, message: 'Metrics calculated' })
    
    // PHASE 3: PARALLEL ANALYSIS (50-80%)
    onProgress?.({ stage: 'analysis', percent: 55, message: 'Running parallel analyses' })
    
    // Run pattern detection, segment analysis, and pricing in parallel
    const [patterns, segments, pricing] = await Promise.all([
      (async () => {
        onProgress?.({ stage: 'patterns', percent: 60, message: 'Detecting patterns' })
        return detectPatterns(responses)
      })(),
      (async () => {
        onProgress?.({ stage: 'segments', percent: 65, message: 'Analyzing segments' })
        return analyzeSegments(responses, overview.avgPurchaseIntent)
      })(),
      (async () => {
        onProgress?.({ stage: 'pricing', percent: 70, message: 'Optimizing pricing' })
        return optimizePricingSimple(responses, industryConfig)
      })(),
    ])
    
    overview.optimalPrice = pricing.optimal
    onProgress?.({ stage: 'analysis', percent: 80, message: `Found ${patterns.length} patterns` })
    
    // PHASE 4: INSIGHT GENERATION (80-95%)
    onProgress?.({ stage: 'insights', percent: 85, message: 'Generating AI insights' })
    
    let insights: Insight[] = []
    try {
      const bundle: AnalysisBundle = {
        responses,
        patterns,
        overview,
        pricing,
      }
      insights = await generateInsights(bundle)
    } catch (error) {
      console.error('Insight generation failed:', error)
      errors.push('Failed to generate insights')
    }
    
    onProgress?.({ stage: 'insights', percent: 90, message: `Generated ${insights.length} insights` })
    
    // PHASE 5: FINALIZATION (95-100%)
    onProgress?.({ stage: 'finalization', percent: 95, message: 'Finalizing results' })
    
    const processingTime = Date.now() - startTime
    
    // Generate executive summary
    const executiveSummary = generateExecutiveSummary(insights, overview, patterns)
    
    // Calculate estimated annual revenue
    const estimatedRevenue = responses.length * (overview.avgPurchaseIntent / 100) * overview.optimalPrice * 12
    
    const results: AnalysisResults = {
      status: errors.length > 0 ? 'partial' : 'success',
      overview,
      patterns,
      segments,
      pricing,
      insights,
      syntheticResponses: responses,
      executiveSummary,
      keyMetrics: {
        avgPurchaseIntent: overview.avgPurchaseIntent,
        optimalPrice: overview.optimalPrice,
        estimatedRevenue,
        topInsight: insights[0]?.headline || 'Analysis complete',
      },
      analysisDate: new Date().toISOString(),
      processingTime,
      errors: errors.length > 0 ? errors : undefined,
    }
    
    onProgress?.({ stage: 'complete', percent: 100, message: 'Analysis complete!' })
    
    console.log(`✅ Analysis complete in ${processingTime}ms`)
    console.log(`   Generated ${responses.length} responses`)
    console.log(`   Found ${patterns.length} patterns`)
    console.log(`   Generated ${insights.length} insights`)
    console.log(`   Analyzed ${segments.length} segments`)
    console.log(`   Optimal price: $${pricing.optimal}`)
    
    return results
    
  } catch (error) {
    console.error('❌ Analysis failed:', error)
    
    // Return partial results if possible
    onProgress?.({ stage: 'error', percent: 0, message: 'Analysis failed' })
    
    throw error
  }
}

/**
 * Generate executive summary
 */
function generateExecutiveSummary(insights: Insight[], overview: any, patterns: Pattern[]): string {
  const critical = insights.filter(i => i.priority === 'critical')
  const high = insights.filter(i => i.priority === 'high')
  
  let summary = `## Executive Summary\n\n`
  summary += `**Overall Purchase Intent:** ${overview.avgPurchaseIntent}%\n`
  summary += `**Recommended Price:** $${overview.optimalPrice}\n`
  summary += `**Sample Size:** ${overview.sampleSize} responses\n\n`
  
  if (critical.length > 0) {
    summary += `### 🚨 Critical Insights\n\n`
    critical.forEach((insight, i) => {
      summary += `${i + 1}. **${insight.headline}**\n`
      summary += `   Revenue Impact: $${(insight.revenueImpact / 1000).toFixed(0)}K\n\n`
    })
  }
  
  if (high.length > 0) {
    summary += `### ⭐ High Priority\n\n`
    high.slice(0, 3).forEach((insight, i) => {
      summary += `${i + 1}. ${insight.headline}\n`
    })
  }
  
  return summary
}

/**
 * Helper: Get top benefit across all responses
 */
function getTopBenefit(responses: SyntheticResponse[]): string {
  const allBenefits = responses.flatMap(r => r.benefitRanking)
  const counts = _.countBy(allBenefits)
  return _.maxBy(Object.keys(counts), k => counts[k]) || 'Quality'
}

/**
 * Helper: Analyze segments
 */
function analyzeSegments(responses: SyntheticResponse[], baseline: number): SegmentAnalysis[] {
  const segments: SegmentAnalysis[] = []
  
  // Analyze by location
  const locations = ['Urban', 'Suburban', 'Rural']
  
  locations.forEach(location => {
    const group = responses.filter(r => r.demographics.location === location)
    if (group.length < 20) return
    
    const avgIntent = _.mean(group.map(r => r.purchaseIntent))
    const lift = ((avgIntent - baseline) / baseline) * 100
    
    segments.push({
      name: `${location} Consumers`,
      size: group.length,
      purchaseIntent: Math.round(avgIntent * 10) / 10,
      lift: Math.round(lift * 10) / 10,
      topBenefits: getTopBenefits(group, 3),
      concerns: getTopConcerns(group, 3),
      recommendations: [
        `Tailor messaging for ${location} markets`,
        `Focus on ${getTopBenefits(group, 1)[0]} benefit`,
      ],
    })
  })
  
  return segments
}

/**
 * Helper: Get top benefits
 */
function getTopBenefits(responses: SyntheticResponse[], count: number): string[] {
  const allBenefits = responses.flatMap(r => r.benefitRanking)
  const counts = _.countBy(allBenefits)
  return _.take(
    _.sortBy(Object.keys(counts), b => -counts[b]),
    count
  )
}

/**
 * Helper: Get top concerns
 */
function getTopConcerns(responses: SyntheticResponse[], count: number): string[] {
  const allConcerns = responses.flatMap(r => r.concerns)
  const counts = _.countBy(allConcerns)
  return _.take(
    _.sortBy(Object.keys(counts), c => -counts[c]),
    count
  )
}

/**
 * Simple pricing optimizer
 */
function optimizePricingSimple(responses: SyntheticResponse[], industryConfig: any): PricingRecommendation {
  const priceAcceptances = responses.map(r => r.priceAcceptance)
  const stats = calculateStats(priceAcceptances)
  
  // Base price from median acceptance
  const basePrice = 29.99
  const acceptanceRatio = stats.median / 100
  const optimal = Math.round(basePrice * acceptanceRatio * 1.2 * 100) / 100
  
  return {
    optimal,
    range: {
      min: Math.round(optimal * 0.85 * 100) / 100,
      max: Math.round(optimal * 1.15 * 100) / 100,
    },
    premium: Math.round(optimal * 1.35 * 100) / 100,
    segments: [
      {
        segment: 'Standard',
        price: optimal,
        reasoning: 'Optimal price based on median acceptance',
      },
      {
        segment: 'Premium',
        price: Math.round(optimal * 1.35 * 100) / 100,
        reasoning: 'For high-income segments',
      },
    ],
  }
}


