import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== GET TEST PERSONAS API ===')
    console.log('Test ID:', params.testId)
    
    // For demo purposes, use demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get test with personas data
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        personas: true,
        analysis: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    console.log('Test found:', test.name)
    console.log('Personas count:', test.personas?.length || 0)

    // If no personas exist, return empty state
    if (!test.personas || test.personas.length === 0) {
      return NextResponse.json({
        personas: [],
        hasPersonas: false,
        test: {
          id: test.id,
          name: test.name,
          status: test.status
        }
      })
    }

    // Convert database personas to UI format
    const personas = test.personas.map(persona => ({
      id: persona.id,
      name: persona.name,
      age: persona.age || 35,
      location: persona.location || 'United States',
      archetype: persona.archetype || 'Health-Conscious Consumer',
      avatar: persona.avatar || '👤',
      purchaseIntent: persona.purchaseIntent || 75,
      pricePoint: persona.pricePoint || 29.99,
      sampleSize: persona.sampleSize || 100,
      demographics: {
        income: persona.income || '$50,000-$75,000',
        education: persona.education || 'College Graduate',
        occupation: persona.occupation || 'Professional',
        familyStatus: persona.familyStatus || 'Married'
      },
      psychographics: {
        values: persona.values || ['Health', 'Quality'],
        lifestyle: persona.lifestyle || ['Active', 'Health-conscious'],
        painPoints: persona.painPoints || ['Joint pain', 'Low energy'],
        goals: persona.goals || ['Better health', 'Active lifestyle']
      },
      keyQuotes: persona.keyQuotes || ['I want natural solutions for my health'],
      behaviors: {
        shoppingHabits: persona.shoppingHabits || 'Researches products online',
        brandLoyalty: persona.brandLoyalty || 'Moderate',
        influencers: persona.influencers || 'Health professionals',
        decisionFactors: persona.decisionFactors || ['Quality', 'Price', 'Reviews']
      }
    }))

    return NextResponse.json({
      personas,
      hasPersonas: personas.length > 0,
      test: {
        id: test.id,
        name: test.name,
        status: test.status
      }
    })

  } catch (error) {
    console.error('Get test personas error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
