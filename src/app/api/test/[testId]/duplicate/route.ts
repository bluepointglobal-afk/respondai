import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    console.log('=== DUPLICATE TEST API ===')
    console.log('Test ID:', params.testId)

    // For demo purposes, use demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get original test with all relations
    const original = await prisma.test.findUnique({
      where: { id: params.testId },
      include: {
        survey: true,
        audiences: true
      }
    })

    if (!original || original.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    console.log('Original test found:', original.name)

    // Create duplicate
    const duplicate = await prisma.test.create({
      data: {
        userId: user.id,
        name: `${original.name} (Copy)`,
        productInfo: original.productInfo,
        validationGoals: original.validationGoals,
        status: 'DRAFT',
        
        // Copy audiences
        audiences: {
          create: original.audiences.map(a => ({
            name: a.name,
            isPrimary: a.isPrimary,
            demographics: a.demographics,
            psychographics: a.psychographics,
            estimatedSize: a.estimatedSize,
            targetSampleSize: a.targetSampleSize,
            reasoning: a.reasoning
          }))
        },
        
        // Copy survey if exists
        ...(original.survey && {
          survey: {
            create: {
              sections: original.survey.sections,
              settings: original.survey.settings,
              publicLink: `/s/${original.survey.id}_copy`,
              embedCode: `<iframe src="${process.env.NEXT_PUBLIC_APP_URL}/s/${original.survey.id}_copy" width="100%" height="600"></iframe>`
            }
          }
        })
      }
    })

    console.log('Test duplicated successfully:', duplicate.id)
    return NextResponse.json({ testId: duplicate.id })
  } catch (error) {
    console.error('Duplicate test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
