import { NextRequest, NextResponse } from 'next/server'
import { generateMarketingGradeInsights } from '@/lib/analytics/insight-generator'
import { generateRichPersonas } from '@/lib/personas/persona-generator'
import { generateStrategicRecommendations } from '@/lib/recommendations/recommendation-generator'
import { generateExecutiveSummary } from '@/lib/analytics/executive-summary-generator'
import { generateAdvancedAnalytics } from '@/lib/analytics/advanced-analytics'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Starting AI engine test...')
    
    // Test data
    const testData = {
      productInfo: {
        name: "Turmeric supplement for Men with joint pain",
        description: "Turmeric supplement for Men with joint pain",
        industry: "supplement",
        stage: "idea",
        targetAudience: "Men 30 - 65 in USA active professionals"
      },
      responses: Array.from({ length: 500 }, (_, i) => ({
        id: `response_${i}`,
        demographics: {
          age: 30 + (i % 35),
          gender: i % 2 === 0 ? 'Male' : 'Female',
          income: ['$25K-$50K', '$50K-$75K', '$75K-$100K', '$100K+'][i % 4],
          location: ['Urban', 'Suburban', 'Rural'][i % 3]
        },
        psychographics: {
          lifestyle: ['Professional', 'Active', 'Health-conscious'][i % 3],
          values: ['Quality', 'Innovation', 'Health'][i % 3],
          painPoints: ['Joint pain', 'Time constraints', 'Quality concerns'][i % 3]
        },
        behaviors: {
          preferredChannel: ['Online', 'Retail', 'Healthcare provider'][i % 3],
          categoryUsage: ['Current user', 'Former user', 'Never used'][i % 3],
          expectedPurchaseTime: ['Immediate', 'Within 3 months', 'Within 6 months'][i % 3]
        },
        purchaseIntent: 40 + (i % 40), // 40-80% range
        priceAcceptance: {
          min: 20 + (i % 30),
          max: 80 + (i % 40),
          optimal: 50 + (i % 30)
        },
        brandFit: 5 + (i % 5), // 5-10 range
        featurePreferences: {
          quality: 8 + (i % 3),
          price: 6 + (i % 4),
          convenience: 7 + (i % 3)
        }
      })),
      purchaseIntent: {
        overall: { mean: 60, median: 60, stdDev: 15 }
      },
      patterns: [
        {
          id: 'pattern-1',
          type: 'demographic',
          title: 'Primary Target Segment',
          description: 'Main demographic group showing highest purchase intent',
          segment: {
            name: 'Health-Conscious Professionals',
            size: 300,
            characteristics: {
              age: '30-45',
              income: '$50K-$100K',
              location: 'Urban/Suburban'
            }
          },
          metrics: {
            purchaseIntent: 60,
            lift: 15,
            pValue: 0.05
          },
          impactScore: 8.5
        }
      ],
      pricing: {
        optimalPrice: 65,
        elasticity: -1.4,
        priceRange: { min: 45, max: 85 }
      },
      validationGoals: ['Product-Market Fit', 'Price Sensitivity', 'Target Audience Validation']
    }

    console.log('📊 DEBUG: Test data prepared:', {
      responses: testData.responses.length,
      purchaseIntent: testData.purchaseIntent.overall.mean,
      patterns: testData.patterns.length
    })

    // Test each AI generator
    const results = {
      insights: null,
      personas: null,
      recommendations: null,
      executiveSummary: null,
      advancedAnalytics: null,
      errors: []
    }

    try {
      console.log('🧠 DEBUG: Testing insights generator...')
      results.insights = await generateMarketingGradeInsights({
        responses: testData.responses,
        purchaseIntent: testData.purchaseIntent,
        patterns: testData.patterns,
        pricing: testData.pricing,
        productInfo: testData.productInfo
      })
      console.log('✅ DEBUG: Insights generated:', results.insights?.length || 0)
    } catch (error) {
      console.error('❌ DEBUG: Insights error:', error)
      results.errors.push({ component: 'insights', error: error.message })
    }

    try {
      console.log('👥 DEBUG: Testing personas generator...')
      results.personas = await generateRichPersonas({
        patterns: testData.patterns,
        responses: testData.responses,
        audiences: []
      })
      console.log('✅ DEBUG: Personas generated:', results.personas?.length || 0)
    } catch (error) {
      console.error('❌ DEBUG: Personas error:', error)
      results.errors.push({ component: 'personas', error: error.message })
    }

    try {
      console.log('📋 DEBUG: Testing recommendations generator...')
      results.recommendations = await generateStrategicRecommendations({
        insights: results.insights || [],
        patterns: testData.patterns,
        purchaseIntent: testData.purchaseIntent,
        pricing: testData.pricing,
        validationGoals: testData.validationGoals
      })
      console.log('✅ DEBUG: Recommendations generated:', results.recommendations?.length || 0)
    } catch (error) {
      console.error('❌ DEBUG: Recommendations error:', error)
      results.errors.push({ component: 'recommendations', error: error.message })
    }

    try {
      console.log('📊 DEBUG: Testing executive summary generator...')
      results.executiveSummary = await generateExecutiveSummary({
        productInfo: testData.productInfo,
        purchaseIntent: testData.purchaseIntent,
        insights: results.insights || [],
        personas: results.personas || [],
        recommendations: results.recommendations || [],
        pricing: testData.pricing,
        sampleSize: testData.responses.length
      })
      console.log('✅ DEBUG: Executive summary generated')
    } catch (error) {
      console.error('❌ DEBUG: Executive summary error:', error)
      results.errors.push({ component: 'executiveSummary', error: error.message })
    }

    try {
      console.log('🔬 DEBUG: Testing advanced analytics generator...')
      results.advancedAnalytics = await generateAdvancedAnalytics(
        testData.responses,
        testData.productInfo,
        [] // audiences parameter
      )
      console.log('✅ DEBUG: Advanced analytics generated')
    } catch (error) {
      console.error('❌ DEBUG: Advanced analytics error:', error)
      results.errors.push({ component: 'advancedAnalytics', error: error.message })
    }

    console.log('🎯 DEBUG: All tests completed')
    console.log('📈 DEBUG: Results summary:', {
      insights: results.insights?.length || 0,
      personas: results.personas?.length || 0,
      recommendations: results.recommendations?.length || 0,
      executiveSummary: results.executiveSummary ? 'Generated' : 'Failed',
      advancedAnalytics: results.advancedAnalytics ? 'Generated' : 'Failed',
      errors: results.errors.length
    })

    return NextResponse.json({
      success: true,
      message: 'AI Engine Debug Complete',
      results: {
        insights: results.insights,
        personas: results.personas,
        recommendations: results.recommendations,
        executiveSummary: results.executiveSummary,
        advancedAnalytics: results.advancedAnalytics,
        errors: results.errors
      },
      summary: {
        totalInsights: results.insights?.length || 0,
        totalPersonas: results.personas?.length || 0,
        totalRecommendations: results.recommendations?.length || 0,
        hasExecutiveSummary: !!results.executiveSummary,
        hasAdvancedAnalytics: !!results.advancedAnalytics,
        errorCount: results.errors.length
      }
    })

  } catch (error) {
    console.error('❌ DEBUG: Fatal error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}