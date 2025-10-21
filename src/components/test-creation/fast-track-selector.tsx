'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Users,
  Sparkles,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Globe,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FastTrackTemplate {
  id: string
  name: string
  description: string
  icon: any
  color: string
  features: string[]
  data: {
    industry: string
    targetAudience: string
    validationGoals: string[]
    bestPractices: string[]
  }
}

interface FastTrackSelectorProps {
  onSelectTemplate: (template: FastTrackTemplate) => void
  onBack: () => void
}

const fastTrackTemplates: FastTrackTemplate[] = [
  {
    id: 'saas-startup',
    name: 'SaaS Startup',
    description: 'Perfect for B2B software products and digital services',
    icon: Target,
    color: 'blue',
    features: ['Product-market fit', 'Pricing strategy', 'Enterprise sales', 'Feature validation'],
    data: {
      industry: 'Technology',
      targetAudience: 'B2B decision makers, CTOs, IT managers',
      validationGoals: ['Product-market fit', 'Pricing strategy', 'Feature validation', 'Competitive positioning'],
      bestPractices: [
        'Focus on enterprise pain points',
        'Emphasize ROI and efficiency gains',
        'Include technical decision makers',
        'Test pricing sensitivity thoroughly'
      ]
    }
  },
  {
    id: 'ecommerce-brand',
    name: 'E-commerce Brand',
    description: 'Consumer products, retail, and direct-to-consumer brands',
    icon: Users,
    color: 'green',
    features: ['Consumer behavior', 'Brand positioning', 'Conversion optimization', 'Market sizing'],
    data: {
      industry: 'Consumer Goods',
      targetAudience: 'Online shoppers, millennials, Gen Z consumers',
      validationGoals: ['Brand positioning', 'Consumer behavior', 'Pricing strategy', 'Market sizing'],
      bestPractices: [
        'Focus on emotional connections',
        'Test brand messaging thoroughly',
        'Include mobile-first consumers',
        'Validate social proof elements'
      ]
    }
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    description: 'Supplements, fitness, wellness products, and health services',
    icon: Sparkles,
    color: 'purple',
    features: ['Health claims', 'Trust building', 'Regulatory compliance', 'Lifestyle fit'],
    data: {
      industry: 'Health & Wellness',
      targetAudience: 'Health-conscious consumers, fitness enthusiasts, wellness seekers',
      validationGoals: ['Health claims validation', 'Trust building', 'Lifestyle fit', 'Pricing strategy'],
      bestPractices: [
        'Emphasize scientific backing',
        'Build trust through testimonials',
        'Focus on lifestyle integration',
        'Address safety concerns upfront'
      ]
    }
  },
  {
    id: 'fintech-startup',
    name: 'FinTech Startup',
    description: 'Financial technology, payments, and digital banking solutions',
    icon: DollarSign,
    color: 'yellow',
    features: ['Trust & security', 'User experience', 'Regulatory compliance', 'Market adoption'],
    data: {
      industry: 'Financial Services',
      targetAudience: 'Digital natives, small business owners, financial advisors',
      validationGoals: ['Trust & security', 'User experience', 'Market adoption', 'Regulatory compliance'],
      bestPractices: [
        'Emphasize security and compliance',
        'Focus on user experience',
        'Include diverse financial backgrounds',
        'Test trust indicators thoroughly'
      ]
    }
  },
  {
    id: 'edtech-platform',
    name: 'EdTech Platform',
    description: 'Educational technology, online learning, and training platforms',
    icon: TrendingUp,
    color: 'indigo',
    features: ['Learning outcomes', 'Engagement metrics', 'Pricing strategy', 'Market adoption'],
    data: {
      industry: 'Education',
      targetAudience: 'Students, educators, corporate trainers, lifelong learners',
      validationGoals: ['Learning outcomes', 'Engagement metrics', 'Pricing strategy', 'Market adoption'],
      bestPractices: [
        'Focus on learning outcomes',
        'Emphasize engagement and retention',
        'Include diverse learning styles',
        'Test mobile accessibility'
      ]
    }
  },
  {
    id: 'sustainability-brand',
    name: 'Sustainability Brand',
    description: 'Eco-friendly products, sustainable solutions, and green technology',
    icon: Globe,
    color: 'emerald',
    features: ['Environmental impact', 'Brand values', 'Price sensitivity', 'Market adoption'],
    data: {
      industry: 'Sustainability',
      targetAudience: 'Eco-conscious consumers, millennials, corporate sustainability teams',
      validationGoals: ['Environmental impact', 'Brand values alignment', 'Price sensitivity', 'Market adoption'],
      bestPractices: [
        'Emphasize environmental impact',
        'Align with consumer values',
        'Address price premium concerns',
        'Include diverse environmental attitudes'
      ]
    }
  }
]

export function FastTrackSelector({ onSelectTemplate, onBack }: FastTrackSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600',
      emerald: 'text-emerald-600',
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <Zap className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Choose Your Fast Track Template</h3>
          <p className="text-gray-600 mt-2">
            Select the template that best matches your business type for instant setup
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fastTrackTemplates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`p-6 cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${getColorClasses(template.color)} flex items-center justify-center`}>
                    <template.icon className={`w-6 h-6 ${getIconColor(template.color)}`} />
                  </div>
                  {selectedTemplate === template.id && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">Key Features:</h5>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">Best Practices:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {template.data.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Selected: {fastTrackTemplates.find(t => t.id === selectedTemplate)?.name}
              </h4>
              <p className="text-gray-600 mt-1">
                This template includes industry best practices and optimized validation goals
              </p>
            </div>
            <Button 
              onClick={() => {
                const template = fastTrackTemplates.find(t => t.id === selectedTemplate)
                if (template) onSelectTemplate(template)
              }}
              className="flex items-center space-x-2"
            >
              <span>Continue with Template</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={onBack}>
          Back to Options
        </Button>
      </div>
    </div>
  )
}
