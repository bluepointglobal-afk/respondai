'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Brain, Play, Sparkles, Plus, BarChart3, Users, Eye, Settings, Calendar, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SurveyCard } from '@/components/dashboard/survey-card'
import { TestStatus, getStatusConfig } from '@/lib/types/test-status'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

interface Test {
  id: string
  name: string
  status: 'DRAFT' | 'SURVEY_BUILDING' | 'AUDIENCE_SETUP' | 'READY_TO_RUN' | 'RUNNING' | 'ANALYZING' | 'COMPLETED' | 'ARCHIVED'
  productInfo: any
  validationGoals: string[]
  createdAt: string
  updatedAt: string
  survey?: {
    id: string
    sections: any
    views: number
    starts: number
    completions: number
  }
  simulation?: {
    id: string
    status: string
    progress: number
  }
  analysis?: {
    id: string
    sampleSize: number
    confidence: number
    shouldLaunch: boolean
  }
  audiences: Array<{
    id: string
    name: string
    isPrimary: boolean
    estimatedSize: number
    targetSampleSize: number
  }>
}


export default function DashboardPage() {
  const searchParams = useSearchParams()
  const testId = searchParams.get('test')
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      setLoading(true)
      console.log('=== FETCHING TESTS ===')
      const response = await fetch('/api/test')
      
      if (!response.ok) {
        throw new Error('Failed to fetch tests')
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      console.log('Tests from API:', data.tests)
      
      setTests(data.tests || [])
      console.log('Tests set in state:', data.tests || [])
      
      // If coming from test creation, show success message
      if (testId) {
        const createdTest = data.tests?.find((t: Test) => t.id === testId)
        if (createdTest) {
          setTimeout(() => {
            alert(`Test "${createdTest.name}" created successfully!`)
          }, 500)
        }
      }
    } catch (err) {
      console.error('Error fetching tests:', err)
      setError('Failed to load tests')
    } finally {
      setLoading(false)
    }
  }

  const hasTests = tests && tests.length > 0

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Button onClick={fetchTests} variant="primary">
              Try Again
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!hasTests) {
    return (
      <DashboardLayout>
        <EmptyState />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Survey Dashboard
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Manage your market research surveys
            </p>
          </div>
          <Link href="/dashboard/test/new">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Create New Survey
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Total Surveys
                </p>
                <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {tests?.length || 0}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Completed Surveys
                </p>
                <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {tests?.filter(t => t.status === 'COMPLETED').length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Total Responses
                </p>
                <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {tests.reduce((sum, t) => sum + (t.survey?.completions || 0), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Avg Confidence
                </p>
                <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {tests?.filter(t => t.analysis).length > 0 
                    ? Math.round(tests.filter(t => t.analysis).reduce((sum, t) => sum + (t.analysis?.confidence || 0), 0) / tests.filter(t => t.analysis).length * 100)
                    : 0}%
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Surveys List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Your Surveys
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tests?.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <SurveyCard test={test} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center px-4"
      >
        {/* Animated Brain Icon */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-block mb-8"
        >
          <div className="relative">
            {/* Pulsing glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-purple rounded-full blur-3xl opacity-30 animate-pulse" />
            
            {/* Icon container */}
            <div className="relative h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-purple p-8 shadow-2xl">
              <Brain className="w-full h-full text-white" />
            </div>

            {/* Floating particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-primary-500"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary">
          Ready to validate your first idea?
        </h1>

        {/* Description */}
        <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-lg mx-auto">
          Create a test and get insights in minutes. Our AI will analyze responses and reveal hidden patterns in your market.
        </p>

        {/* Social proof badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 border border-emerald-200 dark:border-emerald-800/30 mb-8"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
            <span className="text-white text-xl">👋</span>
          </div>
          <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
            &quot;I&apos;ve helped 1,000+ founders validate their ideas&quot;
          </span>
        </motion.div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link href="/dashboard/test/new">
            <Button size="lg" icon={<Sparkles className="h-5 w-5" />}>
              Create Your First Test
            </Button>
          </Link>
          <Link href="/revamped-survey-builder">
          <Button size="lg" variant="secondary" icon={<Play className="h-5 w-5" />}>
              Try Survey Builder
          </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-light-border-primary dark:border-dark-border-primary">
          <Stat icon="🚀" label="1,000+ tests run" />
          <Stat icon="💡" label="$50M+ validated" />
          <Stat icon="⚡" label="2-min setup" />
        </div>
      </motion.div>
    </div>
  )
}

function Stat({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary">
        {label}
      </span>
    </div>
  )
}
