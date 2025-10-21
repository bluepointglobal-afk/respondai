import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const { productInfo, validationGoals } = await req.json()
    
    console.log('🤖 Generating AI survey for:', productInfo.name)
    
    // Generate with AI using the existing generate-survey API logic
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productInfo: {
          name: productInfo.name,
          description: productInfo.description,
          industry: productInfo.industry,
          targetAudience: productInfo.targetAudience || 'General audience',
          stage: 'idea',
          productType: 'digital',
          priceRange: { min: 0, max: 100, currency: 'USD' },
          productFeatures: [],
          companyName: 'Your Company',
          companyStory: 'We are building innovative products',
          brandValues: [],
          competitors: [],
          uniqueValue: '',
          marketGap: ''
        },
        validationGoals: validationGoals.map((goal: string) => ({ 
          category: goal, 
          selected: true, 
          label: goal, 
          description: `Validate ${goal}` 
        })),
        audiences: [{
          name: productInfo.targetAudience || 'General Audience',
          demographics: { age: '25-45', gender: 'any', income: 'middle' },
          estimatedSize: 1000000,
          targetSampleSize: 500
        }]
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate survey with AI')
    }

    const generated = await response.json()
    console.log('AI generation response:', generated)
    
    // Save survey to database
    const survey = await prisma.survey.create({
      data: {
        testId: params.testId,
        sections: generated.survey?.sections || [],
        settings: generated.survey?.settings || {
          estimatedTime: 10,
          showProgressBar: true,
          allowSaveAndResume: true
        },
        publicLink: `/s/${params.testId}`,
        embedCode: `<iframe src="${process.env.NEXT_PUBLIC_APP_URL}/s/${params.testId}" width="100%" height="600"></iframe>`
      }
    })
    
    // Update test status
    await prisma.test.update({
      where: { id: params.testId },
      data: { status: 'DEFINING_AUDIENCES' }
    })
    
    console.log('✅ AI survey generated:', survey.id)
    
    return NextResponse.json({ surveyId: survey.id })
    
  } catch (error) {
    console.error('❌ AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate survey' },
      { status: 500 }
    )
  }
}
