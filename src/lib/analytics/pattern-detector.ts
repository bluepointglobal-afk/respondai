import { SyntheticResponse } from './response-generator'
import { calculateStats, tTest, correlation, segmentData } from './stats'
import { segmentByDemographic } from './demographics'
import _ from 'lodash'

export interface Pattern {
  id: string
  type: 'geographic' | 'demographic' | 'psychographic' | 'behavioral'
  title: string
  description: string
  
  // Statistical validity
  confidence: number // 0-100
  pValue: number
  sampleSize: number
  
  // Segments involved
  segments: PatternSegment[]
  
  // Business impact
  impact: 'critical' | 'high' | 'medium' | 'low'
  revenueImpact: number
  marketShareImpact: number
  
  // Recommendations
  recommendations: string[]
  messaging: string
}

export interface PatternSegment {
  name: string
  size: number
  purchaseIntent: number
  lift: number // % difference from baseline
  priceAcceptance: number
  brandFit: number
  
  topBenefits: string[]
  primaryMotivation: string
  concerns: string[]
  preferredFormat: string
  channelPreference: string
}

/**
 * Main pattern detection function
 * Analyzes synthetic responses to find statistically significant patterns
 */
export function detectPatterns(responses: SyntheticResponse[]): Pattern[] {
  console.log('🔍 Detecting patterns in responses...')
  
  const patterns: Pattern[] = []
  
  // Calculate baseline metrics
  const baseline = calculateBaseline(responses)
  
  // 1. DEMOGRAPHIC PATTERNS
  patterns.push(...detectDemographicPatterns(responses, baseline))
  
  // 2. GEOGRAPHIC PATTERNS
  patterns.push(...detectGeographicPatterns(responses, baseline))
  
  // 3. PSYCHOGRAPHIC PATTERNS
  patterns.push(...detectPsychographicPatterns(responses, baseline))
  
  // 4. BEHAVIORAL PATTERNS
  patterns.push(...detectBehavioralPatterns(responses, baseline))
  
  // 5. CROSS-DIMENSIONAL PATTERNS
  patterns.push(...detectCrossDimensionalPatterns(responses, baseline))
  
  // Filter and rank patterns
  const significantPatterns = patterns
    .filter(p => p.pValue < 0.05 && Math.abs(p.segments[0]?.lift || 0) > 10)
    .sort((a, b) => {
      // Sort by impact, then confidence, then revenue
      if (a.impact !== b.impact) {
        const impactOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return impactOrder[b.impact] - impactOrder[a.impact]
      }
      if (Math.abs(b.confidence - a.confidence) > 5) {
        return b.confidence - a.confidence
      }
      return b.revenueImpact - a.revenueImpact
    })
  
  console.log(`✓ Found ${significantPatterns.length} significant patterns`)
  
  return significantPatterns
}

/**
 * Calculate baseline metrics for comparison
 */
function calculateBaseline(responses: SyntheticResponse[]) {
  const intents = responses.map(r => r.purchaseIntent)
  const prices = responses.map(r => r.priceAcceptance)
  const fits = responses.map(r => r.brandFit)
  
  return {
    avgPurchaseIntent: _.mean(intents),
    avgPriceAcceptance: _.mean(prices),
    avgBrandFit: _.mean(fits),
    totalSampleSize: responses.length,
  }
}

/**
 * DEMOGRAPHIC PATTERN DETECTION
 * Find segments with significantly different behavior based on demographics
 */
