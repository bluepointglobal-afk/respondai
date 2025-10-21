/**
 * VALIDATION GOAL TYPES
 * Core types for the validation framework
 */

export type ValidationCategory = 
  | 'brand'
  | 'product'
  | 'pricing'
  | 'audience'
  | 'strategy'
  | 'geographic'

export interface ValidationGoal {
  id: string
  category: ValidationCategory
  label: string
  description: string
  selected: boolean
  
  // User inputs (when selected)
  specificDecisions?: string[]  // "Should we launch? Which features?"
  successCriteria?: string      // "60%+ purchase intent at $29.99"
  hypotheses?: string[]          // "Urban millennials have unmet need"
}

export const VALIDATION_GOALS: Omit<ValidationGoal, 'id' | 'selected'>[] = [
  {
    category: 'brand',
    label: 'Brand Messaging & Values',
    description: 'Test brand name, tagline, value proposition, and mission/values alignment',
  },
  {
    category: 'product',
    label: 'Product/Service Concept',
    description: 'Validate problem-solution fit, feature prioritization, and format preferences',
  },
  {
    category: 'pricing',
    label: 'Pricing Strategy',
    description: 'Determine willingness to pay, price sensitivity, and optimal pricing model',
  },
  {
    category: 'audience',
    label: 'Target Audience',
    description: 'Validate demographics, identify early adopters, and prioritize segments',
  },
  {
    category: 'strategy',
    label: 'Market Strategy',
    description: 'Test go-to-market channels, messaging effectiveness, and competitive positioning',
  },
  {
    category: 'geographic',
    label: 'Geographic Expansion',
    description: 'Validate regional preferences, cultural adaptation needs, and launch markets',
  },
]

export interface ValidationGoalDetails {
  decisions: string[]
  successCriteria: string
  hypotheses: string[]
}

/**
 * COMPREHENSIVE PRODUCT & BRAND INFORMATION
 * Collected during test setup to enable personalized persona generation
 */
export interface ProductInfo {
  // === BASIC PRODUCT INFO ===
  name: string
  description: string // Detailed product description
  category: string // e.g., "Health Supplement", "SaaS Tool", "Consumer Product"
  industry: string
  stage: 'idea' | 'prototype' | 'mvp' | 'launched'
  
  // === PRODUCT ATTRIBUTES ===
  productType: 'physical' | 'digital' | 'service' | 'hybrid'
  priceRange: {
    min: number
    max: number
    currency: string
  }
  productFeatures: string[] // Key features/benefits
  productFormat?: string // e.g., "Gummies", "Mobile App", "Subscription Box"
  
  // === COMPANY/BRAND INFORMATION ===
  companyName: string
  companyStory: string // Origin story, mission, why it exists
  founderBackground?: string // Founder's experience, credentials, story
  yearFounded?: number
  teamSize?: string
  
  // Brand Identity
  brandValues: string[] // Core values (e.g., "Sustainability", "Innovation", "Community")
  brandPersonality: string[] // Brand traits (e.g., "Bold", "Trustworthy", "Playful")
  brandVoice: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful' | 'inspiring'
  brandMission: string // Why does this brand exist?
  brandVision: string // Where is this brand going?
  
  // === TARGET MARKET ===
  targetAudience: string // General description
  targetDemographics: {
    ageRange?: string[]
    gender?: string[]
    income?: string[]
    education?: string[]
    location?: string[]
    ethnicity?: string[]
    occupation?: string[]
  }
  targetPsychographics: {
    values?: string[]
    lifestyle?: string[]
    interests?: string[]
    painPoints?: string[]
    goals?: string[]
    behaviors?: string[]
  }
  
  // === COMPETITIVE LANDSCAPE ===
  competitors: {
    name: string
    weakness?: string
    pricePoint?: string
    differentiation?: string
  }[]
  uniqueValue: string // Your unique selling proposition (USP)
  competitiveAdvantage: string[] // What makes you different/better
  marketGap: string // The gap in the market you're filling
  
  // === MARKET CONTEXT ===
  marketSize?: string // TAM estimate (e.g., "$500M", "2.5M potential customers")
  marketGrowth?: string // Market growth rate
  currentChallenges?: string[] // Market challenges you're addressing
  customerJourney?: string // How customers currently solve this problem
  problemStatement: string // The core problem you're solving
  solutionStatement: string // How your product solves it
  
  // === BRAND ASSETS & IDENTITY ===
  brandAssets?: {
    logo?: string
    primaryColor?: string
    secondaryColors?: string[]
    fonts?: string[]
    images?: string[]
    tagline?: string
    keyMessaging?: string[]
  }
  
  // === SOCIAL PROOF & TRACTION ===
  existingCustomers?: number
  customerStories?: string[]
  testimonials?: {
    quote: string
    author: string
    role?: string
  }[]
  pressOrAwards?: string[]
  socialMedia?: {
    platform: string
    handle: string
    followers?: number
  }[]
  
  // === ADDITIONAL CONTEXT ===
  culturalContext?: string // Any cultural/social factors relevant to the product
  diversityCommitment?: string // DE&I approach, representation
  sustainability?: string // Environmental/social responsibility
  seasonality?: string // Is this product seasonal?
  regulatoryContext?: string // Any regulations, certifications, compliance needs
  certifications?: string[] // FDA approved, organic, B-corp, etc.
  
  // === BUSINESS MODEL ===
  businessModel?: 'B2C' | 'B2B' | 'B2B2C' | 'Marketplace'
  revenueModel?: 'one-time' | 'subscription' | 'freemium' | 'ads' | 'hybrid'
  distributionChannels?: string[] // DTC, retail, wholesale, etc.
  
  // === CUSTOMER INSIGHTS (if available) ===
  existingCustomerFeedback?: string
  commonObjections?: string[]
  conversionBarriers?: string[]
  keyPurchaseDrivers?: string[]
}

