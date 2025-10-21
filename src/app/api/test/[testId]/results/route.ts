import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== GET TEST RESULTS API ===')
    console.log('Test ID:', params.testId)
    
    // Get test with all related data (skip user check for demo)
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId
      },
        include: {
            survey: true,
            audiences: true,
            analysis: true,
            responses: true,
            surveyResponses: true
          }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    console.log('Test found:', test.name)
    console.log('Analysis exists:', !!test.analysis)
    console.log('Responses count:', test.responses?.length || 0)

    // If no analysis exists, return empty results (no mock data)
    if (!test.analysis) {
      return NextResponse.json({
        test: {
          id: test.id,
          name: test.name,
          status: test.status,
          productInfo: test.productInfo
        },
        analysis: null,
        hasResults: false,
        message: 'No analysis available. Please run analysis first.'
      })
    }

    // Transform analysis data to match frontend expectations
    const transformedAnalysis = {
      executiveSummary: {
        shouldLaunch: test.analysis.shouldLaunch,
        confidence: test.analysis.confidence,
        oneLineSummary: test.analysis.launchReasoning || "AI analysis completed successfully",
        keyFindingHighlight: test.analysis.keyFindings?.[0]?.headline || "Key insights generated"
      },
      keyMetrics: {
        purchaseIntent: {
          value: test.analysis.purchaseIntent?.avgIntent || 0,
          subtitle: "AI Generated",
          n: test.analysis.sampleSize || 500,
          distribution: test.analysis.purchaseIntent?.distribution || {}
        },
        optimalPrice: {
          value: `$${test.analysis.purchaseIntent?.avgIntent || 0}`,
          subtitle: "AI Recommended",
          n: test.analysis.sampleSize || 500,
          distribution: {}
        },
        topBenefit: {
          value: test.analysis.insights?.find(i => i.type === 'messaging')?.headline?.split(' resonates')[0] || "Key Benefit",
          subtitle: "Most preferred",
          n: test.analysis.sampleSize || 500,
          distribution: {}
        },
        brandFit: {
          value: test.analysis.purchaseIntent?.avgIntent ? Math.round(test.analysis.purchaseIntent.avgIntent / 10) : 0,
          subtitle: "Out of 10",
          n: test.analysis.sampleSize || 500,
          distribution: {}
        }
      },
      insights: test.analysis.insights || [],
      patterns: test.analysis.patterns || [],
      personas: [],
      recommendations: {
        immediate: test.analysis.insights?.filter(i => i.recommendations?.[0]?.timeToValue?.includes('week')).map(i => i.recommendations[0].action) || [],
        nearTerm: test.analysis.insights?.filter(i => i.recommendations?.[0]?.timeToValue?.includes('month')).map(i => i.recommendations[0].action) || [],
        longTerm: test.analysis.insights?.filter(i => i.recommendations?.[0]?.timeToValue?.includes('quarter') || i.recommendations?.[0]?.timeToValue?.includes('year')).map(i => i.recommendations[0].action) || []
      },
      risks: test.analysis.insights?.filter(i => i.type === 'red-flag').map(i => ({
        type: i.headline,
        severity: i.priority === 'high' ? 'high' : i.priority === 'medium' ? 'medium' : 'low',
        description: i.narrative,
        mitigation: i.recommendations?.[0]?.action || "Address identified concern"
      })) || []
    }

    // Return the transformed analysis data
    return NextResponse.json({
      test: {
        id: test.id,
        name: test.name,
        status: test.status,
        productInfo: test.productInfo,
        audiences: test.audiences,
        surveyResponses: test.surveyResponses
      },
      analysis: transformedAnalysis,
      responses: test.responses,
      personas: [],
      hasResults: true
    })

  } catch (error) {
    console.error('Get test results error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}