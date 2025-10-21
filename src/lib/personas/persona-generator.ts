/**
 * RICH PERSONA GENERATOR
 * Creates vivid, narrative-driven customer personas for marketing strategy
 */

import { aiClient, getAIModel, isAIAvailable } from '../ai-client'

interface Pattern {
  id: string
  title: string
  segment: {
    name: string
    size: number
    characteristics: any
    psychographics?: any
  }
  metrics: {
    purchaseIntent: number
    lift: number
    sampleSize: number
  }
}

interface SyntheticResponse {
  id: string
  demographics: any
  psychographics: any
  behaviors: any
  purchaseIntent: number
}

interface Audience {
  id: string
  name: string
  demographics: any
  psychographics?: any
}

interface Persona {
  id: string
  name: string
  tagline: string
  demographics: {
    age: string
    gender: string
    income: string
    location: string
    education: string
    occupation: string
    familyStatus: string
  }
  narrative: string
  jobsToBeDone: {
    functional: string[]
    emotional: string[]
    social: string[]
  }
  motivations: string[]
  painPoints: string[]
  purchaseDrivers: {
    mustHaves: string[]
    niceToHaves: string[]
    dealBreakers: string[]
  }
  decisionProcess: {
    researchStyle: string
    influencers: string[]
    timeline: string
    objections: string[]
  }
  messaging: {
    resonates: string[]
    turnsOff: string[]
    tone: string
    channels: string[]
  }
  quotableQuotes: string[]
  dayInLife: string
  marketingGuidance: {
    positioning: string
    keyBenefits: string[]
    socialProof: string
    pricing: string
    campaignIdeas: string[]
  }
  sizeAndValue: {
    estimatedSize: number
    purchaseLikelihood: string
    expectedLTV: string
    acquisitionDifficulty: string
    strategicValue: string
  }
}

export async function generateRichPersonas(data: {
  patterns: Pattern[]
  responses: SyntheticResponse[]
  audiences: Audience[]
}): Promise<Persona[]> {
  
  console.log('👥 Generating rich personas...')
  
  if (!isAIAvailable()) {
    throw new Error('AI service not available')
  }
  
  const prompt = buildPersonaPrompt(data)
  
  console.log(`📊 Persona prompt prepared: ${prompt.length} chars`)
  
  try {
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: 'You are a marketing analyst. Generate 2-3 customer personas. Return ONLY valid JSON array with this exact structure for each persona: {"id": "unique-id", "name": "Persona Name", "tagline": "One sentence description", "demographics": {"age": "30-45", "gender": "Male/Female", "income": "$50K-$100K", "location": "Urban/Suburban", "education": "Bachelor\'s", "occupation": "Professional", "familyStatus": "Married/Single"}, "narrative": "2-3 paragraph story about this person", "jobsToBeDone": {"functional": ["practical needs"], "emotional": ["feelings sought"], "social": ["social needs"]}, "motivations": ["primary drivers"], "painPoints": ["frustrations"], "purchaseDrivers": {"mustHaves": ["non-negotiables"], "niceToHaves": ["bonus features"], "dealBreakers": ["what makes them walk away"]}, "decisionProcess": {"researchStyle": "Heavy researcher", "influencers": ["who influences them"], "timeline": "decision timeline", "objections": ["hesitations"]}, "messaging": {"resonates": ["messages that work"], "turnsOff": ["messages that repel"], "tone": "Professional/Casual", "channels": ["where to reach them"]}, "quotableQuotes": ["3-4 realistic quotes"], "dayInLife": "detailed narrative", "marketingGuidance": {"positioning": "how to position", "keyBenefits": ["benefits to emphasize"], "socialProof": "type of proof that resonates", "pricing": "price sensitivity", "campaignIdeas": ["campaign concepts"]}, "sizeAndValue": {"estimatedSize": 100000, "purchaseLikelihood": "75%", "expectedLTV": "$300", "acquisitionDifficulty": "Medium", "strategicValue": "High"}}'
        },
        {
          role: 'user',
          content: `Product: ${data.patterns[0]?.title || 'Health Product'}
Generate 2-3 personas. Return ONLY valid JSON array.`
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response - handle various formats
    let personas: Persona[]
    
    try {
      // Clean the content - remove any markdown formatting
      let cleanContent = content.trim()
      
      // Remove markdown code blocks if present
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Try to find JSON array in the content
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        cleanContent = jsonMatch[0]
      }
      
      console.log('🧹 Cleaned content for parsing:', cleanContent.substring(0, 200) + '...')
      
      // Parse the JSON
      personas = JSON.parse(cleanContent)
      
      // Ensure it's an array
      if (!Array.isArray(personas)) {
        personas = [personas]
      }
      
      console.log('✅ Successfully parsed personas:', personas.length, 'personas')
      console.log('First persona:', personas[0]?.name)
    } catch (parseError) {
      console.error('Failed to parse personas response:', content)
      console.error('Parse error:', parseError)
      console.error('Raw content length:', content.length)
      console.error('First 500 chars:', content.substring(0, 500))
      
      // Try to extract JSON from the content more aggressively
      try {
        const jsonStart = content.indexOf('[')
        const jsonEnd = content.lastIndexOf(']') + 1
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const extractedJson = content.substring(jsonStart, jsonEnd)
          personas = JSON.parse(extractedJson)
          if (!Array.isArray(personas)) {
            personas = [personas]
          }
          console.log('✅ Successfully extracted and parsed personas from content')
        } else {
          throw new Error('No valid JSON array found in content')
        }
      } catch (extractError) {
        console.error('Failed to extract JSON from content:', extractError)
        throw new Error('Invalid personas format from AI')
      }
    }

    console.log(`✅ Generated ${personas.length} rich personas`)
    
    return personas

  } catch (error) {
    console.error('Persona generation error:', error)
    throw error
  }
}

