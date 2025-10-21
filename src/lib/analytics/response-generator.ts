import OpenAI from 'openai'
import { DemographicProfile, generateDemographicSample } from './demographics'
import { Persona } from '../types/test'
import { getIndustryConfig, IndustryCategory } from '../config/industries'
import _ from 'lodash'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface SyntheticResponse {
  id: string
  demographics: DemographicProfile
  persona: string
  
  // Core metrics
  purchaseIntent: number // 0-100
  priceAcceptance: number // 0-100
  benefitRanking: string[] // Top 3 benefits
  brandFit: number // 0-10
  
  // Additional insights
  primaryMotivation: string
  concerns: string[]
  preferredFormat?: string
  channelPreference?: string
  
  // Raw survey answers
  answers: Record<string, any>
}

export interface ResponseGeneratorConfig {
  productName: string
  productDescription: string
  industryCategory: IndustryCategory  // REQUIRED - determines which config to use
  targetAudience?: string
  personas: Persona[]
  sampleSize: number
  
  // Optional biases to simulate patterns
  demographicBiases?: any
  geographicBiases?: any
}

/**
 * Generate synthetic customer responses using AI
 */
export async function generateSyntheticResponses(
  config: ResponseGeneratorConfig
): Promise<SyntheticResponse[]> {
  const { productName, productDescription, personas, sampleSize } = config
  
  console.log(`🧠 Generating ${sampleSize} synthetic responses...`)
  
  // Step 1: Generate demographic distribution
  const demographics = generateDemographicSample(
    sampleSize,
    config.demographicBiases
  )
  
  // Step 2: Map demographics to personas
  const personaMapping = mapDemographicsToPersonas(demographics, personas)
  
  // Step 3: Generate responses in batches (to manage API costs)
  const batchSize = 50
  const responses: SyntheticResponse[] = []
  
  for (let i = 0; i < sampleSize; i += batchSize) {
    const batch = demographics.slice(i, Math.min(i + batchSize, sampleSize))
    const batchResponses = await generateResponseBatch(
      batch,
      personaMapping.slice(i, Math.min(i + batchSize, sampleSize)),
      productName,
      productDescription,
      config.industryCategory
    )
    responses.push(...batchResponses)
    
    console.log(`✓ Generated ${responses.length}/${sampleSize} responses`)
  }
  
  return responses
}

/**
 * Map demographic profiles to closest matching personas
 */
function mapDemographicsToPersonas(
  demographics: DemographicProfile[],
  personas: Persona[]
): string[] {
  // If no personas provided, create default persona names
  if (personas.length === 0) {
    return demographics.map((demo, index) => `Persona_${index + 1}`)
  }
  
  return demographics.map((demo) => {
    // Simple matching logic - can be enhanced
    const scores = personas.map((persona) => {
      let score = 0
      
      // Age match
      if (persona.age && demo.age && persona.age.includes(demo.age.split('-')[0])) score += 3
      
      // Income match
      if (persona.income && demo.income && persona.income.includes(demo.income.replace(/[<>$K]/g, ''))) score += 2
      
      // Location match
      if (persona.location && demo.location && persona.location.toLowerCase() === demo.location.toLowerCase()) score += 2
      
      return score
    })
    
    const bestMatchIndex = scores.indexOf(Math.max(...scores))
    return personas[bestMatchIndex].id
  })
}

/**
 * Generate a batch of responses using AI
 */
async function generateResponseBatch(
  demographics: DemographicProfile[],
  personaIds: string[],
  productName: string,
  productDescription: string,
  industryCategory: IndustryCategory = 'custom'
): Promise<SyntheticResponse[]> {
  
  // Load industry-specific configuration
  const industryConfig = getIndustryConfig(industryCategory)
  
  // For cost efficiency, use rule-based generation with AI-informed parameters
  // In production, you could use GPT-4 for higher quality
  
  return demographics.map((demo, idx) => {
    const baseIntent = calculateBaseIntent(demo, productDescription)
    const variance = (Math.random() - 0.5) * 20 // ±10% variance
    
    return {
      id: `response-${Date.now()}-${idx}`,
      demographics: demo,
      persona: personaIds[idx],
      
      // Core metrics with realistic variance
      purchaseIntent: Math.max(0, Math.min(100, baseIntent + variance)),
      priceAcceptance: calculatePriceAcceptance(demo, baseIntent),
      benefitRanking: generateBenefitRanking(demo, productDescription, industryConfig),
      brandFit: calculateBrandFit(demo, baseIntent),
      
      // Additional insights - using industry config
      primaryMotivation: selectMotivation(demo, industryConfig),
      concerns: generateConcerns(demo, productDescription, industryConfig),
      preferredFormat: selectPreferredFormat(demo, industryConfig),
      channelPreference: selectChannelPreference(demo),
      
      answers: {},
    }
  })
}

