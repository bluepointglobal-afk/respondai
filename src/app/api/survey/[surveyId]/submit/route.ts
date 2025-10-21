import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const { answers, timeSpent } = await req.json()

    const survey = await prisma.survey.findUnique({
      where: { publicLink: params.surveyId }
    })

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    const response = await prisma.response.create({
      data: {
        testId: survey.testId,
        surveyId: survey.id,
        answers,
        status: 'COMPLETED',
        timeSpent,
        metadata: {
          userAgent: req.headers.get('user-agent'),
          completedAt: new Date().toISOString(),
        },
        completedAt: new Date(),
      }
    })

    await prisma.survey.update({
      where: { id: survey.id },
      data: { completions: { increment: 1 } }
    })

    return NextResponse.json({ success: true, responseId: response.id })
  } catch (error) {
    console.error('Error submitting response:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
