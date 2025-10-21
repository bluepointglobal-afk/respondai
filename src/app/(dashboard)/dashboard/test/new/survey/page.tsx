'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  Save,
  Sparkles,
  GripVertical,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { useTestCreationStore, type Question, type QuestionSection } from '@/lib/stores/test-creation-store'

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice', icon: '☑️' },
  { value: 'scale', label: 'Scale (1-10)', icon: '📊' },
  { value: 'yes_no', label: 'Yes/No', icon: '✓✗' },
  { value: 'text_short', label: 'Short Text', icon: '📝' },
  { value: 'text_long', label: 'Long Text', icon: '📄' },
  { value: 'ranking', label: 'Ranking', icon: '🔢' },
]

export default function SurveyBuilderPage() {
  const router = useRouter()
  const {
    productInfo,
    validationGoals,
    audiences,
    survey,
    setSurvey,
    updateSection,
    addSection,
    removeSection,
    updateQuestion,
    addQuestion,
    removeQuestion,
    setCurrentStep,
  } = useTestCreationStore()
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    // Generate survey if we don't have one
    if (!survey && productInfo) {
      generateSurvey()
    }
  }, [])

  const generateSurvey = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInfo, validationGoals, audiences }),
      })
      
      const data = await response.json()
      setSurvey(data.survey)
    } catch (error) {
      console.error('Failed to generate survey:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleContinue = async () => {
    // Save test to database (we'll implement this)
    setCurrentStep(5)
    router.push('/dashboard/test/new/launch')
  }

  const handleBack = () => {
    router.push('/dashboard/test/new/audience')
  }

  const handleAddSection = () => {
    const newSection: QuestionSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      questions: [],
    }
    addSection(newSection)
  }

  const handleAddQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'multiple_choice',
      text: 'New question',
      required: true,
      options: ['Option 1', 'Option 2'],
    }
    addQuestion(sectionId, newQuestion)
    setEditingQuestion(newQuestion.id)
  }

  if (isGenerating) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center max-w-md">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Sparkles className="h-16 w-16 text-primary-500" />
            </motion.div>
            
            <h2 className="text-2xl font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
              AI is building your survey...
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Creating questions optimized for your validation goals
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!survey) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>
  }

  const totalQuestions = survey.sections.reduce((sum, s) => sum + s.questions.length, 0)

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              Step 4 of 5
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-12 rounded-full transition-colors ${
                    i <= 3
                      ? 'bg-primary-500'
                      : 'bg-light-border-primary dark:bg-dark-border-primary'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                Total Questions
              </div>
              <div className="text-2xl font-bold text-primary-500">
                {totalQuestions}
              </div>
            </div>
            
            <Button
              variant="secondary"
              onClick={() => setPreviewMode(!previewMode)}
              icon={<Eye className="h-5 w-5" />}
            >
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-3 text-light-text-primary dark:text-dark-text-primary">
            Your Survey
          </h1>
          
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Review and customize your questions. Estimated time: {survey.settings.estimatedTime} minutes
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8 mb-8">
          {survey.sections.map((section, sIndex) => (
            <Card key={section.id} padding="lg">
              {/* Section Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  {editingQuestion === `section-${section.id}` ? (
                    <div className="space-y-2">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        placeholder="Section title"
                      />
                      <Input
                        value={section.description}
                        onChange={(e) => updateSection(section.id, { description: e.target.value })}
                        placeholder="Section description"
                      />
                      <Button
                        size="sm"
                        onClick={() => setEditingQuestion(null)}
                      >
                        Done
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary">
                        {sIndex + 1}. {section.title}
                      </h2>
                      {section.description && (
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                          {section.description}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingQuestion(`section-${section.id}`)}
                    className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                  </button>
                  {survey.sections.length > 1 && (
                    <button
                      onClick={() => removeSection(section.id)}
                      className="p-2 rounded-lg hover:bg-error-light/10 dark:hover:bg-error-dark/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-error-light dark:text-error-dark" />
                    </button>
                  )}
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {section.questions.map((question, qIndex) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    questionNumber={qIndex + 1}
                    sectionId={section.id}
                    isEditing={editingQuestion === question.id}
                    onEdit={() => setEditingQuestion(question.id)}
                    onSave={() => setEditingQuestion(null)}
                    onRemove={() => removeQuestion(section.id, question.id)}
                    onUpdate={(updates) => updateQuestion(section.id, question.id, updates)}
                  />
                ))}

                {/* Add Question Button */}
                <button
                  onClick={() => handleAddQuestion(section.id)}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-light-border-secondary dark:border-dark-border-secondary hover:border-primary-500 transition-colors group"
                >
                  <div className="flex items-center justify-center gap-2 text-light-text-tertiary dark:text-dark-text-tertiary group-hover:text-primary-500">
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Add Question</span>
                  </div>
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Section Button */}
        <button
          onClick={handleAddSection}
          className="w-full p-6 rounded-lg border-2 border-dashed border-light-border-secondary dark:border-dark-border-secondary hover:border-primary-500 transition-colors group mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-light-text-tertiary dark:text-dark-text-tertiary group-hover:text-primary-500">
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Section</span>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            Back
          </Button>
          
          <Button
            size="lg"
            onClick={handleContinue}
            icon={<CheckCircle2 className="h-5 w-5" />}
          >
            Save & Launch Survey
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

function QuestionCard({
  question,
  questionNumber,
  sectionId,
  isEditing,
  onEdit,
  onSave,
  onRemove,
  onUpdate,
}: {
  question: Question
  questionNumber: number
  sectionId: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onRemove: () => void
  onUpdate: (updates: Partial<Question>) => void
}) {
  const [editedQuestion, setEditedQuestion] = useState(question)

  const handleSave = () => {
    onUpdate(editedQuestion)
    onSave()
  }

  const questionType = QUESTION_TYPES.find(t => t.value === question.type)

  return (
    <div className="p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary">
      {isEditing ? (
        // Edit Mode
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-light-text-tertiary dark:text-dark-text-tertiary">
              Question Type
            </label>
            <select
              value={editedQuestion.type}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, type: e.target.value as any })}
              className="w-full h-10 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary px-3"
            >
              {QUESTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-light-text-tertiary dark:text-dark-text-tertiary">
              Question Text
            </label>
            <textarea
              value={editedQuestion.text}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, text: e.target.value })}
              className="w-full min-h-[80px] rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary px-3 py-2 resize-none"
              placeholder="Enter your question..."
            />
          </div>

          {editedQuestion.type === 'multiple_choice' && (
            <div>
              <label className="block text-xs font-medium mb-1 text-light-text-tertiary dark:text-dark-text-tertiary">
                Options
              </label>
              {(editedQuestion.options || []).map((opt, i) => (
                <Input
                  key={i}
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...(editedQuestion.options || [])]
                    newOptions[i] = e.target.value
                    setEditedQuestion({ ...editedQuestion, options: newOptions })
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="mb-2"
                />
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newOptions = [...(editedQuestion.options || []), '']
                  setEditedQuestion({ ...editedQuestion, options: newOptions })
                }}
              >
                + Add Option
              </Button>
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedQuestion.required}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, required: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Required</span>
            </label>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={onSave}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-sm font-semibold text-primary-500">
                Q{questionNumber}
              </span>
              <div className="flex-1">
                <p className="font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
                  {question.text}
                  {question.required && (
                    <span className="text-error-light dark:text-error-dark ml-1">*</span>
                  )}
                </p>
                {question.helpText && (
                  <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                    {question.helpText}
                  </p>
                )}
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-tertiary dark:text-dark-text-tertiary">
                    {questionType?.icon} {questionType?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              <Edit2 className="h-4 w-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
            </button>
            <button
              onClick={onRemove}
              className="p-2 rounded-lg hover:bg-error-light/10 dark:hover:bg-error-dark/10 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-error-light dark:text-error-dark" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

