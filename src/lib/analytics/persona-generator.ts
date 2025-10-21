/**
 * AI-Powered Persona Generator
 * Generates dynamic customer personas from survey responses and patterns
 */

import { aiClient, getAIModel, isAIAvailable, getProviderName } from '@/lib/ai-client'

interface SurveyResponse {
  id: string
  answers: any
  metadata: any
  demographics?: {
    age?: string
    gender?: string
    income?: string
    location?: string
    ethnicity?: string
    education?: string
    occupation?: string
  }
}

interface PersonaCluster {
  responses: SurveyResponse[]
  characteristics: {
    avgAge: number
    commonGender: string
    commonIncome: string
    commonLocation: string
    avgPurchaseIntent: number
    avgPricePoint: number
    commonValues: string[]
    commonPainPoints: string[]
  }
}

export interface GeneratedPersona {
  id: string
  name: string
  age: number
  location: string
  archetype: string
  avatar: string
  purchaseIntent: number
  pricePoint: number
  sampleSize: number
  demographics: {
    income: string
    education: string
    occupation: string
    familyStatus: string
    ethnicity?: string
  }
  psychographics: {
    values: string[]
    lifestyle: string[]
    painPoints: string[]
    goals: string[]
  }
  keyQuotes: string[]
  behaviors: {
    shoppingHabits: string
    brandLoyalty: string
    influencers: string
    decisionFactors: string[]
  }
  systemPrompt: string // For AI chat
}

/**
 * Main function to generate personas from survey responses
 */
export async function generatePersonasFromResponses(
  responses: SurveyResponse[],
  productInfo: any,
  validationGoals: any[]
): Promise<GeneratedPersona[]> {
  try {
    // Step 1: Cluster responses into segments
    const clusters = clusterResponsesByDemographics(responses)
    
    // Step 2: Generate personas for top 3-5 clusters
    const topClusters = clusters.slice(0, 5)
    
    const personas: GeneratedPersona[] = []
    
    for (let i = 0; i < topClusters.length; i++) {
      const cluster = topClusters[i]
      const persona = await generatePersonaFromCluster(
        cluster,
        i,
        productInfo,
        validationGoals
      )
      personas.push(persona)
    }
    
    return personas
  } catch (error) {
    console.error('Error generating personas:', error)
    // Return fallback personas if AI fails
    return generateFallbackPersonas(responses, productInfo)
  }
}

/**
 * Cluster responses by demographics and behavior patterns
 */
function clusterResponsesByDemographics(responses: SurveyResponse[]): PersonaCluster[] {
  const clusters: Map<string, SurveyResponse[]> = new Map()
  
  // Group by age + gender + income combination
  responses.forEach(response => {
    const demo = response.demographics || {}
    const key = `${demo.age || 'unknown'}-${demo.gender || 'unknown'}-${demo.income || 'unknown'}`
    
    if (!clusters.has(key)) {
      clusters.set(key, [])
    }
    clusters.get(key)!.push(response)
  })
  
  // Convert to PersonaCluster objects with aggregated characteristics
  const clusterArray: PersonaCluster[] = []
  
  clusters.forEach((responses, key) => {
    if (responses.length < 5) return // Skip small clusters
    
    const characteristics = aggregateCharacteristics(responses)
    clusterArray.push({ responses, characteristics })
  })
  
  // Sort by cluster size (largest first)
  clusterArray.sort((a, b) => b.responses.length - a.responses.length)
  
  return clusterArray
}

/**
 * Aggregate characteristics from a cluster of responses
 */
