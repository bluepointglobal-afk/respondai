'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Star,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { useTestCreationStore, type AudienceSegment } from '@/lib/stores/test-creation-store'

export default function AudienceDefinitionPage() {
  const router = useRouter()
  const {
    productInfo,
    validationGoals,
    audiences,
    setAudiences,
    addAudience,
    removeAudience,
    updateAudience,
    setCurrentStep,
  } = useTestCreationStore()
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    // Generate audiences if we don't have any
    if (audiences.length === 0 && productInfo) {
      generateAudiences()
    }
  }, [])

  const generateAudiences = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-audiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInfo, validationGoals }),
      })
      
      const data = await response.json()
      setAudiences(data.audiences)
    } catch (error) {
      console.error('Failed to generate audiences:', error)
      setAudiences(getDefaultAudiences())
    } finally {
      setIsGenerating(false)
    }
  }

  const handleContinue = () => {
    if (audiences.length === 0) {
      alert('Please add at least one audience segment')
      return
    }
    setCurrentStep(4)
    // After audience definition, go to simulation/analysis
    router.push('/dashboard/test/new/simulation')
  }

  const handleBack = () => {
    // Get test ID from localStorage
    const testId = localStorage.getItem('currentTestId')
    if (testId) {
      router.push(`/dashboard/test/${testId}/survey-method`)
    } else {
      router.push('/dashboard/test/new/product')
    }
  }

  const handleAddCustom = () => {
    const newSegment: AudienceSegment = {
      id: `segment-${Date.now()}`,
      name: 'Custom Segment',
      isPrimary: false,
      demographics: {
        age: [],
        gender: [],
        income: [],
        education: [],
        location: [],
      },
      estimatedSize: 0,
      sampleSize: 100,
    }
    addAudience(newSegment)
    setEditingId(newSegment.id)
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
              AI is analyzing your target market...
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Identifying optimal audience segments based on your product and goals
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const totalSampleSize = audiences.reduce((sum, a) => sum + a.sampleSize, 0)
  const estimatedCost = totalSampleSize * 0 // Free for now, or calculate actual cost

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              Step 3 of 5
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-12 rounded-full transition-colors ${
                    i <= 2
                      ? 'bg-primary-500'
                      : 'bg-light-border-primary dark:bg-dark-border-primary'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {totalSampleSize > 0 && (
            <div className="text-right">
              <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                Total Sample Size
              </div>
              <div className="text-2xl font-bold text-primary-500">
                {totalSampleSize} responses
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-3 text-light-text-primary dark:text-dark-text-primary">
            Your Target Audiences
          </h1>
          
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            We've identified the best audience segments to test. Review, edit, or add your own.
          </p>
        </motion.div>

        {/* Audiences */}
        <div className="space-y-6 mb-8">
          <AnimatePresence>
            {audiences.map((audience, index) => (
              <AudienceCard
                key={audience.id}
                audience={audience}
                index={index}
                isEditing={editingId === audience.id}
                onEdit={() => setEditingId(audience.id)}
                onSave={() => setEditingId(null)}
                onRemove={() => removeAudience(audience.id)}
                onUpdate={(updates) => updateAudience(audience.id, updates)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Add Custom */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleAddCustom}
          className="
            w-full p-6 rounded-lg border-2 border-dashed 
            border-light-border-secondary dark:border-dark-border-secondary 
            hover:border-primary-500 
            bg-light-bg-secondary dark:bg-dark-bg-secondary 
            transition-all duration-200 group
          "
        >
          <div className="flex items-center justify-center gap-3 text-light-text-secondary dark:text-dark-text-secondary group-hover:text-primary-500">
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Custom Audience Segment</span>
          </div>
        </motion.button>

        {/* Pro Tip */}
        <div className="mt-6 p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/30">
          <p className="text-sm text-cyan-900 dark:text-cyan-100">
            💡 <strong>Tip:</strong> Focus on 2-3 specific segments for your first test. You can always run additional tests for other audiences later.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-8">
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
            disabled={audiences.length === 0}
            icon={<ArrowRight className="h-5 w-5" />}
          >
            Continue to Survey Builder
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

function AudienceCard({
  audience,
  index,
  isEditing,
  onEdit,
  onSave,
  onRemove,
  onUpdate,
}: {
  audience: AudienceSegment
  index: number
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onRemove: () => void
  onUpdate: (updates: Partial<AudienceSegment>) => void
}) {
  const [editedAudience, setEditedAudience] = useState(audience)

  const handleSave = () => {
    onUpdate(editedAudience)
    onSave()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card padding="lg" className={`relative ${audience.isPrimary ? 'ring-2 ring-primary-500' : ''}`}>
        {/* Primary Badge */}
        {audience.isPrimary && (
          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Primary Target
          </div>
        )}

        {isEditing ? (
          // Edit Mode
          <div className="space-y-4 pt-2">
            <Input
              value={editedAudience.name}
              onChange={(e) => setEditedAudience({ ...editedAudience, name: e.target.value })}
              placeholder="Segment Name"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-light-text-tertiary dark:text-dark-text-tertiary">
                  Estimated TAM
                </label>
                <Input
                  type="number"
                  value={editedAudience.estimatedSize}
                  onChange={(e) => setEditedAudience({ ...editedAudience, estimatedSize: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-light-text-tertiary dark:text-dark-text-tertiary">
                  Sample Size
                </label>
                <Input
                  type="number"
                  value={editedAudience.sampleSize}
                  onChange={(e) => setEditedAudience({ ...editedAudience, sampleSize: parseInt(e.target.value) || 100 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedAudience.isPrimary}
                onChange={(e) => setEditedAudience({ ...editedAudience, isPrimary: e.target.checked })}
                className="rounded border-light-border-primary dark:border-dark-border-primary"
              />
              <label className="text-sm text-light-text-primary dark:text-dark-text-primary">
                Mark as primary target
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
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">
                  {audience.name}
                </h3>
                
                {/* Demographics Summary */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {audience.demographics.age.length > 0 && (
                    <span className="px-2 py-1 rounded text-xs bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary">
                      Age: {audience.demographics.age.join(', ')}
                    </span>
                  )}
                  {audience.demographics.gender.length > 0 && (
                    <span className="px-2 py-1 rounded text-xs bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary">
                      {audience.demographics.gender.join(', ')}
                    </span>
                  )}
                  {audience.demographics.location.length > 0 && (
                    <span className="px-2 py-1 rounded text-xs bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary">
                      {audience.demographics.location.join(', ')}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      Estimated TAM
                    </div>
                    <div className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                      {formatNumber(audience.estimatedSize)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      Sample Size
                    </div>
                    <div className="text-lg font-bold text-primary-500">
                      {audience.sampleSize} responses
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                {audience.reasoning && (
                  <div className="mt-3 p-3 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {audience.reasoning}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 ml-4">
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
          </div>
        )}
      </Card>
    </motion.div>
  )
}

function getDefaultAudiences(): AudienceSegment[] {
  return [
    {
      id: 'segment-1',
      name: 'Urban Professionals 28-45',
      isPrimary: true,
      demographics: {
        age: ['28-35', '36-45'],
        gender: ['Female', 'Male'],
        income: ['$60-100K', '$100-150K'],
        education: ['Bachelor\'s Degree'],
        location: ['Urban'],
      },
      estimatedSize: 15000000,
      reasoning: 'Primary segment with high purchasing power and adoption rates',
      sampleSize: 150,
    },
  ]
}

