'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Brain,
  Loader2,
  CheckCircle2,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { useTestCreationStore } from '@/lib/stores/test-creation-store'

export default function SimulationPage() {
  const router = useRouter()
  const {
    productInfo,
    validationGoals,
    audiences,
    survey,
    setCurrentStep,
  } = useTestCreationStore()
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleStartAnalysis = async () => {
    setIsRunning(true)
    setProgress(0)
    
    try {
      // Simulate analysis progress
      const stages = [
        { stage: 'Initializing AI Analysis Engine...', progress: 10 },
        { stage: 'Generating Synthetic Responses...', progress: 25 },
        { stage: 'Analyzing Response Patterns...', progress: 50 },
        { stage: 'Creating Customer Personas...', progress: 75 },
        { stage: 'Generating Insights & Recommendations...', progress: 90 },
        { stage: 'Finalizing Results...', progress: 100 },
      ]

      for (const { stage, progress: stageProgress } of stages) {
        setCurrentStage(stage)
        setProgress(stageProgress)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Call the comprehensive analysis API
      const response = await fetch('/api/analysis/comprehensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productInfo,
          validationGoals: validationGoals.filter(g => g.selected).map(g => g.id),
          audiences: audiences.map(a => ({
            name: a.name,
            demographics: a.demographics,
            estimatedSize: a.estimatedSize,
            targetSampleSize: a.sampleSize
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      console.log('Analysis completed:', result)
      
      setAnalysisComplete(true)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleViewResults = () => {
    // Get test ID from localStorage
    const testId = localStorage.getItem('currentTestId')
    if (testId) {
      router.push(`/dashboard/test/${testId}/results`)
    } else {
      router.push('/dashboard/test/new/results')
    }
  }

  const handleBack = () => {
    // Get test ID from localStorage
    const testId = localStorage.getItem('currentTestId')
    if (testId) {
      router.push(`/dashboard/test/${testId}/audience`)
    } else {
      router.push('/dashboard/test/new/audience')
    }
  }

  const totalQuestions = survey?.sections?.reduce((sum, s) => sum + s.questions.length, 0) || 0
  const totalSampleSize = audiences.reduce((sum, a) => sum + a.sampleSize, 0)

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
                className={`h-2 w-12 rounded-full ${
                  i <= 4 ? 'bg-primary-500' : 'bg-light-border dark:bg-dark-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Header */}
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
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold mb-3 text-light-text-primary dark:text-dark-text-primary">
            AI Analysis & Simulation
          </h1>
          
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Run our AI engine to analyze your survey data and generate comprehensive insights about your product validation
          </p>
        </motion.div>

        {/* Analysis Overview */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary">
            Analysis Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {totalQuestions} Questions
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Survey questions to analyze
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {totalSampleSize} Responses
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Synthetic responses to generate
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {audiences.length} Segments
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Target audience segments
              </p>
            </div>
          </div>
        </Card>

        {/* Analysis Progress */}
        {isRunning && (
          <Card padding="lg" className="mb-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">
                Running AI Analysis...
              </h3>
              
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                {currentStage}
              </p>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                {progress}% Complete
              </p>
            </div>
          </Card>
        )}

        {/* Analysis Complete */}
        {analysisComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <Card padding="lg" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-block mb-4"
              >
                <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary">
                🎉 Analysis Complete!
              </h3>
              
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Your comprehensive product validation analysis is ready. View detailed insights, customer personas, and actionable recommendations.
              </p>
              
              <Button 
                onClick={handleViewResults}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Results & Insights
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audience
          </Button>
          
          {!isRunning && !analysisComplete && (
            <Button 
              onClick={handleStartAnalysis}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start AI Analysis
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
