import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== GET TEST STATUS API CALLED ===')
    console.log('Test ID:', params.testId)
    
    // GET demo user (for revamped survey builder demo)
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      console.log('Demo user not found')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.log('Demo user found:', user.id, user.email)

    // FIND test
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      }
    })

    if (!test) {
      console.log('Test not found')
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    console.log('Test found:', test.id, test.name, test.status)

    return NextResponse.json({ 
      success: true,
      test: {
        id: test.id,
        name: test.name,
        status: test.status,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Get test status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    // 2. PARSE REQUEST body
    const body = await req.json()
    
    // 3. VALIDATE data
    if (!body.status) {
      return NextResponse.json({ error: 'Missing status field' }, { status: 400 })
    }

    // 4. GET demo user (for revamped survey builder demo)
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 5. UPDATE test status
    const test = await prisma.test.update({
      where: { 
        id: params.testId,
        userId: user.id // Ensure user owns this test
      },
      data: {
        status: body.status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      test: {
        id: test.id,
        status: test.status,
        updatedAt: test.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Update test status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}