'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Mountain,
  Waves,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

// Mock data
const patternData = {
  pattern1: {
    title: 'Geographic + Values Correlation',
    type: 'geographic',
    segments: [
      {
        name: 'Coastal States (CA, NY, OR, WA)',
        icon: Waves,
        messaging: '"Sustainability" messaging',
        lift: '+32%',
        routinePreference: 'Evening (67%)',
        purchaseModel: 'Subscribe-first (79%)',
        optimalPrice: '$32.99',
        color: 'from-cyan-500 to-blue-500',
      },
      {
        name: 'Mountain/Central (CO, TX, AZ)',
        icon: Mountain,
        messaging: '"Clinical backing" messaging',
        lift: '+41%',
        routinePreference: 'Morning (71%)',
        purchaseModel: 'One-time (68%)',
        optimalPrice: '$26.99',
        color: 'from-amber-500 to-orange-500',
      },
    ],
    heatMapData: {
      CA: { value: 76, color: '#06B6D4' },
      NY: { value: 72, color: '#14B8A6' },
      OR: { value: 68, color: '#10B981' },
      WA: { value: 71, color: '#14B8A6' },
      CO: { value: 65, color: '#F59E0B' },
      TX: { value: 62, color: '#F97316' },
      AZ: { value: 59, color: '#FB923C' },
      FL: { value: 48, color: '#94A3B8' },
      IL: { value: 52, color: '#94A3B8' },
    },
  },
  pattern2: {
    title: 'Ethnicity + Cultural Values',
    type: 'demographic',
    critical: true,
    segments: [
      {
        demographic: 'Black Women 35-50 (Urban)',
        purchaseIntent: 79,
        lift: '+47%',
        messaging: 'Diverse representation',
        keyFactors: ['Diverse representation', 'Community messaging', 'Founder story'],
        revenueImpact: 420000,
        preferredFormat: 'Capsules (not gummies)',
        channelPreference: 'Instagram & TikTok',
      },
      {
        demographic: 'Hispanic Women 25-40',
        purchaseIntent: 71,
        lift: '+34%',
        messaging: 'Family Focus',
        keyFactors: ['Family focus', 'Natural ingredients', 'Value pricing'],
        revenueImpact: 280000,
        preferredFormat: 'Gummies',
        channelPreference: 'Facebook & WhatsApp',
      },
      {
        demographic: 'White Women 30-45',
        purchaseIntent: 64,
        lift: '+18%',
        messaging: 'Clinical',
        keyFactors: ['Clinical studies', 'Third-party testing', 'Wellness trends'],
        revenueImpact: 185000,
        preferredFormat: 'Any format',
        channelPreference: 'Instagram & Pinterest',
      },
      {
        demographic: 'Asian Women 25-35',
        purchaseIntent: 68,
        lift: '+22%',
        messaging: 'Research',
        keyFactors: ['Research-backed', 'Quality ingredients', 'Premium positioning'],
        revenueImpact: 195000,
        preferredFormat: 'Capsules',
        channelPreference: 'Instagram & YouTube',
      },
    ],
  },
}

