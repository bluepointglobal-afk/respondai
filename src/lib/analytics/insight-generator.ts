/**
 * MARKETING-GRADE INSIGHT GENERATOR
 * Generates consultant-level insights with specific, actionable recommendations
 */

import { aiClient, getAIModel, isAIAvailable } from '../ai-client'

interface SyntheticResponse {
  id: string
  demographics: {
    age: number
    gender: string
    income: number
    location: string
    education: string
    occupation: string
    familyStatus: string
  }
  psychographics: {
    motivations: string[]
    concerns: string[]
    values: string[]
    lifestyle: string[]
  }
  behaviors: {
    preferredChannel: string
    categoryUsage: string
    expectedPurchaseTime: string
    researchStyle: string
    influencers: string[]
  }
  purchaseIntent: number
  priceAcceptance: any
  featurePreferences: any
  responseData: any
}

interface Pattern {
  id: string
  title: string
  segment: {
    name: string
    size: number
    characteristics: any
    psychographics?: any
  }
  metrics: {
    purchaseIntent: number
    lift: number
    sampleSize: number
  }
}

interface Insight {
  id: string
  type: 'opportunity' | 'risk' | 'strategy' | 'finding'
  category: 'market' | 'pricing' | 'positioning' | 'segmentation' | 'channel' | 'timing' | 'product'
  priority: 'high' | 'medium' | 'low'
  title: string
  summary: string
  description: string
  evidence: {
    dataPoints: string[]
    sampleSize: number
    confidence: number
    methodology: string
  }
  impact: {
    revenue: string
    timeframe: 'short' | 'medium' | 'long'
    effort: 'low' | 'medium' | 'high'
    priority: 'critical' | 'important' | 'nice-to-have'
  }
  recommendations: Array<{
    action: string
    rationale: string
    timeline: string
    owner: string
    kpis: string[]
  }>
  relatedPatterns: string[]
}

export async function generateMarketingGradeInsights(analysisData: {
  responses: SyntheticResponse[]
  purchaseIntent: any
  patterns: Pattern[]
  pricing: any
  productInfo: any
}): Promise<Insight[]> {
  
  console.log('🧠 Generating marketing-grade insights...')
  
  if (!isAIAvailable()) {
    throw new Error('AI service not available')
  }
  
  const prompt = buildInsightPrompt(analysisData)
  
  console.log(`📊 Insight prompt prepared: ${prompt.length} chars`)
  
  try {
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: 'You are a marketing analyst. Generate 3-5 actionable insights about the market research data. Return ONLY a valid JSON array with this exact structure for each insight: {"id": "unique-id", "type": "opportunity|risk|strategy", "category": "market|pricing|positioning", "priority": "high|medium|low", "title": "Clear title", "summary": "One sentence summary", "description": "Detailed description", "evidence": {"dataPoints": ["stat1", "stat2"], "sampleSize": 500, "confidence": 85}, "impact": {"revenue": "Revenue impact", "timeframe": "short|medium|long", "effort": "low|medium|high", "priority": "critical|important|nice-to-have"}, "recommendations": [{"action": "Specific action", "rationale": "Why this helps", "timeline": "When to do it", "owner": "Who does it", "kpis": ["metric1", "metric2"]}]}'
        },
        {
          role: 'user',
          content: `Product: ${analysisData.productInfo.name}
Description: ${analysisData.productInfo.description}
Target: ${analysisData.productInfo.targetAudience}
Industry: ${analysisData.productInfo.industryCategory}
Purchase Intent: ${analysisData.purchaseIntent.overall.mean}%
Sample Size: ${analysisData.responses.length}
Price: $${analysisData.pricing.optimalPrice}

Generate 3-5 marketing insights. Return ONLY valid JSON array.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let insights: Insight[]
    let jsonContent = content.trim()
    
    try {
      
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/, '').replace(/\n?```$/, '')
      }
      
      // Look for JSON array or object
      const arrayMatch = jsonContent.match(/\[[\s\S]*\]/)
      const objectMatch = jsonContent.match(/\{[\s\S]*\}/)
      
      if (arrayMatch) {
        jsonContent = arrayMatch[0]
      } else if (objectMatch) {
        jsonContent = objectMatch[0]
      }
      
      insights = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('Failed to parse insights response:', content)
      console.error('Parse error:', parseError)
      console.error('Raw content length:', content.length)
      console.error('First 500 chars:', content.substring(0, 500))
      throw new Error('Invalid insights format from AI')
    }

    console.log(`✅ Generated ${insights.length} marketing-grade insights`)
    
    return insights

  } catch (error) {
    console.error('Insight generation error:', error)
    throw error
  }
}

