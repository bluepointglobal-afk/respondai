export interface AudienceDefinition {
  // Identity
  id: string
  name: string  // e.g., "Urban Millennials - Health Conscious"
  isPrimary: boolean
  priority: 'primary' | 'secondary' | 'exploratory'
  
  // Demographics (Detailed)
  demographics: {
    age: {
      min: number
      max: number
      distribution: 'uniform' | 'normal' | 'skewed'
    }
    gender: {
      male: number      // % of segment
      female: number
      other: number
      any: boolean      // If gender not relevant
    }
    ethnicity: {
      white: number
      black: number
      hispanic: number
      asian: number
      other: number
      any: boolean
    }
    income: {
      brackets: string[]  // ["$50K-$75K", "$75K-$100K"]
      median: number
      distribution: 'normal' | 'skewed_high' | 'skewed_low'
    }
    education: {
      levels: string[]  // ["Some college", "Bachelor's", "Graduate"]
      distribution: Record<string, number>
    }
    location: {
      type: 'urban' | 'suburban' | 'rural' | 'mixed'
      regions: string[]  // ["Northeast", "West Coast"]
      cities: string[]   // ["New York", "Los Angeles"] (optional)
      density: 'high' | 'medium' | 'low'
    }
    employment: {
      status: string[]   // ["Employed full-time", "Self-employed"]
      occupation: string[]  // ["Professional", "Manager"]
    }
  }
  
  // Psychographics
  psychographics: {
    lifestyle: string[]  // ["Health-conscious", "Tech-savvy", "Budget-minded"]
    values: string[]     // ["Sustainability", "Convenience", "Quality"]
    interests: string[]  // ["Fitness", "Wellness", "Natural products"]
    attitudes: {
      innovation: 'early_adopter' | 'mainstream' | 'laggard'
      brand_loyalty: 'high' | 'medium' | 'low'
      price_sensitivity: 'high' | 'medium' | 'low'
      risk_tolerance: 'high' | 'medium' | 'low'
      health_consciousness: 'high' | 'medium' | 'low'
    }
  }
  
  // Behavioral
  behavioral: {
    category_usage: 'heavy' | 'medium' | 'light' | 'non-user'
    brand_usage: string[]  // Current brands used
    purchase_frequency: string
    channel_preference: string[]  // ["Online", "Retail", "Direct"]
    information_seeking: 'high' | 'medium' | 'low'
  }
  
  // Market Sizing
  market_sizing: {
    // TAM Calculation
    tam_calculation: {
      total_us_population: number  // 333 million
      demographic_filter_rate: number  // % matching demographics
      geographic_filter_rate: number   // % in target locations
      psychographic_filter_rate: number // % matching attitudes
      behavioral_filter_rate: number    // % in category
      
      // Formula: Population × (demo% × geo% × psycho% × behavior%)
      estimated_tam: number  // Final TAM number
      calculation_steps: TAMCalculationStep[]  // Show work
    }
    
    // Market Confidence
    confidence: {
      level: 'high' | 'medium' | 'low'
      factors: string[]  // What drives confidence
      assumptions: string[]  // What we're assuming
      risks: string[]  // What could change estimate
    }
  }
  
  // Sample Size Recommendation
  sample_recommendation: {
    // Statistical Requirements
    minimum_sample: number  // Statistically valid minimum
    recommended_sample: number  // Optimal for analysis
    optimal_sample: number  // For highest confidence
    
    // Calculation Basis
    calculation: {
      confidence_level: number  // 95%
      margin_of_error: number   // ±5%
      expected_proportion: number  // 50% (worst case)
      population_size: number   // From TAM
      design_effect: number     // For clustering
      response_rate: number     // Expected completion rate
      
      formula: string  // Show the formula used
      rationale: string  // Why this sample size
    }
    
    // Practical Considerations
    practical: {
      cost_per_response: number  // Estimated
      total_cost: number
      time_to_collect: string
      feasibility: 'easy' | 'moderate' | 'challenging'
    }
  }
  
  // Strategic Rationale
  strategic: {
    // Why This Audience
    rationale: string  // Full explanation
    
    // Value Proposition Match
    fit_score: number  // 0-100 how well product fits
    fit_reasons: string[]
    
    // Strategic Priority
    priority_score: number  // 0-100
    priority_factors: {
      size: number      // Market size score
      accessibility: number  // Easy to reach score
      receptivity: number    // Likely to adopt score
      profitability: number  // Revenue potential score
    }
    
    // Competitive Context
    competitive: {
      competition_level: 'low' | 'medium' | 'high'
      key_competitors: string[]
      differentiation_opportunity: string
    }
    
    // Expected Performance
    expected_metrics: {
      purchase_intent: number  // Predicted %
      willingness_to_pay: number  // Predicted $
      conversion_rate: number  // Predicted %
      lifetime_value: number   // Predicted $
      confidence: number  // 0-100
    }
  }
  
  // Targeting Guidance
  targeting: {
    channels: string[]  // Best channels to reach
    messaging: string   // Key message themes
    creative: string    // Visual/tonal direction
    timing: string      // Best time to reach
    influencers: string[]  // Key influencer types
  }
}

export interface TAMCalculationStep {
  filter_name: string
  filter_description: string
  penetration_rate: number  // % that passes filter
  calculation: string  // Formula used
  result: number  // Running total
  source: string  // Data source
}

export interface TAMCalculationInput {
  demographics: {
    age_min: number
    age_max: number
    gender: string[]  // ["male", "female"] or ["any"]
    income_min: number
    income_max: number
    education: string[]
    location_type: string[]  // ["urban", "suburban"]
    regions: string[]  // ["Northeast", "West"]
  }
  
  psychographics: {
    health_consciousness: 'high' | 'medium' | 'low' | 'any'
    innovation_adoption: 'early' | 'mainstream' | 'late' | 'any'
    natural_product_preference: 'high' | 'medium' | 'low' | 'any'
    price_sensitivity: 'high' | 'medium' | 'low' | 'any'
  }
  
  behavioral: {
    category_usage: 'heavy' | 'medium' | 'light' | 'non-user' | 'any'
    condition_prevalence?: number  // % with condition (e.g., joint pain)
  }
}

export interface TAMCalculationResult {
  steps: TAMCalculationStep[]
  final_tam: number
  confidence: 'high' | 'medium' | 'low'
  confidence_factors: string[]
  assumptions: string[]
  risks: string[]
}

export interface SampleSizeInput {
  population_size: number  // TAM
  confidence_level: number  // 90, 95, or 99
  margin_of_error: number  // 3, 5, or 10
  expected_proportion: number  // 0.5 default (worst case)
  subgroup_count: number  // Number of segments to analyze
  design_effect: number  // 1.0 = simple random, 1.5 = clustered
  expected_response_rate: number  // 0.8 = 80% completion
}

export interface SampleSizeResult {
  minimum: number
  recommended: number
  optimal: number
  
  calculation: {
    infinite_population: number
    finite_adjusted: number
    design_adjusted: number
    response_adjusted: number
    subgroup_adjusted: number
  }
  
  rationale: string
  cost_estimate: CostEstimate
  feasibility: 'easy' | 'moderate' | 'challenging'
}

export interface CostEstimate {
  cost_per_response: number
  total_cost_minimum: number
  total_cost_recommended: number
  total_cost_optimal: number
  time_estimate: string
}
