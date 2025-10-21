import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  try {
    console.log('=== CREATE TEST API CALLED ===')
    
    // 1. GET USER from session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    console.log('Request body received:', JSON.stringify(body, null, 2))
    
    // 2. GET user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    console.log('Found user:', user.id, user.email)
    
    // Create test
    console.log('Creating test with data:', {
      userId: user.id,
      name: body.name || 'Test Survey',
      productInfo: body.productInfo || { name: 'Test Product' },
      validationGoals: body.validationGoals || [],
      status: 'DRAFT'
    })
    
    const test = await prisma.test.create({
      data: {
        userId: user.id,
        name: body.name || 'Test Survey',
        productInfo: body.productInfo || { name: 'Test Product' },
        validationGoals: body.validationGoals || [],
        status: 'DRAFT'
      }
    })
    
    console.log('Test created successfully:', test.id, test.name)
    
    const response = { 
      testId: test.id,
      test: {
        id: test.id,
        name: test.name,
        status: test.status,
        createdAt: test.createdAt
      }
    }
    
    console.log('Returning response:', JSON.stringify(response, null, 2))
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Create test error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}