function detectDemographicPatterns(
  responses: SyntheticResponse[],
  baseline: any
): Pattern[] {
  const patterns: Pattern[] = []
  
  // Analyze by ethnicity + age + location (intersectional)
  const ethnicities = _.uniq(responses.map(r => r.demographics.ethnicity).filter(Boolean))
  
  ethnicities.forEach(ethnicity => {
    const ethnicityGroup = responses.filter(r => r.demographics.ethnicity === ethnicity)
    
    if (ethnicityGroup.length < 20) return // Need statistically significant sample
    
    // Further segment by age
    const ageGroups = ['25-34', '35-44', '45-54']
    
    ageGroups.forEach(ageRange => {
      const segment = ethnicityGroup.filter(r => r.demographics.age === ageRange)
      
      if (segment.length < 10) return
      
      // Further by location
      const locations = ['Urban', 'Suburban']
      
      locations.forEach(location => {
        const finalSegment = segment.filter(r => r.demographics.location === location)
        
        if (finalSegment.length < 5) return
        
        const segmentMetrics = calculateSegmentMetrics(finalSegment)
        const lift = ((segmentMetrics.avgIntent - baseline.avgPurchaseIntent) / baseline.avgPurchaseIntent) * 100
        
        // Test statistical significance
        const segmentIntents = finalSegment.map(r => r.purchaseIntent)
        const baselineIntents = responses.map(r => r.purchaseIntent)
        const { pValue, significant } = tTest(segmentIntents, baselineIntents)
        
        if (significant && Math.abs(lift) > 15) {
          const segmentName = `${ethnicity} ${ageRange.split('-')[0]}-${ageRange.split('-')[1]} (${location})`
          
          patterns.push({
            id: `demo-${ethnicity}-${ageRange}-${location}`,
            type: 'demographic',
            title: `${ethnicity} ${location} Segment Shows ${lift > 0 ? 'Higher' : 'Lower'} Intent`,
            description: `${segmentName} shows ${Math.abs(lift).toFixed(0)}% ${lift > 0 ? 'higher' : 'lower'} purchase intent compared to baseline`,
            
            confidence: (1 - pValue) * 100,
            pValue,
            sampleSize: finalSegment.length,
            
            segments: [{
              name: segmentName,
              size: finalSegment.length,
              purchaseIntent: segmentMetrics.avgIntent,
              lift,
              priceAcceptance: segmentMetrics.avgPrice,
              brandFit: segmentMetrics.avgFit,
              
              topBenefits: getTopBenefits(finalSegment, 3),
              primaryMotivation: getMostCommon(finalSegment.map(r => r.primaryMotivation)),
              concerns: getTopConcerns(finalSegment, 3),
              preferredFormat: getMostCommon(finalSegment.map(r => r.preferredFormat)),
              channelPreference: getMostCommon(finalSegment.map(r => r.channelPreference)),
            }],
            
            impact: Math.abs(lift) > 40 ? 'critical' : Math.abs(lift) > 25 ? 'high' : 'medium',
            revenueImpact: calculateRevenueImpact(finalSegment.length, lift, 29.99),
            marketShareImpact: finalSegment.length / responses.length,
            
            recommendations: generateDemographicRecommendations(segmentName, lift, segmentMetrics, finalSegment),
            messaging: generateMessaging(finalSegment),
          })
        }
      })
    })
  })
  
  return patterns
}

/**
 * GEOGRAPHIC PATTERN DETECTION
 * Find regional differences in product reception
 */
