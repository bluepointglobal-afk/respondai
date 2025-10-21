/**
 * COMPREHENSIVE ANALYSIS API
 * Single endpoint that handles complete product analysis
 * Eliminates need for multiple API calls and mock data
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateComprehensiveAnalysis, validateAnalysisResult, ProductInfo } from '@/lib/analytics/comprehensive-ai-engine'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Starting comprehensive analysis...')
    
    const body = await req.json()
    const { productInfo }: { productInfo: ProductInfo } = body
    
    if (!productInfo || !productInfo.name || !productInfo.description) {
      return NextResponse.json(
        { error: 'Product information is required' },
        { status: 400 }
      )
    }
    
    // Generate comprehensive analysis using AI
    const analysis = await generateComprehensiveAnalysis(productInfo)
    
    // Validate the analysis result
    const validatedAnalysis = validateAnalysisResult(analysis)
    
    // Get or create demo user
    let user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo@respondai.com',
          name: 'Demo User',
          image: null
        }
      })
    }

    // Create test record
    const test = await prisma.test.create({
      data: {
        name: `${productInfo.name} Analysis`,
        status: 'COMPLETED',
        userId: user.id,
        productInfo: {
          name: productInfo.name,
          description: productInfo.description,
          industry: productInfo.industry,
          targetAudience: productInfo.targetAudience,
          problemStatement: productInfo.problemStatement,
          solutionStatement: productInfo.solutionStatement,
          uniqueValue: productInfo.uniqueValue,
          priceRange: productInfo.priceRange,
          brandValues: productInfo.brandValues,
          companyStory: productInfo.companyStory,
          companyName: productInfo.companyName
        },
        validationGoals: {
          audience: true,
          problem: true,
          solution: true,
          pricing: true,
          brand: true
        }
      }
    })
    
    // Save analysis to database
    await prisma.analysis.create({
      data: {
        testId: test.id,
        purchaseIntent: {
          avgIntent: validatedAnalysis.keyMetrics?.purchaseIntent?.value || 0,
          distribution: validatedAnalysis.keyMetrics?.purchaseIntent?.distribution || {},
          confidence: validatedAnalysis.executiveSummary?.confidence || 85
        },
        patterns: validatedAnalysis.patterns,
        culturalRisks: validatedAnalysis.risks?.filter(r => r?.type === 'market') || [],
        segments: validatedAnalysis.patterns?.map(p => ({
          name: p?.title || 'Unknown Segment',
          size: p?.segments?.reduce((sum, s) => sum + (s?.size || 0), 0) || 0,
          intent: p?.segments?.reduce((sum, s) => sum + (s?.purchaseIntent || 0), 0) / (p?.segments?.length || 1) || 0,
          confidence: p?.confidence || 0
        })) || [],
        insights: validatedAnalysis.insights,
        executiveSummary: {
          shouldLaunch: validatedAnalysis.executiveSummary?.shouldLaunch ?? true,
          confidence: validatedAnalysis.executiveSummary?.confidence ?? 85,
          keyFindings: validatedAnalysis.insights?.slice(0, 3).map(i => i?.headline).filter(h => h) || []
        },
        keyFindings: validatedAnalysis.insights?.slice(0, 5).filter(i => i?.headline) || [],
        sampleSize: validatedAnalysis.keyMetrics?.purchaseIntent?.n || 500,
        dataMode: 'ai-generated',
        confidence: validatedAnalysis.executiveSummary?.confidence ?? 85,
        shouldLaunch: validatedAnalysis.executiveSummary?.shouldLaunch ?? true,
        launchConfidence: validatedAnalysis.executiveSummary?.confidence ?? 85,
        launchReasoning: validatedAnalysis.executiveSummary?.oneLineSummary ?? 'Analysis complete'
      }
    })
    
    // Create personas with correct schema
    for (const persona of validatedAnalysis.personas || []) {
      await prisma.persona.create({
        data: {
          analysisId: test.id,
          name: persona?.name || 'Unknown Persona',
          avatar: persona?.icon || '👤',
          age: parseInt(persona?.age?.split('-')[0]) || 30,
          archetype: persona?.title || 'Unknown Archetype',
          demographics: {
            age: persona?.age || 'Unknown',
            income: persona?.income || 'Unknown',
            location: persona?.location || 'Unknown'
          },
          surveyData: {
            purchaseIntent: persona?.purchaseIntent || 0,
            priceSensitivity: persona?.priceSensitivity || 0,
            preferredChannels: persona?.preferredChannels || [],
            concerns: persona?.concerns || []
          },
          psychographics: {
            values: persona?.psychographics || 'Unknown',
            motivations: persona?.topBenefits || [],
            lifestyle: 'Health-conscious professional'
          },
          personality: {
            traits: ['Health-conscious', 'Busy', 'Professional'],
            speakingStyle: 'Direct and health-focused',
            tone: 'Professional yet approachable'
          },
          systemPrompt: `You are ${persona?.name || 'Unknown Persona'}, a ${persona?.title || 'health-conscious professional'}. You are ${persona?.psychographics || 'focused on wellness and convenience'}. Your main concerns are: ${persona?.concerns?.join(', ') || 'effectiveness and value'}.`
        }
      })
    }
    
    console.log(`📊 Personas created: ${validatedAnalysis.personas?.length || 0}`)
    
    console.log(`✅ Analysis complete for ${productInfo.name}`)
    console.log(`   Test ID: ${test.id}`)
    console.log(`   Purchase Intent: ${validatedAnalysis.keyMetrics?.purchaseIntent?.value || 0}%`)
    console.log(`   Optimal Price: ${validatedAnalysis.keyMetrics?.optimalPrice?.value || '$0'}`)
    console.log(`   Insights: ${validatedAnalysis.insights?.length || 0}`)
    console.log(`   Patterns: ${validatedAnalysis.patterns?.length || 0}`)
    
    return NextResponse.json({
      success: true,
      testId: test.id,
      analysis: validatedAnalysis,
      message: 'Comprehensive analysis complete'
    })
    
  } catch (error) {
    console.error('Comprehensive analysis error:', error)
    
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Please check your API configuration and try again'
      },
      { status: 500 }
    )
  }
}