/**
 * Calculate base purchase intent based on demographics
 */
function calculateBaseIntent(
  demo: DemographicProfile,
  productDescription: string
): number {
  let intent = 45 // Base 45%
  
  // Age factors
  if (demo.age === '25-34' || demo.age === '35-44') intent += 10
  if (demo.age === '65+') intent -= 5
  
  // Income factors
  if (demo.income && (demo.income.includes('100') || demo.income.includes('150'))) intent += 8
  if (demo.income && demo.income.includes('<30')) intent -= 10
  
  // Location factors
  if (demo.location === 'Urban') intent += 5
  if (demo.location === 'Rural') intent -= 3
  
  // Education factors
  if (demo.education === 'Graduate' || demo.education === "Bachelor's") intent += 5
  
  // Add product-specific intelligence
  if (productDescription.toLowerCase().includes('wellness') ||
      productDescription.toLowerCase().includes('health')) {
    if (demo.age === '35-44' || demo.age === '45-54') intent += 8
  }
  
  return Math.max(10, Math.min(85, intent))
}

/**
 * Calculate price acceptance
 */
function calculatePriceAcceptance(
  demo: DemographicProfile,
  baseIntent: number
): number {
  let acceptance = baseIntent * 0.8 // Price acceptance typically lower than intent
  
  // Income adjustments
  if (demo.income && demo.income.includes('150')) acceptance += 15
  if (demo.income && demo.income.includes('<30')) acceptance -= 15
  
  return Math.max(0, Math.min(100, acceptance))
}

/**
 * Generate benefit ranking
 * NOW INDUSTRY-AGNOSTIC - uses config
 */
function generateBenefitRanking(
  demo: DemographicProfile,
  productDescription: string,
  industryConfig: any
): string[] {
  const allBenefits = industryConfig.benefits.length > 0 
    ? industryConfig.benefits 
    : [
        'High Quality',
        'Great Value',
        'Reliable',
        'Easy to Use',
        'Effective',
        'Convenient',
        'Trusted',
        'Innovative',
      ]
  
  // Demographic-informed ranking
  const weights: Record<string, number> = {}
  
  allBenefits.forEach((benefit: string) => {
    weights[benefit] = Math.random()
    
    // Apply demographic biases (industry-agnostic keyword matching)
    if ((benefit.toLowerCase().includes('sustain') || benefit.toLowerCase().includes('eco')) && demo.location === 'Urban') {
      weights[benefit] += 0.3
    }
    if ((benefit.toLowerCase().includes('afford') || benefit.toLowerCase().includes('value')) && demo.income && demo.income.includes('<')) {
      weights[benefit] += 0.4
    }
    if ((benefit.toLowerCase().includes('premium') || benefit.toLowerCase().includes('quality')) && demo.income && demo.income.includes('150')) {
      weights[benefit] += 0.3
    }
    if ((benefit.toLowerCase().includes('clinical') || benefit.toLowerCase().includes('tested') || benefit.toLowerCase().includes('proven')) && 
        (demo.education === "Bachelor's" || demo.education === 'Graduate')) {
      weights[benefit] += 0.3
    }
  })
  
  return Object.entries(weights)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([benefit]) => benefit)
}

/**
 * Calculate brand fit score
 */
function calculateBrandFit(
  demo: DemographicProfile,
  baseIntent: number
): number {
  const fit = (baseIntent / 100) * 10 // Scale to 0-10
  const variance = (Math.random() - 0.5) * 2 // ±1 variance
  
  return Math.max(1, Math.min(10, fit + variance))
}

/**
 * Select primary motivation
 * NOW INDUSTRY-AGNOSTIC - uses config
 */
