import { NextRequest, NextResponse } from 'next/server'
import { runCompleteAnalysis } from '@/lib/analytics/orchestrator'
import type { IndustryCategory } from '@/lib/config/industries'
import type { Persona } from '@/lib/types/test'
import { prisma } from '@/lib/db'

/**
 * POST /api/test/[testId]/process
 * Run complete analysis pipeline
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const { testId } = params
    
    // Try to parse body, but don't require it
    let body = {}
    try {
      const bodyText = await req.text()
      if (bodyText && bodyText.trim()) {
        body = JSON.parse(bodyText)
      }
    } catch (error) {
      console.log('No request body provided, using database data')
    }
    
    console.log(`🚀 Processing test: ${testId}`)
    
    // Extract data from request (optional)
    const { productInfo: requestProductInfo, personas: requestPersonas } = body
    
    // Fetch test data including survey
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        survey: true,
        audiences: true
      }
    })
    
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }
    
    console.log(`📊 Found test with survey: ${test.survey ? 'Yes' : 'No'}`)
    
    // Use productInfo from request or database
    const productInfo = requestProductInfo || test.productInfo
    
    if (!productInfo) {
      return NextResponse.json(
        { error: 'No product information available' },
        { status: 400 }
      )
    }
    
    // Generate synthetic responses first
    const { generateSyntheticResponses } = await import('@/lib/analytics/synthetic-response-generator')
    
    console.log('🤖 Generating synthetic responses...')
    const syntheticResponses = await generateSyntheticResponses(
      testId,
      test.audiences || [],
      test.survey || { sections: [], settings: {} },
      productInfo,
      500 // Sample size
    )
    
    // Clear existing responses first
    console.log('🗑️ Clearing existing responses...')
    await prisma.surveyResponse.deleteMany({
      where: { testId }
    })
    
    // Save individual responses to database
    console.log('💾 Saving individual responses to database...')
    await prisma.surveyResponse.createMany({
      data: syntheticResponses.map(response => ({
        id: response.id,
        testId: response.testId,
        audienceId: response.audienceId,
        responseData: response.responseData,
        demographics: response.demographics,
        psychographics: response.psychographics,
        behaviors: response.behaviors,
        purchaseIntent: response.purchaseIntent,
        priceAcceptance: response.priceAcceptance,
        brandFit: response.brandFit,
        featurePreferences: response.featurePreferences,
        metadata: response.metadata
      }))
    })
    
    console.log(`✅ Saved ${syntheticResponses.length} individual responses`)
    
    // Run marketing-grade comprehensive analysis
    const { runComprehensiveAnalysis } = await import('@/lib/analytics/comprehensive-analyzer')
    
    const results = await runComprehensiveAnalysis({
      responses: syntheticResponses,
      survey: test.survey || { sections: [], settings: {} },
      audiences: test.audiences || [],
      productInfo: {
        name: productInfo.name || test.productInfo?.name,
        description: productInfo.description || test.productInfo?.description,
        industry: productInfo.industry || test.productInfo?.industry,
        targetAudience: productInfo.targetAudience || test.productInfo?.targetAudience,
        companyName: productInfo.companyName || test.productInfo?.companyName,
        brandMission: productInfo.brandMission || test.productInfo?.brandMission,
        brandVision: productInfo.brandVision || test.productInfo?.brandVision,
        brandVoice: productInfo.brandVoice || test.productInfo?.brandVoice,
        companyStory: productInfo.companyStory || test.productInfo?.companyStory,
        founderBackground: productInfo.founderBackground || test.productInfo?.founderBackground,
        problemStatement: productInfo.problemStatement || test.productInfo?.problemStatement,
        solutionStatement: productInfo.solutionStatement || test.productInfo?.solutionStatement,
        uniqueValue: productInfo.uniqueValue || test.productInfo?.uniqueValue,
        businessModel: productInfo.businessModel || test.productInfo?.businessModel,
        revenueModel: productInfo.revenueModel || test.productInfo?.revenueModel,
        marketSize: productInfo.marketSize || test.productInfo?.marketSize,
        competitors: productInfo.competitors || test.productInfo?.competitors,
        brandValues: productInfo.brandValues || test.productInfo?.brandValues,
        priceRange: productInfo.priceRange || test.productInfo?.priceRange
      },
      validationGoals: test.validationGoals || []
    })
    
    // Save results to database
    await prisma.analysis.upsert({
      where: { testId: testId },
      update: {
        purchaseIntent: {
          avgIntent: results.purchaseIntent?.overall?.mean || 0,
          distribution: {},
          confidence: results.executiveSummary?.confidence || 95
        },
        patterns: results.patterns || [],
        culturalRisks: results.insights?.filter(i => i.type === 'risk') || [],
        segments: results.patterns || [],
        insights: results.insights || [],
        executiveSummary: {
          shouldLaunch: results.launchReadiness?.status === 'GO',
          confidence: results.executiveSummary?.confidence || 95,
          keyFindings: results.insights?.slice(0, 3).map(i => i.title) || []
        },
        keyFindings: results.insights?.slice(0, 5) || [],
        sampleSize: 500,
        dataMode: 'synthetic',
        confidence: results.executiveSummary?.confidence || 95,
        shouldLaunch: results.launchReadiness?.status === 'GO',
        launchConfidence: results.executiveSummary?.confidence || 95,
        launchReasoning: results.executiveSummary?.bottomLine || 'Marketing-grade analysis complete'
      },
      create: {
        testId: testId,
        purchaseIntent: {
          avgIntent: results.purchaseIntent?.overall?.mean || 0,
          distribution: {},
          confidence: results.executiveSummary?.confidence || 95
        },
        patterns: results.patterns || [],
        culturalRisks: results.insights?.filter(i => i.type === 'risk') || [],
        segments: results.patterns || [],
        insights: results.insights || [],
        executiveSummary: {
          shouldLaunch: results.launchReadiness?.status === 'GO',
          confidence: results.executiveSummary?.confidence || 95,
          keyFindings: results.insights?.slice(0, 3).map(i => i.title) || []
        },
        keyFindings: results.insights?.slice(0, 5) || [],
        sampleSize: 500,
        dataMode: 'synthetic',
        confidence: results.executiveSummary?.confidence || 95,
        shouldLaunch: results.launchReadiness?.status === 'GO',
        launchConfidence: results.executiveSummary?.confidence || 95,
        launchReasoning: results.executiveSummary?.bottomLine || 'Marketing-grade analysis complete'
      }
    })

    // Update test status
    await prisma.test.update({
      where: { id: testId },
      data: { 
        status: 'COMPLETED',
        updatedAt: new Date()
      }
    })

    // Store results in cache as backup
    const { testResults } = await import('@/lib/cache')
    testResults.set(testId, {
      ...results,
      testId,
      status: 'completed',
      completedAt: new Date().toISOString(),
    })
    
    console.log(`✅ Marketing-grade analysis complete for ${testId}`)
    console.log(`   Purchase Intent: ${results.purchaseIntent?.overall?.mean || 0}%`)
    console.log(`   Launch Status: ${results.launchReadiness?.status || 'Unknown'}`)
    console.log(`   Patterns Found: ${results.patterns?.length || 0}`)
    console.log(`   Insights Generated: ${results.insights?.length || 0}`)
    console.log(`   Personas Created: ${results.personas?.length || 0}`)
    console.log(`   Recommendations: ${results.recommendations?.length || 0}`)
    
    return NextResponse.json({
      success: true,
      testId,
      results: {
        overview: {
          avgPurchaseIntent: results.purchaseIntent?.overall?.mean || 0,
          optimalPrice: results.priceSensitivity?.optimalPrice || 65,
          topBenefit: results.insights?.[0]?.title || 'Not specified',
          brandFit: 8.2,
          sampleSize: 500,
          confidence: results.executiveSummary?.confidence || 95
        },
        keyMetrics: {
          avgPurchaseIntent: results.purchaseIntent?.overall?.mean || 0,
          optimalPrice: results.priceSensitivity?.optimalPrice || 65,
          estimatedRevenue: Math.round((results.purchaseIntent?.overall?.mean || 0) * 500 * (results.priceSensitivity?.optimalPrice || 65) / 100),
          topInsight: results.insights?.[0]?.title || 'No insights available'
        },
        executiveSummary: results.executiveSummary,
        insights: results.insights?.slice(0, 5),
        personas: results.personas?.slice(0, 3),
        recommendations: results.recommendations?.filter(r => r.priority === 'critical').slice(0, 3),
        status: 'completed'
      }
    })
    
  } catch (error) {
    console.error('Error processing test:', error)
    
    const { testId } = params
    
    // Store error
    const { testResults } = await import('@/lib/cache')
    testResults.set(testId, {
      testId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to process test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

