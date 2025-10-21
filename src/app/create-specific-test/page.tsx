'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { ArrowRight, Users, Target } from 'lucide-react'

export default function CreateSpecificTestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    industry: '',
    targetAudience: '',
    ageRange: '',
    gender: '',
    location: '',
    income: '',
    validationGoals: ['product']
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create a comprehensive product info object
      const productInfo = {
        name: formData.productName,
        description: formData.productDescription,
        industry: formData.industry,
        stage: 'idea',
        productType: 'digital',
        priceRange: { min: 0, max: 100, currency: 'USD' },
        productFeatures: [],
        companyName: 'Your Company',
        companyStory: 'We are building innovative products',
        brandValues: [],
        targetAudience: formData.targetAudience,
        competitors: [],
        uniqueValue: '',
        marketGap: ''
      }

      const testData = {
        name: `${formData.productName} Validation Test`,
        productInfo,
        validationGoals: formData.validationGoals
      }

      console.log('Creating test with data:', testData)

      const response = await fetch('/api/test/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })

      if (!response.ok) {
        throw new Error('Failed to create test')
      }

      const result = await response.json()
      console.log('Test created:', result)

      // Navigate to audience page
      router.push(`/dashboard/test/${result.testId}/audience`)
      
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Failed to create test. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              Create Your Specific Test
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Tell us about your product and target audience so we can generate accurate audience segments
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Product Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Product Name *
                  </label>
                  <Input
                    value={formData.productName}
                    onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                    placeholder="e.g., Joint Pain Relief Supplement"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Product Description *
                  </label>
                  <Textarea
                    value={formData.productDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, productDescription: e.target.value }))}
                    placeholder="Describe your product, its benefits, and what makes it unique"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Industry *
                  </label>
                  <Select
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    required
                  >
                    <option value="">Select Industry</option>
                    <option value="health-wellness">Health & Wellness</option>
                    <option value="food-beverage">Food & Beverage</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Target Audience Details
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Target Audience Description *
                  </label>
                  <Input
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="e.g., Men 30-55 in USA with joint pain"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Age Range
                    </label>
                    <Select
                      value={formData.ageRange}
                      onChange={(e) => setFormData(prev => ({ ...prev, ageRange: e.target.value }))}
                    >
                      <option value="">Select Age Range</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="30-55">30-55</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55-64">55-64</option>
                      <option value="65+">65+</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Gender
                    </label>
                    <Select
                      value={formData.gender}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="">Any Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="both">Both</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Location
                    </label>
                    <Select
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    >
                      <option value="">Select Location</option>
                      <option value="usa">USA</option>
                      <option value="canada">Canada</option>
                      <option value="europe">Europe</option>
                      <option value="asia">Asia</option>
                      <option value="global">Global</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Income Level
                    </label>
                    <Select
                      value={formData.income}
                      onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                    >
                      <option value="">Select Income</option>
                      <option value="under-25k">Under $25K</option>
                      <option value="25k-50k">$25K-$50K</option>
                      <option value="50k-75k">$50K-$75K</option>
                      <option value="75k-100k">$75K-$100K</option>
                      <option value="100k-plus">$100K+</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? 'Creating...' : 'Create Test'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
