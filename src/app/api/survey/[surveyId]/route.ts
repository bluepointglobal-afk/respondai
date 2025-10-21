import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const survey = await prisma.survey.findUnique({
      where: { publicLink: params.surveyId },
      include: {
        test: {
          select: {
            productName: true,
            description: true,
          }
        }
      }
    })

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    // Check if survey is still open
    if (survey.closeDate && new Date() > survey.closeDate) {
      return NextResponse.json({ error: 'Survey closed' }, { status: 410 })
    }

    // Check response limit
    if (survey.responseLimit && survey.completions >= survey.responseLimit) {
      return NextResponse.json({ error: 'Survey full' }, { status: 410 })
    }

    // Increment views
    await prisma.survey.update({
      where: { id: survey.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({
      survey: {
        id: survey.id,
        sections: survey.sections,
        settings: survey.settings,
        product: survey.test,
      }
    })
  } catch (error) {
    console.error('Error fetching survey:', error)
    return NextResponse.json({ error: 'Failed to fetch survey' }, { status: 500 })
  }
}

