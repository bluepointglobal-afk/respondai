import { NextRequest, NextResponse } from 'next/server'
import { clearTestCache, clearTestCacheForTest, getCacheStats } from '@/lib/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated (basic auth check)
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { testId } = await req.json().catch(() => ({}))
    
    if (testId) {
      // Clear cache for specific test
      clearTestCacheForTest(testId)
      return NextResponse.json({ 
        success: true, 
        message: `Cache cleared for test: ${testId}`,
        testId 
      })
    } else {
      // Clear entire cache
      clearTestCache()
      return NextResponse.json({ 
        success: true, 
        message: 'All cache cleared' 
      })
    }
    
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = getCacheStats()
    return NextResponse.json({
      success: true,
      cache: stats
    })
    
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    )
  }
}
