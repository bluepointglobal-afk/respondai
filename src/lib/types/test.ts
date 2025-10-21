import { IndustryCategory } from '../config/industries'

export interface ProductInfo {
  productName: string
  description: string
  industry: IndustryCategory  // Required - determines which config to use
  targetAudience?: string
}

export interface Persona {
  id: string
  name: string
  title: string
  age: string
  income: string
  location: string
  psychographics: string
  icon?: string
}

export interface TestData {
  id: string
  name: string
  status: 'draft' | 'processing' | 'completed' | 'failed'
  productInfo: ProductInfo
  personas: Persona[]
  createdAt: string
  updatedAt: string
}

export interface TestResult {
  purchaseIntent: number
  optimalPrice: number
  topBenefit: string
  brandFit: number
  insights: Insight[]
  patterns: Pattern[]
}

export interface Insight {
  id: string
  type: 'winner' | 'opportunity' | 'validation' | 'risk'
  title: string
  description: string
  impact?: string
}

export interface Pattern {
  id: string
  type: 'geographic' | 'demographic' | 'psychographic'
  title: string
  description: string
  segments: PatternSegment[]
  revenueImpact?: number
}

export interface PatternSegment {
  name: string
  metrics: {
    label: string
    value: string | number
    change?: string
  }[]
}