function aggregateCharacteristics(responses: SurveyResponse[]) {
  const ages = responses
    .map(r => extractAgeFromRange(r.demographics?.age))
    .filter(a => a > 0)
  
  const purchaseIntents = responses
    .map(r => r.answers?.['purchase-intent'] || r.answers?.purchaseIntent)
    .filter(p => typeof p === 'number')
  
  const pricePoints = responses
    .map(r => extractPriceFromAnswer(r.answers?.['price-expectation'] || r.answers?.priceExpectation))
    .filter(p => p > 0)
  
  const genders = responses.map(r => r.demographics?.gender).filter(Boolean)
  const incomes = responses.map(r => r.demographics?.income).filter(Boolean)
  const locations = responses.map(r => r.demographics?.location).filter(Boolean)
  
  return {
    avgAge: ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 40,
    commonGender: mostCommon(genders) || 'Female',
    commonIncome: mostCommon(incomes) || '$50,000-$75,000',
    commonLocation: mostCommon(locations) || 'Urban',
    avgPurchaseIntent: purchaseIntents.length > 0 
      ? Math.round((purchaseIntents.reduce((a, b) => a + b, 0) / purchaseIntents.length) * 10) 
      : 65,
    avgPricePoint: pricePoints.length > 0 
      ? Math.round(pricePoints.reduce((a, b) => a + b, 0) / pricePoints.length) 
      : 30,
    commonValues: extractCommonValues(responses),
    commonPainPoints: extractCommonPainPoints(responses),
  }
}

/**
 * Generate a single persona from a cluster using AI
 */