function buildInsightPrompt(analysisData: any): string {
  return `You are a senior marketing strategist analyzing market research data for a new product launch.

PRODUCT CONTEXT:
- Product: ${analysisData.productInfo?.name || 'Unknown Product'}
- Description: ${analysisData.productInfo?.description || 'No description'}
- Target Market: ${analysisData.productInfo?.targetAudience || 'Unknown'}
- Industry: ${analysisData.productInfo?.industry || 'Unknown'}
- Stage: ${analysisData.productInfo?.stage || 'unknown'}

RESEARCH DATA:
- Total Responses: ${analysisData.responses?.length || 0}
- Overall Purchase Intent: ${analysisData.purchaseIntent?.overall?.mean || 0}%
- Price Sensitivity: ${analysisData.pricing?.elasticity || 'Unknown'}
- Optimal Price Point: $${analysisData.pricing?.optimalPrice || 0}

KEY PATTERNS DETECTED:
${(analysisData.patterns || []).slice(0, 10).map((p: any, i: number) => `
${i + 1}. ${p.title}
   - Segment: ${p.segment?.name || 'Unknown'}
   - Purchase Intent: ${p.metrics?.purchaseIntent || 0}%
   - Lift vs. Average: ${p.metrics?.lift?.toFixed(1) || 0}%
   - Sample Size: ${p.metrics?.sampleSize || 0}
`).join('\n')}

DEMOGRAPHIC BREAKDOWN:
${generateDemographicSummary(analysisData.responses || [])}

PSYCHOGRAPHIC BREAKDOWN:
${generatePsychographicSummary(analysisData.responses || [])}

BEHAVIORAL INSIGHTS:
${generateBehavioralSummary(analysisData.responses || [])}

YOUR TASK:
Generate 8-12 DEEP, ACTIONABLE insights that a CMO would pay $50,000 for. Each insight must:

1. **Be Specific**: Use exact numbers, percentages, and data points
2. **Reveal Non-Obvious Patterns**: Go beyond surface-level observations
3. **Be Actionable**: Include clear "what to do about it"
4. **Show Business Impact**: Quantify revenue opportunity or risk
5. **Use Marketing Frameworks**: Reference Jobs-to-be-Done, positioning theory, segmentation best practices

INSIGHT CATEGORIES TO COVER:
1. Market Opportunity (TAM/SAM breakdown with rationale)
2. Pricing Strategy (elasticity analysis, price anchoring opportunities)
3. Positioning & Messaging (what resonates, what doesn't, why)
4. Customer Segmentation (psychographic + behavioral, not just demographic)
5. Competitive Dynamics (implied from feature preferences)
6. Purchase Barriers (objections analysis with mitigation strategies)
7. Channel Strategy (where these customers buy and why)
8. Launch Timing (when to launch based on customer readiness)
9. Risk Factors (what could derail success)
10. Hidden Opportunities (unexpected findings in the data)

FOR EACH INSIGHT, PROVIDE:
{
  "id": "insight-1",
  "type": "opportunity" | "risk" | "strategy" | "finding",
  "category": "market" | "pricing" | "positioning" | "segmentation" | "channel" | "timing" | "product",
  "priority": "high" | "medium" | "low",
  "title": "Compelling headline (8-12 words)",
  "summary": "One-sentence takeaway",
  "description": "3-4 paragraphs with:
    - What the data shows (specific numbers)
    - Why this matters (business context)
    - What's driving this (root cause analysis)
    - What to do about it (actionable recommendations)",
  "evidence": {
    "dataPoints": ["Specific stat 1", "Specific stat 2", "Specific stat 3"],
    "sampleSize": number,
    "confidence": number,
    "methodology": "How this was calculated"
  },
  "impact": {
    "revenue": "Quantified revenue opportunity or risk",
    "timeframe": "short" | "medium" | "long",
    "effort": "low" | "medium" | "high",
    "priority": "critical" | "important" | "nice-to-have"
  },
  "recommendations": [
    {
      "action": "Specific action to take",
      "rationale": "Why this action addresses the insight",
      "timeline": "When to do it",
      "owner": "Who should own this",
      "kpis": ["How to measure success"]
    }
  ],
  "relatedPatterns": ["IDs of related patterns from the data"]
}

CRITICAL REQUIREMENTS:
- Every number must be derived from the actual response data provided
- No generic statements like "customers want quality" - be SPECIFIC
- Every insight must have a "so what?" - why does this matter to the business?
- Use marketing terminology: TAM/SAM/SOM, CAC, LTV, positioning, differentiation, etc.
- Reference psychological principles: loss aversion, social proof, anchoring, etc.
- Think like a strategy consultant, not a data analyst

Return ONLY valid JSON array with 8-12 insights. No markdown, no commentary.`
}

// Helper functions to summarize data
function generateDemographicSummary(responses: SyntheticResponse[]): string {
  if (!responses || responses.length === 0) return 'No demographic data available'
  
  const ageGroups = groupBy(responses, r => getAgeGroup(r.demographics?.age))
  const genderBreakdown = groupBy(responses, r => r.demographics?.gender)
  const incomeGroups = groupBy(responses, r => getIncomeGroup(r.demographics?.income))
  
  return `
Age Distribution:
${Object.entries(ageGroups).map(([group, resps]) => 
  `  ${group}: ${resps.length} (${(resps.length/responses.length*100).toFixed(1)}%) - Avg Intent: ${avgPurchaseIntent(resps)}%`
).join('\n')}

Gender:
${Object.entries(genderBreakdown).map(([gender, resps]) =>
  `  ${gender}: ${resps.length} (${(resps.length/responses.length*100).toFixed(1)}%) - Avg Intent: ${avgPurchaseIntent(resps)}%`
).join('\n')}

Income:
${Object.entries(incomeGroups).map(([group, resps]) =>
  `  ${group}: ${resps.length} (${(resps.length/responses.length*100).toFixed(1)}%) - Avg Intent: ${avgPurchaseIntent(resps)}%`
).join('\n')}
`
}

