import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== GET TEST INSIGHTS API ===')
    console.log('Test ID:', params.testId)
    
    // For demo purposes, use demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get test with analysis data
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        analysis: true,
        responses: true,
        personas: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    console.log('Test found:', test.name)
    console.log('Analysis exists:', !!test.analysis)

    // If no analysis exists, return empty insights
    if (!test.analysis) {
      return NextResponse.json({
        insights: [],
        hasInsights: false,
        test: {
          id: test.id,
          name: test.name,
          status: test.status
        }
      })
    }

    // Extract insights from analysis data
    const insights = extractInsightsFromAnalysis(test.analysis, test.responses, test.personas)

    return NextResponse.json({
      insights,
      hasInsights: insights.length > 0,
      test: {
        id: test.id,
        name: test.name,
        status: test.status
      }
    })

  } catch (error) {
    console.error('Get test insights error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function extractInsightsFromAnalysis(analysis: any, responses: any[], personas: any[]) {
  const insights = []

  // Extract insights from analysis data
  if (analysis.insights) {
    analysis.insights.forEach((insight: any) => {
      insights.push({
        id: insight.id || `insight-${Date.now()}-${Math.random()}`,
        title: insight.title || insight.insight,
        category: insight.category || 'opportunity',
        priority: insight.priority || 'medium',
        insight: insight.description || insight.insight,
        evidence: insight.evidence || [],
        impact: insight.impact || {
          revenueImpact: 'Moderate',
          marketShareImpact: 'Moderate',
          confidence: 75
        },
        recommendations: insight.recommendations || [],
        relatedPatterns: insight.relatedPatterns || [],
        relatedPersonas: insight.relatedPersonas || []
      })
    })
  }

  // Generate insights from analysis summary if no specific insights exist
  if (insights.length === 0 && analysis.summary) {
    // Create insights from key findings
    if (analysis.summary.topBenefit) {
      insights.push({
        id: 'insight-benefit',
        title: `"${analysis.summary.topBenefit}" is Your Key Differentiator`,
        category: 'messaging',
        priority: 'critical',
        insight: `The benefit "${analysis.summary.topBenefit}" shows the highest preference among respondents, indicating strong market demand for this feature.`,
        evidence: [{
          metric: 'Benefit Preference',
          value: analysis.summary.topBenefit,
          significance: 'Highest preference among all benefits tested'
        }],
        impact: {
          revenueImpact: 'High',
          marketShareImpact: 'High',
          confidence: 85
        },
        recommendations: [{
          action: 'Lead with this benefit in all marketing materials',
          difficulty: 'easy',
          timeline: 'Immediate',
          estimatedLift: '15-25%'
        }],
        relatedPatterns: ['benefit-preference'],
        relatedPersonas: personas.map(p => p.id)
      })
    }

    if (analysis.summary.optimalPrice) {
      insights.push({
        id: 'insight-pricing',
        title: `Optimal Price Point: $${analysis.summary.optimalPrice}`,
        category: 'pricing',
        priority: 'high',
        insight: `The optimal price point of $${analysis.summary.optimalPrice} maximizes revenue while maintaining strong purchase intent.`,
        evidence: [{
          metric: 'Optimal Price',
          value: `$${analysis.summary.optimalPrice}`,
          significance: 'Price point that maximizes revenue'
        }],
        impact: {
          revenueImpact: 'High',
          marketShareImpact: 'Moderate',
          confidence: 80
        },
        recommendations: [{
          action: 'Set launch price at $' + analysis.summary.optimalPrice,
          difficulty: 'medium',
          timeline: 'Pre-launch',
          estimatedLift: '20-30%'
        }],
        relatedPatterns: ['price-sensitivity'],
        relatedPersonas: personas.map(p => p.id)
      })
    }

    if (analysis.summary.avgPurchaseIntent) {
      insights.push({
        id: 'insight-purchase-intent',
        title: `${analysis.summary.avgPurchaseIntent}% Purchase Intent - ${analysis.summary.avgPurchaseIntent > 70 ? 'Strong' : 'Moderate'} Market Demand`,
        category: 'opportunity',
        priority: analysis.summary.avgPurchaseIntent > 70 ? 'critical' : 'high',
        insight: `With ${analysis.summary.avgPurchaseIntent}% purchase intent, there is ${analysis.summary.avgPurchaseIntent > 70 ? 'strong' : 'moderate'} market demand for this product.`,
        evidence: [{
          metric: 'Purchase Intent',
          value: `${analysis.summary.avgPurchaseIntent}%`,
          significance: analysis.summary.avgPurchaseIntent > 70 ? 'Strong market demand' : 'Moderate market demand'
        }],
        impact: {
          revenueImpact: 'High',
          marketShareImpact: 'High',
          confidence: 75
        },
        recommendations: [{
          action: analysis.summary.avgPurchaseIntent > 70 ? 'Proceed with full launch' : 'Consider pilot launch first',
          difficulty: 'medium',
          timeline: 'Launch phase',
          estimatedLift: '25-40%'
        }],
        relatedPatterns: ['purchase-intent'],
        relatedPersonas: personas.map(p => p.id)
      })
    }
  }

  return insights
}
