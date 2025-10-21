'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Copy, 
  Eye, 
  Settings,
  FileText,
  BarChart3,
  Star,
  Users,
  DollarSign,
  Heart,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react'

interface QuestionTemplate {
  id: string
  type: 'multiple_choice' | 'scale' | 'yes_no' | 'text_short' | 'text_long' | 'ranking'
  title: string
  description: string
  icon: React.ReactNode
  category: 'demographic' | 'psychographic' | 'behavioral' | 'validation' | 'brand'
  defaultOptions?: string[]
  defaultScale?: { min: number; max: number; labels: { min: string; max: string } }
}

interface Question {
  id: string
  type: string
  text: string
  helpText?: string
  required: boolean
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: { min: string; max: string }
  validationGoal?: string
  analysisCategory?: string
}

interface SurveySection {
  id: string
  title: string
  description: string
  questions: Question[]
}

const questionTemplates: QuestionTemplate[] = [
  // Demographics
  {
    id: 'age_range',
    type: 'multiple_choice',
    title: 'Age Range',
    description: 'Collect age demographic information',
    icon: <Users className="w-5 h-5" />,
    category: 'demographic',
    defaultOptions: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
  },
  {
    id: 'income_level',
    type: 'multiple_choice',
    title: 'Income Level',
    description: 'Understand purchasing power',
    icon: <DollarSign className="w-5 h-5" />,
    category: 'demographic',
    defaultOptions: ['Under $25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '$100k-$150k', '$150k+']
  },
  {
    id: 'education_level',
    type: 'multiple_choice',
    title: 'Education Level',
    description: 'Educational background',
    icon: <FileText className="w-5 h-5" />,
    category: 'demographic',
    defaultOptions: ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Other']
  },

  // Psychographics
  {
    id: 'price_sensitivity',
    type: 'scale',
    title: 'Price Sensitivity',
    description: 'How important is price in your decision?',
    icon: <DollarSign className="w-5 h-5" />,
    category: 'psychographic',
    defaultScale: { min: 1, max: 5, labels: { min: 'Not Important', max: 'Very Important' } }
  },
  {
    id: 'brand_loyalty',
    type: 'scale',
    title: 'Brand Loyalty',
    description: 'How loyal are you to brands you like?',
    icon: <Heart className="w-5 h-5" />,
    category: 'psychographic',
    defaultScale: { min: 1, max: 5, labels: { min: 'Not Loyal', max: 'Very Loyal' } }
  },
  {
    id: 'innovation_adoption',
    type: 'scale',
    title: 'Innovation Adoption',
    description: 'How quickly do you adopt new products?',
    icon: <Zap className="w-5 h-5" />,
    category: 'psychographic',
    defaultScale: { min: 1, max: 5, labels: { min: 'Slow Adopter', max: 'Early Adopter' } }
  },

  // Behavioral
  {
    id: 'purchase_frequency',
    type: 'multiple_choice',
    title: 'Purchase Frequency',
    description: 'How often do you buy this type of product?',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'behavioral',
    defaultOptions: ['Never', 'Rarely', 'Occasionally', 'Frequently', 'Very Frequently']
  },
  {
    id: 'shopping_preferences',
    type: 'multiple_choice',
    title: 'Shopping Preferences',
    description: 'Where do you prefer to shop?',
    icon: <Target className="w-5 h-5" />,
    category: 'behavioral',
    defaultOptions: ['Online', 'In-Store', 'Both Equally', 'Mobile App', 'Social Media']
  },

  // Validation
  {
    id: 'purchase_intent',
    type: 'scale',
    title: 'Purchase Intent',
    description: 'How likely are you to buy this product?',
    icon: <Star className="w-5 h-5" />,
    category: 'validation',
    defaultScale: { min: 1, max: 5, labels: { min: 'Very Unlikely', max: 'Very Likely' } }
  },
  {
    id: 'problem_validation',
    type: 'yes_no',
    title: 'Problem Validation',
    description: 'Does this product solve a problem you have?',
    icon: <Lightbulb className="w-5 h-5" />,
    category: 'validation'
  },
  {
    id: 'feature_importance',
    type: 'ranking',
    title: 'Feature Importance',
    description: 'Rank these features by importance',
    icon: <Star className="w-5 h-5" />,
    category: 'validation',
    defaultOptions: ['Quality', 'Price', 'Brand', 'Convenience', 'Innovation']
  },

  // Brand
  {
    id: 'brand_awareness',
    type: 'multiple_choice',
    title: 'Brand Awareness',
    description: 'How familiar are you with this brand?',
    icon: <Target className="w-5 h-5" />,
    category: 'brand',
    defaultOptions: ['Never Heard', 'Heard of It', 'Somewhat Familiar', 'Very Familiar', 'Regular Customer']
  },
  {
    id: 'brand_perception',
    type: 'scale',
    title: 'Brand Perception',
    description: 'How do you perceive this brand?',
    icon: <Heart className="w-5 h-5" />,
    category: 'brand',
    defaultScale: { min: 1, max: 5, labels: { min: 'Very Negative', max: 'Very Positive' } }
  }
]

interface DragDropSurveyBuilderProps {
  initialSections?: SurveySection[]
  onSave: (sections: SurveySection[]) => void
  onPreview: (sections: SurveySection[]) => void
}

export function DragDropSurveyBuilder({ 
  initialSections = [], 
  onSave, 
  onPreview 
}: DragDropSurveyBuilderProps) {
  const [sections, setSections] = useState<SurveySection[]>(initialSections)
  const [draggedItem, setDraggedItem] = useState<QuestionTemplate | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [editingSection, setEditingSection] = useState<SurveySection | null>(null)

  const addSection = useCallback(() => {
    const newSection: SurveySection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      description: 'Section description',
      questions: []
    }
    setSections(prev => [...prev, newSection])
  }, [])

  const updateSection = useCallback((sectionId: string, updates: Partial<SurveySection>) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ))
  }, [])

  const deleteSection = useCallback((sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId))
  }, [])

  const addQuestionToSection = useCallback((sectionId: string, template: QuestionTemplate) => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      type: template.type,
      text: template.title,
      helpText: template.description,
      required: true,
      options: template.defaultOptions,
      scaleMin: template.defaultScale?.min,
      scaleMax: template.defaultScale?.max,
      scaleLabels: template.defaultScale?.labels,
      validationGoal: template.category === 'validation' ? 'validation' : undefined,
      analysisCategory: template.category
    }

    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    ))
  }, [])

  const updateQuestion = useCallback((sectionId: string, questionId: string, updates: Partial<Question>) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.map(q => 
              q.id === questionId ? { ...q, ...updates } : q
            )
          }
        : section
    ))
  }, [])

  const deleteQuestion = useCallback((sectionId: string, questionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
        : section
    ))
  }, [])

  const duplicateQuestion = useCallback((sectionId: string, question: Question) => {
    const duplicatedQuestion: Question = {
      ...question,
      id: `question_${Date.now()}`,
      text: `${question.text} (Copy)`
    }

    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, questions: [...section.questions, duplicatedQuestion] }
        : section
    ))
  }, [])

  const moveQuestion = useCallback((sectionId: string, fromIndex: number, toIndex: number) => {
    setSections(prev => prev.map(section => {
      if (section.id !== sectionId) return section

      const questions = [...section.questions]
      const [movedQuestion] = questions.splice(fromIndex, 1)
      questions.splice(toIndex, 0, movedQuestion)

      return { ...section, questions }
    }))
  }, [])

  const handleDragStart = (template: QuestionTemplate) => {
    setDraggedItem(template)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault()
    if (draggedItem) {
      addQuestionToSection(sectionId, draggedItem)
      setDraggedItem(null)
    }
  }

  const getTotalQuestions = () => {
    return sections.reduce((total, section) => total + section.questions.length, 0)
  }

  const getEstimatedTime = () => {
    return Math.ceil(getTotalQuestions() * 0.5) // 30 seconds per question
  }

  return (
    <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Survey Builder
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Drag and drop questions to build your survey
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              {getTotalQuestions()} questions • ~{getEstimatedTime()} min
            </div>
            <Button variant="secondary" onClick={() => onPreview(sections)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="primary" onClick={() => onSave(sections)}>
              Save Survey
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Templates Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="default" className="p-4 sticky top-6">
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Question Templates
              </h3>
              
              <div className="space-y-2">
                {Object.entries(
                  questionTemplates.reduce((acc, template) => {
                    if (!acc[template.category]) acc[template.category] = []
                    acc[template.category].push(template)
                    return acc
                  }, {} as Record<string, QuestionTemplate[]>)
                ).map(([category, templates]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2 capitalize">
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {templates.map((template) => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          draggable
                          onDragStart={() => handleDragStart(template)}
                          className="p-3 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border cursor-grab hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center space-x-2">
                            {template.icon}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                                {template.title}
                              </p>
                              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Survey Builder */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {sections.length === 0 ? (
                <Card variant="default" className="p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <FileText className="w-16 h-16 text-light-text-tertiary dark:text-dark-text-tertiary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                      Start Building Your Survey
                    </h3>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                      Add sections and drag questions from the sidebar to create your survey
                    </p>
                    <Button variant="primary" onClick={addSection}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Section
                    </Button>
                  </div>
                </Card>
              ) : (
                sections.map((section, sectionIndex) => (
                  <Card 
                    key={section.id} 
                    variant="default" 
                    className="p-6"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section.id)}
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        {editingSection?.id === section.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingSection.title}
                              onChange={(e) => setEditingSection(prev => 
                                prev ? { ...prev, title: e.target.value } : null
                              )}
                              className="text-lg font-semibold"
                            />
                            <Textarea
                              value={editingSection.description}
                              onChange={(e) => setEditingSection(prev => 
                                prev ? { ...prev, description: e.target.value } : null
                              )}
                              rows={2}
                            />
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  updateSection(section.id, editingSection)
                                  setEditingSection(null)
                                }}
                              >
                                Save
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setEditingSection(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                              {section.title}
                            </h2>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                              {section.description}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingSection(section)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                      {section.questions.length === 0 ? (
                        <div className="p-8 border-2 border-dashed border-light-border dark:border-dark-border rounded-lg text-center">
                          <GripVertical className="w-8 h-8 text-light-text-tertiary dark:text-dark-text-tertiary mx-auto mb-2" />
                          <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Drag questions here to add them to this section
                          </p>
                        </div>
                      ) : (
                        section.questions.map((question, questionIndex) => (
                          <QuestionEditor
                            key={question.id}
                            question={question}
                            onUpdate={(updates) => updateQuestion(section.id, question.id, updates)}
                            onDelete={() => deleteQuestion(section.id, question.id)}
                            onDuplicate={() => duplicateQuestion(section.id, question)}
                            onMoveUp={questionIndex > 0 ? () => moveQuestion(section.id, questionIndex, questionIndex - 1) : undefined}
                            onMoveDown={questionIndex < section.questions.length - 1 ? () => moveQuestion(section.id, questionIndex, questionIndex + 1) : undefined}
                          />
                        ))
                      )}
                    </div>

                    {/* Add Question Button */}
                    <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Add a default text question
                          const newQuestion: Question = {
                            id: `question_${Date.now()}`,
                            type: 'text_short',
                            text: 'New Question',
                            required: true,
                            analysisCategory: 'validation'
                          }
                          setSections(prev => prev.map(s => 
                            s.id === section.id 
                              ? { ...s, questions: [...s.questions, newQuestion] }
                              : s
                          ))
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </Card>
                ))
              )}

              {/* Add Section Button */}
              <Button variant="ghost" onClick={addSection} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface QuestionEditorProps {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onDuplicate: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

function QuestionEditor({ 
  question, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onMoveUp, 
  onMoveDown 
}: QuestionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(question)

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(question)
    setIsEditing(false)
  }

  const renderQuestionPreview = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" disabled className="w-4 h-4" />
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {option}
                </span>
              </div>
            ))}
          </div>
        )
      
      case 'scale':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              {question.scaleLabels?.min}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: (question.scaleMax || 5) - (question.scaleMin || 1) + 1 }, (_, i) => (
                <div key={i} className="w-6 h-6 border border-light-border dark:border-dark-border rounded"></div>
              ))}
            </div>
            <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              {question.scaleLabels?.max}
            </span>
          </div>
        )
      
      case 'yes_no':
        return (
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input type="radio" disabled className="w-4 h-4" />
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Yes</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" disabled className="w-4 h-4" />
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">No</span>
            </div>
          </div>
        )
      
      case 'text_short':
        return (
          <input 
            type="text" 
            disabled 
            placeholder="Short text answer" 
            className="w-full p-2 border border-light-border dark:border-dark-border rounded bg-light-bg-secondary dark:bg-dark-bg-secondary"
          />
        )
      
      case 'text_long':
        return (
          <textarea 
            disabled 
            placeholder="Long text answer" 
            rows={3}
            className="w-full p-2 border border-light-border dark:border-dark-border rounded bg-light-bg-secondary dark:bg-dark-bg-secondary"
          />
        )
      
      case 'ranking':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-6 h-6 border border-light-border dark:border-dark-border rounded flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {option}
                </span>
              </div>
            ))}
          </div>
        )
      
      default:
        return <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">Unknown question type</div>
    }
  }

  return (
    <Card variant="default" className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editData.text}
                onChange={(e) => setEditData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Question text"
              />
              <Textarea
                value={editData.helpText || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, helpText: e.target.value }))}
                placeholder="Help text (optional)"
                rows={2}
              />
              <div className="flex items-center space-x-4">
                <Select
                  value={editData.type}
                  onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="scale">Scale</option>
                  <option value="yes_no">Yes/No</option>
                  <option value="text_short">Short Text</option>
                  <option value="text_long">Long Text</option>
                  <option value="ranking">Ranking</option>
                </Select>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.required}
                    onChange={(e) => setEditData(prev => ({ ...prev, required: e.target.checked }))}
                  />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Required</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary">
                  {question.text}
                </h4>
                {question.required && (
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                )}
                <Badge variant="outline" className="text-xs capitalize">
                  {question.type.replace('_', ' ')}
                </Badge>
              </div>
              {question.helpText && (
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">
                  {question.helpText}
                </p>
              )}
              {renderQuestionPreview()}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDuplicate}>
            <Copy className="w-4 h-4" />
          </Button>
          {onMoveUp && (
            <Button size="sm" variant="ghost" onClick={onMoveUp}>
              ↑
            </Button>
          )}
          {onMoveDown && (
            <Button size="sm" variant="ghost" onClick={onMoveDown}>
              ↓
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
