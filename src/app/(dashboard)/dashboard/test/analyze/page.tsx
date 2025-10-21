'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProductInfo {
  name: string
  description: string
  industry: string
  targetAudience: string
  problemStatement?: string
  solutionStatement?: string
  uniqueValue?: string
  priceRange?: { min: number; max: number }
  brandValues?: string[]
  companyStory?: string
  companyName?: string
}

export default function ComprehensiveAnalysisPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    description: '',
    industry: '',
    targetAudience: '',
    problemStatement: '',
    solutionStatement: '',
    uniqueValue: '',
    priceRange: { min: 0, max: 0 },
    brandValues: [],
    companyStory: '',
    companyName: ''
  })

  const industries = [
    'health-wellness',
    'beauty-personal-care',
    'food-beverage',
    'technology-software',
    'fashion-apparel',
    'home-garden',
    'fitness-equipment',
    'education-courses',
    'baby-parenting',
    'pet-products',
    'office-productivity'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🚀 Starting comprehensive analysis...')
      
      const response = await fetch('/api/test/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productInfo })
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Analysis complete:', result)

      // Redirect to results page
      router.push(`/dashboard/test/${result.testId}/results`)
      
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Analysis failed. Please check your API configuration and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Comprehensive Product Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Get complete market research insights in one comprehensive AI analysis
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productInfo.name}
                  onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Daily Calm Gummies"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry *
                </label>
                <select
                  required
                  value={productInfo.industry}
                  onChange={(e) => setProductInfo({ ...productInfo, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Description *
              </label>
              <textarea
                required
                rows={4}
                value={productInfo.description}
                onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your product in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Audience *
              </label>
              <input
                type="text"
                required
                value={productInfo.targetAudience}
                onChange={(e) => setProductInfo({ ...productInfo, targetAudience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Health-conscious adults 25-45"
              />
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Additional Information (Optional)
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Problem Statement
                </label>
                <textarea
                  rows={3}
                  value={productInfo.problemStatement}
                  onChange={(e) => setProductInfo({ ...productInfo, problemStatement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="What problem does your product solve?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unique Value Proposition
                </label>
                <input
                  type="text"
                  value={productInfo.uniqueValue}
                  onChange={(e) => setProductInfo({ ...productInfo, uniqueValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="What makes your product unique?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    value={productInfo.priceRange?.min || ''}
                    onChange={(e) => setProductInfo({ 
                      ...productInfo, 
                      priceRange: { ...productInfo.priceRange, min: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    value={productInfo.priceRange?.max || ''}
                    onChange={(e) => setProductInfo({ 
                      ...productInfo, 
                      priceRange: { ...productInfo.priceRange, max: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Run Comprehensive Analysis
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Analysis Preview */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              What You'll Get:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Complete purchase intent analysis with demographic breakdowns</li>
              <li>• Optimal pricing recommendations with Van Westendorp analysis</li>
              <li>• Top benefit identification and messaging optimization</li>
              <li>• Brand fit scoring with confidence intervals</li>
              <li>• 8-12 actionable insights with revenue impact estimates</li>
              <li>• 3-5 statistically significant demographic patterns</li>
              <li>• 3 detailed personas with purchase behavior</li>
              <li>• Risk assessment and mitigation strategies</li>
              <li>• Immediate, near-term, and long-term recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
