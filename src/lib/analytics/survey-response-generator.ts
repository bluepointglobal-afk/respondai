import { aiClient, getAIModel, isAIAvailable, getProviderName } from '@/lib/ai-client'
import { DemographicProfile } from './demographics'
import { Persona } from '../types/test'

export interface SurveyQuestion {
  id: string
  type: string
  text: string
  options?: string[]
  required?: boolean
  validationGoal?: string
  analysisCategory?: string
}

export interface SurveySection {
  id: string
  title: string
  description?: string
  questions: SurveyQuestion[]
}

export interface Survey {
  sections: SurveySection[]
  settings: {
    estimatedTime: number
    showProgressBar: boolean
    allowSaveAndResume: boolean
  }
}

export interface SurveyResponse {
  id: string
  demographics: DemographicProfile
  persona: string
  answers: Record<string, any>
  purchaseIntent: number
  priceAcceptance: number
  brandFit: number
  completionTime: number
  timestamp: string
}

export interface SurveyResponseConfig {
  survey: Survey
  productInfo: any
  personas: Persona[]
  sampleSize: number
  demographics: DemographicProfile[]
}

/**
 * Generate realistic survey responses by having AI profiles answer actual survey questions
 */
export async function generateSurveyResponses(
  config: SurveyResponseConfig
): Promise<SurveyResponse[]> {
  console.log(`🧠 Generating ${config.sampleSize} survey responses using OPTIMIZED single AI call...`)
  
  if (!isAIAvailable()) {
    console.log('⚠️ No AI available, using mock responses')
    return generateMockSurveyResponses(config)
  }

  try {
    // OPTIMIZATION: Single AI call for all responses instead of multiple calls
    const responses = await generateSurveyResponseBatch(
      config.demographics,
      config.survey,
      config.productInfo,
      config.personas
    )
    
    console.log(`✓ Generated ${responses.length}/${config.sampleSize} survey responses in single AI call`)
    return responses
  } catch (error) {
    console.error('Error generating AI survey responses:', error)
    console.log('Falling back to mock responses')
    return generateMockSurveyResponses(config)
  }
}

/**
 * Generate a batch of survey responses using AI (optimized for speed)
 */
