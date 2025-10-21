import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string; personaId: string } }
) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { personaId: params.personaId },
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json({ messages: [] })
  }
}