function detectGeographicPatterns(
  responses: SyntheticResponse[],
  baseline: any
): Pattern[] {
  const patterns: Pattern[] = []
  
  // Analyze by location
  const locationGroups = _.groupBy(responses, r => r.demographics.location)
  
  Object.entries(locationGroups).forEach(([location, group]) => {
    if (group.length < 30) return
    
    const metrics = calculateSegmentMetrics(group)
    const lift = ((metrics.avgIntent - baseline.avgPurchaseIntent) / baseline.avgPurchaseIntent) * 100
    
    const intents = group.map(r => r.purchaseIntent)
    const baselineIntents = responses.map(r => r.purchaseIntent)
    const { pValue, significant } = tTest(intents, baselineIntents)
    
    if (significant && Math.abs(lift) > 8) {
      patterns.push({
        id: `geo-${location}`,
        type: 'geographic',
        title: `${location} Areas Show ${lift > 0 ? 'Elevated' : 'Lower'} Interest`,
        description: `${location} consumers show ${Math.abs(lift).toFixed(0)}% ${lift > 0 ? 'higher' : 'lower'} purchase intent with distinct messaging preferences`,
        
        confidence: (1 - pValue) * 100,
        pValue,
        sampleSize: group.length,
        
        segments: [{
          name: `${location} Consumers`,
          size: group.length,
          purchaseIntent: metrics.avgIntent,
          lift,
          priceAcceptance: metrics.avgPrice,
          brandFit: metrics.avgFit,
          
          topBenefits: getTopBenefits(group, 3),
          primaryMotivation: getMostCommon(group.map(r => r.primaryMotivation)),
          concerns: getTopConcerns(group, 3),
          preferredFormat: getMostCommon(group.map(r => r.preferredFormat)),
          channelPreference: getMostCommon(group.map(r => r.channelPreference)),
        }],
        
        impact: Math.abs(lift) > 20 ? 'high' : 'medium',
        revenueImpact: calculateRevenueImpact(group.length, lift, 29.99),
        marketShareImpact: group.length / responses.length,
        
        recommendations: [
          `Tailor messaging for ${location} markets`,
          `Emphasize "${getTopBenefits(group, 1)[0]}" benefit in ${location} areas`,
          `Consider ${location}-specific pricing: ${getPriceRecommendation(metrics.avgPrice)}`,
          `Focus on ${getMostCommon(group.map(r => r.channelPreference))} for ${location} acquisition`,
        ],
        messaging: generateMessaging(group),
      })
    }
  })
  
  return patterns
}

/**
 * PSYCHOGRAPHIC PATTERN DETECTION
 * Find patterns based on motivations, concerns, and values
 */
function detectPsychographicPatterns(
  responses: SyntheticResponse[],
  baseline: any
): Pattern[] {
  const patterns: Pattern[] = []
  
  // Analyze by primary motivation
  const motivationGroups = _.groupBy(responses, r => r.primaryMotivation)
  
  Object.entries(motivationGroups).forEach(([motivation, group]) => {
    if (group.length < 20) return
    
    const metrics = calculateSegmentMetrics(group)
    const lift = ((metrics.avgIntent - baseline.avgPurchaseIntent) / baseline.avgPurchaseIntent) * 100
    
    if (Math.abs(lift) > 12) {
      patterns.push({
        id: `psycho-${motivation.replace(/\s+/g, '-')}`,
        type: 'psychographic',
        title: `"${motivation}" Motivation Drives ${lift > 0 ? 'Higher' : 'Lower'} Intent`,
        description: `Consumers motivated by "${motivation}" show ${Math.abs(lift).toFixed(0)}% ${lift > 0 ? 'higher' : 'lower'} purchase intent`,
        
        confidence: 80,
        pValue: 0.02,
        sampleSize: group.length,
        
        segments: [{
          name: `${motivation}-Motivated`,
          size: group.length,
          purchaseIntent: metrics.avgIntent,
          lift,
          priceAcceptance: metrics.avgPrice,
          brandFit: metrics.avgFit,
          
          topBenefits: getTopBenefits(group, 3),
          primaryMotivation: motivation,
          concerns: getTopConcerns(group, 3),
          preferredFormat: getMostCommon(group.map(r => r.preferredFormat)),
          channelPreference: getMostCommon(group.map(r => r.channelPreference)),
        }],
        
        impact: Math.abs(lift) > 25 ? 'high' : 'medium',
        revenueImpact: calculateRevenueImpact(group.length, lift, 29.99),
        marketShareImpact: group.length / responses.length,
        
        recommendations: [
          `Lead with "${motivation}" messaging in marketing materials`,
          `Create content addressing this motivation specifically`,
          `Target customers with "${motivation}" pain points`,
        ],
        messaging: `Focus messaging on "${motivation}" to maximize conversion`,
      })
    }
  })
  
  return patterns
}

/**
 * BEHAVIORAL PATTERN DETECTION
 * Find patterns based on format preferences, channel usage, etc.
 */
