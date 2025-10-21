import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string; personaId: string } }
) {
  try {
    const persona = await prisma.persona.findUnique({
      where: { id: params.personaId }
    })

    if (!persona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 })
    }

    return NextResponse.json({ persona })
  } catch (error) {
    console.error('Error fetching persona:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
