import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== GET TEST RECOMMENDATIONS API ===')
    console.log('Test ID:', params.testId)
    
    // For demo purposes, use demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get test with recommendations data
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        recommendations: true,
        analysis: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    console.log('Test found:', test.name)
    console.log('Recommendations count:', test.recommendations?.length || 0)

    // If no recommendations exist, return empty state
    if (!test.recommendations || test.recommendations.length === 0) {
      return NextResponse.json({
        recommendations: [],
        hasRecommendations: false,
        test: {
          id: test.id,
          name: test.name,
          status: test.status
        }
      })
    }

    // Convert database recommendations to UI format
    const recommendations = test.recommendations.map(rec => ({
      id: rec.id,
      category: rec.category || 'strategy',
      type: rec.type || 'do',
      action: rec.action || 'Take action',
      reasoning: rec.reasoning || 'Based on analysis',
      impact: rec.impact || 'Positive impact expected',
      difficulty: rec.difficulty || 'medium',
      timeline: rec.timeline || 'near-term',
      estimatedLift: rec.estimatedLift || '10-20%',
      priority: rec.priority || 1
    }))

    return NextResponse.json({
      recommendations,
      hasRecommendations: recommendations.length > 0,
      test: {
        id: test.id,
        name: test.name,
        status: test.status
      }
    })

  } catch (error) {
    console.error('Get test recommendations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
