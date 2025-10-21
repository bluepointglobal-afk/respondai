import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    console.log('=== GET TESTS API CALLED ===')
    
    // Get demo user (for revamped survey builder demo)
    console.log('Looking for demo user...')
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    console.log('Demo user found:', user ? 'Yes' : 'No')

    if (!user) {
      console.log('No demo user found, returning empty tests')
      return NextResponse.json({ tests: [] })
    }

    // Fetch tests with related data
    console.log('Fetching tests for user:', user.id)
    const tests = await prisma.test.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    })

    console.log('Tests found:', tests.length)
    return NextResponse.json({ tests })
    
  } catch (error) {
    console.error('Get tests error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