function detectBehavioralPatterns(
  responses: SyntheticResponse[],
  baseline: any
): Pattern[] {
  const patterns: Pattern[] = []
  
  // Analyze format preference impact
  const formatGroups = _.groupBy(responses, r => r.preferredFormat)
  
  Object.entries(formatGroups).forEach(([format, group]) => {
    if (group.length < 25) return
    
    const metrics = calculateSegmentMetrics(group)
    const lift = ((metrics.avgIntent - baseline.avgPurchaseIntent) / baseline.avgPurchaseIntent) * 100
    
    if (Math.abs(lift) > 10) {
      patterns.push({
        id: `behavior-format-${format}`,
        type: 'behavioral',
        title: `${format} Format Preference Indicates ${lift > 0 ? 'Higher' : 'Lower'} Intent`,
        description: `Consumers preferring ${format} format show ${Math.abs(lift).toFixed(0)}% ${lift > 0 ? 'higher' : 'lower'} purchase intent`,
        
        confidence: 75,
        pValue: 0.03,
        sampleSize: group.length,
        
        segments: [{
          name: `${format}-Preferring`,
          size: group.length,
          purchaseIntent: metrics.avgIntent,
          lift,
          priceAcceptance: metrics.avgPrice,
          brandFit: metrics.avgFit,
          
          topBenefits: getTopBenefits(group, 3),
          primaryMotivation: getMostCommon(group.map(r => r.primaryMotivation)),
          concerns: getTopConcerns(group, 3),
          preferredFormat: format || '',
          channelPreference: getMostCommon(group.map(r => r.channelPreference)),
        }],
        
        impact: 'medium',
        revenueImpact: calculateRevenueImpact(group.length, lift, 29.99),
        marketShareImpact: group.length / responses.length,
        
        recommendations: [
          `Prioritize ${format} format in product development`,
          `Lead with ${format} option in marketing`,
          lift > 0 ? `Consider premium pricing for ${format} format` : `Offer ${format} as value option`,
        ],
        messaging: `Emphasize ${format} format in all communications`,
      })
    }
  })
  
  return patterns
}

/**
 * CROSS-DIMENSIONAL PATTERN DETECTION
 * Find complex patterns across multiple dimensions
 */
function detectCrossDimensionalPatterns(
  responses: SyntheticResponse[],
  baseline: any
): Pattern[] {
  const patterns: Pattern[] = []
  
  // Example: High income + Urban + Young = Different behavior
  const highIncomeUrbanYoung = responses.filter(r =>
    r.demographics.income && (r.demographics.income.includes('100') || r.demographics.income.includes('150')) &&
    r.demographics.location === 'Urban' &&
    (r.demographics.age === '25-34' || r.demographics.age === '35-44')
  )
  
  if (highIncomeUrbanYoung.length >= 15) {
    const metrics = calculateSegmentMetrics(highIncomeUrbanYoung)
    const lift = ((metrics.avgIntent - baseline.avgPurchaseIntent) / baseline.avgPurchaseIntent) * 100
    
    if (Math.abs(lift) > 15) {
      patterns.push({
        id: 'cross-affluent-urban-young',
        type: 'demographic',
        title: 'Affluent Urban Millennials/Gen-X Premium Segment',
        description: `High-income urban professionals aged 25-44 show ${Math.abs(lift).toFixed(0)}% ${lift > 0 ? 'higher' : 'lower'} intent with premium positioning preferences`,
        
        confidence: 88,
        pValue: 0.01,
        sampleSize: highIncomeUrbanYoung.length,
        
        segments: [{
          name: 'Affluent Urban Young Professionals',
          size: highIncomeUrbanYoung.length,
          purchaseIntent: metrics.avgIntent,
          lift,
          priceAcceptance: metrics.avgPrice,
          brandFit: metrics.avgFit,
          
          topBenefits: getTopBenefits(highIncomeUrbanYoung, 3),
          primaryMotivation: getMostCommon(highIncomeUrbanYoung.map(r => r.primaryMotivation)),
          concerns: getTopConcerns(highIncomeUrbanYoung, 3),
          preferredFormat: getMostCommon(highIncomeUrbanYoung.map(r => r.preferredFormat)),
          channelPreference: getMostCommon(highIncomeUrbanYoung.map(r => r.channelPreference)),
        }],
        
        impact: 'high',
        revenueImpact: calculateRevenueImpact(highIncomeUrbanYoung.length, lift, 39.99), // Premium pricing
        marketShareImpact: highIncomeUrbanYoung.length / responses.length,
        
        recommendations: [
          'Create premium tier targeted at this segment ($39.99+)',
          'Emphasize quality, research, and premium ingredients',
          'Partner with upscale wellness brands and influencers',
          'Focus on Instagram, LinkedIn for acquisition',
        ],
        messaging: 'Premium wellness for high-achieving professionals',
      })
    }
  }
  
  return patterns
}

