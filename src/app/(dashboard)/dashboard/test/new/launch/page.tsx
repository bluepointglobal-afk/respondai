'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Rocket, Copy, Check, Mail, Share2, Download, ExternalLink, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { useTestCreationStore } from '@/lib/stores/test-creation-store'

export default function LaunchPage() {
  const router = useRouter()
  const { productInfo, survey, audiences, testId, setTestId, reset } = useTestCreationStore()
  const [localTestId, setLocalTestId] = useState<string | null>(testId)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Clear any old data from the store to ensure fresh start
    console.log('🧹 Clearing old data from store...')
    reset()
    
    if (!testId) {
      saveTest()
    } else {
      setLocalTestId(testId)
    }
  }, [])

  const saveTest = async () => {
    setIsSaving(true)
    
    const newTestId = `test-${Date.now()}`
    setLocalTestId(newTestId)
    setTestId(newTestId)
    
    setTimeout(() => {
      setIsSaving(false)
    }, 2000)
  }

  const surveyLink = localTestId ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/s/${localTestId}` : ''

  const handleCopyLink = () => {
    if (surveyLink) {
      navigator.clipboard.writeText(surveyLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleViewResults = () => {
    if (localTestId) {
      router.push(`/dashboard/test/${localTestId}/results`)
    }
  }

  const totalQuestions = survey?.sections.reduce((sum, s) => sum + s.questions.length, 0) || 0
  const totalSampleSize = audiences.reduce((sum, a) => sum + a.sampleSize, 0)

  if (isSaving) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Rocket className="h-16 w-16 text-primary-500" />
            </motion.div>
            <h2 className="text-2xl font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">
              Launching your survey...
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Setting up data collection
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
            Step 5 of 5
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-2 w-12 rounded-full bg-primary-500"
              />
            ))}
          </div>
        </div>

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-success-light to-emerald-500 dark:from-success-dark dark:to-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold mb-3 text-light-text-primary dark:text-dark-text-primary">
            🎉 Your Survey is Live!
          </h1>
          
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Share the link below to start collecting responses from your target audience
          </p>
        </motion.div>

        {/* Survey Stats */}
        <Card padding="lg" className="mb-6">
          <h3 className="font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
            Survey Details
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                Product
              </div>
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {productInfo?.name}
              </div>
            </div>
            <div>
              <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                Questions
              </div>
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {totalQuestions}
              </div>
            </div>
            <div>
              <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                Target Sample
              </div>
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {totalSampleSize} responses
              </div>
            </div>
          </div>
        </Card>

        {/* Survey Link */}
        <Card padding="lg" className="mb-6">
          <h3 className="font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
            Share Your Survey
          </h3>
          
          <div className="flex gap-2 mb-4">
            <Input
              value={surveyLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              onClick={handleCopyLink}
              icon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="secondary" size="sm" icon={<Mail className="h-4 w-4" />}>
              Email
            </Button>
            <Button variant="secondary" size="sm" icon={<Share2 className="h-4 w-4" />}>
              Social
            </Button>
            <Button variant="secondary" size="sm" icon={<Download className="h-4 w-4" />}>
              QR Code
            </Button>
            <a href={surveyLink} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                Preview
              </Button>
            </a>
          </div>
        </Card>

        {/* Distribution Tips */}
        <Card padding="lg" className="bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800/30 mb-8">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-light-text-primary dark:text-dark-text-primary">
            <span>💡</span>
            Distribution Tips
          </h3>
          <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <li>• Post in relevant subreddits and Facebook groups</li>
            <li>• Share with friends who match your target audience</li>
            <li>• Use Google/Facebook ads for broader reach ($50-100 budget)</li>
            <li>• Offer incentive (e.g., &quot;Enter to win $100 gift card&quot;)</li>
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/test/new/survey')}
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            Back to Survey
          </Button>
          
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              size="lg"
              onClick={handleViewResults}
              icon={<ExternalLink className="h-5 w-5" />}
            >
              View Results
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

