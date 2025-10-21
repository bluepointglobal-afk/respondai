/**
 * ROBUST AI ANALYSIS ENGINE
 * Single, reliable AI engine with comprehensive error handling
 */

import { aiClient, getAIModel, isAIAvailable } from '../ai-client'
import { 
  ProductInfo, 
  ComprehensiveAnalysisResult, 
  AnalysisError,
  AnalysisResponse 
} from './types'
import { validateAnalysisResult, createAnalysisError } from './validation'

/**
 * Generate comprehensive market research analysis
 * Single AI call with robust error handling and validation
 */
export async function generateComprehensiveAnalysis(
  productInfo: ProductInfo
): Promise<ComprehensiveAnalysisResult> {
  
  // Pre-flight checks
  if (!isAIAvailable()) {
    throw createAnalysisError(
      'AI service not available',
      'AI_UNAVAILABLE',
      { message: 'Please configure API keys for OpenAI or Groq' }
    )
  }

  if (!productInfo?.name || !productInfo?.description) {
    throw createAnalysisError(
      'Invalid product information',
      'INVALID_INPUT',
      { productInfo }
    )
  }

  console.log(`🤖 Generating comprehensive analysis for: ${productInfo.name}`)
  
  try {
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt()
        },
        {
          role: 'user',
          content: buildAnalysisPrompt(productInfo)
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw createAnalysisError(
        'No analysis generated from AI',
        'AI_NO_RESPONSE',
        { completion }
      )
    }

    // Parse and validate the response
    const analysis = parseAIResponse(content)
    const validation = validateAnalysisResult(analysis)

    if (!validation.success) {
      throw createAnalysisError(
        'AI response validation failed',
        'VALIDATION_FAILED',
        { errors: validation.errors, warnings: validation.warnings }
      )
    }

    console.log(`✅ Generated comprehensive analysis with ${validation.data.insights?.length || 0} insights and ${validation.data.patterns?.length || 0} patterns`)
    
    return validation.data

  } catch (error) {
    console.error('AI analysis error:', error)
    
    if (error instanceof AnalysisError) {
      throw error
    }

    // Handle AI API errors
    if (error instanceof Error) {
      throw createAnalysisError(
        `AI analysis failed: ${error.message}`,
        'AI_API_ERROR',
        { originalError: error.message }
      )
    }

    throw createAnalysisError(
      'Unknown error during AI analysis',
      'UNKNOWN_ERROR',
      { error }
    )
  }
}

/**
 * Build the system prompt for the AI
 */
function buildSystemPrompt(): string {
  return `You are a world-class market research analyst and data scientist with expertise in:

- Consumer behavior analysis and segmentation
- Statistical significance testing and confidence intervals
- Pricing psychology and Van Westendorp analysis
- Brand positioning and messaging optimization
- Market sizing and opportunity assessment
- Risk analysis and mitigation strategies
- Cross-demographic pattern detection
- Revenue impact modeling

You analyze products with the rigor of McKinsey, the creativity of IDEO, and the statistical precision of Gallup.

CRITICAL REQUIREMENTS:
1. Generate REALISTIC, DATA-DRIVEN insights based on actual market research principles
2. Use proper statistical measures (confidence intervals, p-values, sample sizes)
3. Provide SPECIFIC, ACTIONABLE recommendations with clear ROI estimates
4. Include demographic cross-tabulations with statistical significance
5. Generate insights that reflect REAL consumer behavior patterns
6. Use industry-specific knowledge and benchmarks
7. Provide revenue impact estimates based on realistic market sizing

RESPONSE FORMAT:
Return ONLY valid JSON matching the exact schema provided. No markdown formatting, no code blocks, no explanations. Just pure JSON starting with { and ending with }.

SCHEMA VALIDATION:
- All required fields must be present
- All values must match the specified types
- Arrays must contain valid objects
- Numbers must be realistic and properly formatted
- Strings must be non-empty and meaningful

QUALITY STANDARDS:
- Insights must be specific and actionable
- Patterns must include statistical significance
- Personas must be realistic and detailed
- Recommendations must be prioritized and timed
- Risks must be properly categorized and mitigated`
}

/**
 * Build the analysis prompt for the AI
 */
