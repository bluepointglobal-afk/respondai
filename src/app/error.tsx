'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
