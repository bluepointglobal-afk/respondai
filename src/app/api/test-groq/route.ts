import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const groqKey = process.env.GROQ_API_KEY
    
    return NextResponse.json({ 
      hasGroqKey: !!groqKey,
      keyLength: groqKey?.length || 0,
      keyPrefix: groqKey?.substring(0, 10) || 'none',
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('GROQ'))
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
