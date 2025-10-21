import { NextRequest, NextResponse } from 'next/server'
import { generateAudienceSuggestions } from '@/lib/audience/ai-generator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (!body.productInfo) {
      return NextResponse.json({ error: 'Missing productInfo' }, { status: 400 })
    }

    console.log('=== API AUDIENCE GENERATION ===')
    console.log('Product Context:', body)
    
    const audiences = await generateAudienceSuggestions(body)
    
    console.log('Generated audiences:', audiences.length)
    
    return NextResponse.json({ 
      success: true,
      audiences 
    })
    
  } catch (error) {
    console.error('API audience generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate audience suggestions',
      details: error.message 
    }, { status: 500 })
  }
}