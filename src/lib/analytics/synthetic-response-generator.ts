/**
 * SYNTHETIC RESPONSE GENERATOR
 * Generates realistic individual survey responses for comprehensive analysis
 */

import { aiClient, getAIModel, isAIAvailable } from '../ai-client'

interface SyntheticResponse {
  id: string
  testId: string
  audienceId?: string
  responseData: any
  demographics: {
    age: number
    gender: string
    income: number
    location: string
    education: string
    occupation: string
    familyStatus: string
  }
  psychographics: {
    motivations: string[]
    concerns: string[]
    values: string[]
    lifestyle: string[]
  }
  behaviors: {
    preferredChannel: string
    categoryUsage: string
    expectedPurchaseTime: string
    researchStyle: string
    influencers: string[]
  }
  purchaseIntent: number
  priceAcceptance: any
  brandFit: number
  featurePreferences: any
  metadata: {
    device?: string
    timeSpent?: number
    completionRate?: number
  }
  createdAt: string
}

export async function generateSyntheticResponses(
  testId: string,
  audiences: any[],
  survey: any,
  productInfo: any,
  sampleSize: number = 500
): Promise<SyntheticResponse[]> {
  
  console.log(`🤖 Generating ${sampleSize} synthetic responses...`)
  
  if (!isAIAvailable()) {
    throw new Error('AI service not available')
  }
  
  try {
    // Generate responses in batches to avoid token limits
    const batchSize = 50
    const batches = Math.ceil(sampleSize / batchSize)
    const allResponses: SyntheticResponse[] = []
    
    for (let batch = 0; batch < batches; batch++) {
      const currentBatchSize = Math.min(batchSize, sampleSize - (batch * batchSize))
      
      console.log(`📊 Generating batch ${batch + 1}/${batches} (${currentBatchSize} responses)`)
      
      const batchResponses = await generateResponseBatch(
        testId,
        audiences,
        survey,
        productInfo,
        currentBatchSize,
        batch * batchSize
      )
      
      allResponses.push(...batchResponses)
    }
    
    console.log(`✅ Generated ${allResponses.length} synthetic responses`)
    return allResponses
    
  } catch (error) {
    console.error('Synthetic response generation error:', error)
    throw error
  }
}

