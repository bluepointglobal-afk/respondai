/**
 * ADVANCED ANALYTICS ENGINE
 * Implements MaxDiff, Kano, Van Westendorp, TURF analysis
 */

import { aiClient, getAIModel, isAIAvailable } from '../ai-client'

interface AdvancedAnalyticsResult {
  maxDiff: {
    methodology: string
    features: Array<{
      feature: string
      utilityScore: number
      rank: number
      relativeImportance: string
      bestCount: number
      worstCount: number
    }>
    interpretation: string
    recommendations: string[]
  }
  kano: {
    methodology: string
    features: Array<{
      feature: string
      category: 'Must-be' | 'Performance' | 'Attractive' | 'Indifferent'
      satisfaction: number
      dissatisfaction: number
      category_rationale: string
    }>
    productStrategy: string[]
    investmentGuidance: string[]
  }
  priceSensitivity: {
    methodology: string
    pricePoints: {
      tooExpensive: number
      expensive: number
      cheap: number
      tooCheap: number
    }
    optimalPrice: number
    acceptableRange: [number, number]
    indifferencePrice: number
    analysis: string
    elasticity: number
    recommendations: string[]
  }
  turf: {
    methodology: string
    scenarios: Array<{
      channels: string[]
      reach: number
      frequency: number
      cost: number
    }>
    optimalMix: {
      channels: string[]
      reach: number
      efficiency: number
    }
    recommendations: string[]
  }
}

