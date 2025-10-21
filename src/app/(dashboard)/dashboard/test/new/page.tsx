'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { QuickStartOptions } from '@/components/test-creation/quick-start-options'
import { DocumentParser } from '@/components/test-creation/document-parser'
import { FastTrackSelector } from '@/components/test-creation/fast-track-selector'
import { useTestCreationStore } from '@/lib/stores/test-creation-store'

type CreationMode = 'options' | 'upload' | 'fast-track' | 'manual'

export default function NewTestPage() {
  const router = useRouter()
  const { setCurrentStep } = useTestCreationStore()
  
  const [mode, setMode] = useState<CreationMode>('options')
  const [parsedData, setParsedData] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const handleModeSelect = (selectedMode: CreationMode) => {
    setMode(selectedMode)
  }

  const handleParsedData = (data: any) => {
    setParsedData(data)
    // Navigate to survey builder with parsed data
    router.push('/revamped-survey-builder')
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    // Navigate to survey builder with template data
    router.push('/revamped-survey-builder')
  }

  const handleBackToOptions = () => {
    setMode('options')
  }

  const renderCurrentMode = () => {
    switch (mode) {
      case 'upload':
        return (
          <DocumentParser
            onParsedData={handleParsedData}
            onBack={handleBackToOptions}
          />
        )
      case 'fast-track':
        return (
          <FastTrackSelector
            onSelectTemplate={handleTemplateSelect}
            onBack={handleBackToOptions}
          />
        )
      case 'manual':
        // For now, redirect to the old manual flow
        router.push('/revamped-survey-builder')
        return null
      default:
        return (
          <QuickStartOptions onSelectOption={handleModeSelect} />
        )
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {renderCurrentMode()}
      </div>
    </DashboardLayout>
  )
}