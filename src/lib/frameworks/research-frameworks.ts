// Research Framework Foundation - Professional Market Research Methodologies
// This implements industry-standard research objectives and methodologies

export enum ResearchObjective {
  // PRODUCT VALIDATION
  CONCEPT_TESTING = 'concept-testing',
  PRODUCT_MARKET_FIT = 'product-market-fit',
  FEATURE_PRIORITIZATION = 'feature-prioritization',
  USABILITY_VALIDATION = 'usability-validation',
  
  // BRAND & MESSAGING
  BRAND_POSITIONING = 'brand-positioning',
  MESSAGE_TESTING = 'message-testing',
  BRAND_HEALTH = 'brand-health',
  UVP_VALIDATION = 'uvp-validation',
  
  // PRICING
  PRICE_SENSITIVITY = 'price-sensitivity',
  WILLINGNESS_TO_PAY = 'willingness-to-pay',
  PRICING_MODEL = 'pricing-model',
  VALUE_PERCEPTION = 'value-perception',
  
  // MARKET STRATEGY
  MARKET_SEGMENTATION = 'market-segmentation',
  TARGET_AUDIENCE = 'target-audience',
  COMPETITIVE_ANALYSIS = 'competitive-analysis',
  CHANNEL_OPTIMIZATION = 'channel-optimization',
  
  // CUSTOMER INSIGHTS
  JOBS_TO_BE_DONE = 'jobs-to-be-done',
  PAIN_POINT_ANALYSIS = 'pain-point-analysis',
  CUSTOMER_JOURNEY = 'customer-journey',
  OBJECTION_ANALYSIS = 'objection-analysis'
}

export enum ResearchMethodology {
  QUANTITATIVE = 'quantitative',
  QUALITATIVE = 'qualitative',
  MIXED_METHODS = 'mixed-methods',
  LONGITUDINAL = 'longitudinal',
  EXPERIMENTAL = 'experimental'
}

export enum QuestionType {
  // BASIC TYPES
  MULTIPLE_CHOICE_SINGLE = 'multiple-choice-single',
  MULTIPLE_CHOICE_MULTIPLE = 'multiple-choice-multiple',
  SCALE_1_5 = 'scale-1-5',
  SCALE_1_7 = 'scale-1-7',
  SCALE_1_10 = 'scale-1-10',
  YES_NO = 'yes-no',
  TEXT_SHORT = 'text-short',
  TEXT_LONG = 'text-long',
  
  // RESEARCH-SPECIFIC TYPES (CRITICAL)
  NPS = 'nps',                      // Net Promoter Score (0-10)
  MAXDIFF = 'maxdiff',              // Maximum Difference Scaling
  RANKING = 'ranking',              // Drag-and-drop ranking
  MATRIX_SINGLE = 'matrix-single',  // Grid questions (radio)
  MATRIX_MULTIPLE = 'matrix-multiple', // Grid questions (checkbox)
  SEMANTIC_DIFFERENTIAL = 'semantic-differential', // Bipolar scales
  CONSTANT_SUM = 'constant-sum',    // Allocate 100 points
  VAN_WESTENDORP = 'van-westendorp', // 4 price questions
  CONJOINT = 'conjoint',            // Trade-off analysis
  KANO = 'kano',                    // Must-have, Performance, Delighter
  LIKERT_AGREEMENT = 'likert-agreement', // Strongly Disagree to Agree
  LIKERT_SATISFACTION = 'likert-satisfaction', // Very Dissatisfied to Satisfied
  LIKERT_FREQUENCY = 'likert-frequency', // Never to Always
  LIKERT_IMPORTANCE = 'likert-importance', // Not Important to Critical
  PICK_N = 'pick-n',                // Select exactly N options
  HEAT_MAP = 'heat-map',            // Click on image
  SLIDER = 'slider',                // Continuous scale with labels
  DATE = 'date',                    // Date picker
  DROPDOWN = 'dropdown'             // Long list of options
}

export interface ValidationFramework {
  primary_goal: ResearchObjective
  methodology: ResearchMethodology
  required_metrics: Metric[]
  recommended_questions: QuestionTemplate[]
  analysis_outputs: AnalysisOutput[]
  sample_size_guidelines: SampleSizeGuidelines
  completion_time_target: number // minutes
}

