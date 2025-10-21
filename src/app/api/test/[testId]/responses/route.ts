import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== GET TEST RESPONSES API ===')
    console.log('Test ID:', params.testId)
    
    // For demo purposes, use demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get test with responses data
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        responses: true,
        analysis: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    console.log('Test found:', test.name)
    console.log('Responses count:', test.responses?.length || 0)

    // If no responses exist, return empty state
    if (!test.responses || test.responses.length === 0) {
      return NextResponse.json({
        responses: [],
        hasResponses: false,
        test: {
          id: test.id,
          name: test.name,
          status: test.status
        }
      })
    }

    // Convert database responses to UI format
    const responses = test.responses.map(response => ({
      id: response.id,
      demographics: response.demographics || {},
      persona: response.persona || 'Unknown',
      purchaseIntent: response.purchaseIntent || 0,
      priceAcceptance: response.priceAcceptance || 0,
      brandFit: response.brandFit || 0,
      answers: response.answers || {},
      completionTime: response.completionTime || 0,
      timestamp: response.timestamp || new Date().toISOString(),
      status: response.status || 'completed'
    }))

    return NextResponse.json({
      responses,
      hasResponses: responses.length > 0,
      test: {
        id: test.id,
        name: test.name,
        status: test.status
      }
    })

  } catch (error) {
    console.error('Get test responses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}