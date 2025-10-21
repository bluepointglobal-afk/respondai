'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function TestPage() {
  const params = useParams()
  const testId = params.testId as string
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching test data for:', testId)
        const response = await fetch(`/api/test/${testId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('📊 Data received:', result)
        setData(result)
      } catch (err) {
        console.error('❌ Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [testId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="p-6">
      <h1>Test Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