async function generatePersonaFromCluster(
  cluster: PersonaCluster,
  index: number,
  productInfo: any,
  validationGoals: any[]
): Promise<GeneratedPersona> {
  const { responses, characteristics } = cluster
  
  // Prepare context for AI
  const context = {
    productName: productInfo.name,
    productDescription: productInfo.description,
    industry: productInfo.industry,
    clusterSize: responses.length,
    characteristics: characteristics,
    sampleResponses: responses.slice(0, 3).map(r => ({
      age: r.demographics?.age,
      gender: r.demographics?.gender,
      occupation: r.demographics?.occupation,
      answers: Object.entries(r.answers || {}).slice(0, 5)
    }))
  }
  
  try {
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: `You are a market research expert who creates detailed customer personas from survey data.
Create a realistic, data-driven persona that represents this cluster of ${responses.length} respondents.
The persona should feel authentic and specific to the product/industry context.
Return ONLY valid JSON.`
        },
        {
          role: 'user',
          content: `Create a detailed customer persona for this cluster:

Product: ${context.productName}
Description: ${context.productDescription}
Industry: ${context.industry}

Cluster Characteristics:
- Sample Size: ${context.clusterSize} respondents
- Average Age: ${characteristics.avgAge}
- Gender: ${characteristics.commonGender}
- Income: ${characteristics.commonIncome}
- Location: ${characteristics.commonLocation}
- Purchase Intent: ${characteristics.avgPurchaseIntent}%
- Price Point: $${characteristics.avgPricePoint}
- Common Values: ${characteristics.commonValues.join(', ')}
- Pain Points: ${characteristics.commonPainPoints.join(', ')}

Sample Responses:
${JSON.stringify(context.sampleResponses, null, 2)}

Generate a JSON object with this structure:
{
  "name": "First Last (realistic name for demographic)",
  "age": ${characteristics.avgAge},
  "location": "City, State (realistic for cluster)",
  "archetype": "2-4 word persona archetype",
  "avatar": "emoji that represents this persona",
  "demographics": {
    "income": "${characteristics.commonIncome}",
    "education": "education level",
    "occupation": "specific job title",
    "familyStatus": "family situation",
    "ethnicity": "if relevant to product/cluster"
  },
  "psychographics": {
    "values": ["value1", "value2", "value3", "value4"],
    "lifestyle": ["lifestyle1", "lifestyle2", "lifestyle3"],
    "painPoints": ["pain1", "pain2", "pain3", "pain4"],
    "goals": ["goal1", "goal2", "goal3", "goal4"]
  },
  "keyQuotes": [
    "Authentic quote that this persona would say about the product",
    "Another realistic quote about their needs",
    "Quote about price/value",
    "Quote about decision factors"
  ],
  "behaviors": {
    "shoppingHabits": "1-2 sentences about how they shop",
    "brandLoyalty": "1 sentence about loyalty",
    "influencers": "Who influences their decisions",
    "decisionFactors": ["factor1", "factor2", "factor3"]
  }
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
    
    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error('No content from AI')
    
    const aiPersona = JSON.parse(content)
    
    // Build system prompt for chat
    const systemPrompt = buildSystemPromptForPersona(aiPersona, characteristics, productInfo)
    
    return {
      id: `persona-${index + 1}`,
      ...aiPersona,
      purchaseIntent: characteristics.avgPurchaseIntent,
      pricePoint: characteristics.avgPricePoint,
      sampleSize: responses.length,
      systemPrompt
    }
  } catch (error) {
    console.error('Error generating persona with AI:', error)
    // Fallback to template-based persona
    return generateTemplatePersona(cluster, index)
  }
}

/**
 * Build a comprehensive system prompt for AI chat with this persona
 */
function buildSystemPromptForPersona(
  persona: any,
  characteristics: any,
  productInfo: any
): string {
  return `You are ${persona.name}, a ${persona.age}-year-old ${persona.demographics.occupation} from ${persona.location}.

DEMOGRAPHICS:
- Age: ${persona.age}
- Occupation: ${persona.demographics.occupation}
- Income: ${persona.demographics.income}
- Education: ${persona.demographics.education}
- Family: ${persona.demographics.familyStatus}

PSYCHOGRAPHICS:
Values: ${persona.psychographics.values.join(', ')}
Lifestyle: ${persona.psychographics.lifestyle.join(', ')}
Pain Points: ${persona.psychographics.painPoints.join(', ')}
Goals: ${persona.psychographics.goals.join(', ')}

YOUR PERSONALITY & VOICE:
${persona.keyQuotes.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}

SHOPPING BEHAVIOR:
- Shopping Habits: ${persona.behaviors.shoppingHabits}
- Brand Loyalty: ${persona.behaviors.brandLoyalty}
- Influenced By: ${persona.behaviors.influencers}
- Decision Factors: ${persona.behaviors.decisionFactors.join(', ')}

PRODUCT CONTEXT:
You were surveyed about "${productInfo.name}" - ${productInfo.description}
Your purchase intent: ${characteristics.avgPurchaseIntent}%
Your acceptable price point: $${characteristics.avgPricePoint}

INSTRUCTIONS:
1. Stay in character at all times
2. Respond authentically based on your demographics, values, and pain points
3. Reference your survey responses when relevant
4. Be honest about concerns and what would make you more likely to purchase
5. Use natural, conversational language that matches your education and background
6. Provide specific, actionable feedback when asked
7. If asked about other personas, acknowledge you can only speak for yourself

Remember: You represent ${characteristics.clusterSize} real people with similar characteristics from the survey.`
}

/**
 * Generate fallback personas if AI fails
 */
function generateFallbackPersonas(
  responses: SurveyResponse[],
  productInfo: any
): GeneratedPersona[] {
  const clusters = clusterResponsesByDemographics(responses)
  return clusters.slice(0, 3).map((cluster, i) => generateTemplatePersona(cluster, i))
}

/**
 * Generate a template-based persona (used as fallback)
 */
function generateTemplatePersona(cluster: PersonaCluster, index: number): GeneratedPersona {
  const { characteristics } = cluster
  const archetypes = [
    'The Informed Buyer',
    'The Value Seeker',
    'The Premium Customer',
    'The Cautious Researcher',
    'The Early Adopter'
  ]
  
  return {
    id: `persona-${index + 1}`,
    name: generateRealisticName(characteristics.commonGender, characteristics.avgAge),
    age: characteristics.avgAge,
    location: 'Major Metro Area',
    archetype: archetypes[index] || 'The Potential Customer',
    avatar: getAvatarForDemographic(characteristics.commonGender, characteristics.avgAge),
    purchaseIntent: characteristics.avgPurchaseIntent,
    pricePoint: characteristics.avgPricePoint,
    sampleSize: cluster.responses.length,
    demographics: {
      income: characteristics.commonIncome,
      education: 'Bachelor\'s Degree',
      occupation: 'Professional',
      familyStatus: characteristics.avgAge > 45 ? 'Married, 2 children' : 'Single'
    },
    psychographics: {
      values: characteristics.commonValues,
      lifestyle: ['Health-conscious', 'Busy professional', 'Quality-focused'],
      painPoints: characteristics.commonPainPoints,
      goals: ['Find reliable products', 'Make informed decisions', 'Get value for money']
    },
    keyQuotes: [
      'I want to make sure this is right for me before purchasing',
      'Quality and value are both important to me',
      'I trust products backed by data and reviews'
    ],
    behaviors: {
      shoppingHabits: 'Research thoroughly before purchasing',
      brandLoyalty: 'Moderate - open to switching for better options',
      influencers: 'Reviews, recommendations, expert opinions',
      decisionFactors: ['Quality', 'Price', 'Reviews', 'Brand reputation']
    },
    systemPrompt: `You are a ${characteristics.avgAge}-year-old customer who represents ${cluster.responses.length} survey respondents.`
  }
}

// Helper functions
function extractAgeFromRange(ageRange?: string): number {
  if (!ageRange) return 0
  const match = ageRange.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

function extractPriceFromAnswer(priceAnswer?: any): number {
  if (!priceAnswer) return 0
  if (typeof priceAnswer === 'number') return priceAnswer
  const match = String(priceAnswer).match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

function mostCommon<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  const counts = new Map<T, number>()
  arr.forEach(item => counts.set(item, (counts.get(item) || 0) + 1))
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0]
}

function extractCommonValues(responses: SurveyResponse[]): string[] {
  // Extract from survey responses
  const values: string[] = []
  responses.forEach(r => {
    if (r.answers?.values) {
      if (Array.isArray(r.answers.values)) {
        values.push(...r.answers.values)
      }
    }
  })
  return [...new Set(values)].slice(0, 4)
}

function extractCommonPainPoints(responses: SurveyResponse[]): string[] {
  const painPoints: string[] = []
  responses.forEach(r => {
    if (r.answers?.concerns || r.answers?.painPoints) {
      const concerns = r.answers.concerns || r.answers.painPoints
      if (Array.isArray(concerns)) {
        painPoints.push(...concerns)
      } else if (typeof concerns === 'string') {
        painPoints.push(concerns)
      }
    }
  })
  return [...new Set(painPoints)].slice(0, 4)
}

function generateRealisticName(gender: string, age: number): string {
  const femaleNames = ['Sarah', 'Jennifer', 'Maria', 'Angela', 'Tasha', 'Michelle', 'Jessica', 'Lisa']
  const maleNames = ['Michael', 'David', 'James', 'Robert', 'John', 'Carlos', 'Kevin', 'Brian']
  const lastNames = ['Johnson', 'Williams', 'Garcia', 'Martinez', 'Thompson', 'Davis', 'Miller', 'Wilson']
  
  const firstNames = gender.toLowerCase().includes('female') || gender.toLowerCase().includes('woman') 
    ? femaleNames 
    : maleNames
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  
  return `${firstName} ${lastName}`
}

function getAvatarForDemographic(gender: string, age: number): string {
  const isFemale = gender.toLowerCase().includes('female') || gender.toLowerCase().includes('woman')
  
  if (age < 30) return isFemale ? '👩' : '👨'
  if (age < 50) return isFemale ? '👩‍💼' : '👨‍💼'
  return isFemale ? '👩🏽‍💼' : '👨🏽‍💼'
}
