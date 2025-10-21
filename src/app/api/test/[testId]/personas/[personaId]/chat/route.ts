import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string; personaId: string } }
) {
  try {
    const { message, conversationHistory } = await req.json()

    const persona = await prisma.persona.findUnique({
      where: { id: params.personaId }
    })

    if (!persona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        response: "I appreciate your question! As someone in my demographic, I'd say this product has potential, but I'd need to see more details about pricing and how it fits my lifestyle."
      })
    }

    const messages = [
      { role: 'system' as const, content: persona.systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.8,
      max_tokens: 300,
    })

    const response = completion.choices[0].message.content || 'I need to think about that.'

    await prisma.chatMessage.create({
      data: {
        personaId: params.personaId,
        role: 'user',
        content: message,
      }
    })

    await prisma.chatMessage.create({
      data: {
        personaId: params.personaId,
        role: 'assistant',
        content: response,
      }
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to chat' }, { status: 500 })
  }
}