function generatePsychographicSummary(responses: SyntheticResponse[]): string {
  if (!responses || responses.length === 0) return 'No psychographic data available'
  
  const motivations = extractTopMotivations(responses)
  const concerns = extractTopConcerns(responses)
  const values = extractTopValues(responses)
  
  return `
Top Motivations (from open-ended responses):
${motivations.slice(0, 5).map((m, i) => `  ${i+1}. ${m.motivation} (${m.count} mentions, ${m.avgIntent}% intent)`).join('\n')}

Top Concerns/Barriers:
${concerns.slice(0, 5).map((c, i) => `  ${i+1}. ${c.concern} (${c.count} mentions)`).join('\n')}

Core Values:
${values.slice(0, 5).map((v, i) => `  ${i+1}. ${v.value} (${v.count} mentions)`).join('\n')}
`
}

function generateBehavioralSummary(responses: SyntheticResponse[]): string {
  if (!responses || responses.length === 0) return 'No behavioral data available'
  
  const channelPrefs = groupBy(responses, r => r.behaviors?.preferredChannel)
  const usagePatterns = groupBy(responses, r => r.behaviors?.categoryUsage)
  const purchaseTimeline = groupBy(responses, r => r.behaviors?.expectedPurchaseTime)
  
  return `
Channel Preferences:
${Object.entries(channelPrefs).map(([channel, resps]) =>
  `  ${channel}: ${resps.length} (${(resps.length/responses.length*100).toFixed(1)}%)`
).join('\n')}

Current Category Usage:
${Object.entries(usagePatterns).map(([usage, resps]) =>
  `  ${usage}: ${resps.length} (${(resps.length/responses.length*100).toFixed(1)}%)`
).join('\n')}

Purchase Timeline:
${Object.entries(purchaseTimeline).map(([time, resps]) =>
  `  ${time}: ${resps.length} (${(resps.length/responses.length*100).toFixed(1)}%)`
).join('\n')}
`
}

// Utility functions
function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item) || 'Unknown'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

function getAgeGroup(age: number): string {
  if (age < 25) return '18-24'
  if (age < 35) return '25-34'
  if (age < 45) return '35-44'
  if (age < 55) return '45-54'
  if (age < 65) return '55-64'
  return '65+'
}

function getIncomeGroup(income: number): string {
  if (income < 30000) return '<$30K'
  if (income < 50000) return '$30K-50K'
  if (income < 75000) return '$50K-75K'
  if (income < 100000) return '$75K-100K'
  if (income < 150000) return '$100K-150K'
  return '$150K+'
}

function avgPurchaseIntent(responses: SyntheticResponse[]): number {
  if (!responses || responses.length === 0) return 0
  const total = responses.reduce((sum, r) => sum + (r.purchaseIntent || 0), 0)
  return Math.round(total / responses.length)
}

function extractTopMotivations(responses: SyntheticResponse[]): Array<{motivation: string, count: number, avgIntent: number}> {
  const motivations: Record<string, {count: number, totalIntent: number}> = {}
  
  responses.forEach(response => {
    const motivs = response.psychographics?.motivations || []
    motivs.forEach((motivation: string) => {
      if (!motivations[motivation]) {
        motivations[motivation] = {count: 0, totalIntent: 0}
      }
      motivations[motivation].count++
      motivations[motivation].totalIntent += response.purchaseIntent || 0
    })
  })
  
  return Object.entries(motivations)
    .map(([motivation, data]) => ({
      motivation,
      count: data.count,
      avgIntent: Math.round(data.totalIntent / data.count)
    }))
    .sort((a, b) => b.count - a.count)
}

function extractTopConcerns(responses: SyntheticResponse[]): Array<{concern: string, count: number}> {
  const concerns: Record<string, number> = {}
  
  responses.forEach(response => {
    const concernsList = response.psychographics?.concerns || []
    concernsList.forEach((concern: string) => {
      concerns[concern] = (concerns[concern] || 0) + 1
    })
  })
  
  return Object.entries(concerns)
    .map(([concern, count]) => ({concern, count}))
    .sort((a, b) => b.count - a.count)
}

function extractTopValues(responses: SyntheticResponse[]): Array<{value: string, count: number}> {
  const values: Record<string, number> = {}
  
  responses.forEach(response => {
    const valuesList = response.psychographics?.values || []
    // Ensure valuesList is an array
    const valuesArray = Array.isArray(valuesList) ? valuesList : [valuesList].filter(Boolean)
    valuesArray.forEach((value: string) => {
      if (value && typeof value === 'string') {
        values[value] = (values[value] || 0) + 1
      }
    })
  })
  
  return Object.entries(values)
    .map(([value, count]) => ({value, count}))
    .sort((a, b) => b.count - a.count)
}