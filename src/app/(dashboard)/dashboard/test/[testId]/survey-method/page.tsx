import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { SurveyMethodClient } from './survey-method-client'

export default async function SurveyMethodPage({ params }: { params: { testId: string } }) {
  const test = await prisma.test.findUnique({
    where: { id: params.testId }
  })
  
  if (!test) notFound()
  
  return <SurveyMethodClient test={test} />
}