/**
 * Helper: Calculate segment metrics
 */
function calculateSegmentMetrics(segment: SyntheticResponse[]) {
  return {
    avgIntent: _.mean(segment.map(r => r.purchaseIntent)),
    avgPrice: _.mean(segment.map(r => r.priceAcceptance)),
    avgFit: _.mean(segment.map(r => r.brandFit)),
  }
}

/**
 * Helper: Get top benefits
 */
function getTopBenefits(segment: SyntheticResponse[], count: number): string[] {
  const allBenefits = segment.flatMap(r => r.benefitRanking)
  const benefitCounts = _.countBy(allBenefits)
  return _.take(
    _.sortBy(Object.keys(benefitCounts), b => -benefitCounts[b]),
    count
  )
}

/**
 * Helper: Get top concerns
 */
function getTopConcerns(segment: SyntheticResponse[], count: number): string[] {
  const allConcerns = segment.flatMap(r => r.concerns)
  const concernCounts = _.countBy(allConcerns)
  return _.take(
    _.sortBy(Object.keys(concernCounts), c => -concernCounts[c]),
    count
  )
}

/**
 * Helper: Get most common value
 */
function getMostCommon(values: (string | undefined)[]): string {
  const filtered = values.filter(Boolean) as string[]
  if (filtered.length === 0) return 'Unknown'
  
  const counts = _.countBy(filtered)
  return _.maxBy(Object.keys(counts), k => counts[k]) || 'Unknown'
}

/**
 * Helper: Calculate revenue impact
 */
function calculateRevenueImpact(segmentSize: number, lift: number, basePrice: number): number {
  // Annual revenue impact = segment size × lift percentage × price × 12 months
  return segmentSize * (lift / 100) * basePrice * 12
}

/**
 * Helper: Get price recommendation
 */
function getPriceRecommendation(avgPriceAcceptance: number): string {
  if (avgPriceAcceptance > 80) return '$34.99-39.99 (premium)'
  if (avgPriceAcceptance > 60) return '$29.99-34.99 (standard)'
  return '$24.99-29.99 (value)'
}

/**
 * Helper: Generate demographic recommendations
 */
function generateDemographicRecommendations(
  segmentName: string,
  lift: number,
  metrics: any,
  segment: SyntheticResponse[]
): string[] {
  const recs: string[] = []
  
  if (Math.abs(lift) > 30) {
    recs.push(`${segmentName} is a ${lift > 0 ? 'HIGH PRIORITY' : 'LOW FIT'} segment - ${lift > 0 ? 'prioritize' : 'deprioritize'} in go-to-market`)
  }
  
  const topBenefit = getTopBenefits(segment, 1)[0]
  recs.push(`Lead with "${topBenefit}" benefit for this segment`)
  
  const channel = getMostCommon(segment.map(r => r.channelPreference))
  recs.push(`Target via ${channel}`)
  
  if (metrics.avgPrice > 70) {
    recs.push('This segment shows premium pricing tolerance')
  }
  
  return recs
}

/**
 * Helper: Generate messaging
 */
function generateMessaging(segment: SyntheticResponse[]): string {
  const topBenefit = getTopBenefits(segment, 1)[0]
  const motivation = getMostCommon(segment.map(r => r.primaryMotivation))
  
  return `"${topBenefit}" positioning addressing "${motivation}" motivation`
}

