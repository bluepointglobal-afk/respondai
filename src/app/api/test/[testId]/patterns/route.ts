import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== GET TEST PATTERNS API ===')
    console.log('Test ID:', params.testId)
    
    // For demo purposes, use demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get test with patterns data
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        analysis: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    console.log('Test found:', test.name)
    console.log('Analysis exists:', !!test.analysis)

    // If no analysis exists, return empty state
    if (!test.analysis || !test.analysis.patterns) {
      return NextResponse.json({
        patterns: [],
        hasPatterns: false,
        test: {
          id: test.id,
          name: test.name,
          status: test.status
        }
      })
    }

    // Extract patterns from analysis data
    const patterns = test.analysis.patterns.map((pattern: any) => ({
      id: pattern.id || `pattern-${Date.now()}-${Math.random()}`,
      title: pattern.title || pattern.name || 'Pattern',
      type: pattern.type || 'demographic',
      description: pattern.description || 'Pattern description',
      strength: pattern.strength || 'medium',
      segments: pattern.segments || [],
      insights: pattern.insights || [],
      recommendations: pattern.recommendations || []
    }))

    return NextResponse.json({
      patterns,
      hasPatterns: patterns.length > 0,
      test: {
        id: test.id,
        name: test.name,
        status: test.status
      }
    })

  } catch (error) {
    console.error('Get test patterns error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
