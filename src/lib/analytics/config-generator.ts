import OpenAI from 'openai'
import { IndustryConfig } from '../config/industries'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

/**
 * AI CONFIG GENERATOR
 * Generates custom industry configuration for "Other" category
 * Makes RespondAI work for ANY product by extracting attributes using AI
 */
export async function generateCustomConfig(
  productName: string,
  productDescription: string,
  industry?: string
): Promise<IndustryConfig> {
  console.log('🤖 Generating custom industry config with AI...')
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a market research expert. Analyze the product and extract key attributes that make it unique. Return ONLY valid JSON, no markdown formatting.`,
        },
        {
          role: 'user',
          content: `Analyze this product and extract specific attributes:

Product: ${productName}
Description: ${productDescription}
${industry ? `Industry context: ${industry}` : ''}

Return JSON with this EXACT structure:
{
  "benefits": [8 specific product benefits based on the description],
  "motivations": [6 customer motivations for buying THIS product],
  "concerns": [6 potential customer concerns specific to this product],
  "formats": [product format/delivery options if applicable, or empty array],
  "pricingModels": [relevant pricing models for this product type]
}

Make it highly specific to THIS product, not generic. Use the product description to infer real benefits.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content generated')
    }

    // Parse AI response
    const parsed = JSON.parse(content)
    
    return {
      category: 'custom',
      name: 'Custom',
      icon: '✨',
      description: `Custom configuration for ${productName}`,
      benefits: parsed.benefits || [],
      motivations: parsed.motivations || [],
      concerns: parsed.concerns || [],
      formats: parsed.formats || [],
      deliveryMethods: parsed.deliveryMethods || [],
      pricingModels: parsed.pricingModels || ['One-time', 'Subscription'],
    }
  } catch (error) {
    console.error('Failed to generate custom config:', error)
    
    // Fallback to generic config
    return getFallbackConfig()
  }
}

/**
 * Fallback configuration if AI fails
 */
function getFallbackConfig(): IndustryConfig {
  return {
    category: 'custom',
    name: 'Custom',
    icon: '✨',
    description: 'Generic product configuration',
    benefits: [
      'High Quality',
      'Great Value',
      'Reliable',
      'Easy to Use',
      'Effective',
      'Convenient',
      'Trusted',
      'Innovative',
    ],
    motivations: [
      'Solve specific problem',
      'Improve quality of life',
      'Save time',
      'Save money',
      'Try something new',
      'Recommendation',
    ],
    concerns: [
      'Price',
      'Quality',
      'Effectiveness',
      'Ease of use',
      'Support',
      'Trust',
    ],
    formats: [],
    pricingModels: ['One-time', 'Subscription'],
  }
}

/**
 * Cache custom configs to avoid regenerating
 */
const configCache = new Map<string, IndustryConfig>()

export async function getCachedCustomConfig(
  productName: string,
  productDescription: string,
  industry?: string
): Promise<IndustryConfig> {
  const cacheKey = `${productName}-${productDescription.substring(0, 50)}`
  
  if (configCache.has(cacheKey)) {
    return configCache.get(cacheKey)!
  }
  
  const config = await generateCustomConfig(productName, productDescription, industry)
  configCache.set(cacheKey, config)
  
  return config
}

