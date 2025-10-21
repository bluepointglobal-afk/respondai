'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, Eye, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function ResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResponses()
  }, [params.testId])

  const loadResponses = async () => {
    try {
      const res = await fetch(`/api/test/${params.testId}/responses`)
      const data = await res.json()
      setResponses(data.responses || [])
    } catch (error) {
      console.error('Failed to load responses')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    alert('Export functionality coming soon')
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/test/${params.testId}/results`)}
              className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                Survey Responses
              </h1>
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                {responses.length} responses collected
              </p>
            </div>
          </div>

          <Button onClick={handleExport} icon={<Download className="h-5 w-5" />}>
            Export CSV
          </Button>
        </div>

        {loading ? (
          <Card padding="lg"><div>Loading...</div></Card>
        ) : responses.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
            <h3 className="text-xl font-semibold mb-2">No responses yet</h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Share your survey link to start collecting responses
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {responses.map((response: any) => (
              <Card key={response.id} padding="lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-1">
                      Response #{response.id.slice(-8)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                      <span>{new Date(response.completedAt).toLocaleString()}</span>
                      {response.timeSpent && (
                        <span>Time: {Math.floor(response.timeSpent / 60)}m {response.timeSpent % 60}s</span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs ${
                        response.status === 'COMPLETED' 
                          ? 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark'
                          : 'bg-warning-light/10 text-warning-light'
                      }`}>
                        {response.status}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" icon={<Eye className="h-4 w-4" />}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