function buildAnalysisPrompt(productInfo: ProductInfo): string {
  return `Analyze this product comprehensively and generate a complete market research report based on 500 synthetic survey responses:

**COMPREHENSIVE PRODUCT & BRAND ANALYSIS:**

**PRODUCT INFORMATION:**
- Name: ${productInfo.name}
- Description: ${productInfo.description}
- Industry: ${productInfo.industry}
- Target Audience: ${productInfo.targetAudience}
- Problem Being Solved: ${productInfo.problemStatement || 'Not specified'}
- Unique Value Proposition: ${productInfo.uniqueValue || 'Not specified'}
- Price Range: $${productInfo.priceRange?.min || 0} - $${productInfo.priceRange?.max || 0}

**BRAND & COMPANY DEEP DIVE:**
- Company Name: ${productInfo.companyName || 'Not specified'}
- Brand Values: ${productInfo.brandValues?.join(', ') || 'Not specified'}
- Brand Mission: ${productInfo.brandMission || 'Not specified'}
- Brand Vision: ${productInfo.brandVision || 'Not specified'}
- Brand Voice: ${productInfo.brandVoice || 'Not specified'}
- Company Story: ${productInfo.companyStory || 'Not specified'}
- Founder Background: ${productInfo.founderBackground || 'Not specified'}

**MARKET & BUSINESS CONTEXT:**
- Business Model: ${productInfo.businessModel || 'Not specified'}
- Revenue Model: ${productInfo.revenueModel || 'Not specified'}
- Distribution Channels: ${productInfo.distributionChannels?.join(', ') || 'Not specified'}
- Market Size: ${productInfo.marketSize || 'Not specified'}
- Market Growth: ${productInfo.marketGrowth || 'Not specified'}
- Competitors: ${productInfo.competitors?.join(', ') || 'Not specified'}
- Competitive Advantage: ${productInfo.competitiveAdvantage?.join(', ') || 'Not specified'}
- Market Gap: ${productInfo.marketGap || 'Not specified'}

**CUSTOMER INSIGHTS:**
- Existing Customers: ${productInfo.existingCustomers || 'Not specified'}
- Customer Stories: ${productInfo.customerStories?.join(', ') || 'Not specified'}
- Testimonials: ${productInfo.testimonials?.join(', ') || 'Not specified'}
- Common Objections: ${productInfo.commonObjections?.join(', ') || 'Not specified'}
- Conversion Barriers: ${productInfo.conversionBarriers?.join(', ') || 'Not specified'}
- Key Purchase Drivers: ${productInfo.keyPurchaseDrivers?.join(', ') || 'Not specified'}

**CULTURAL & REGULATORY CONTEXT:**
- Cultural Context: ${productInfo.culturalContext || 'Not specified'}
- Regulatory Context: ${productInfo.regulatoryContext || 'Not specified'}
- Certifications: ${productInfo.certifications?.join(', ') || 'Not specified'}
- Sustainability: ${productInfo.sustainability || 'Not specified'}
- Diversity Commitment: ${productInfo.diversityCommitment || 'Not specified'}

**ANALYSIS REQUIREMENTS:**

Based on the comprehensive brand story and product information above, generate a detailed market research analysis as if you surveyed 500 real consumers from the target demographic. Consider the brand's unique positioning around "men in transformation" and the specific challenges they face.

1. **EXECUTIVE SUMMARY**
   - Should this product launch? (boolean)
   - Confidence level (0-100)
   - One-line summary that reflects the brand's transformation narrative
   - Specific demographic insight (e.g., "Divorced fathers 35-45 show 47% higher purchase intent due to transformation messaging")

2. **KEY METRICS** (Based on 500 synthetic responses)
   - Purchase Intent: Average score with demographic breakdowns
   - Optimal Price: Van Westendorp analysis considering the target demographic's financial situation
   - Top Benefit: Most valued feature with connection to brand transformation story
   - Brand Fit: Score out of 10 with confidence intervals

3. **INSIGHTS** (Generate 8-12 insights across all types)
   - Market opportunities with revenue impact (consider the transformation market)
   - Red flags requiring attention (pricing sensitivity, messaging risks)
   - Messaging optimization recommendations (leverage the brand story)
   - Pricing strategy insights (consider target demographic's financial pressure)
   - Market sizing opportunities (transformation/rebuilding market)
   - Quick wins for immediate implementation

4. **PATTERNS** (Identify 3-5 statistically significant patterns)
   - Demographic segments with higher/lower intent (age, income, life stage)
   - Psychographic clusters with distinct behaviors (transformation seekers vs. status quo)
   - Geographic preferences and variations (urban vs. suburban transformation needs)
   - Behavioral patterns and preferences (how they discover and purchase)

5. **PERSONAS** (Generate 3 detailed personas based on the brand story)
   - "The Rebuilding Father" - divorced, rebuilding life, seeking dignity
   - "The Silent Transformer" - going through hardship, needs support
   - "The Dignity Seeker" - wants to reclaim self-respect through self-care
   - Include purchase intent, price sensitivity, benefits, concerns for each

6. **RECOMMENDATIONS** (Prioritized by timeline and impact)
   - Immediate actions (1-2 weeks)
   - Near-term goals (1-3 months) 
   - Long-term strategy (3-12 months)

7. **RISKS** (Based on the target demographic and brand positioning)
   - Market risks (price sensitivity, competition)
   - Brand risks (messaging misalignment, cultural sensitivity)
   - Execution risks (distribution, pricing, positioning)

**CRITICAL REQUIREMENTS:**
- Generate realistic, data-driven insights based on the brand story and target demographic
- Use proper statistical measures (confidence intervals, p-values, sample sizes)
- Provide specific, actionable recommendations with clear ROI estimates
- Include demographic cross-tabulations with statistical significance
- Generate insights that reflect REAL consumer behavior patterns for men 30-50 going through transformation
- Use industry-specific knowledge and benchmarks for health/wellness supplements
- Provide revenue impact estimates based on realistic market sizing
- Consider the unique positioning around "transformation" and "dignity through self-care"
- Address the specific pain points: divorce, financial pressure, silent battles, rebuilding
- Leverage the brand's mission: "helping men rebuild presence, dignity, and strength"

Return ONLY valid JSON matching the exact schema provided. No markdown formatting, no code blocks, no explanations. Just pure JSON starting with { and ending with }.

**STATISTICAL REQUIREMENTS:**
- Use realistic sample sizes (n=500 for overall, n=50-150 for segments)
- Include proper confidence intervals (90%, 95%, 99%)
- Provide p-values for significance testing
- Use realistic effect sizes and lift percentages
- Base revenue estimates on actual market sizing

**INDUSTRY CONTEXT:**
Apply deep knowledge of ${productInfo.industry} industry:
- Typical purchase intent ranges
- Price sensitivity patterns
- Key success factors
- Common failure modes
- Competitive landscape considerations

Generate a comprehensive analysis that a Fortune 500 company would pay $100K+ for.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "executiveSummary": {
    "shouldLaunch": true,
    "confidence": 85,
    "oneLineSummary": "Your one-line summary here",
    "keyFindingHighlight": "Your key finding here"
  },
  "keyMetrics": {
    "purchaseIntent": {
      "value": 65,
      "subtitle": "AI Generated",
      "n": 500,
      "distribution": {"high": 200, "medium": 200, "low": 100}
    },
    "optimalPrice": {
      "value": "$29.99",
      "subtitle": "AI Recommended", 
      "n": 500,
      "distribution": {"tooCheap": 50, "cheap": 150, "expensive": 200, "tooExpensive": 100}
    },
    "topBenefit": {
      "value": "Key Benefit",
      "subtitle": "Most preferred",
      "n": 500,
      "distribution": {"benefit1": 200, "benefit2": 150, "benefit3": 100, "benefit4": 50}
    },
    "brandFit": {
      "value": 7.5,
      "subtitle": "Out of 10",
      "n": 500,
      "distribution": {"mean": 7.5, "stdDev": 1.2, "confidenceInterval": [7.3, 7.7]}
    }
  },
  "insights": [
    {
      "id": "insight-1",
      "type": "opportunity",
      "priority": "high",
      "headline": "Market opportunity headline",
      "narrative": "Detailed narrative explaining the opportunity",
      "dataSupport": "Statistical support for this insight",
      "impactScore": 85,
      "revenueImpact": 1000000,
      "confidence": 90,
      "recommendations": [
        {
          "action": "Specific action to take",
          "difficulty": "medium",
          "timeToValue": "1-2 months",
          "estimatedLift": 25,
          "cost": "medium"
        }
      ]
    }
  ],
  "patterns": [
    {
      "id": "pattern-1",
      "type": "demographic",
      "title": "Pattern title",
      "description": "Pattern description",
      "confidence": 90,
      "pValue": 0.01,
      "sampleSize": 150,
      "segments": [
        {
          "name": "Segment name",
          "size": 150,
          "purchaseIntent": 75,
          "lift": 25,
          "priceAcceptance": 80,
          "brandFit": 8.5,
          "topBenefits": ["Benefit 1", "Benefit 2"],
          "primaryMotivation": "Primary motivation",
          "concerns": ["Concern 1", "Concern 2"],
          "preferredFormat": "Preferred format",
          "channelPreference": "Preferred channel"
        }
      ],
      "impact": "high",
      "revenueImpact": 500000,
      "recommendations": ["Recommendation 1", "Recommendation 2"],
      "messaging": "Key messaging for this pattern"
    }
  ],
  "personas": [
    {
      "id": "persona-1",
      "name": "Persona name",
      "title": "Persona title",
      "age": "25-35",
      "income": "$50-75K",
      "location": "Urban",
      "psychographics": "Detailed psychographic description",
      "icon": "👤",
      "purchaseIntent": 75,
      "priceSensitivity": 60,
      "topBenefits": ["Benefit 1", "Benefit 2"],
      "concerns": ["Concern 1", "Concern 2"],
      "preferredChannels": ["Channel 1", "Channel 2"]
    }
  ],
  "recommendations": {
    "immediate": ["Immediate action 1", "Immediate action 2"],
    "nearTerm": ["Near term action 1", "Near term action 2"],
    "longTerm": ["Long term action 1", "Long term action 2"]
  },
  "risks": [
    {
      "type": "market",
      "severity": "medium",
      "description": "Risk description",
      "mitigation": "Mitigation strategy"
    }
  ],
  "nextSteps": {
    "immediate": ["Immediate step 1", "Immediate step 2"],
    "nearTerm": ["Near term step 1", "Near term step 2"],
    "longTerm": ["Long term step 1", "Long term step 2"]
  }
}`
}

