import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET SINGLE TEST
export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== GET TEST API ===')
    console.log('Test ID:', params.testId)
    
    // For demo purposes, use demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get test with related data
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        survey: true,
        audiences: true,
        analysis: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    console.log('Test found:', test.name)
    return NextResponse.json(test)
  } catch (error) {
    console.error('Get test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH TEST STATUS
export async function PATCH(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== PATCH TEST API ===')
    console.log('Test ID:', params.testId)
    
    const body = await req.json()
    console.log('Update data:', body)
    
    // For demo purposes, use demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update test
    const updatedTest = await prisma.test.update({
      where: { 
        id: params.testId,
        userId: user.id
      },
      data: body
    })

    console.log('✅ Test updated:', updatedTest.id)
    return NextResponse.json(updatedTest)
    
  } catch (error) {
    console.error('❌ PATCH test error:', error)
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 })
  }
}