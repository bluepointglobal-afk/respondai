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
    console.log('TestPage: Starting fetch for testId:', testId)
    fetchData()
  }, [testId])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('TestPage: Fetching data...')
      
      const response = await fetch(`/api/test/${testId}`)
      console.log('TestPage: Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const result = await response.json()
      console.log('TestPage: Data received:', result)
      setData(result)
    } catch (err) {
      console.error('TestPage: Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Data</h2>
        <div className="space-y-2">
          <p><strong>ID:</strong> {data?.id}</p>
          <p><strong>Name:</strong> {data?.name}</p>
          <p><strong>Status:</strong> {data?.status}</p>
          <p><strong>Product:</strong> {data?.productInfo?.name}</p>
        </div>
      </div>
    </div>
  )
}