function buildPersonaPrompt(data: any): string {
  return `You are creating customer personas for marketing strategy. These are NOT demographics lists - they are rich, narrative profiles that marketers will use to guide messaging, product development, and go-to-market strategy.

DATA SUMMARY:
${(data.patterns || []).slice(0, 5).map((p: any) => `
Pattern: ${p.title}
Segment: ${p.segment?.name || 'Unknown'} (${p.segment?.size || 0} people)
Purchase Intent: ${p.metrics?.purchaseIntent || 0}%
Key Behaviors: ${JSON.stringify(p.segment?.psychographics || {})}
`).join('\n')}

RESPONSE INSIGHTS:
- Total Responses: ${data.responses?.length || 0}
- Average Purchase Intent: ${calculateAvgIntent(data.responses || [])}%
- Top Demographics: ${getTopDemographics(data.responses || [])}
- Key Motivations: ${getTopMotivations(data.responses || [])}

CREATE 3-5 PERSONAS following this EXACT structure:

{
  "id": "persona-1",
  "name": "Descriptive name that captures essence (e.g., 'The Comeback Dad', 'The Peak Performer')",
  "tagline": "One-sentence archetype",
  "demographics": {
    "age": "30-45",
    "gender": "Male",
    "income": "$75K-$150K",
    "location": "Urban/Suburban",
    "education": "Bachelor's degree",
    "occupation": "Mid-senior management",
    "familyStatus": "Divorced, 2 kids"
  },
  "narrative": "A rich 2-3 paragraph story about who this person is. Use third person. Make it VIVID and SPECIFIC:
    - What does a typical day look like?
    - What's their relationship with similar products?
    - What are they trying to achieve in life?
    - What are their fears and aspirations?
    - How do they make purchase decisions?",
  
  "jobsToBeDone": {
    "functional": ["What practical problem are they solving?"],
    "emotional": ["What feeling are they seeking?"],
    "social": ["What do they want others to think/see?"]
  },
  
  "motivations": [
    "Primary drivers (be specific: not 'health' but 'being able to play with kids without getting tired')"
  ],
  
  "painPoints": [
    "Specific frustrations (not 'price' but 'feels like spending money with no guaranteed results')"
  ],
  
  "purchaseDrivers": {
    "mustHaves": ["Non-negotiables"],
    "niceToHaves": ["Bonus features"],
    "dealBreakers": ["What would make them walk away"]
  },
  
  "decisionProcess": {
    "researchStyle": "Heavy researcher | Quick decision | Social proof driven",
    "influencers": ["Who influences their decisions"],
    "timeline": "Impulsive | Considers for weeks | Waits for proof",
    "objections": ["What hesitations they have"]
  },
  
  "messaging": {
    "resonates": ["Messages that work (be specific, use actual phrases)"],
    "turnsOff": ["Messages that repel them"],
    "tone": "Professional | Casual | Scientific | Inspirational",
    "channels": ["Where to reach them"]
  },
  
  "quotableQuotes": [
    "3-4 realistic quotes this persona would say about the product/problem (make them feel REAL)"
  ],
  
  "dayInLife": "A detailed narrative (4-5 sentences) showing how this product fits into their life. When would they use it? What prompts the purchase? How do they feel about it?",
  
  "marketingGuidance": {
    "positioning": "How to position the product to this persona",
    "keyBenefits": ["Which benefits to emphasize (in priority order)"],
    "socialProof": "What type of testimonials/proof resonates",
    "pricing": "Price sensitivity and willingness to pay",
    "campaignIdeas": ["3-4 specific campaign concepts for this persona"]
  },
  
  "sizeAndValue": {
    "estimatedSize": 500000,
    "purchaseLikelihood": "75%",
    "expectedLTV": "$450",
    "acquisitionDifficulty": "Medium",
    "strategicValue": "High - early adopters who influence others"
  }
}

CRITICAL REQUIREMENTS:
- Each persona must feel like a REAL PERSON you could have coffee with
- Use specific details, not generalizations ("drives a 5-year-old Honda Accord" not "has a car")
- Include contradictions and nuance (people are complex)
- Write in active, vivid language
- Every section must be ACTIONABLE for marketing
- The "quotable quotes" should sound like real human speech
- Reference actual data points from the patterns provided
- Make personas distinct from each other - avoid overlap

Return ONLY valid JSON array with 3-5 personas. No markdown.`
}