/**
 * Parse AI response with robust error handling
 */
function parseAIResponse(content: string): any {
  try {
    // Clean the content
    let cleaned = content.trim()
    
    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    // Find JSON boundaries
    const startIndex = cleaned.indexOf('{')
    const lastIndex = cleaned.lastIndexOf('}')
    
    if (startIndex === -1 || lastIndex === -1 || startIndex >= lastIndex) {
      throw new Error('No valid JSON found in response')
    }
    
    const jsonContent = cleaned.substring(startIndex, lastIndex + 1)
    const parsed = JSON.parse(jsonContent)
    
    console.log(`✅ Successfully parsed AI response (${jsonContent.length} characters)`)
    return parsed
    
  } catch (parseError) {
    console.error('Failed to parse AI response:', {
      content: content.substring(0, 500) + '...',
      error: parseError instanceof Error ? parseError.message : 'Unknown parse error'
    })
    
    throw createAnalysisError(
      'Failed to parse AI response as valid JSON',
      'PARSE_ERROR',
      { 
        parseError: parseError instanceof Error ? parseError.message : 'Unknown error',
        contentPreview: content.substring(0, 200)
      }
    )
  }
}

/**
 * Create a fallback analysis for when AI fails
 * This should only be used in extreme cases
 */
export function createFallbackAnalysis(productInfo: ProductInfo): ComprehensiveAnalysisResult {
  console.warn(`⚠️ Creating fallback analysis for ${productInfo.name} - AI analysis failed`)
  
  return {
    executiveSummary: {
      shouldLaunch: true,
      confidence: 75,
      oneLineSummary: "Product shows potential but requires further validation",
      keyFindingHighlight: "Initial analysis suggests market opportunity exists"
    },
    keyMetrics: {
      purchaseIntent: {
        value: 65,
        subtitle: "Estimated",
        n: 500,
        distribution: { high: 200, medium: 200, low: 100 }
      },
      optimalPrice: {
        value: "$29.99",
        subtitle: "Estimated",
        n: 500,
        distribution: { tooCheap: 50, cheap: 150, expensive: 200, tooExpensive: 100 }
      },
      topBenefit: {
        value: "Core Benefit",
        subtitle: "Estimated",
        n: 500,
        distribution: { benefit1: 200, benefit2: 150, benefit3: 100, benefit4: 50 }
      },
      brandFit: {
        value: 7.0,
        subtitle: "Out of 10",
        n: 500,
        distribution: { mean: 7.0, stdDev: 1.5, confidenceInterval: [6.8, 7.2] }
      }
    },
    insights: [
      {
        id: "fallback-insight-1",
        type: "opportunity",
        priority: "medium",
        headline: "Market validation required",
        narrative: "Product shows initial promise but requires comprehensive market validation",
        dataSupport: "Based on industry benchmarks and initial assessment",
        impactScore: 60,
        revenueImpact: 0,
        confidence: 75,
        recommendations: [
          {
            action: "Conduct comprehensive market research",
            difficulty: "medium",
            timeToValue: "2-3 months",
            estimatedLift: 15,
            cost: "medium"
          }
        ]
      }
    ],
    patterns: [],
    personas: [
      {
        id: "fallback-persona-1",
        name: "Target Customer",
        title: "Primary Target",
        age: "25-45",
        income: "$50-100K",
        location: "Urban",
        psychographics: "Tech-savvy, health-conscious, values convenience",
        icon: "👤",
        purchaseIntent: 65,
        priceSensitivity: 60,
        topBenefits: ["Convenience", "Quality", "Value"],
        concerns: ["Price", "Effectiveness", "Trust"],
        preferredChannels: ["Online", "Social Media"]
      }
    ],
    recommendations: {
      immediate: ["Validate market demand", "Refine value proposition"],
      nearTerm: ["Conduct user research", "Develop go-to-market strategy"],
      longTerm: ["Scale marketing efforts", "Expand product line"]
    },
    risks: [
      {
        type: "market",
        severity: "medium",
        description: "Market validation incomplete",
        mitigation: "Conduct comprehensive market research before launch"
      }
    ],
    nextSteps: {
      immediate: ["Validate assumptions", "Refine product positioning"],
      nearTerm: ["Conduct market research", "Develop marketing strategy"],
      longTerm: ["Scale operations", "Expand market reach"]
    }
  }
}
