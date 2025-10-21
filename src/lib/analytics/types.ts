/**
 * ROBUST TYPE SYSTEM FOR AI ANALYSIS
 * Comprehensive type definitions with strict validation
 */

// ============================================
// CORE PRODUCT TYPES
// ============================================

export interface ProductInfo {
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

export interface ValidationGoals {
  audience: boolean
  problem: boolean
  solution: boolean
  pricing: boolean
  brand: boolean
}

// ============================================
// AI ANALYSIS TYPES
// ============================================

export interface ExecutiveSummary {
  shouldLaunch: boolean
  confidence: number
  oneLineSummary: string
  keyFindingHighlight: string
}

export interface KeyMetric {
  value: number | string
  subtitle: string
  n: number
  distribution: Record<string, number>
}

export interface KeyMetrics {
  purchaseIntent: KeyMetric
  optimalPrice: KeyMetric
  topBenefit: KeyMetric
  brandFit: KeyMetric
}

export interface Insight {
  id: string
  type: 'opportunity' | 'red-flag' | 'messaging' | 'pricing' | 'market-sizing' | 'quick-win'
  priority: 'high' | 'medium' | 'low'
  headline: string
  narrative: string
  dataSupport: string
  impactScore: number
  revenueImpact: number
  confidence: number
  recommendations: Recommendation[]
}

export interface Recommendation {
  action: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeToValue: string
  estimatedLift: number
  cost: 'low' | 'medium' | 'high'
}

export interface PatternSegment {
  name: string
  size: number
  purchaseIntent: number
  lift: number
  priceAcceptance: number
  brandFit: number
  topBenefits: string[]
  primaryMotivation: string
  concerns: string[]
  preferredFormat?: string
  channelPreference?: string
}

export interface Pattern {
  id: string
  type: 'demographic' | 'psychographic' | 'geographic' | 'behavioral'
  title: string
  description: string
  confidence: number
  pValue: number
  sampleSize: number
  segments: PatternSegment[]
  impact: 'high' | 'medium' | 'low'
  revenueImpact: number
  recommendations: string[]
  messaging: string
}

export interface Persona {
  id: string
  name: string
  title: string
  age: string
  income: string
  location: string
  psychographics: string
  icon: string
  purchaseIntent: number
  priceSensitivity: number
  topBenefits: string[]
  concerns: string[]
  preferredChannels: string[]
}

export interface Risk {
  type: 'market' | 'competitive' | 'execution' | 'financial'
  severity: 'high' | 'medium' | 'low'
  description: string
  mitigation: string
}

export interface TimelineRecommendations {
  immediate: string[]
  nearTerm: string[]
  longTerm: string[]
}

export interface ComprehensiveAnalysisResult {
  executiveSummary: ExecutiveSummary
  keyMetrics: KeyMetrics
  insights: Insight[]
  patterns: Pattern[]
  personas: Persona[]
  recommendations: TimelineRecommendations
  risks: Risk[]
  nextSteps: TimelineRecommendations
}

// ============================================
// DATABASE MAPPING TYPES
// ============================================

export interface DatabaseAnalysis {
  testId: string
  purchaseIntent: {
    avgIntent: number
    distribution: Record<string, number>
    confidence: number
  }
  patterns: Pattern[]
  culturalRisks: Risk[]
  segments: {
    name: string
    size: number
    intent: number
    confidence: number
  }[]
  insights: Insight[]
  executiveSummary: {
    shouldLaunch: boolean
    confidence: number
    keyFindings: string[]
  }
  keyFindings: Insight[]
  sampleSize: number
  dataMode: 'ai-generated' | 'real' | 'hybrid'
  confidence: number
  shouldLaunch: boolean
  launchConfidence: number
  launchReasoning: string
}

export interface DatabasePersona {
  analysisId: string
  name: string
  avatar: string
  age: number
  archetype: string
  demographics: {
    age: string
    income: string
    location: string
  }
  surveyData: {
    purchaseIntent: number
    priceSensitivity: number
    preferredChannels: string[]
    concerns: string[]
  }
  psychographics: {
    values: string
    motivations: string[]
    lifestyle: string
  }
  personality: {
    traits: string[]
    speakingStyle: string
    tone: string
  }
  systemPrompt: string
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors: string[]
  warnings: string[]
}

export interface AnalysisConfig {
  productInfo: ProductInfo
  validationGoals: ValidationGoals
  userId: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface AnalysisResponse {
  success: boolean
  testId?: string
  analysis?: ComprehensiveAnalysisResult
  message?: string
  error?: string
  details?: string
  suggestion?: string
}

// ============================================
// ERROR TYPES
// ============================================

export class AnalysisError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AnalysisError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value?: any
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation: string,
    public details?: any
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}
