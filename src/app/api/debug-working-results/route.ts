import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Creating working comprehensive results...')
    
    // Get the test data directly
    const testId = 'cmh016ydp000aoyv62nyv8msv'
    const response = await fetch(`http://localhost:3000/api/test/${testId}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('📊 Test data received:', data)
    
    // Transform the data to show what we have
    const analysisData = {
      testId: data.id,
      testName: data.name,
      productInfo: data.productInfo,
      status: data.status,
      hasAnalysis: !!data.analysis,
      analysisSummary: data.analysis ? {
        insights: data.analysis.insights?.length || 0,
        personas: data.analysis.personas?.length || 0,
        recommendations: data.analysis.recommendations?.length || 0,
        executiveSummary: !!data.analysis.executiveSummary,
        purchaseIntent: data.analysis.purchaseIntent?.avgIntent || 0,
        sampleSize: data.analysis.sampleSize || 0,
        confidence: data.analysis.confidence || 0,
        shouldLaunch: data.analysis.shouldLaunch || false,
        launchReasoning: data.analysis.launchReasoning || 'No reasoning provided'
      } : null,
      rawInsights: data.analysis?.insights || [],
      rawExecutiveSummary: data.analysis?.executiveSummary || null
    }
    
    return NextResponse.json({
      success: true,
      message: 'Working Comprehensive Results Data',
      data: analysisData
    })

  } catch (error) {
    console.error('❌ DEBUG: Fatal error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