// Helper functions
function calculateAvgIntent(responses: SyntheticResponse[]): number {
  if (!responses || responses.length === 0) return 0
  const total = responses.reduce((sum, r) => sum + (r.purchaseIntent || 0), 0)
  return Math.round(total / responses.length)
}

function getTopDemographics(responses: SyntheticResponse[]): string {
  if (!responses || responses.length === 0) return 'No data'
  
  const ageGroups: Record<string, number> = {}
  const genders: Record<string, number> = {}
  
  responses.forEach(response => {
    const age = response.demographics?.age
    const gender = response.demographics?.gender
    
    if (age) {
      const ageGroup = getAgeGroup(age)
      ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1
    }
    
    if (gender) {
      genders[gender] = (genders[gender] || 0) + 1
    }
  })
  
  const topAge = Object.entries(ageGroups).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'
  const topGender = Object.entries(genders).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'
  
  return `${topGender} ${topAge}`
}

function getTopMotivations(responses: SyntheticResponse[]): string {
  if (!responses || responses.length === 0) return 'No data'
  
  const motivations: Record<string, number> = {}
  
  responses.forEach(response => {
    const motivs = response.psychographics?.motivations || []
    motivs.forEach((motivation: string) => {
      motivations[motivation] = (motivations[motivation] || 0) + 1
    })
  })
  
  const topMotivations = Object.entries(motivations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([motivation]) => motivation)
    .join(', ')
  
  return topMotivations || 'No motivations found'
}

function getAgeGroup(age: number): string {
  if (age < 25) return '18-24'
  if (age < 35) return '25-34'
  if (age < 45) return '35-44'
  if (age < 55) return '45-54'
  if (age < 65) return '55-64'
  return '65+'
}
