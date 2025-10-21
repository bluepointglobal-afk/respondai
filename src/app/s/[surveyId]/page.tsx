'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function PublicSurveyPage() {
  const params = useParams()
  const [survey, setSurvey] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    loadSurvey()
  }, [params.surveyId])

  const loadSurvey = async () => {
    try {
      const res = await fetch(`/api/survey/${params.surveyId}`)
      const data = await res.json()
      setSurvey(data.survey)
    } catch (error) {
      console.error('Failed to load survey')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    try {
      await fetch(`/api/survey/${params.surveyId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers,
          timeSpent,
        }),
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit')
      alert('Failed to submit. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card padding="lg" className="max-w-md text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle2 className="h-16 w-16 text-success-light dark:text-success-dark mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary">
              Thank you!
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Your responses have been recorded and will help shape this product.
            </p>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary p-4">
        <Card padding="lg" className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Survey not found</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            This survey may have been closed or the link is incorrect.
          </p>
        </Card>
      </div>
    )
  }

  const section = survey.sections[currentSection]
  const progress = ((currentSection + 1) / survey.sections.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg-primary to-light-bg-secondary dark:from-dark-bg-primary dark:to-dark-bg-secondary py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary">
            {survey.product?.productName}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Help us understand your needs - takes about {survey.settings.estimatedTime} minutes
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              Section {currentSection + 1} of {survey.sections.length}
            </p>
            <p className="text-sm font-semibold text-primary-500">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </div>

        {/* Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="lg" className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary">
                {section.title}
              </h2>
              {section.description && (
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                  {section.description}
                </p>
              )}

              <div className="space-y-8">
                {section.questions.map((q: any, idx: number) => (
                  <QuestionRenderer
                    key={q.id}
                    question={q}
                    questionNumber={idx + 1}
                    value={answers[q.id]}
                    onChange={(val: any) => setAnswers({ ...answers, [q.id]: val })}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentSection(currentSection - 1)}
            disabled={currentSection === 0}
            icon={<ChevronLeft className="h-5 w-5" />}
          >
            Previous
          </Button>

          {currentSection < survey.sections.length - 1 ? (
            <Button
              onClick={() => setCurrentSection(currentSection + 1)}
              icon={<ChevronRight className="h-5 w-5" />}
            >
              Next Section
            </Button>
          ) : (
            <Button onClick={handleSubmit} size="lg">
              Submit Survey
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function QuestionRenderer({ question, questionNumber, value, onChange }: any) {
  return (
    <div className="pb-6 border-b border-light-border-primary dark:border-dark-border-primary last:border-0 last:pb-0">
      <label className="block font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
        {questionNumber}. {question.text}
        {question.required && <span className="text-error-light dark:text-error-dark ml-1">*</span>}
      </label>
      
      {question.helpText && (
        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-4">
          {question.helpText}
        </p>
      )}

      {question.type === 'multiple_choice' && (
        <div className="space-y-2">
          {question.options.map((opt: string, i: number) => (
            <label
              key={i}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                value === opt
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                  : 'border-light-border-primary dark:border-dark-border-primary hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="w-5 h-5 text-primary-500"
              />
              <span className="flex-1 text-light-text-primary dark:text-dark-text-primary">
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'scale' && (
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 rounded-lg">
          <input
            type="range"
            min={question.scaleMin || 1}
            max={question.scaleMax || 10}
            value={value || question.scaleMin || 1}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${((value || question.scaleMin) - question.scaleMin) / (question.scaleMax - question.scaleMin) * 100}%, rgb(226, 232, 240) ${((value || question.scaleMin) - question.scaleMin) / (question.scaleMax - question.scaleMin) * 100}%, rgb(226, 232, 240) 100%)`
            }}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              {question.scaleLabels?.min || question.scaleMin}
            </span>
            <span className="text-2xl font-bold text-primary-500">
              {value || question.scaleMin || 1}
            </span>
            <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              {question.scaleLabels?.max || question.scaleMax}
            </span>
          </div>
        </div>
      )}

      {question.type === 'text_short' && (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer..."
          className="text-base"
        />
      )}

      {question.type === 'text_long' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[120px] rounded-lg border-2 border-light-border-primary dark:border-dark-border-primary bg-light-bg-tertiary dark:bg-dark-bg-tertiary px-4 py-3 text-light-text-primary dark:text-dark-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Share your thoughts..."
        />
      )}

      {question.type === 'yes_no' && (
        <div className="flex gap-4">
          <Button
            variant={value === true ? 'primary' : 'secondary'}
            onClick={() => onChange(true)}
            className="flex-1"
          >
            Yes
          </Button>
          <Button
            variant={value === false ? 'primary' : 'secondary'}
            onClick={() => onChange(false)}
            className="flex-1"
          >
            No
          </Button>
        </div>
      )}
    </div>
  )
}

