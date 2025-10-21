export interface ProductCategoryIntelligence {
  category: ProductCategory
  sub_category: string
  
  // CRITICAL: Category-specific research considerations
  research_considerations: CategoryResearchFramework
  
  // Industry benchmarks
  benchmarks: CategoryBenchmarks
  
  // Regulatory context
  regulatory_requirements: RegulatoryFramework
  
  // Competitive landscape
  competitive_context: CompetitiveIntelligence
  
  // Consumer behavior patterns
  behavior_patterns: ConsumerBehaviorProfile
}

export enum ProductCategory {
  // HEALTH & WELLNESS
  'supplements-vitamins',
  'supplements-herbal',
  'supplements-sports-nutrition',
  'supplements-condition-specific',
  'functional-foods',
  'wellness-devices',
  'telehealth-services',
  
  // FOOD & BEVERAGE
  'beverages-coffee',
  'beverages-tea',
  'beverages-functional',
  'beverages-alcohol',
  'food-snacks',
  'food-meal-replacement',
  'food-specialty-diet',
  
  // TECHNOLOGY
  'saas-productivity',
  'saas-marketing',
  'saas-analytics',
  'mobile-apps',
  'hardware-devices',
  'ai-tools',
  
  // CONSUMER PRODUCTS
  'beauty-skincare',
  'beauty-makeup',
  'personal-care',
  'home-garden',
  'pet-products',
  'baby-products',
  
  // SERVICES
  'financial-services',
  'healthcare-services',
  'education-training',
  'consulting-services',
  'subscription-services',
  
  // ECOMMERCE
  'fashion-clothing',
  'fashion-accessories',
  'electronics',
  'home-furniture',
  'automotive',
  
  // OTHER
  'other'
}

export interface CategoryResearchFramework {
  required_research_areas: ResearchArea[]
  estimated_completion_time: string
  recommended_sample_size: {
    minimum: number
    optimal: number
    rationale: string
  }
}

export interface ResearchArea {
  area: string
  rationale: string
  questions_needed: string[]
  priority: 'must_have' | 'high_priority' | 'medium_priority' | 'low_priority'
}

export interface CategoryBenchmarks {
  average_survey_length: number
  typical_completion_time: string
  common_question_types: string[]
  industry_specific_metrics: string[]
}

export interface RegulatoryFramework {
  compliance_requirements: string[]
  claim_restrictions: string[]
  required_disclaimers: string[]
  safety_considerations: string[]
}

export interface CompetitiveIntelligence {
  category_leaders: string[]
  price_range: { low: number; avg: number; high: number }
  common_features: string[]
  differentiation_opportunities: string[]
  market_maturity: 'emerging' | 'growth' | 'mature' | 'declining'
}

export interface ConsumerBehaviorProfile {
  typical_purchase_cycle: string
  key_decision_factors: string[]
  common_barriers: string[]
  preferred_channels: string[]
  loyalty_patterns: string[]
}

export interface ProductIntelligence {
  // CORE ATTRIBUTES
  core_attributes: {
    product_type: string
    primary_ingredient: string[]
    secondary_ingredients: string[]
    delivery_format: string
    target_condition: string
    target_demographic: string[]
  }
  
  // CLAIMS ANALYSIS
  claims: {
    explicit_claims: string[]
    implied_claims: string[]
    claim_strength: 'strong' | 'moderate' | 'weak'
    regulatory_risk: 'high' | 'medium' | 'low'
    evidence_needed: string[]
  }
  
  // COMPETITIVE CONTEXT
  competitive_intel: {
    category_leaders: string[]
    price_range: { low: number; avg: number; high: number }
    common_features: string[]
    differentiation_opportunities: string[]
    market_maturity: 'emerging' | 'growth' | 'mature' | 'declining'
  }
  
  // RESEARCH IMPLICATIONS
  research_implications: {
    must_validate: string[]
    should_validate: string[]
    nice_to_validate: string[]
    regulatory_requirements: string[]
  }
  
  // AUDIENCE INSIGHTS
  audience_profile: {
    likely_demographics: {
      age_range: string
      gender_skew: string
      income_level: string
      education: string
      location: string
    }
    
    likely_psychographics: {
      health_consciousness: 'high' | 'medium' | 'low'
      natural_product_preference: 'high' | 'medium' | 'low'
      risk_tolerance: 'high' | 'medium' | 'low'
      information_seeking: 'high' | 'medium' | 'low'
    }
    
    likely_behaviors: {
      current_category_usage: 'heavy' | 'medium' | 'light' | 'non-user'
      brand_loyalty: 'high' | 'medium' | 'low'
      price_sensitivity: 'high' | 'medium' | 'low'
      channel_preference: string[]
    }
  }
}

export interface QuestionSelectionEngine {
  inputs: {
    product_description: string
    target_audience: string
    validation_goals: string[]
    industry_category: string
    competitive_context: string
  }
  
  selection_algorithm: {
    product_attributes: {
      condition: string
      ingredient: string[]
      format: string
      target_demographic: string
      claims: string[]
    }
    
    priority_areas: {
      must_have: string[]
      high_priority: string[]
      medium_priority: string[]
      low_priority: string[]
    }
    
    question_selection: {
      from_each_area: number
      prioritize_by: 'relevance' | 'importance' | 'impact'
      max_total_questions: number
      target_completion_time: number
    }
    
    customization: {
      replace_generic_terms: boolean
      add_product_specific_options: boolean
      adjust_for_target_audience: boolean
      maintain_benchmark_compatibility: boolean
    }
  }
}
