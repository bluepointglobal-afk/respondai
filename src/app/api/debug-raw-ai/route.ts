import { NextRequest, NextResponse } from 'next/server'
import { aiClient, getAIModel } from '@/lib/ai-client'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Testing raw AI output...')
    
    // Test simple prompt
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: 'You are a market research analyst. Return ONLY valid JSON with this exact structure: [{"id": "persona-1", "name": "Test Persona", "tagline": "Test tagline"}]'
        },
        {
          role: 'user',
          content: 'Generate 1 test persona for a turmeric supplement. Return ONLY valid JSON array.'
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const content = completion.choices[0]?.message?.content
    console.log('🤖 Raw AI Response:', content)
    
    // Try to parse it
    let parsed = null
    try {
      parsed = JSON.parse(content || '')
      console.log('✅ JSON Parse Success:', parsed)
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError)
      console.error('Raw content:', content)
    }

    return NextResponse.json({
      success: true,
      rawContent: content,
      parsedContent: parsed,
      parseError: parsed ? null : 'Failed to parse JSON'
    })

  } catch (error) {
    console.error('❌ DEBUG: Fatal error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
