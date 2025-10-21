import { ProductIntelligence, ProductCategory } from './types'

export class ProductParser {
  private categoryIntelligence: Map<ProductCategory, any> = new Map()
  
  constructor() {
    this.initializeCategoryIntelligence()
  }

  parse(productDescription: string): ProductIntelligence {
    const productText = productDescription.toLowerCase()
    
    // Extract core attributes
    const coreAttributes = this.extractCoreAttributes(productText)
    
    // Analyze claims
    const claims = this.analyzeClaims(productText)
    
    // Determine competitive context
    const competitiveIntel = this.determineCompetitiveContext(coreAttributes.category)
    
    // Generate research implications
    const researchImplications = this.generateResearchImplications(coreAttributes, claims)
    
    // Build audience profile
    const audienceProfile = this.buildAudienceProfile(coreAttributes, claims)
    
    return {
      core_attributes: coreAttributes,
      claims,
      competitive_intel: competitiveIntel,
      research_implications: researchImplications,
      audience_profile: audienceProfile
    }
  }

  private extractCoreAttributes(productText: string) {
    const attributes = {
      product_type: this.detectProductType(productText),
      primary_ingredient: this.extractIngredients(productText),
      secondary_ingredients: this.extractSecondaryIngredients(productText),
      delivery_format: this.detectDeliveryFormat(productText),
      target_condition: this.extractTargetCondition(productText),
      target_demographic: this.extractTargetDemographic(productText)
    }
    
    return attributes
  }

  private detectProductType(text: string): string {
    const productTypes = {
      'supplement': ['supplement', 'vitamin', 'capsule', 'tablet', 'powder', 'gummy'],
      'beverage': ['coffee', 'tea', 'drink', 'beverage', 'juice', 'smoothie'],
      'food': ['snack', 'bar', 'meal', 'food', 'protein', 'energy'],
      'beauty': ['skincare', 'makeup', 'beauty', 'cream', 'serum', 'lotion'],
      'saas': ['software', 'app', 'platform', 'tool', 'saas', 'dashboard'],
      'device': ['device', 'gadget', 'tracker', 'monitor', 'sensor']
    }
    
    for (const [type, keywords] of Object.entries(productTypes)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return type
      }
    }
    