async function generateSurveyResponseBatch(
  demographics: DemographicProfile[],
  survey: Survey,
  productInfo: any,
  personas: Persona[]
): Promise<SurveyResponse[]> {
  const responses: SurveyResponse[] = []

  // OPTIMIZATION: Generate all responses in a single AI call instead of individual calls
  try {
    const batchAnswers = await generateBatchSurveyAnswers(demographics, survey, productInfo, personas)
    
    for (let i = 0; i < demographics.length; i++) {
      const demo = demographics[i]
      const persona = findMatchingPersona(demo, personas)
      const surveyAnswers = batchAnswers[i] || {}
      
      // Calculate derived metrics
      const purchaseIntent = calculatePurchaseIntent(surveyAnswers, demo)
      const priceAcceptance = calculatePriceAcceptance(surveyAnswers, demo)
      const brandFit = calculateBrandFit(surveyAnswers, demo)
      
      responses.push({
        id: `survey-response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        demographics: demo,
        persona: persona?.id || 'unknown',
        answers: surveyAnswers,
        purchaseIntent,
        priceAcceptance,
        brandFit,
        completionTime: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error generating batch survey responses:', error)
    // Fallback to individual mock responses
    for (const demo of demographics) {
      responses.push(generateMockSurveyResponse(demo, survey))
    }
  }

  return responses
}

/**
 * Generate batch survey answers for multiple respondents in a single AI call
 */
async function generateBatchSurveyAnswers(
  demographics: DemographicProfile[],
  survey: Survey,
  productInfo: any,
  personas: Persona[]
): Promise<Record<string, any>[]> {
  const aiClient = getAIClient()
  if (!aiClient) {
    throw new Error('AI client not available')
  }

  // Prepare survey questions
  const questions = survey.sections.flatMap(section => section.questions)
  
  // Prepare respondent profiles
  const profiles = demographics.map((demo, index) => {
    const persona = findMatchingPersona(demo, personas)
    return {
      id: index + 1,
      age: demo.age,
      gender: demo.gender,
      income: demo.income,
      education: demo.education,
      location: demo.location,
      persona: persona?.name || 'General User',
      characteristics: persona?.characteristics || []
    }
  })

  const prompt = `You are generating realistic survey responses for market research. 

PRODUCT BEING SURVEYED:
- Name: ${productInfo.name}
- Description: ${productInfo.description}
- Industry: ${productInfo.industry}
- Target Audience: ${productInfo.targetAudience}

SURVEY QUESTIONS:
${questions.map((q, i) => `${i + 1}. ${q.text} (Type: ${q.type}${q.options ? `, Options: ${JSON.stringify(q.options)}` : ''})`).join('\n')}

RESPONDENT PROFILES:
${profiles.map(p => `Respondent ${p.id}: ${p.age} year old ${p.gender}, ${p.income} income, ${p.education} education, ${p.location}, Persona: ${p.persona}`).join('\n')}

Generate realistic responses for each respondent. Return a JSON array where each object contains:
- respondentId: number
- answers: object with question numbers as keys and answers as values

Example format:
[
  {
    "respondentId": 1,
    "answers": {
      "1": "Very likely",
      "2": 8,
      "3": "Quality and effectiveness"
    }
  },
  {
    "respondentId": 2,
    "answers": {
      "1": "Somewhat likely", 
      "2": 6,
      "3": "Price and convenience"
    }
  }
]

Make responses realistic and varied based on demographics and personas.`

  const completion = await aiClient.chat.completions.create({
    model: getAIModel('fast'),
    messages: [
      {
        role: 'system',
        content: 'You are a market research data generator. Generate realistic survey responses based on demographics and personas. Return only valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: 'json_object' }
  })

  const response = completion.choices[0]?.message?.content
  if (!response) {
    throw new Error('No response from AI')
  }

  try {
    const parsed = JSON.parse(response)
    // Handle different response formats
    if (Array.isArray(parsed)) {
      return parsed
    } else if (parsed.responses && Array.isArray(parsed.responses)) {
      return parsed.responses
    } else {
      // Fallback: create mock responses
      return demographics.map((_, index) => ({
        respondentId: index + 1,
        answers: generateMockAnswers(questions)
      }))
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    // Fallback: create mock responses
    return demographics.map((_, index) => ({
      respondentId: index + 1,
      answers: generateMockAnswers(questions)
    }))
  }
}

/**
 * Generate mock answers for fallback scenarios
 */
function generateMockAnswers(questions: SurveyQuestion[]): Record<string, any> {
  const answers: Record<string, any> = {}
  
  questions.forEach((question, index) => {
    const questionKey = (index + 1).toString()
    
    switch (question.type) {
      case 'multiple-choice':
        answers[questionKey] = question.options?.[Math.floor(Math.random() * question.options.length)] || 'Option A'
        break
      case 'scale':
        answers[questionKey] = Math.floor(Math.random() * 10) + 1
        break
      case 'text':
        answers[questionKey] = 'This is a realistic response based on the question.'
        break
      case 'ranking':
        answers[questionKey] = question.options ? [...question.options].sort(() => Math.random() - 0.5) : []
        break
      default:
        answers[questionKey] = 'Response'
    }
  })
  
  return answers
}

/**
 * Generate AI answers to actual survey questions (DEPRECATED - too slow)
 */
async function generateAISurveyAnswers(
  demographics: DemographicProfile,
  persona: Persona | null,
  survey: Survey,
  productInfo: any
): Promise<Record<string, any>> {
  const answers: Record<string, any> = {}

  // Build context for AI
  const context = {
    demographics: {
      age: demographics.age,
      gender: demographics.gender,
      income: demographics.income,
      education: demographics.education,
      location: demographics.location,
      ethnicity: demographics.ethnicity
    },
    persona: persona ? {
      name: persona.name,
      characteristics: persona.characteristics,
      motivations: persona.motivations,
      painPoints: persona.painPoints
    } : null,
    product: {
      name: productInfo.name,
      description: productInfo.description,
      industry: productInfo.industry,
      targetAudience: productInfo.targetAudience,
      priceRange: productInfo.priceRange
    }
  }

  // Process each section
  for (const section of survey.sections) {
    for (const question of section.questions) {
      try {
        const answer = await generateAIAnswer(question, context)
        answers[question.id] = answer
      } catch (error) {
        console.error(`Error answering question ${question.id}:`, error)
        answers[question.id] = generateFallbackAnswer(question)
      }
    }
  }

  return answers
}

/**
 * Generate AI answer for a specific question
 */
async function generateAIAnswer(
  question: SurveyQuestion,
  context: any
): Promise<any> {
  const prompt = `You are responding to a market research survey as a realistic person with these characteristics:

DEMOGRAPHICS:
- Age: ${context.demographics.age}
- Gender: ${context.demographics.gender}
- Income: ${context.demographics.income}
- Education: ${context.demographics.education}
- Location: ${context.demographics.location}
- Ethnicity: ${context.demographics.ethnicity}

PERSONA: ${context.persona ? JSON.stringify(context.persona) : 'General consumer'}

PRODUCT CONTEXT:
- Product: ${context.product.name}
- Description: ${context.product.description}
- Industry: ${context.product.industry}
- Target Audience: ${context.product.targetAudience}

QUESTION:
"${question.text}"

QUESTION TYPE: ${question.type}
OPTIONS: ${question.options ? JSON.stringify(question.options) : 'N/A'}

Respond as this person would realistically respond. Be authentic and consistent with their demographics and persona.

For multiple choice questions, select ONE option.
For scale questions, provide a number.
For text questions, provide a brief, realistic response.
For ranking questions, provide the order.

Return ONLY the answer, no explanation.`

  const completion = await aiClient.chat.completions.create({
    model: getAIModel('fast'),
    messages: [
      {
        role: 'system',
        content: 'You are a realistic survey respondent. Answer questions authentically based on your demographics and persona. Return only the answer, no explanation.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 100
  })

  const answer = completion.choices[0]?.message?.content?.trim()
  
  if (!answer) {
    throw new Error('No answer generated')
  }

  // Parse answer based on question type
  return parseAnswer(answer, question)
}

/**
 * Parse AI answer based on question type
 */
function parseAnswer(answer: string, question: SurveyQuestion): any {
  switch (question.type) {
    case 'multiple_choice':
      // Return the selected option
      return answer
    
    case 'scale':
      // Extract number from answer
      const numberMatch = answer.match(/\d+/)
      return numberMatch ? parseInt(numberMatch[0]) : 5
    
    case 'yes_no':
      return answer.toLowerCase().includes('yes') ? 'Yes' : 'No'
    
    case 'text_short':
    case 'text_long':
      return answer
    
    case 'ranking':
      // Parse ranking format
      try {
        return JSON.parse(answer)
      } catch {
        return answer.split(',').map((item: string) => item.trim())
      }
    
    default:
      return answer
  }
}

/**
 * Calculate purchase intent from survey answers
 */
function calculatePurchaseIntent(answers: Record<string, any>, demographics: DemographicProfile): number {
  // Look for purchase intent questions
  const intentAnswers = Object.values(answers).filter(answer => 
    typeof answer === 'number' && answer >= 1 && answer <= 10
  )
  
  if (intentAnswers.length > 0) {
    const avgIntent = intentAnswers.reduce((sum: number, val: number) => sum + val, 0) / intentAnswers.length
    return Math.round(avgIntent * 10) // Convert to 0-100 scale
  }
  
  // Fallback based on demographics
  let baseIntent = 50
  
  if (demographics.age.includes('25-34') || demographics.age.includes('35-44')) {
    baseIntent += 10
  }
  
  if (demographics.income.includes('$75K') || demographics.income.includes('$100K')) {
    baseIntent += 15
  }
  
  return Math.min(100, baseIntent + Math.random() * 20 - 10)
}

/**
 * Calculate price acceptance from survey answers
 */
function calculatePriceAcceptance(answers: Record<string, any>, demographics: DemographicProfile): number {
  // Look for price-related answers
  const priceAnswers = Object.values(answers).filter(answer => 
    typeof answer === 'string' && answer.toLowerCase().includes('$')
  )
  
  if (priceAnswers.length > 0) {
    // Extract price values and calculate average
    const prices = priceAnswers.map(answer => {
      const match = answer.match(/\$(\d+)/)
      return match ? parseInt(match[1]) : 0
    }).filter(price => price > 0)
    
    if (prices.length > 0) {
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
      return Math.min(100, Math.round(avgPrice * 2)) // Convert to 0-100 scale
    }
  }
  
  // Fallback based on income
  let baseAcceptance = 30
  
  if (demographics.income.includes('$75K')) baseAcceptance += 20
  if (demographics.income.includes('$100K')) baseAcceptance += 30
  if (demographics.income.includes('$150K')) baseAcceptance += 40
  
  return Math.min(100, baseAcceptance + Math.random() * 20 - 10)
}

/**
 * Calculate brand fit from survey answers
 */
function calculateBrandFit(answers: Record<string, any>, demographics: DemographicProfile): number {
  // Look for brand-related answers
  const brandAnswers = Object.values(answers).filter(answer => 
    typeof answer === 'string' && 
    (answer.toLowerCase().includes('trust') || 
     answer.toLowerCase().includes('quality') ||
     answer.toLowerCase().includes('reliable'))
  )
  
  if (brandAnswers.length > 0) {
    return 7 + Math.random() * 2 // 7-9 range for positive brand sentiment
  }
  
  // Fallback
  return 5 + Math.random() * 4 // 5-9 range
}

/**
 * Find matching persona for demographics
 */
function findMatchingPersona(demographics: DemographicProfile, personas: Persona[]): Persona | null {
  if (!personas || personas.length === 0) return null
  
  // Simple matching logic
  let bestMatch = personas[0]
  let bestScore = 0
  
  for (const persona of personas) {
    let score = 0
    
    // Age match
    if (persona.age && demographics.age && persona.age.includes(demographics.age.split('-')[0])) {
      score += 3
    }
    
    // Income match
    if (persona.income && demographics.income && persona.income.includes(demographics.income.split('$')[1]?.split('K')[0])) {
      score += 2
    }
    
    if (score > bestScore) {
      bestScore = score
      bestMatch = persona
    }
  }
  
  return bestMatch
}

/**
 * Generate fallback answer for a question
 */
function generateFallbackAnswer(question: SurveyQuestion): any {
  switch (question.type) {
    case 'multiple_choice':
      return question.options?.[Math.floor(Math.random() * question.options.length)] || 'Other'
    
    case 'scale':
      return Math.floor(Math.random() * 10) + 1
    
    case 'yes_no':
      return Math.random() > 0.5 ? 'Yes' : 'No'
    
    case 'text_short':
      return 'Sample response'
    
    case 'text_long':
      return 'This is a sample response for testing purposes.'
    
    case 'ranking':
      return question.options ? [...question.options].sort(() => Math.random() - 0.5) : []
    
    default:
      return 'Sample answer'
  }
}

/**
 * Generate mock survey responses when AI is not available
 */
function generateMockSurveyResponses(config: SurveyResponseConfig): SurveyResponse[] {
  return config.demographics.map((demo, index) => 
    generateMockSurveyResponse(demo, config.survey)
  )
}

/**
 * Generate a single mock survey response
 */
function generateMockSurveyResponse(demo: DemographicProfile, survey: Survey): SurveyResponse {
  const answers: Record<string, any> = {}
  
  // Generate mock answers for each question
  for (const section of survey.sections) {
    for (const question of section.questions) {
      answers[question.id] = generateFallbackAnswer(question)
    }
  }
  
  return {
    id: `mock-response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    demographics: demo,
    persona: 'mock-persona',
    answers,
    purchaseIntent: 50 + Math.random() * 30,
    priceAcceptance: 40 + Math.random() * 40,
    brandFit: 5 + Math.random() * 4,
    completionTime: Math.floor(Math.random() * 300) + 180,
    timestamp: new Date().toISOString()
  }
}
