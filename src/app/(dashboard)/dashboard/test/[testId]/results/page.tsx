'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function TestResultsPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  
  useEffect(() => {
    // Redirect to the comprehensive results page
    router.replace(`/dashboard/test/${testId}/results/comprehensive`)
  }, [testId, router])
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Comprehensive Results...</h2>
          <p className="text-gray-600">Loading your marketing-grade analytics</p>
        </div>
      </div>
    </div>
  )
}