import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generatePersonasFromResponses } from '@/lib/analytics/persona-generator'

export async function POST(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const testId = params.testId
    
    // Fetch test data
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        responses: true
      }
    }).catch(() => null)
    
    const mockProductInfo = {
      name: 'Sample Product',
      description: 'Natural health supplement',
      industry: 'Health & Wellness'
    }
    
    if (!test) {
      // Mock data for demo
      const mockResponses = generateMockResponses()
      const mockGoals: any[] = []
      
      const personas = await generatePersonasFromResponses(
        mockResponses,
        mockProductInfo,
        mockGoals
      )
      
      return NextResponse.json({ personas })
    }
    
    // Generate personas from real data
    const personas = await generatePersonasFromResponses(
      test.responses as any[],
      (test as any).productInfo || mockProductInfo,
      (test as any).validationGoals || []
    )
    
    // TODO: Save personas to database when Persona model is added
    // await prisma.persona.createMany({
    //   data: personas.map(p => ({
    //     testId,
    //     name: p.name,
    //     archetype: p.archetype,
    //     demographics: p.demographics as any,
    //     psychographics: p.psychographics as any,
    //     purchaseIntent: p.purchaseIntent,
    //     pricePoint: p.pricePoint,
    //     sampleSize: p.sampleSize,
    //     avatar: p.avatar,
    //     systemPrompt: p.systemPrompt
    //   })),
    //   skipDuplicates: true
    // }).catch(err => {
    //   console.log('Could not save to database:', err.message)
    // })
    
    return NextResponse.json({ personas })
    
  } catch (error) {
    console.error('Error generating personas:', error)
    return NextResponse.json(
      { error: 'Failed to generate personas' },
      { status: 500 }
    )
  }
}

function generateMockResponses() {
  return [
    {
      id: '1',
      answers: {
        'purchase-intent': 8,
        'price-expectation': '35',
        values: ['Quality', 'Natural ingredients', 'Effectiveness']
      },
      metadata: {},
      demographics: {
        age: '45-54',
        gender: 'Female',
        income: '$75,000-$100,000',
        location: 'Atlanta, GA',
        ethnicity: 'Black',
        education: 'Bachelor\'s Degree',
        occupation: 'Healthcare Administrator'
      }
    },
    {
      id: '2',
      answers: {
        'purchase-intent': 7,
        'price-expectation': '28',
        values: ['Value', 'Family', 'Natural']
      },
      metadata: {},
      demographics: {
        age: '35-44',
        gender: 'Female',
        income: '$50,000-$75,000',
        location: 'Houston, TX',
        ethnicity: 'Hispanic',
        education: 'Some College',
        occupation: 'Retail Manager'
      }
    },
    {
      id: '3',
      answers: {
        'purchase-intent': 9,
        'price-expectation': '42',
        values: ['Excellence', 'Results', 'Convenience']
      },
      metadata: {},
      demographics: {
        age: '55-64',
        gender: 'Female',
        income: '$150,000+',
        location: 'Washington, DC',
        education: 'Master\'s Degree',
        occupation: 'Senior Executive'
      }
    }
  ]
}