export default function PatternsPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const [patterns, setPatterns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasPatterns, setHasPatterns] = useState(false)

  useEffect(() => {
    fetchPatterns()
  }, [testId])

  const fetchPatterns = async () => {
    try {
      setLoading(true)
      console.log('Fetching patterns for test:', testId)
      
      const response = await fetch(`/api/test/${testId}/patterns`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patterns: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Patterns received:', data)
      
      if (data.hasPatterns && data.patterns) {
        setPatterns(data.patterns)
        setHasPatterns(true)
      } else {
        setPatterns([])
        setHasPatterns(false)
      }
    } catch (error) {
      console.error('Error fetching patterns:', error)
      setPatterns([])
      setHasPatterns(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/test/${params.testId}/results`)}
              className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-purple to-primary-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  Hidden Pattern Analysis
                </h1>
              </div>
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                Based on 7,240 responses across 12 tests
              </p>
            </div>
          </div>
          <Button variant="secondary" icon={<Download className="h-5 w-5" />}>
            Export Full Report
          </Button>
        </div>

        {/* Pattern Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedPattern('pattern1')}
            className={`
              flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all
              ${
                selectedPattern === 'pattern1'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                  : 'border-light-border-primary dark:border-dark-border-primary hover:border-primary-300 dark:hover:border-primary-700'
              }
            `}
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                PATTERN 1: Geographic + Values Correlation
              </div>
              <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                Regional preferences & messaging
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedPattern('pattern2')}
            className={`
              flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all relative
              ${
                selectedPattern === 'pattern2'
                  ? 'border-accent-purple bg-purple-50 dark:bg-purple-950/20'
                  : 'border-light-border-primary dark:border-dark-border-primary hover:border-accent-purple/50'
              }
            `}
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                PATTERN 2: Ethnicity + Cultural Values
              </div>
              <div className="text-sm text-error-light dark:text-error-dark font-medium">
                (Critical)
              </div>
            </div>
            {patternData.pattern2.critical && (
              <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-error-light dark:bg-error-dark text-white text-xs font-semibold">
                High Impact
              </div>
            )}
          </button>
        </div>

        {/* Pattern Content */}
        {selectedPattern === 'pattern1' ? (
          <GeographicPattern data={patternData.pattern1} />
        ) : (
          <DemographicPattern data={patternData.pattern2} />
        )}

        {/* Schedule Monitoring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card padding="lg" className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-2 border-dashed border-light-border-secondary dark:border-dark-border-secondary">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-1">
                    Schedule Monthly Monitoring
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Track how these patterns evolve over time and get alerts when new patterns emerge
                  </p>
                </div>
              </div>
              <Button variant="primary">
                Enable Monitoring
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

function GeographicPattern({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {/* US Heat Map */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold mb-6 text-light-text-primary dark:text-dark-text-primary">
          US Purchase Intent Heat Map
        </h2>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
          Darker regions show higher purchase intent by region
        </p>

        {/* State Cards Grid (Visual Heat Map Alternative) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {Object.entries(data.heatMapData).map(([state, info]: [string, any]) => {
            const intensity = info.value > 70 ? 'high' : info.value > 60 ? 'medium' : 'low'
            const bgColors = {
              high: 'bg-cyan-500/20 dark:bg-cyan-400/20 border-cyan-500',
              medium: 'bg-amber-500/20 dark:bg-amber-400/20 border-amber-500',
              low: 'bg-slate-500/10 dark:bg-slate-400/10 border-slate-400',
            }

            return (
              <motion.div
                key={state}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Object.keys(data.heatMapData).indexOf(state) * 0.05 }}
                className={`
                  p-3 rounded-lg border-2
                  ${bgColors[intensity]}
                  hover:scale-105 transition-transform cursor-pointer
                `}
              >
                <div className="text-center">
                  <div className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                    {state}
                  </div>
                  <div className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                    {info.value}%
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
          <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
            Purchase Intent:
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-500" />
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                High (70%+)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500" />
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Medium (60-70%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-400" />
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Low (&lt;60%)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-light-border-primary dark:border-dark-border-primary">
          <Button variant="ghost" size="sm">
            View Regional Strategy Recommendations →
          </Button>
        </div>
      </Card>

      {/* Regional Segments */}
      <div className="grid md:grid-cols-2 gap-6">
        {data.segments.map((segment: any, index: number) => (
          <RegionalSegmentCard key={index} segment={segment} />
        ))}
      </div>
    </div>
  )
}

function RegionalSegmentCard({ segment }: { segment: any }) {
  const Icon = segment.icon

  return (
    <Card padding="lg" className="relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${segment.color} opacity-5`} />

      <div className="relative">
        <div className="flex items-start gap-4 mb-6">
          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${segment.color} flex items-center justify-center shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-light-text-primary dark:text-dark-text-primary mb-1">
              {segment.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {segment.messaging}
              </span>
              <Badge variant="success">
                {segment.lift}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              Routine Preference
            </div>
            <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {segment.routinePreference}
            </div>
          </div>
          <div>
            <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              Purchase Model
            </div>
            <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {segment.purchaseModel}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              Optimal Price
            </div>
            <div className="text-2xl font-semibold text-success-light dark:text-success-dark">
              {segment.optimalPrice}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function DemographicPattern({ data }: { data: any }) {
  const maxValue = Math.max(...data.segments.map((s: any) => s.purchaseIntent))

  return (
    <div className="space-y-6">
      {/* Overview Chart */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">
          Purchase Intent by Demographics & Messaging
        </h2>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-8">
          Showing lift with targeted messaging approaches
        </p>

        <div className="space-y-6">
          {data.segments.map((segment: any, index: number) => (
            <DemographicBar key={index} segment={segment} maxValue={maxValue} index={index} />
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-light-border-primary dark:border-dark-border-primary flex items-center justify-between">
          <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
            General Population (Baseline): <span className="font-semibold">46%</span>
          </div>
        </div>
      </Card>

      {/* Detailed Segment Cards */}
      <div className="space-y-6">
        {data.segments.map((segment: any, index: number) => (
          <DetailedSegmentCard key={index} segment={segment} index={index} />
        ))}
      </div>
    </div>
  )
}

function DemographicBar({ segment, maxValue, index }: { segment: any; maxValue: number; index: number }) {
  const percentage = (segment.purchaseIntent / maxValue) * 100

  const colors = [
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-cyan-500',
    'from-blue-500 to-cyan-500',
    'from-amber-500 to-orange-500',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
          {segment.demographic}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-light-text-secondary dark:text-dark-text-secondary">
            {segment.messaging}
          </span>
          <span className="font-bold text-light-text-primary dark:text-dark-text-primary">
            {segment.purchaseIntent}%
          </span>
          <Badge variant="success">
            {segment.lift}
          </Badge>
        </div>
      </div>

      <div className="relative h-8 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[index % colors.length]} rounded-lg`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </motion.div>
  )
}

function DetailedSegmentCard({ segment, index }: { segment: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card padding="lg" variant={index === 0 ? 'insight' : 'default'}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center text-2xl">
            {index === 0 ? '🎯' : index === 1 ? '👨‍👩‍👧' : index === 2 ? '🔬' : '📊'}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
              {segment.demographic}
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Purchase lift with */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-light-text-tertiary dark:text-dark-text-tertiary">
                  Purchase lift with:
                </div>
                {segment.keyFactors.map((factor: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-success-light/10 dark:bg-success-dark/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-3 w-3 text-success-light dark:text-success-dark" />
                    </div>
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {factor}
                    </span>
                  </div>
                ))}
              </div>

              {/* Additional insights */}
              <div className="space-y-3 p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                    Preferred format:
                  </span>
                  <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {segment.preferredFormat}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                    Key messaging:
                  </span>
                  <span className="text-sm font-semibold text-accent-purple">
                    &quot;{segment.messaging}&quot;
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                    Channel preference:
                  </span>
                  <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {segment.channelPreference}
                  </span>
                </div>
              </div>
            </div>

            {/* Revenue Impact */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-success-light/10 to-emerald-500/10 dark:from-success-dark/10 dark:to-emerald-600/10 border border-success-light/20 dark:border-success-dark/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success-light dark:bg-success-dark flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                    Revenue Impact
                  </div>
                  <div className="text-2xl font-bold text-success-light dark:text-success-dark">
                    +${(segment.revenueImpact / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    over 24 months
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                    ROI: 3.2x • Payback: 4.2 months
                  </div>
                </div>
              </div>
            </div>

            {index === 0 && (
              <div className="mt-4">
                <Button variant="primary" size="sm">
                  Generate Segment-Specific Creative Brief →
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