    return 'other'
  }

  private extractIngredients(text: string): string[] {
    const commonIngredients = [
      'turmeric', 'curcumin', 'ginseng', 'caffeine', 'protein', 'collagen',
      'omega-3', 'vitamin d', 'vitamin c', 'magnesium', 'zinc', 'iron',
      'probiotics', 'prebiotics', 'antioxidants', 'green tea', 'matcha',
      'ashwagandha', 'rhodiola', 'mushroom', 'adaptogen', 'electrolytes'
    ]
    
    const foundIngredients = commonIngredients.filter(ingredient => 
      text.includes(ingredient)
    )
    
    return foundIngredients
  }

  private extractSecondaryIngredients(text: string): string[] {
    const secondaryKeywords = [
      'bioperine', 'black pepper', 'piperine', 'lecithin', 'mct oil',
      'stevia', 'natural flavors', 'preservatives', 'binder', 'filler'
    ]
    
    return secondaryKeywords.filter(ingredient => text.includes(ingredient))
  }

  private detectDeliveryFormat(text: string): string {
    const formats = {
      'capsules': ['capsule', 'cap'],
      'tablets': ['tablet', 'pill'],
      'powder': ['powder', 'mix'],
      'liquid': ['liquid', 'drops', 'syrup'],
      'gummies': ['gummy', 'chewable'],
      'cream': ['cream', 'lotion', 'serum'],
      'ground': ['ground', 'whole bean'],
      'instant': ['instant', 'ready-to-drink']
    }
    
    for (const [format, keywords] of Object.entries(formats)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return format
      }
    }
    
    return 'unknown'
  }

  private extractTargetCondition(text: string): string {
    const conditions = {
      'joint pain': ['joint', 'arthritis', 'inflammation', 'pain'],
      'energy': ['energy', 'fatigue', 'tired', 'boost'],
      'focus': ['focus', 'concentration', 'mental', 'cognitive'],
      'sleep': ['sleep', 'insomnia', 'rest', 'relaxation'],
      'weight': ['weight', 'fat loss', 'metabolism', 'burn'],
      'immune': ['immune', 'immunity', 'cold', 'flu'],
      'digestive': ['digestive', 'gut', 'stomach', 'bloating'],
      'skin': ['skin', 'acne', 'wrinkles', 'aging']
    }
    
    for (const [condition, keywords] of Object.entries(conditions)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return condition
      }
    }
    
    return 'general wellness'
  }

  private extractTargetDemographic(text: string): string[] {
    const demographics = []
    
    if (text.includes('men') || text.includes('male')) {
      demographics.push('men')
    }
    if (text.includes('women') || text.includes('female')) {
      demographics.push('women')
    }
    if (text.includes('senior') || text.includes('elderly')) {
      demographics.push('seniors')
    }
    if (text.includes('athlete') || text.includes('fitness')) {
      demographics.push('athletes')
    }
    if (text.includes('professional') || text.includes('executive')) {
      demographics.push('professionals')
    }
    
    return demographics.length > 0 ? demographics : ['general adult']
  }

  private analyzeClaims(text: string) {
    const explicitClaims = this.extractExplicitClaims(text)
    const impliedClaims = this.extractImpliedClaims(text)
    
    return {
      explicit_claims: explicitClaims,
      implied_claims: impliedClaims,
      claim_strength: this.assessClaimStrength(explicitClaims, impliedClaims),
      regulatory_risk: this.assessRegulatoryRisk(explicitClaims),
      evidence_needed: this.determineEvidenceNeeded(explicitClaims, impliedClaims)
    }
  }

  private extractExplicitClaims(text: string): string[] {
    const claimPatterns = [
      /supports?\s+([^.!?]+)/gi,
      /helps?\s+([^.!?]+)/gi,
      /improves?\s+([^.!?]+)/gi,
      /reduces?\s+([^.!?]+)/gi,
      /enhances?\s+([^.!?]+)/gi,
      /boosts?\s+([^.!?]+)/gi
    ]
    
    const claims: string[] = []
    
    claimPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        claims.push(...matches.map(match => match.trim()))
      }
    })
    
    return [...new Set(claims)] // Remove duplicates
  }

  private extractImpliedClaims(text: string): string[] {
    const impliedKeywords = {
      'natural': ['natural', 'organic', 'plant-based'],
      'clinically proven': ['clinically', 'studies', 'research'],
      'premium': ['premium', 'high-quality', 'superior'],
      'fast acting': ['fast', 'quick', 'rapid', 'immediate'],
      'safe': ['safe', 'gentle', 'non-toxic']
    }
    
    const impliedClaims: string[] = []
    
    for (const [claim, keywords] of Object.entries(impliedKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        impliedClaims.push(claim)
      }
    }
    
    return impliedClaims
  }

  private assessClaimStrength(explicit: string[], implied: string[]): 'strong' | 'moderate' | 'weak' {
    const strongIndicators = ['clinically proven', 'studies show', 'research-backed']
    const moderateIndicators = ['supports', 'helps', 'may help']
    const weakIndicators = ['natural', 'premium', 'high-quality']
    
    const allClaims = [...explicit, ...implied].join(' ').toLowerCase()
    
    if (strongIndicators.some(indicator => allClaims.includes(indicator))) {
      return 'strong'
    } else if (moderateIndicators.some(indicator => allClaims.includes(indicator))) {
      return 'moderate'
    } else {
      return 'weak'
    }
  }

  private assessRegulatoryRisk(claims: string[]): 'high' | 'medium' | 'low' {
    const highRiskTerms = ['treats', 'cures', 'prevents', 'diagnoses']
    const mediumRiskTerms = ['reduces', 'improves', 'enhances']
    
    const allClaims = claims.join(' ').toLowerCase()
    
    if (highRiskTerms.some(term => allClaims.includes(term))) {
      return 'high'
    } else if (mediumRiskTerms.some(term => allClaims.includes(term))) {
      return 'medium'
    } else {
      return 'low'
    }
  }

  private determineEvidenceNeeded(explicit: string[], implied: string[]): string[] {
    const evidenceTypes = [
      'clinical studies',
      'efficacy data',
      'safety profile',
      'mechanism of action',
      'dosage optimization',
      'side effects',
      'interactions',
      'time to effect'
    ]
    
    return evidenceTypes
  }

  private determineCompetitiveContext(category: string) {
    const competitiveData = {
      'supplement': {
        category_leaders: ['Nature Made', 'Centrum', 'Garden of Life', 'NOW Foods'],
        price_range: { low: 10, avg: 25, high: 60 },
        common_features: ['third-party tested', 'non-GMO', 'made in USA'],
        differentiation_opportunities: ['enhanced absorption', 'clinical studies', 'premium ingredients'],
        market_maturity: 'mature' as const
      },
      'beverage': {
        category_leaders: ['Starbucks', 'Red Bull', 'Monster', 'Celsius'],
        price_range: { low: 2, avg: 4, high: 8 },
        common_features: ['natural ingredients', 'low sugar', 'energy boost'],
        differentiation_opportunities: ['functional benefits', 'premium taste', 'unique ingredients'],
        market_maturity: 'growth' as const
      },
      'saas': {
        category_leaders: ['Salesforce', 'HubSpot', 'Slack', 'Zoom'],
        price_range: { low: 10, avg: 50, high: 200 },
        common_features: ['cloud-based', 'integrations', 'analytics'],
        differentiation_opportunities: ['AI features', 'better UX', 'specialized focus'],
        market_maturity: 'growth' as const
      }
    }
    
    return competitiveData[category as keyof typeof competitiveData] || competitiveData.supplement
  }

  private generateResearchImplications(coreAttributes: any, claims: any) {
    return {
      must_validate: [
        'Purchase intent among target demographic',
        'Perceived effectiveness vs alternatives',
        'Price sensitivity and value perception',
        'Believability of key claims',
        'Uniqueness vs competitive set'
      ],
      should_validate: [
        'Format preference',
        'Dosing preference',
        'Brand vs generic preference',
        'Channel preference',
        'Subscription interest'
      ],
      nice_to_validate: [
        'Packaging preferences',
        'Bundle opportunities',
        'Brand personality',
        'Educational content interests'
      ],
      regulatory_requirements: [
        'Cannot claim to treat or cure conditions',
        'Must include appropriate disclaimers',
        'Structure-function claims must be substantiated'
      ]
    }
  }

  private buildAudienceProfile(coreAttributes: any, claims: any) {
    return {
      likely_demographics: {
        age_range: this.inferAgeRange(coreAttributes.target_condition),
        gender_skew: coreAttributes.target_demographic.includes('men') ? 'male' : 
                    coreAttributes.target_demographic.includes('women') ? 'female' : 'balanced',
        income_level: this.inferIncomeLevel(coreAttributes.product_type),
        education: 'college_educated',
        location: 'suburban_urban'
      },
      
      likely_psychographics: {
        health_consciousness: 'high',
        natural_product_preference: 'high',
        risk_tolerance: 'medium',
        information_seeking: 'high'
      },
      
      likely_behaviors: {
        current_category_usage: 'medium',
        brand_loyalty: 'medium',
        price_sensitivity: 'medium',
        channel_preference: ['online', 'health_store', 'direct_brand']
      }
    }
  }

  private inferAgeRange(condition: string): string {
    const ageMapping = {
      'joint pain': '40-65',
      'energy': '25-45',
      'focus': '25-50',
      'sleep': '30-60',
      'weight': '25-55',
      'immune': 'all ages',
      'skin': '25-50'
    }
    
    return ageMapping[condition as keyof typeof ageMapping] || '25-55'
  }

  private inferIncomeLevel(productType: string): string {
    const incomeMapping = {
      'supplement': '$50K-$100K',
      'beverage': '$40K-$80K',
      'saas': '$60K-$120K',
      'beauty': '$45K-$90K'
    }
    
    return incomeMapping[productType as keyof typeof incomeMapping] || '$50K-$100K'
  }

  private initializeCategoryIntelligence() {
    // Initialize category-specific intelligence
    // This would be populated with comprehensive data for each category
  }
}
