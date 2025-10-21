'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTestCreationStore } from '@/lib/stores/test-creation-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Sparkles, Building2, Target, Lightbulb, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function ProductSetupPage() {
  const router = useRouter()
  const { productInfo, setProductInfo, currentStep, setCurrentStep, validationGoals } = useTestCreationStore()
  
  const [formData, setFormData] = useState<any>(() => {
    const defaultData = {
      // Basic
      name: '',
      description: '',
      category: '',
      industry: '',
      stage: 'idea' as const,
      productType: 'physical' as const,
      priceRange: { min: 0, max: 0, currency: 'USD' },
      productFeatures: [] as string[],
      productFormat: '',
      
      // Company/Brand
      companyName: '',
      companyStory: '',
      founderBackground: '',
      brandValues: [] as string[],
      brandPersonality: [] as string[],
      brandVoice: 'friendly' as const,
      brandMission: '',
      brandVision: '',
      
      // Target Market
      targetAudience: '',
      targetDemographics: {},
      targetPsychographics: {},
      
      // Competition
      competitors: [] as any[],
      uniqueValue: '',
      competitiveAdvantage: [] as string[],
      marketGap: '',
      
      // Market Context
      problemStatement: '',
      solutionStatement: '',
      marketSize: '',
      marketGrowth: '',
      currentChallenges: [] as string[],
      customerJourney: '',
      
      // Brand Assets
      brandAssets: {},
      
      // Social Proof
      existingCustomers: 0,
      customerStories: [] as string[],
      testimonials: [] as any[],
      pressOrAwards: [] as string[],
      socialMedia: [] as any[],
      
      // Additional Context
      culturalContext: '',
      diversityCommitment: '',
      sustainability: '',
      seasonality: '',
      regulatoryContext: '',
      certifications: [] as string[],
      
      // Business Model
      businessModel: 'B2C' as const,
      revenueModel: 'one-time' as const,
      distributionChannels: [] as string[],
      
      // Customer Insights
      existingCustomerFeedback: '',
      commonObjections: [] as string[],
      conversionBarriers: [] as string[],
      keyPurchaseDrivers: [] as string[]
    }
    
    // Merge with existing productInfo, ensuring all required fields exist
    return { ...defaultData, ...productInfo }
  })

  // Auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProductInfo(formData)
    }, 1000) // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId)
  }, [formData, setProductInfo])

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  const addArrayItem = (field: string, value: string = '') => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...prev[field], value]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }))
  }

  const addCompetitor = () => {
    setFormData((prev: any) => ({
      ...prev,
      competitors: [...prev.competitors, { name: '', weakness: '', pricePoint: '', differentiation: '' }]
    }))
  }

  const updateCompetitor = (index: number, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      competitors: prev.competitors.map((comp: any, i: number) => 
        i === index ? { ...comp, [field]: value } : comp
      )
    }))
  }

  const removeCompetitor = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      competitors: prev.competitors.filter((_: any, i: number) => i !== index)
    }))
  }


  const handleNext = async () => {
    try {
      // Save to store for immediate UI updates
      setProductInfo(formData)
      
      // Create test in database
      const response = await fetch('/api/test/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || `${formData.companyName || 'Product'} Validation Test`,
          validationGoals: validationGoals.filter(g => g.selected).map(g => g.id),
          productInfo: formData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save test')
      }

      const result = await response.json()
      
      // Store test ID for later steps
      localStorage.setItem('currentTestId', result.testId)
      
      // Redirect to survey method choice page
      router.push(`/dashboard/test/${result.testId}/survey-method`)
    } catch (error) {
      console.error('Error saving test:', error)
      alert('Failed to save test. Please try again.')
    }
  }


  const handleBack = () => {
    setCurrentStep(1) // Step 1 is goals
    router.push('/dashboard/test/new')
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary">Step 2 of 4</Badge>
          </div>
          <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            Product & Industry Setup
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Tell us about your product, brand, and market positioning
          </p>
        </div>

        <div className="space-y-8">
          {/* Basic Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-500" />
                Basic Product Information
              </CardTitle>
              <CardDescription>
                Core details about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                    placeholder="e.g., Vitality Boost Gummies"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                    placeholder="e.g., Health Supplements"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Detailed Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="Describe your product in detail - what it does, how it works, key benefits..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Industry *</label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => updateField('industry', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Stage *</label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => updateField('stage', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Just an idea</SelectItem>
                      <SelectItem value="prototype">Prototype stage</SelectItem>
                      <SelectItem value="mvp">MVP ready</SelectItem>
                      <SelectItem value="launched">Already launched</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Type *</label>
                  <select
                    value={formData.productType}
                    onChange={(e) => updateField('productType', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  >
                    <option value="physical">Physical Product</option>
                    <option value="digital">Digital Product/App</option>
                    <option value="service">Service</option>
                    <option value="hybrid">Hybrid (Physical + Digital)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Format</label>
                  <input
                    type="text"
                    value={formData.productFormat}
                    onChange={(e) => updateField('productFormat', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                    placeholder="e.g., Gummies, Mobile App, Subscription Box"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range (USD) *</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">Min Price</label>
                    <input
                      type="number"
                      value={formData.priceRange?.min || 0}
                      onChange={(e) => updateNestedField('priceRange', 'min', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">Max Price</label>
                    <input
                      type="number"
                      value={formData.priceRange?.max || 0}
                      onChange={(e) => updateNestedField('priceRange', 'max', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Key Features/Benefits</label>
                <div className="space-y-2">
                  {formData.productFeatures.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.productFeatures]
                          newFeatures[index] = e.target.value
                          updateField('productFeatures', newFeatures)
                        }}
                        className="flex-1 px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                        placeholder="e.g., Natural ingredients, No artificial colors"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('productFeatures', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => addArrayItem('productFeatures', '')}
                  >
                    Add Feature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company & Brand Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary-500" />
                Company & Brand Identity
              </CardTitle>
              <CardDescription>
                Tell us about your company and brand story
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="e.g., Vitality Labs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Story *</label>
                <textarea
                  value={formData.companyStory}
                  onChange={(e) => updateField('companyStory', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="Tell us your company's origin story, mission, and why it exists..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Founder Background</label>
                <textarea
                  value={formData.founderBackground}
                  onChange={(e) => updateField('founderBackground', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="Your experience, credentials, and story..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand Values</label>
                <div className="space-y-2">
                  {formData.brandValues.map((value: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          const newValues = [...formData.brandValues]
                          newValues[index] = e.target.value
                          updateField('brandValues', newValues)
                        }}
                        className="flex-1 px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                        placeholder="e.g., Sustainability, Innovation, Community"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('brandValues', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => addArrayItem('brandValues', '')}
                  >
                    Add Value
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand Mission *</label>
                <textarea
                  value={formData.brandMission}
                  onChange={(e) => updateField('brandMission', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="Why does this brand exist? What problem are you solving?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand Vision</label>
                <textarea
                  value={formData.brandVision}
                  onChange={(e) => updateField('brandVision', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="Where is this brand going? What's the future vision?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Target Market */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-500" />
                Target Market & Problem
              </CardTitle>
              <CardDescription>
                Define your target audience and the problem you're solving
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience *</label>
                <textarea
                  value={formData.targetAudience}
                  onChange={(e) => updateField('targetAudience', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="Describe your ideal customers - age, lifestyle, interests, pain points..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Problem Statement *</label>
                <textarea
                  value={formData.problemStatement}
                  onChange={(e) => updateField('problemStatement', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="What specific problem are you solving for your customers?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Solution Statement *</label>
                <textarea
                  value={formData.solutionStatement}
                  onChange={(e) => updateField('solutionStatement', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="How does your product solve this problem?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Competitive Landscape */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-500" />
                Competitive Landscape
              </CardTitle>
              <CardDescription>
                Understand your competition and differentiation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Unique Value Proposition *</label>
                <textarea
                  value={formData.uniqueValue}
                  onChange={(e) => updateField('uniqueValue', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="What makes your product unique? Why should customers choose you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Market Gap</label>
                <textarea
                  value={formData.marketGap}
                  onChange={(e) => updateField('marketGap', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary"
                  placeholder="What gap in the market are you filling?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Main Competitors</label>
                <div className="space-y-4">
                  {formData.competitors.map((competitor: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1">Competitor Name</label>
                          <input
                            type="text"
                            value={competitor.name}
                            onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary border-light-border-secondary dark:border-dark-border-secondary"
                            placeholder="e.g., Competitor A"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Price Point</label>
                          <input
                            type="text"
                            value={competitor.pricePoint}
                            onChange={(e) => updateCompetitor(index, 'pricePoint', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary border-light-border-secondary dark:border-dark-border-secondary"
                            placeholder="e.g., $25-30"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Their Weakness</label>
                          <input
                            type="text"
                            value={competitor.weakness}
                            onChange={(e) => updateCompetitor(index, 'weakness', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary border-light-border-secondary dark:border-dark-border-secondary"
                            placeholder="e.g., Artificial ingredients"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Your Differentiation</label>
                          <input
                            type="text"
                            value={competitor.differentiation}
                            onChange={(e) => updateCompetitor(index, 'differentiation', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary border-light-border-secondary dark:border-dark-border-secondary"
                            placeholder="e.g., All-natural formula"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompetitor(index)}
                        className="mt-2"
                      >
                        Remove Competitor
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={addCompetitor}
                  >
                    Add Competitor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!formData.name || !formData.description || !formData.category || !formData.industry}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}