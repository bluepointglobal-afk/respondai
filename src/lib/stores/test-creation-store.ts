import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ValidationGoal } from '@/lib/types/validation'

export interface ProductInfo {
  // Basic
  name: string
  description: string
  category: string
  industry: string
  stage: 'idea' | 'prototype' | 'mvp' | 'launched'
  productType: 'physical' | 'digital' | 'service' | 'hybrid'
  priceRange: { min: number; max: number; currency: string }
  productFeatures: string[]
  productFormat?: string
  
  // Company/Brand
  companyName: string
  companyStory: string
  founderBackground?: string
  yearFounded?: number
  teamSize?: string
  
  brandValues: string[]
  brandPersonality: string[]
  brandVoice: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful' | 'inspiring'
  brandMission: string
  brandVision: string
  
  // Target Market
  targetAudience: string
  targetDemographics: any
  targetPsychographics: any
  
  // Competition
  competitors: any[]
  uniqueValue: string
  competitiveAdvantage: string[]
  marketGap: string
  
  // Market Context
  marketSize?: string
  marketGrowth?: string
  currentChallenges: string[]
  customerJourney?: string
  problemStatement: string
  solutionStatement: string
  
  // Brand Assets
  brandAssets?: any
  
  // Social Proof
  existingCustomers?: number
  customerStories: string[]
  testimonials: any[]
  pressOrAwards: string[]
  socialMedia: any[]
  
  // Additional Context
  culturalContext?: string
  diversityCommitment?: string
  sustainability?: string
  seasonality?: string
  regulatoryContext?: string
  certifications: string[]
  
  // Business Model
  businessModel?: 'B2C' | 'B2B' | 'B2B2C' | 'Marketplace'
  revenueModel?: 'one-time' | 'subscription' | 'freemium' | 'ads' | 'hybrid'
  distributionChannels: string[]
  
  // Customer Insights
  existingCustomerFeedback?: string
  commonObjections: string[]
  conversionBarriers: string[]
  keyPurchaseDrivers: string[]
}

export interface AudienceSegment {
  id: string
  name: string
  isPrimary: boolean
  demographics: {
    age: string[]
    gender: string[]
    ethnicity?: string[]
    income: string[]
    education: string[]
    location: string[]
    geography?: string[]
  }
  psychographics?: {
    values: string[]
    lifestyle: string[]
    painPoints: string[]
  }
  estimatedSize: number
  reasoning?: string
  sampleSize: number
}

export interface QuestionSection {
  id: string
  title: string
  description: string
  questions: Question[]
}

export interface Question {
  id: string
  type: 'multiple_choice' | 'scale' | 'yes_no' | 'text_short' | 'text_long' | 'ranking'
  text: string
  helpText?: string
  required: boolean
  
  // Type-specific configs
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: { min: string; max: string }
  
  // Logic
  showIf?: {
    questionId: string
    condition: 'equals' | 'contains' | 'greater_than'
    value: any
  }
  
  // Metadata
  validationGoal?: string
  analysisCategory?: 'problem' | 'solution' | 'brand' | 'pricing' | 'demographic'
}

interface TestCreationStore {
  // Current step
  currentStep: number
  
  // State
  validationGoals: ValidationGoal[]
  productInfo: ProductInfo | null
  audiences: AudienceSegment[]
  survey: {
    sections: QuestionSection[]
    settings: {
      estimatedTime: number
      showProgressBar: boolean
      allowSaveAndResume: boolean
    }
  } | null
  testId: string | null
  
  // Actions
  setCurrentStep: (step: number) => void
  setValidationGoals: (goals: ValidationGoal[]) => void
  setProductInfo: (info: ProductInfo) => void
  setAudiences: (audiences: AudienceSegment[]) => void
  addAudience: (audience: AudienceSegment) => void
  removeAudience: (id: string) => void
  updateAudience: (id: string, updates: Partial<AudienceSegment>) => void
  setSurvey: (survey: { sections: QuestionSection[]; settings: any }) => void
  addSection: (section: QuestionSection) => void
  updateSection: (sectionId: string, updates: Partial<QuestionSection>) => void
  removeSection: (sectionId: string) => void
  addQuestion: (sectionId: string, question: Question) => void
  updateQuestion: (sectionId: string, questionId: string, updates: Partial<Question>) => void
  removeQuestion: (sectionId: string, questionId: string) => void
  setTestId: (id: string) => void
  reset: () => void
}

const initialState = {
  currentStep: 1,
  validationGoals: [],
  productInfo: null,
  audiences: [],
  survey: null,
  testId: null,
}

export const useTestCreationStore = create<TestCreationStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setValidationGoals: (goals) => set({ validationGoals: goals }),
      
      setProductInfo: (info) => set({ productInfo: info }),
      
      setAudiences: (audiences) => set({ audiences }),
      
      addAudience: (audience) =>
        set((state) => ({ audiences: [...state.audiences, audience] })),
      
      removeAudience: (id) =>
        set((state) => ({
          audiences: state.audiences.filter((a) => a.id !== id),
        })),
      
      updateAudience: (id, updates) =>
        set((state) => ({
          audiences: state.audiences.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      
      setSurvey: (survey) => set({ survey }),
      
      addSection: (section) =>
        set((state) => ({
          survey: state.survey
            ? {
                ...state.survey,
                sections: [...state.survey.sections, section],
              }
            : { sections: [section], settings: { estimatedTime: 0, showProgressBar: true, allowSaveAndResume: true } },
        })),
      
      updateSection: (sectionId, updates) =>
        set((state) => ({
          survey: state.survey
            ? {
                ...state.survey,
                sections: state.survey.sections.map((s) =>
                  s.id === sectionId ? { ...s, ...updates } : s
                ),
              }
            : null,
        })),
      
      removeSection: (sectionId) =>
        set((state) => ({
          survey: state.survey
            ? {
                ...state.survey,
                sections: state.survey.sections.filter((s) => s.id !== sectionId),
              }
            : null,
        })),
      
      addQuestion: (sectionId, question) =>
        set((state) => ({
          survey: state.survey
            ? {
                ...state.survey,
                sections: state.survey.sections.map((s) =>
                  s.id === sectionId
                    ? { ...s, questions: [...s.questions, question] }
                    : s
                ),
              }
            : null,
        })),
      
      updateQuestion: (sectionId, questionId, updates) =>
        set((state) => ({
          survey: state.survey
            ? {
                ...state.survey,
                sections: state.survey.sections.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        questions: s.questions.map((q) =>
                          q.id === questionId ? { ...q, ...updates } : q
                        ),
                      }
                    : s
                ),
              }
            : null,
        })),
      
      removeQuestion: (sectionId, questionId) =>
        set((state) => ({
          survey: state.survey
            ? {
                ...state.survey,
                sections: state.survey.sections.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        questions: s.questions.filter((q) => q.id !== questionId),
                      }
                    : s
                ),
              }
            : null,
        })),
      
      setTestId: (id) => set({ testId: id }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'test-creation-storage',
    }
  )
)