export interface Metric {
  name: string
  type: 'quantitative' | 'qualitative' | 'behavioral'
  calculation_method: string
  interpretation_guide: string
  industry_benchmarks?: {
    excellent: number
    good: number
    average: number
    poor: number
  }
}

export interface QuestionTemplate {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  scale?: ScaleDefinition
  required: boolean
  skip_logic?: SkipLogic
  validation_rules?: ValidationRule[]
}

export interface ScaleDefinition {
  min: number
  max: number
  labels: {
    min: string
    max: string
    mid?: string
  }
  type: 'likert' | 'frequency' | 'satisfaction' | 'agreement' | 'importance'
}

export interface SkipLogic {
  condition: string
  skip_to: string
  action: 'skip' | 'show' | 'hide'
}

export interface ValidationRule {
  type: 'required' | 'min_length' | 'max_length' | 'pattern' | 'range'
  value: any
  message: string
}

export interface AnalysisOutput {
  type: 'chart' | 'table' | 'insight' | 'recommendation'
  format: string
  interpretation: string
  action_items: string[]
}

export interface SampleSizeGuidelines {
  minimum: number
  recommended: number
  per_segment_minimum: number
  confidence_level: number
  margin_of_error: number
}

// COMPREHENSIVE RESEARCH FRAMEWORKS
export const RESEARCH_FRAMEWORKS: Record<ResearchObjective, ValidationFramework> = {
  [ResearchObjective.CONCEPT_TESTING]: {
    primary_goal: ResearchObjective.CONCEPT_TESTING,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [
      {
        name: 'Purchase Intent',
        type: 'quantitative',
        calculation_method: 'Top 2 box (Definitely + Probably would buy)',
        interpretation_guide: 'Higher scores indicate stronger market demand',
        industry_benchmarks: { excellent: 0.4, good: 0.3, average: 0.2, poor: 0.1 }
      },
      {
        name: 'Uniqueness Score',
        type: 'quantitative',
        calculation_method: 'Average rating on uniqueness scale',
        interpretation_guide: 'Higher scores indicate better differentiation'
      },
      {
        name: 'Believability Score',
        type: 'quantitative',
        calculation_method: 'Average rating on believability scale',
        interpretation_guide: 'Higher scores indicate concept credibility'
      }
    ],
    recommended_questions: [
      {
        id: 'purchase_intent',
        type: QuestionType.SCALE_1_5,
        text: 'How likely would you be to purchase this product?',
        scale: {
          min: 1,
          max: 5,
          labels: { min: 'Definitely would not buy', max: 'Definitely would buy' },
          type: 'likert'
        },
        required: true
      },
      {
        id: 'uniqueness',
        type: QuestionType.SCALE_1_5,
        text: 'How unique is this product compared to existing solutions?',
        scale: {
          min: 1,
          max: 5,
          labels: { min: 'Not unique at all', max: 'Very unique' },
          type: 'likert'
        },
        required: true
      },
      {
        id: 'believability',
        type: QuestionType.SCALE_1_5,
        text: 'How believable are the claims made about this product?',
        scale: {
          min: 1,
          max: 5,
          labels: { min: 'Not believable', max: 'Very believable' },
          type: 'likert'
        },
        required: true
      }
    ],
    analysis_outputs: [
      {
        type: 'chart',
        format: 'bar_chart',
        interpretation: 'Purchase intent distribution shows market demand',
        action_items: ['Focus on top 2 box respondents', 'Investigate low intent barriers']
      }
    ],
    sample_size_guidelines: {
      minimum: 200,
      recommended: 400,
      per_segment_minimum: 100,
      confidence_level: 0.95,
      margin_of_error: 0.05
    },
    completion_time_target: 12
  },

  [ResearchObjective.PRODUCT_MARKET_FIT]: {
    primary_goal: ResearchObjective.PRODUCT_MARKET_FIT,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [
      {
        name: 'Product-Market Fit Score',
        type: 'quantitative',
        calculation_method: '% saying "very disappointed" if product disappeared',
        interpretation_guide: '40%+ indicates strong PMF',
        industry_benchmarks: { excellent: 0.4, good: 0.3, average: 0.2, poor: 0.1 }
      },
      {
        name: 'NPS Score',
        type: 'quantitative',
        calculation_method: '% Promoters - % Detractors',
        interpretation_guide: 'Positive NPS indicates customer satisfaction'
      },
      {
        name: 'Retention Intent',
        type: 'quantitative',
        calculation_method: '% likely to continue using product',
        interpretation_guide: 'Higher scores indicate stickiness'
      }
    ],
    recommended_questions: [
      {
        id: 'pmf_question',
        type: QuestionType.SCALE_1_5,
        text: 'How would you feel if this product was no longer available?',
        scale: {
          min: 1,
          max: 5,
          labels: { min: 'Very disappointed', max: 'Not disappointed' },
          type: 'satisfaction'
        },
        required: true
      },
      {
        id: 'nps_question',
        type: QuestionType.NPS,
        text: 'How likely are you to recommend this product to a friend or colleague?',
        required: true
      }
    ],
    analysis_outputs: [
      {
        type: 'insight',
        format: 'text',
        interpretation: 'PMF analysis reveals product-market alignment',
        action_items: ['Focus on disappointed segment', 'Improve product features']
      }
    ],
    sample_size_guidelines: {
      minimum: 300,
      recommended: 500,
      per_segment_minimum: 150,
      confidence_level: 0.95,
      margin_of_error: 0.04
    },
    completion_time_target: 15
  },

  [ResearchObjective.FEATURE_PRIORITIZATION]: {
    primary_goal: ResearchObjective.FEATURE_PRIORITIZATION,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [
      {
        name: 'Feature Importance Scores',
        type: 'quantitative',
        calculation_method: 'MaxDiff utility scores',
        interpretation_guide: 'Higher scores indicate greater importance'
      },
      {
        name: 'Kano Classification',
        type: 'qualitative',
        calculation_method: 'Must-be, Performance, Attractive categorization',
        interpretation_guide: 'Strategic feature prioritization'
      }
    ],
    recommended_questions: [
      {
        id: 'maxdiff_questions',
        type: QuestionType.MAXDIFF,
        text: 'Which feature is MOST important and which is LEAST important?',
        required: true
      },
      {
        id: 'kano_questions',
        type: QuestionType.KANO,
        text: 'How would you feel if this feature was/was not included?',
        required: true
      }
    ],
    analysis_outputs: [
      {
        type: 'chart',
        format: 'horizontal_bar',
        interpretation: 'Feature prioritization guides development roadmap',
        action_items: ['Build must-have features first', 'Focus on attractive features']
      }
    ],
    sample_size_guidelines: {
      minimum: 200,
      recommended: 400,
      per_segment_minimum: 100,
      confidence_level: 0.95,
      margin_of_error: 0.05
    },
    completion_time_target: 18
  },

  [ResearchObjective.PRICE_SENSITIVITY]: {
    primary_goal: ResearchObjective.PRICE_SENSITIVITY,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [
      {
        name: 'Optimal Price Point',
        type: 'quantitative',
        calculation_method: 'Van Westendorp intersection analysis',
        interpretation_guide: 'Price point with maximum acceptance'
      },
      {
        name: 'Acceptable Price Range',
        type: 'quantitative',
        calculation_method: 'Range between marginal cheapness and expensiveness',
        interpretation_guide: 'Price flexibility for positioning'
      },
      {
        name: 'Price Sensitivity Index',
        type: 'quantitative',
        calculation_method: 'Range width / optimal price',
        interpretation_guide: 'Lower index = more price sensitive'
      }
    ],
    recommended_questions: [
      {
        id: 'van_westendorp_1',
        type: QuestionType.TEXT_SHORT,
        text: 'At what price would you consider this product TOO EXPENSIVE to buy?',
        required: true
      },
      {
        id: 'van_westendorp_2',
        type: QuestionType.TEXT_SHORT,
        text: 'At what price would you consider this product EXPENSIVE, but still consider buying?',
        required: true
      },
      {
        id: 'van_westendorp_3',
        type: QuestionType.TEXT_SHORT,
        text: 'At what price would you consider this product a GOOD VALUE?',
        required: true
      },
      {
        id: 'van_westendorp_4',
        type: QuestionType.TEXT_SHORT,
        text: 'At what price would you consider this product TOO CHEAP (quality concerns)?',
        required: true
      }
    ],
    analysis_outputs: [
      {
        type: 'chart',
        format: 'line_chart',
        interpretation: 'Price sensitivity curves reveal optimal pricing',
        action_items: ['Set price at optimal point', 'Test within acceptable range']
      }
    ],
    sample_size_guidelines: {
      minimum: 200,
      recommended: 400,
      per_segment_minimum: 100,
      confidence_level: 0.95,
      margin_of_error: 0.05
    },
    completion_time_target: 12
  },

  // Additional frameworks would continue here...
  [ResearchObjective.USABILITY_VALIDATION]: {
    primary_goal: ResearchObjective.USABILITY_VALIDATION,
    methodology: ResearchMethodology.MIXED_METHODS,
    required_metrics: [
      {
        name: 'Task Completion Rate',
        type: 'quantitative',
        calculation_method: '% successfully completing tasks',
        interpretation_guide: 'Higher rates indicate better usability'
      },
      {
        name: 'System Usability Scale',
        type: 'quantitative',
        calculation_method: 'SUS score (0-100)',
        interpretation_guide: 'Scores above 68 are considered good'
      }
    ],
    recommended_questions: [
      {
        id: 'sus_questions',
        type: QuestionType.LIKERT_AGREEMENT,
        text: 'I think that I would like to use this system frequently',
        scale: {
          min: 1,
          max: 5,
          labels: { min: 'Strongly disagree', max: 'Strongly agree' },
          type: 'agreement'
        },
        required: true
      }
    ],
    analysis_outputs: [
      {
        type: 'chart',
        format: 'gauge',
        interpretation: 'SUS score indicates overall usability',
        action_items: ['Improve low-scoring areas', 'Focus on user experience']
      }
    ],
    sample_size_guidelines: {
      minimum: 30,
      recommended: 50,
      per_segment_minimum: 15,
      confidence_level: 0.95,
      margin_of_error: 0.1
    },
    completion_time_target: 20
  },

  // Placeholder frameworks for remaining objectives
  [ResearchObjective.BRAND_POSITIONING]: {
    primary_goal: ResearchObjective.BRAND_POSITIONING,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 15
  },

  [ResearchObjective.MESSAGE_TESTING]: {
    primary_goal: ResearchObjective.MESSAGE_TESTING,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 12
  },

  [ResearchObjective.BRAND_HEALTH]: {
    primary_goal: ResearchObjective.BRAND_HEALTH,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 15
  },

  [ResearchObjective.UVP_VALIDATION]: {
    primary_goal: ResearchObjective.UVP_VALIDATION,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 12
  },

  [ResearchObjective.WILLINGNESS_TO_PAY]: {
    primary_goal: ResearchObjective.WILLINGNESS_TO_PAY,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 12
  },

  [ResearchObjective.PRICING_MODEL]: {
    primary_goal: ResearchObjective.PRICING_MODEL,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 15
  },

  [ResearchObjective.VALUE_PERCEPTION]: {
    primary_goal: ResearchObjective.VALUE_PERCEPTION,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 12
  },

  [ResearchObjective.MARKET_SEGMENTATION]: {
    primary_goal: ResearchObjective.MARKET_SEGMENTATION,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 400, recommended: 1000, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.03 },
    completion_time_target: 20
  },

  [ResearchObjective.TARGET_AUDIENCE]: {
    primary_goal: ResearchObjective.TARGET_AUDIENCE,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 15
  },

  [ResearchObjective.COMPETITIVE_ANALYSIS]: {
    primary_goal: ResearchObjective.COMPETITIVE_ANALYSIS,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 15
  },

  [ResearchObjective.CHANNEL_OPTIMIZATION]: {
    primary_goal: ResearchObjective.CHANNEL_OPTIMIZATION,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 12
  },

  [ResearchObjective.JOBS_TO_BE_DONE]: {
    primary_goal: ResearchObjective.JOBS_TO_BE_DONE,
    methodology: ResearchMethodology.MIXED_METHODS,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 18
  },

  [ResearchObjective.PAIN_POINT_ANALYSIS]: {
    primary_goal: ResearchObjective.PAIN_POINT_ANALYSIS,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 15
  },

  [ResearchObjective.CUSTOMER_JOURNEY]: {
    primary_goal: ResearchObjective.CUSTOMER_JOURNEY,
    methodology: ResearchMethodology.MIXED_METHODS,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 20
  },

  [ResearchObjective.OBJECTION_ANALYSIS]: {
    primary_goal: ResearchObjective.OBJECTION_ANALYSIS,
    methodology: ResearchMethodology.QUANTITATIVE,
    required_metrics: [],
    recommended_questions: [],
    analysis_outputs: [],
    sample_size_guidelines: { minimum: 200, recommended: 400, per_segment_minimum: 100, confidence_level: 0.95, margin_of_error: 0.05 },
    completion_time_target: 12
  }
}

