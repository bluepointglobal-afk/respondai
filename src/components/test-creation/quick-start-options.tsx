'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Zap,
  Upload,
  Sparkles,
  Target,
  Users,
  ArrowRight,
  FileImage,
  File,
  CheckCircle,
  Clock,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface QuickStartOptionsProps {
  onSelectOption: (option: 'upload' | 'fast-track' | 'manual') => void
}

export function QuickStartOptions({ onSelectOption }: QuickStartOptionsProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Process file upload
      console.log('File uploaded:', file.name)
      onSelectOption('upload')
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      console.log('File dropped:', file.name)
      onSelectOption('upload')
    }
  }

  const fastTrackTemplates = [
    {
      id: 'saas-startup',
      name: 'SaaS Startup',
      description: 'Perfect for B2B software products',
      icon: Target,
      features: ['Product-market fit', 'Pricing strategy', 'Enterprise sales']
    },
    {
      id: 'ecommerce-brand',
      name: 'E-commerce Brand',
      description: 'Consumer products and retail',
      icon: Users,
      features: ['Consumer behavior', 'Brand positioning', 'Conversion optimization']
    },
    {
      id: 'health-wellness',
      name: 'Health & Wellness',
      description: 'Supplements, fitness, wellness products',
      icon: Sparkles,
      features: ['Health claims', 'Regulatory compliance', 'Trust building']
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Start Your Market Research
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose how you'd like to begin. We'll help you create a comprehensive market research study in minutes.
        </p>
      </div>

      {/* Main Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Document Upload Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="p-6 h-full cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                dragOver ? 'bg-blue-100' : 'bg-blue-50'
              }`}>
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Upload Document</h3>
                <p className="text-gray-600 mt-2">
                  Upload your pitch deck, business plan, or product brief
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>PDF, DOC, TXT supported</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>AI extracts key information</span>
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </Card>
        </motion.div>

        {/* Fast Track Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="p-6 h-full cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectOption('fast-track')}>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Fast Track</h3>
                <p className="text-gray-600 mt-2">
                  Use proven templates for common business types
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>2 minutes setup</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-4 h-4 mr-2" />
                  <span>Best practices included</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Manual Entry Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="p-6 h-full cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectOption('manual')}>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 flex items-center justify-center">
                <File className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Manual Entry</h3>
                <p className="text-gray-600 mt-2">
                  Fill out the form step by step
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Full customization</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Detailed control</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Fast Track Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          Popular Fast Track Templates
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {fastTrackTemplates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectOption('fast-track')}>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <template.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Why Choose RespondAI?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">AI-powered insights</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">500+ synthetic responses</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Results in minutes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
