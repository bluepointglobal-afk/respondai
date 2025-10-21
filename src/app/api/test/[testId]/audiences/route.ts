import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    // 1. GET USER from session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. PARSE REQUEST body
    const { audiences } = await req.json()
    
    // 3. VALIDATE data
    if (!audiences || !Array.isArray(audiences)) {
      return NextResponse.json({ error: 'Missing audiences array' }, { status: 400 })
    }

    // 4. GET user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 5. VERIFY test ownership
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // 6. DELETE existing audiences
    await prisma.audience.deleteMany({
      where: { testId: params.testId }
    })

    // 7. CREATE new audiences
    const createdAudiences = await prisma.audience.createMany({
      data: audiences.map(a => ({
        testId: params.testId,
        name: a.name,
        isPrimary: a.isPrimary || false,
        demographics: a.demographics,
        psychographics: a.psychographics || null,
        estimatedSize: a.estimatedSize || 0,
        targetSampleSize: a.targetSampleSize || 100,
        reasoning: a.reasoning || null
      }))
    })

    return NextResponse.json({ 
      success: true,
      count: createdAudiences.count
    })
    
  } catch (error) {
    console.error('Save audiences error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    // 1. GET USER from session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. GET user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. VERIFY test ownership and get audiences
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        audiences: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      test: {
        id: test.id,
        name: test.name,
        productInfo: test.productInfo,
        validationGoals: test.validationGoals,
        audiences: test.audiences
      },
      audiences: test.audiences
    })
    
  } catch (error) {
    console.error('Get audiences error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