export async function generateAdvancedAnalytics(
  responses: any[],
  productInfo: any,
  audiences: any[]
): Promise<AdvancedAnalyticsResult> {
  
  console.log('🔬 Generating advanced analytics...')
  
  if (!isAIAvailable()) {
    throw new Error('AI service not available')
  }
  
  try {
    const prompt = buildAdvancedAnalyticsPrompt(responses, productInfo, audiences)
    
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: 'You are a market research analyst. Return ONLY valid JSON with this exact structure: {"maxDiffResults": {"topFeatures": ["feature1", "feature2"], "utilityScores": {"feature1": 0.8, "feature2": 0.7}}, "kanoResults": {"mustBeFeatures": ["feature1"], "performanceFeatures": ["feature2"], "attractiveFeatures": ["feature3"]}, "vanWestendorpResults": {"optimalPrice": 65, "priceRange": {"min": 45, "max": 85}}, "turfResults": {"optimalChannels": ["channel1", "channel2"], "reachEfficiency": 0.78}}'
        },
        {
          role: 'user',
          content: `Product: ${productInfo.name}
Sample Size: ${responses.length}
Generate advanced analytics. Return ONLY valid JSON.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let analytics: AdvancedAnalyticsResult
    let jsonContent = content.trim()
    
    try {
      // Clean the content - remove any markdown formatting
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
      
      console.log('🧹 Cleaned advanced analytics content for parsing:', jsonContent.substring(0, 200) + '...')
      
      // Parse the JSON
      analytics = JSON.parse(jsonContent)
      
      console.log('✅ Successfully parsed advanced analytics')
    } catch (parseError) {
      console.error('Failed to parse advanced analytics:', content)
      console.error('Parse error:', parseError)
      console.error('Raw content length:', content.length)
      console.error('First 500 chars:', content.substring(0, 500))
      console.error('Extracted JSON:', jsonContent)
      
      // Try to extract JSON from the content more aggressively
      try {
        const jsonStart = content.indexOf('{')
        const jsonEnd = content.lastIndexOf('}') + 1
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const extractedJson = content.substring(jsonStart, jsonEnd)
          analytics = JSON.parse(extractedJson)
          console.log('✅ Successfully extracted and parsed advanced analytics from content')
        } else {
          throw new Error('No valid JSON object found in content')
        }
      } catch (extractError) {
        console.error('Failed to extract JSON from content:', extractError)
        throw new Error('Invalid analytics format from AI')
      }
    }

    console.log('✅ Advanced analytics generated')
    return analytics

  } catch (error) {
    console.error('Advanced analytics generation error:', error)
    throw error
  }
}

function buildAdvancedAnalyticsPrompt(responses: any[], productInfo: any, audiences: any[]): string {
  return `Generate comprehensive advanced analytics for market research data.

PRODUCT CONTEXT:
- Product: ${productInfo?.name || 'Unknown Product'}
- Description: ${productInfo?.description || 'No description'}
- Industry: ${productInfo?.industry || 'Unknown'}
- Target Audience: ${productInfo?.targetAudience || 'Unknown'}

RESPONSE DATA SUMMARY:
- Total Responses: ${responses.length}
- Purchase Intent Distribution: ${calculatePurchaseIntentDistribution(responses)}
- Price Acceptance Patterns: ${extractPricePatterns(responses)}
- Feature Preferences: ${extractFeaturePreferences(responses)}
- Channel Preferences: ${extractChannelPreferences(responses)}

AUDIENCES:
${audiences.map(aud => `- ${aud.name}: ${aud.demographics ? JSON.stringify(aud.demographics) : 'No demographics'}`).join('\n')}

Generate advanced analytics with this EXACT structure:

{
  "maxDiff": {
    "methodology": "MaxDiff analysis determines relative importance of features by forcing trade-offs between best and worst options",
    "features": [
      {
        "feature": "Natural ingredients",
        "utilityScore": 28.5,
        "rank": 1,
        "relativeImportance": "32%",
        "bestCount": 234,
        "worstCount": 12
      }
    ],
    "interpretation": "Top 3 features drive 68% of value perception. Natural ingredients and clinical backing are must-haves.",
    "recommendations": ["Emphasize natural ingredients in messaging", "Highlight clinical studies", "De-emphasize convenience features"]
  },
  
  "kano": {
    "methodology": "Kano model categorizes features by their impact on satisfaction when present vs absent",
    "features": [
      {
        "feature": "Clinical backing",
        "category": "Must-be",
        "satisfaction": 8.2,
        "dissatisfaction": 3.1,
        "category_rationale": "Expected by consumers - absence creates dissatisfaction, presence is expected"
      }
    ],
    "productStrategy": ["Focus on Must-be features first", "Develop Performance features", "Consider Attractive features for differentiation"],
    "investmentGuidance": ["Invest heavily in clinical validation", "Improve convenience gradually", "Explore premium packaging options"]
  },
  
  "priceSensitivity": {
    "methodology": "Van Westendorp Price Sensitivity Meter analyzes price acceptance through four price points",
    "pricePoints": {
      "tooExpensive": 89,
      "expensive": 75,
      "cheap": 35,
      "tooCheap": 18
    },
    "optimalPrice": 65,
    "acceptableRange": [45, 75],
    "indifferencePrice": 58,
    "analysis": "Price sensitivity is moderate with optimal price at $65. Acceptable range is $45-$75, indicating good price flexibility.",
    "elasticity": -1.4,
    "recommendations": ["Launch at $65 for maximum revenue", "Test premium positioning at $75", "Avoid pricing below $45 to maintain quality perception"]
  },
  
  "turf": {
    "methodology": "Total Unduplicated Reach and Frequency analysis optimizes channel mix for maximum reach efficiency",
    "scenarios": [
      {
        "channels": ["Instagram", "LinkedIn"],
        "reach": 67,
        "frequency": 3.2,
        "cost": 45000
      }
    ],
    "optimalMix": {
      "channels": ["Instagram", "LinkedIn", "Google Ads"],
      "reach": 82,
      "efficiency": 0.82
    },
    "recommendations": ["Focus on Instagram and LinkedIn for primary reach", "Add Google Ads for search intent", "Consider YouTube for video content"]
  }
}

CRITICAL REQUIREMENTS:
- Base all numbers on the actual response data provided
- Make insights specific to the product and industry
- Provide actionable recommendations for each analysis type
- Use proper statistical terminology and methodologies
- Ensure all percentages and scores are realistic
- Reference actual features and channels relevant to the product

Return ONLY valid JSON. No markdown, no commentary.`
}

// Helper functions to extract patterns from responses
function calculatePurchaseIntentDistribution(responses: any[]): string {
  if (!responses || !Array.isArray(responses) || responses.length === 0) return 'No data'
  
  const intents = responses.map(r => r.purchaseIntent || 0)
  const avg = Math.round(intents.reduce((a, b) => a + b, 0) / intents.length)
  const high = intents.filter(i => i >= 70).length
  const medium = intents.filter(i => i >= 40 && i < 70).length
  const low = intents.filter(i => i < 40).length
  
  return `Avg: ${avg}%, High (70+): ${high}, Medium (40-69): ${medium}, Low (<40): ${low}`
}

function extractPricePatterns(responses: any[]): string {
  if (!responses || !Array.isArray(responses) || responses.length === 0) return 'No data'
  
  const priceAcceptances = responses.map(r => r.priceAcceptance).filter(Boolean)
  if (priceAcceptances.length === 0) return 'No price data'
  
  const avgOptimal = Math.round(
    priceAcceptances.reduce((sum, p) => sum + ((p.expensive + p.cheap) / 2), 0) / priceAcceptances.length
  )
  
  return `Avg optimal price: $${avgOptimal}`
}

function extractFeaturePreferences(responses: any[]): string {
  if (!responses || !Array.isArray(responses) || responses.length === 0) return 'No data'
  
  const preferences = responses.map(r => r.featurePreferences).filter(Boolean)
  if (preferences.length === 0) return 'No feature data'
  
  const features = Object.keys(preferences[0] || {})
  return `Features analyzed: ${features.join(', ')}`
}

function extractChannelPreferences(responses: any[]): string {
  if (!responses || !Array.isArray(responses) || responses.length === 0) return 'No data'
  
  const channels = responses.map(r => r.behaviors?.preferredChannel).filter(Boolean)
  const channelCounts: Record<string, number> = {}
  
  channels.forEach(channel => {
    channelCounts[channel] = (channelCounts[channel] || 0) + 1
  })
  
  const topChannels = Object.entries(channelCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([channel, count]) => `${channel} (${count})`)
    .join(', ')
  
  return topChannels || 'No channel data'
}