async function generateResponseBatch(
  testId: string,
  audiences: any[],
  survey: any,
  productInfo: any,
  batchSize: number,
  offset: number
): Promise<SyntheticResponse[]> {
  
  const prompt = buildResponseGenerationPrompt(productInfo, audiences, batchSize, offset)
  
  const completion = await aiClient.chat.completions.create({
    model: getAIModel('fast'),
    messages: [
      {
        role: 'system',
        content: 'You are generating realistic individual survey responses for market research. Create diverse, realistic responses that reflect real consumer behavior patterns.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 3000
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from AI')
  }

  // Parse the JSON response
  let responses: any[]
  try {
    let jsonContent = content.trim()
    
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/, '').replace(/\n?```$/, '')
    }
    
    const jsonMatch = jsonContent.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      jsonContent = jsonMatch[0]
    }
    
    responses = JSON.parse(jsonContent)
    
    // Validate that we got an array
    if (!Array.isArray(responses)) {
      throw new Error('AI response is not an array')
    }
    
  } catch (parseError) {
    console.error('Failed to parse responses:', content)
    console.error('Parse error:', parseError)
    
    // Fallback: generate mock responses if AI parsing fails
    console.log('🔄 Falling back to mock responses...')
    responses = generateMockResponses(batchSize, offset)
  }

  // Transform to our SyntheticResponse format
  return responses.map((response, index) => ({
    id: `${testId}_response_${offset + index + 1}`,
    testId,
    audienceId: response.audienceId,
    responseData: response.responseData || {},
    demographics: response.demographics,
    psychographics: response.psychographics,
    behaviors: response.behaviors,
    purchaseIntent: response.purchaseIntent || Math.floor(Math.random() * 100),
    priceAcceptance: response.priceAcceptance || {},
    brandFit: response.brandFit || Math.floor(Math.random() * 10) + 1,
    featurePreferences: response.featurePreferences || {},
    metadata: {
      device: response.metadata?.device || 'Desktop',
      timeSpent: response.metadata?.timeSpent || Math.floor(Math.random() * 300) + 60,
      completionRate: response.metadata?.completionRate || 100
    },
    createdAt: new Date().toISOString()
  }))
}

function buildResponseGenerationPrompt(productInfo: any, audiences: any[], batchSize: number, offset: number): string {
  return `Generate ${batchSize} realistic individual survey responses for market research.

PRODUCT CONTEXT:
- Product: ${productInfo?.name || 'Unknown Product'}
- Description: ${productInfo?.description || 'No description'}
- Target Audience: ${productInfo?.targetAudience || 'Unknown'}
- Industry: ${productInfo?.industry || 'Unknown'}

AUDIENCES:
${audiences.map(aud => `
- ${aud.name}: ${aud.demographics ? JSON.stringify(aud.demographics) : 'No demographics'}
`).join('\n')}

Generate responses with this EXACT structure:

[
  {
    "audienceId": "audience_id_or_null",
    "demographics": {
      "age": 35,
      "gender": "Male",
      "income": 75000,
      "location": "Urban",
      "education": "Bachelor's degree",
      "occupation": "Marketing Manager",
      "familyStatus": "Married with children"
    },
    "psychographics": {
      "motivations": ["Career advancement", "Family health", "Work-life balance"],
      "concerns": ["Product effectiveness", "Price value", "Side effects"],
      "values": ["Quality", "Trust", "Innovation"],
      "lifestyle": ["Health-conscious", "Tech-savvy", "Family-oriented"]
    },
    "behaviors": {
      "preferredChannel": "Online research",
      "categoryUsage": "Regular user",
      "expectedPurchaseTime": "Within 3 months",
      "researchStyle": "Heavy researcher",
      "influencers": ["Health professionals", "Online reviews", "Friends"]
    },
    "purchaseIntent": 75,
    "priceAcceptance": {
      "tooExpensive": 120,
      "expensive": 85,
      "cheap": 35,
      "tooCheap": 15
    },
    "brandFit": 8.5,
    "featurePreferences": {
      "naturalIngredients": 9,
      "clinicalBacking": 8,
      "convenience": 7,
      "price": 6
    },
    "metadata": {
      "device": "Mobile",
      "timeSpent": 180,
      "completionRate": 100
    }
  }
]

REQUIREMENTS:
- Create diverse responses across different demographics
- Ensure realistic purchase intent scores (0-100)
- Include varied price acceptance patterns
- Make brand fit scores realistic (1-10)
- Include realistic time spent (60-600 seconds)
- Ensure responses feel authentic and varied
- Match demographic patterns to target audiences

Return ONLY valid JSON array with ${batchSize} responses. No markdown.`
}

function generateMockResponses(batchSize: number, offset: number): any[] {
  const responses = []
  
  for (let i = 0; i < batchSize; i++) {
    const age = 25 + Math.floor(Math.random() * 35)
    const income = 30000 + Math.floor(Math.random() * 120000)
    const purchaseIntent = 20 + Math.floor(Math.random() * 80)
    const brandFit = 3 + Math.floor(Math.random() * 8)
    
    responses.push({
      audienceId: null,
      demographics: {
        age,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        income,
        location: ['Urban', 'Suburban', 'Rural'][Math.floor(Math.random() * 3)],
        education: ['High School', 'Bachelor\'s', 'Master\'s', 'PhD'][Math.floor(Math.random() * 4)],
        occupation: ['Professional', 'Manager', 'Student', 'Retired'][Math.floor(Math.random() * 4)],
        familyStatus: ['Single', 'Married', 'Divorced'][Math.floor(Math.random() * 3)]
      },
      psychographics: {
        motivations: ['Health improvement', 'Performance enhancement', 'Quality of life'],
        concerns: ['Side effects', 'Cost', 'Effectiveness'],
        values: ['Quality', 'Trust', 'Innovation'],
        lifestyle: ['Health-conscious', 'Active', 'Busy']
      },
      behaviors: {
        preferredChannel: ['Online research', 'Social media', 'Direct marketing'][Math.floor(Math.random() * 3)],
        categoryUsage: ['Regular user', 'Occasional user', 'New to category'][Math.floor(Math.random() * 3)],
        expectedPurchaseTime: ['Within 1 month', 'Within 3 months', 'Within 6 months'][Math.floor(Math.random() * 3)],
        researchStyle: ['Heavy researcher', 'Quick decision', 'Social proof driven'][Math.floor(Math.random() * 3)],
        influencers: ['Health professionals', 'Online reviews', 'Friends']
      },
      purchaseIntent,
      priceAcceptance: {
        tooExpensive: Math.round(purchaseIntent * 1.5),
        expensive: Math.round(purchaseIntent * 1.2),
        cheap: Math.round(purchaseIntent * 0.6),
        tooCheap: Math.round(purchaseIntent * 0.3)
      },
      brandFit,
      featurePreferences: {
        naturalIngredients: 6 + Math.floor(Math.random() * 5),
        clinicalBacking: 5 + Math.floor(Math.random() * 5),
        convenience: 4 + Math.floor(Math.random() * 5),
        price: 3 + Math.floor(Math.random() * 5)
      },
      metadata: {
        device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
        timeSpent: 60 + Math.floor(Math.random() * 300),
        completionRate: 100
      }
    })
  }
  
  return responses
}
