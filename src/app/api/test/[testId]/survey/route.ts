import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== SURVEY SAVE API CALLED ===')
    console.log('Test ID from params:', params.testId)
    
    // 2. PARSE REQUEST body
    const { sections, settings } = await req.json()
    console.log('Request body parsed, sections count:', sections?.length)
    
    // 3. VALIDATE data
    if (!sections) {
      console.log('Missing sections in request')
      return NextResponse.json({ error: 'Missing sections' }, { status: 400 })
    }

    // 4. GET demo user (for revamped survey builder demo)
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      console.log('Demo user not found')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.log('Demo user found:', user.id, user.email)

    // 5. VERIFY test ownership
    console.log('Looking for test with ID:', params.testId, 'and userId:', user.id)
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      }
    })

    if (!test) {
      console.log('Test not found. Checking if test exists at all...')
      const anyTest = await prisma.test.findUnique({
        where: { id: params.testId }
      })
      if (anyTest) {
        console.log('Test exists but belongs to different user:', anyTest.userId)
      } else {
        console.log('Test does not exist at all')
      }
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }
    console.log('Test found:', test.id, test.name)

    // 6. UPSERT survey (create or update)
    const survey = await prisma.survey.upsert({
      where: { testId: params.testId },
      update: {
        sections,
        settings: settings || {},
        updatedAt: new Date()
      },
      create: {
        testId: params.testId,
        sections,
        settings: settings || {},
        publicLink: `/s/${params.testId}`,
        embedCode: `<iframe src="${process.env.NEXT_PUBLIC_APP_URL}/s/${params.testId}" width="100%" height="600"></iframe>`
      }
    })

    return NextResponse.json({ 
      success: true,
      survey: {
        id: survey.id,
        testId: survey.testId,
        sections: survey.sections,
        settings: survey.settings,
        publicLink: survey.publicLink
      }
    })
    
  } catch (error) {
    console.error('Save survey error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    // 2. GET demo user (for revamped survey builder demo)
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. VERIFY test ownership and get survey
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        survey: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      survey: test.survey
    })
    
  } catch (error) {
    console.error('Get survey error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
