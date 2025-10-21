import { NextRequest, NextResponse } from 'next/server'
import { aiClient, getAIModel, getProviderName } from '@/lib/ai-client'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Capturing actual AI prompts and responses...')
    
    // Get the AI model
    const modelName = getAIModel('smart')
    const providerName = getProviderName()
    console.log('🤖 Using AI provider:', providerName)
    console.log('🤖 Using AI model:', modelName)
    
    // Test prompt for insights
    const insightsPrompt = `
You are a senior marketing strategist analyzing market research data for a new product launch.

PRODUCT CONTEXT:
- Product: Grass fed protein whey ultra purified
- Description: Grass fed protein wey ulta purified
- Target Market: Men 30 - 65 in USA active professionals
- Industry: supplement
- Stage: idea

RESEARCH DATA:
- Total Responses: 500
- Overall Purchase Intent: 57%
- Price Sensitivity: 0.8
- Optimal Price Point: $65

KEY PATTERNS DETECTED:
1. Primary Target Segment
   - Segment: Health-Conscious Professionals (300 people)
   - Purchase Intent: 57%
   - Lift vs. Average: 15.0%
   - Sample Size: 300

YOUR TASK:
Generate 3 DEEP, ACTIONABLE insights that a CMO would pay $50,000 for. Each insight must:

1. **Be Specific**: Use exact numbers, percentages, and data points
2. **Reveal Non-Obvious Patterns**: Go beyond surface-level observations
3. **Be Actionable**: Include clear "what to do about it"
4. **Show Business Impact**: Quantify revenue opportunity or risk
5. **Use Marketing Frameworks**: Reference Jobs-to-be-Done, positioning theory, segmentation best practices

FOR EACH INSIGHT, PROVIDE:
{
  "type": "opportunity" | "risk" | "strategy" | "finding",
  "category": "market" | "pricing" | "positioning" | "segmentation" | "channel" | "timing" | "product",
  "priority": "high" | "medium" | "low",
  "title": "Compelling headline (8-12 words)",
  "summary": "One-sentence takeaway",
  "description": "3-4 paragraphs with specific numbers, business context, root cause analysis, and actionable recommendations",
  "evidence": {
    "dataPoints": ["Specific stat 1", "Specific stat 2", "Specific stat 3"],
    "sampleSize": number,
    "confidence": number,
    "methodology": "How this was calculated"
  },
  "impact": {
    "revenue": "Quantified revenue opportunity or risk",
    "timeframe": "Short-term (0-3mo) | Medium-term (3-12mo) | Long-term (12mo+)",
    "effort": "Low | Medium | High",
    "priority": "Critical | Important | Nice-to-have"
  },
  "recommendations": [
    {
      "action": "Specific action to take",
      "rationale": "Why this action addresses the insight",
      "timeline": "When to do it",
      "owner": "Who should own this",
      "kpis": ["How to measure success"]
    }
  ]
}

CRITICAL REQUIREMENTS:
- Every number must be derived from the actual response data provided
- No generic statements like "customers want quality" - be SPECIFIC
- Every insight must have a "so what?" - why does this matter to the business?
- Use marketing terminology: TAM/SAM/SOM, CAC, LTV, positioning, differentiation, etc.
- Reference psychological principles: loss aversion, social proof, anchoring, etc.
- Think like a strategy consultant, not a data analyst

Return ONLY valid JSON array with 3 insights. No markdown, no commentary.`

    console.log('📝 Sending insights prompt to AI...')
    console.log('Prompt length:', insightsPrompt.length)
    
    const insightsResponse = await aiClient.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: insightsPrompt }],
      temperature: 0.7,
      max_tokens: 4000
    })
    
    const insightsContent = insightsResponse.choices[0]?.message?.content || ''
    console.log('🤖 AI Response received')
    console.log('Response length:', insightsContent.length)
    console.log('First 500 chars:', insightsContent.substring(0, 500))
    
    // Test personas prompt
    const personasPrompt = `
You are creating customer personas for marketing strategy. These are NOT demographics lists - they are rich, narrative profiles that marketers will use to guide messaging, product development, and go-to-market strategy.

DATA SUMMARY:
Pattern: Primary Target Segment
Segment: Health-Conscious Professionals (300 people)
Purchase Intent: 57%
Key Behaviors: {"values":["innovation","quality"]}

CREATE 2 PERSONAS following this EXACT structure:

{
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
  "narrative": "A rich 2-3 paragraph story about who this person is. Use third person. Make it VIVID and SPECIFIC",
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
  "dayInLife": "A detailed narrative (4-5 sentences) showing how this product fits into their life",
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
- Use specific details, not generalizations
- Include contradictions and nuance (people are complex)
- Write in active, vivid language
- Every section must be ACTIONABLE for marketing
- The "quotable quotes" should sound like real human speech
- Reference actual data points from the patterns provided
- Make personas distinct from each other - avoid overlap

Return ONLY valid JSON array with 2 personas. No markdown.`

    console.log('📝 Sending personas prompt to AI...')
    const personasResponse = await aiClient.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: personasPrompt }],
      temperature: 0.8,
      max_tokens: 4000
    })
    
    const personasContent = personasResponse.choices[0]?.message?.content || ''
    console.log('🤖 AI Personas Response received')
    console.log('Response length:', personasContent.length)
    console.log('First 500 chars:', personasContent.substring(0, 500))

    return NextResponse.json({
      success: true,
      message: 'AI Prompts and Responses captured',
      provider: providerName,
      model: modelName,
      prompts: {
        insights: insightsPrompt,
        personas: personasPrompt
      },
      responses: {
        insights: {
          raw: insightsContent,
          length: insightsContent.length,
          first500: insightsContent.substring(0, 500)
        },
        personas: {
          raw: personasContent,
          length: personasContent.length,
          first500: personasContent.substring(0, 500)
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Debug prompts error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