function selectMotivation(demo: DemographicProfile, industryConfig: any): string {
  const motivations = industryConfig.motivations.length > 0
    ? industryConfig.motivations
    : [
        'Solve specific problem',
        'Improve quality of life',
        'Save time',
        'Save money',
        'Try something new',
        'Recommendation',
      ]
  
  // Select from industry-specific motivations
  if (motivations.length === 0) {
    return 'General interest'
  }
  
  // Weight by demographics if we have enough motivations
  if (motivations.length >= 2) {
    // Prefer first 2 motivations for middle-aged consumers
    if (demo.age === '35-44' || demo.age === '45-54') {
      return Math.random() > 0.5 ? motivations[0] : motivations[1]
    }
  }
  
  return motivations[Math.floor(Math.random() * motivations.length)]
}

/**
 * Generate concerns
 * NOW INDUSTRY-AGNOSTIC - uses config
 */
function generateConcerns(
  demo: DemographicProfile,
  productDescription: string,
  industryConfig: any
): string[] {
  const allConcerns = industryConfig.concerns.length > 0
    ? industryConfig.concerns
    : [
        'Price',
        'Quality',
        'Effectiveness',
        'Ease of use',
        'Support',
        'Trust',
      ]
  
  const concerns: string[] = []
  
  if (allConcerns.length === 0) {
    return ['Price', 'Quality']
  }
  
  // Income-based concerns
  const priceConcern = allConcerns.find((c: string) => c.toLowerCase().includes('price') || c.toLowerCase().includes('cost'))
  if (priceConcern && demo.income && demo.income.includes('<50')) {
    concerns.push(priceConcern)
  }
  
  // Education-based concerns  
  const qualityConcern = allConcerns.find((c: string) => 
    c.toLowerCase().includes('quality') || 
    c.toLowerCase().includes('scientific') ||
    c.toLowerCase().includes('tested')
  )
  if (qualityConcern && (demo.education === 'Graduate' || demo.education === "Bachelor's")) {
    concerns.push(qualityConcern)
  }
  
  // Random additional concern
  if (Math.random() > 0.5 && allConcerns.length > 0) {
    const remaining = allConcerns.filter((c: string) => !concerns.includes(c))
    if (remaining.length > 0) {
      concerns.push(remaining[Math.floor(Math.random() * remaining.length)])
    }
  }
  
  return concerns.length > 0 ? concerns : [allConcerns[0]]
}

/**
 * Select preferred format
 * NOW INDUSTRY-AGNOSTIC - uses config
 */
function selectPreferredFormat(demo: DemographicProfile, industryConfig: any): string {
  const formats = industryConfig.formats && industryConfig.formats.length > 0
    ? industryConfig.formats
    : industryConfig.deliveryMethods && industryConfig.deliveryMethods.length > 0
    ? industryConfig.deliveryMethods
    : ['Standard', 'Premium']
  
  if (formats.length === 0) {
    return 'Standard'
  }
  
  // Select from available formats
  return formats[Math.floor(Math.random() * formats.length)]
}

/**
 * Select channel preference
 */
function selectChannelPreference(demo: DemographicProfile): string {
  if (demo.age === '18-24' || demo.age === '25-34') {
    return Math.random() > 0.5 ? 'Instagram & TikTok' : 'Instagram & YouTube'
  }
  if (demo.age === '35-44' || demo.age === '45-54') {
    return Math.random() > 0.5 ? 'Instagram & Pinterest' : 'Facebook & Instagram'
  }
  if (demo.age === '55-64' || demo.age === '65+') {
    return 'Facebook & Email'
  }
  
  return 'Instagram'
}

/**
 * Export responses to CSV format
 */
export function exportResponsesToCSV(responses: SyntheticResponse[]): string {
  const headers = [
    'ID',
    'Age',
    'Gender',
    'Income',
    'Location',
    'Education',
    'Ethnicity',
    'Purchase Intent',
    'Price Acceptance',
    'Brand Fit',
    'Top Benefit',
    'Primary Motivation',
    'Preferred Format',
    'Channel Preference',
  ]
  
  const rows = responses.map((r) => [
    r.id,
    r.demographics.age,
    r.demographics.gender,
    r.demographics.income,
    r.demographics.location,
    r.demographics.education,
    r.demographics.ethnicity || '',
    r.purchaseIntent.toFixed(1),
    r.priceAcceptance.toFixed(1),
    r.brandFit.toFixed(1),
    r.benefitRanking[0],
    r.primaryMotivation,
    r.preferredFormat || '',
    r.channelPreference || '',
  ])
  
  return [headers, ...rows].map((row) => row.join(',')).join('\n')
}

