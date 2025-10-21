import { NextRequest, NextResponse } from 'next/server'
import { generateMarketingGradeInsights } from '@/lib/analytics/insight-generator'
import { generateRichPersonas } from '@/lib/personas/persona-generator'
import { generateStrategicRecommendations } from '@/lib/recommendations/recommendation-generator'
import { generateAdvancedAnalytics } from '@/lib/analytics/advanced-analytics'
import { generateExecutiveSummary } from '@/lib/analytics/executive-summary-generator'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Starting AI prompt and response capture...')
    
    // Mock data to test AI prompts
    const mockData = {
      responses: [
        {
          demographics: { age: 35, gender: 'male', income: 'middle' },
          psychographics: { values: ['innovation', 'quality'] },
          behaviors: { preferredChannel: 'online', categoryUsage: 'regular' },
          purchaseIntent: 7,
          priceAcceptance: 65,
          brandFit: 8,
          featurePreferences: ['quality', 'convenience']
        }
      ],
      purchaseIntent: { overall: { mean: 57, median: 57, stdDev: 2.1 } },
      patterns: [
        {
          id: 'pattern-1',
          type: 'demographic',
          title: 'Primary Target Segment',
          segment: { name: 'Health-Conscious Professionals', size: 300 },
          metrics: { purchaseIntent: 57, lift: 15, sampleSize: 300 }
        }
      ],
      pricing: { elasticity: 0.8, optimalPrice: 65 },
      productInfo: {
        name: 'Grass fed protein whey ultra purified',
        description: 'Grass fed protein wey ulta purified',
        targetAudience: 'Men 30 - 65 in USA active professionals',
        industryCategory: 'supplement',
        stage: 'idea'
      },
      audiences: [
        {
          id: 'audience-1',
          name: 'Primary Target Audience',
          demographics: { age: { min: 25, max: 45 }, gender: 'any' },
          psychographics: { values: ['innovation', 'quality'] }
        }
      ]
    }

    const results = {
      insights: null,
      personas: null,
      recommendations: null,
      advancedAnalytics: null,
      executiveSummary: null
    }

    const debugInfo = {
      prompts: {},
      responses: {},
      errors: {}
    }

    // Test Insights Generator
    try {
      console.log('🧠 Testing Insights Generator...')
      const insightsResult = await generateMarketingGradeInsights(mockData)
      results.insights = insightsResult
      debugInfo.responses.insights = insightsResult
      console.log('✅ Insights generated successfully')
    } catch (error) {
      console.error('❌ Insights error:', error)
      debugInfo.errors.insights = error.message
    }

    // Test Personas Generator
    try {
      console.log('👥 Testing Personas Generator...')
      const personasResult = await generateRichPersonas(mockData)
      results.personas = personasResult
      debugInfo.responses.personas = personasResult
      console.log('✅ Personas generated successfully')
    } catch (error) {
      console.error('❌ Personas error:', error)
      debugInfo.errors.personas = error.message
    }

    // Test Recommendations Generator
    try {
      console.log('📋 Testing Recommendations Generator...')
      const recommendationsResult = await generateStrategicRecommendations(mockData)
      results.recommendations = recommendationsResult
      debugInfo.responses.recommendations = recommendationsResult
      console.log('✅ Recommendations generated successfully')
    } catch (error) {
      console.error('❌ Recommendations error:', error)
      debugInfo.errors.recommendations = error.message
    }

    // Test Advanced Analytics Generator
    try {
      console.log('📊 Testing Advanced Analytics Generator...')
      const advancedResult = await generateAdvancedAnalytics(mockData.responses, mockData.audiences)
      results.advancedAnalytics = advancedResult
      debugInfo.responses.advancedAnalytics = advancedResult
      console.log('✅ Advanced Analytics generated successfully')
    } catch (error) {
      console.error('❌ Advanced Analytics error:', error)
      debugInfo.errors.advancedAnalytics = error.message
    }

    // Test Executive Summary Generator
    try {
      console.log('📄 Testing Executive Summary Generator...')
      const summaryResult = await generateExecutiveSummary(mockData)
      results.executiveSummary = summaryResult
      debugInfo.responses.executiveSummary = summaryResult
      console.log('✅ Executive Summary generated successfully')
    } catch (error) {
      console.error('❌ Executive Summary error:', error)
      debugInfo.errors.executiveSummary = error.message
    }

    return NextResponse.json({
      success: true,
      message: 'AI Debug completed',
      mockData,
      results,
      debugInfo,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Debug endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