// SURVEY STRUCTURE BEST PRACTICES
export interface SurveyStructure {
  sections: SurveySection[]
  total_time_minutes: number
  question_count: number
}

export interface SurveySection {
  order: number
  name: string
  purpose: string
  questions: QuestionTemplate[]
  logic?: SkipLogic
  timing_seconds: number
}

export const BEST_PRACTICE_SURVEY_FLOW: SurveySection[] = [
  {
    order: 1,
    name: 'Screener',
    purpose: 'Qualify respondents',
    questions: [
      {
        id: 'demographic_filters',
        type: QuestionType.MULTIPLE_CHOICE_SINGLE,
        text: 'What is your age range?',
        options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        required: true
      }
    ],
    timing_seconds: 45
  },
  {
    order: 2,
    name: 'Introduction',
    purpose: 'Set context and expectations',
    questions: [
      {
        id: 'brief_explanation',
        type: QuestionType.TEXT_SHORT,
        text: 'Briefly describe your experience with [category] products',
        required: false
      }
    ],
    timing_seconds: 30
  },
  {
    order: 3,
    name: 'Warmup',
    purpose: 'Build engagement',
    questions: [
      {
        id: 'category_usage',
        type: QuestionType.SCALE_1_5,
        text: 'How often do you use [category] products?',
        scale: {
          min: 1,
          max: 5,
          labels: { min: 'Never', max: 'Daily' },
          type: 'frequency'
        },
        required: true
      }
    ],
    timing_seconds: 60
  },
  {
    order: 4,
    name: 'Core Problem',
    purpose: 'Understand pain points',
    questions: [
      {
        id: 'current_solution',
        type: QuestionType.MULTIPLE_CHOICE_SINGLE,
        text: 'What do you currently use to solve this problem?',
        options: ['Product A', 'Product B', 'Manual process', 'Nothing', 'Other'],
        required: true
      }
    ],
    timing_seconds: 120
  },
  {
    order: 5,
    name: 'Concept Exposure',
    purpose: 'Present concept clearly',
    questions: [
      {
        id: 'concept_description',
        type: QuestionType.TEXT_LONG,
        text: 'Please read the following product description: [CONCEPT]',
        required: true
      }
    ],
    timing_seconds: 90
  },
  {
    order: 6,
    name: 'Concept Evaluation',
    purpose: 'Measure concept reception',
    questions: [
      {
        id: 'purchase_intent',
        type: QuestionType.SCALE_1_5,
        text: 'How likely would you be to purchase this product?',
        scale: {
          min: 1,
          max: 5,
          labels: { min: 'Definitely would not buy', max: 'Definitely would buy' },
          type: 'likert'
        },
        required: true
      }
    ],
    timing_seconds: 180
  },
  {
    order: 7,
    name: 'Pricing',
    purpose: 'Understand price sensitivity',
    questions: [
      {
        id: 'van_westendorp_1',
        type: QuestionType.TEXT_SHORT,
        text: 'At what price would you consider this product TOO EXPENSIVE?',
        required: true
      }
    ],
    timing_seconds: 120
  },
  {
    order: 8,
    name: 'Brand Messaging',
    purpose: 'Test messaging resonance',
    questions: [
      {
        id: 'message_variants',
        type: QuestionType.MULTIPLE_CHOICE_SINGLE,
        text: 'Which message resonates most with you?',
        options: ['Message A', 'Message B', 'Message C', 'None of these'],
        required: true
      }
    ],
    timing_seconds: 90
  },
  {
    order: 9,
    name: 'Open Feedback',
    purpose: 'Capture qualitative insights',
    questions: [
      {
        id: 'why_purchase_or_not',
        type: QuestionType.TEXT_LONG,
        text: 'What would be the main reason you would or would not purchase this product?',
        required: false
      }
    ],
    timing_seconds: 120
  },
  {
    order: 10,
    name: 'Demographics',
    purpose: 'Segmentation analysis',
    questions: [
      {
        id: 'income',
        type: QuestionType.MULTIPLE_CHOICE_SINGLE,
        text: 'What is your annual household income?',
        options: ['Under $25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '$100k+', 'Prefer not to answer'],
        required: false
      }
    ],
    timing_seconds: 60
  }
]

// QUESTION QUALITY STANDARDS
export interface QuestionQualityRules {
  // CLARITY
  no_jargon: boolean
  one_concept_per_question: boolean
  clear_instructions: boolean
  simple_language: boolean
  
  // BIAS PREVENTION
  no_leading_language: boolean
  balanced_scales: boolean
  randomize_options: boolean
  no_loaded_words: boolean
  
  // CULTURAL SENSITIVITY
  inclusive_language: boolean
  culturally_appropriate: boolean
  avoid_assumptions: boolean
  
  // RESPONSE QUALITY
  include_na_option: boolean
  attention_checks: boolean
  prevent_speeding: boolean
  trap_questions: boolean
}

export const DEFAULT_QUALITY_RULES: QuestionQualityRules = {
  no_jargon: true,
  one_concept_per_question: true,
  clear_instructions: true,
  simple_language: true,
  no_leading_language: true,
  balanced_scales: true,
  randomize_options: true,
  no_loaded_words: true,
  inclusive_language: true,
  culturally_appropriate: true,
  avoid_assumptions: true,
  include_na_option: true,
  attention_checks: true,
  prevent_speeding: true,
  trap_questions: true
}

// UTILITY FUNCTIONS
export function getFrameworkByObjective(objective: ResearchObjective): ValidationFramework {
  return RESEARCH_FRAMEWORKS[objective]
}

export function getAllObjectives(): ResearchObjective[] {
  return Object.values(ResearchObjective)
}

export function getObjectivesByCategory(category: 'product' | 'brand' | 'pricing' | 'market' | 'customer'): ResearchObjective[] {
  const categories = {
    product: [ResearchObjective.CONCEPT_TESTING, ResearchObjective.PRODUCT_MARKET_FIT, ResearchObjective.FEATURE_PRIORITIZATION, ResearchObjective.USABILITY_VALIDATION],
    brand: [ResearchObjective.BRAND_POSITIONING, ResearchObjective.MESSAGE_TESTING, ResearchObjective.BRAND_HEALTH, ResearchObjective.UVP_VALIDATION],
    pricing: [ResearchObjective.PRICE_SENSITIVITY, ResearchObjective.WILLINGNESS_TO_PAY, ResearchObjective.PRICING_MODEL, ResearchObjective.VALUE_PERCEPTION],
    market: [ResearchObjective.MARKET_SEGMENTATION, ResearchObjective.TARGET_AUDIENCE, ResearchObjective.COMPETITIVE_ANALYSIS, ResearchObjective.CHANNEL_OPTIMIZATION],
    customer: [ResearchObjective.JOBS_TO_BE_DONE, ResearchObjective.PAIN_POINT_ANALYSIS, ResearchObjective.CUSTOMER_JOURNEY, ResearchObjective.OBJECTION_ANALYSIS]
  }
  
  return categories[category] || []
}

export function validateQuestionQuality(question: QuestionTemplate, rules: QuestionQualityRules = DEFAULT_QUALITY_RULES): string[] {
  const issues: string[] = []
  
  if (rules.no_jargon && question.text.includes('leverage') || question.text.includes('synergy')) {
    issues.push('Avoid jargon - use plain language')
  }
  
  if (rules.one_concept_per_question && question.text.includes(' and ') && question.text.includes('?')) {
    issues.push('Ask only one concept per question')
  }
  
  if (rules.no_leading_language && question.text.toLowerCase().includes('don\'t you agree')) {
    issues.push('Avoid leading language')
  }
  
  return issues
}
