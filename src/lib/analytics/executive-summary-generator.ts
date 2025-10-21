/**
 * EXECUTIVE SUMMARY GENERATOR
 * Creates C-level executive summaries for board meetings and strategic decisions
 */

import { aiClient, getAIModel, isAIAvailable } from '../ai-client'

interface ProductInfo {
  name: string
  description: string
  targetAudience: string
  industry: string
  stage: string
}

interface PurchaseIntent {
  overall: {
    mean: number
    median: number
    stdDev: number
  }
}

interface Insight {
  id: string
  title: string
  type: string
  priority: string
  summary: string
  impact: {
    revenue: string
    timeframe: string
  }
}

interface Persona {
  id: string
  name: string
  tagline: string
  sizeAndValue: {
    estimatedSize: number
    purchaseLikelihood: string
    expectedLTV: string
  }
}

interface Recommendation {
  id: string
  title: string
  timeframe: string
  priority: string
  category: string
}

interface Pricing {
  optimalPrice: number
  elasticity: number
}

interface ExecutiveSummary {
  bottomLine: string
  marketOpportunity: string
  keyFinding: string
  strategicImplications: string[]
  recommendedActions: string[]
  risks: string[]
  confidence: number
  methodology: string
}

export async function generateExecutiveSummary(data: {
  productInfo: ProductInfo
  purchaseIntent: PurchaseIntent
  insights: Insight[]
  personas: Persona[]
  recommendations: Recommendation[]
  pricing: Pricing
  sampleSize: number
}): Promise<ExecutiveSummary> {
  
  console.log('📊 Generating executive summary...')
  
  if (!isAIAvailable()) {
    throw new Error('AI service not available')
  }
  
  const prompt = buildExecutiveSummaryPrompt(data)
  
  console.log(`📊 Executive summary prompt prepared: ${prompt.length} chars`)
  
  try {
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: 'You are a senior executive advisor writing a strategic summary for a CEO/CMO who will spend 3 minutes reading this before a board meeting. Be compelling but honest, strategic but concise. Lead with conclusions, not process.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 2000
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse the markdown response into structured data
    const summary = parseExecutiveSummary(content)
    
    console.log('✅ Generated executive summary')
    
    return summary

  } catch (error) {
    console.error('Executive summary generation error:', error)
    throw error
  }
}

function buildExecutiveSummaryPrompt(data: any): string {
  return `You are writing an executive summary for a CEO/CMO who will spend 3 minutes reading this before a board meeting.

PRODUCT: ${data.productInfo?.name || 'Unknown Product'}
SAMPLE SIZE: ${data.sampleSize || 0} responses
PURCHASE INTENT: ${data.purchaseIntent?.overall?.mean || 0}%
OPTIMAL PRICE: $${data.pricing?.optimalPrice || 0}

KEY INSIGHTS (Top 5):
${(data.insights || []).slice(0, 5).map((i: any, idx: number) => `${idx + 1}. ${i.title}`).join('\n')}

KEY PERSONAS:
${(data.personas || []).map((p: any) => `- ${p.name}: ${p.tagline}`).join('\n')}

TOP RECOMMENDATIONS:
${(data.recommendations || []).filter((r: any) => r.priority === 'critical').map((r: any) => `- ${r.title}`).join('\n')}

WRITE AN EXECUTIVE SUMMARY following this structure:

## The Bottom Line (1-2 sentences)
Start with the answer: Launch or don't launch? Clear recommendation.

## Market Opportunity (1 paragraph)
- TAM/SAM in dollars
- Who wants this and how badly
- What makes this opportunity compelling
- What's at stake if we miss it

## Key Finding (1 paragraph)
The single most important insight from the research. The "aha moment" that changes strategy.

## Strategic Implications (3-4 bullets)
The 3-4 most important things this research tells us about how to win:
- Positioning/messaging
- Target customer
- Pricing strategy  
- Go-to-market approach

## Recommended Actions (3-4 bullets)
The critical next steps, in priority order. What to do Monday morning.

## Risks & Considerations (2-3 bullets)
What could go wrong. What we need to watch out for.

## Confidence & Methodology (1 sentence)
Sample size, confidence level, data quality note.

WRITING GUIDELINES:
- Use executive language (strategic, confident, data-informed)
- Lead with conclusions, not process
- Be specific with numbers ("34% higher intent" not "strong interest")
- Assume reader is smart but busy
- No jargon or marketing buzzwords
- Every sentence should matter
- Write for skimming (bullets, bold key phrases)

Return as structured markdown. Be compelling but honest.`
}

function parseExecutiveSummary(content: string): ExecutiveSummary {
  // Parse the markdown content into structured data
  const lines = content.split('\n').filter(line => line.trim())
  
  let bottomLine = ''
  let marketOpportunity = ''
  let keyFinding = ''
  const strategicImplications: string[] = []
  const recommendedActions: string[] = []
  const risks: string[] = []
  let confidence = 85
  let methodology = ''
  
  let currentSection = ''
  let currentContent: string[] = []
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine.startsWith('##')) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        const content = currentContent.join(' ').trim()
        
        switch (currentSection) {
          case 'The Bottom Line':
            bottomLine = content
            break
          case 'Market Opportunity':
            marketOpportunity = content
            break
          case 'Key Finding':
            keyFinding = content
            break
          case 'Strategic Implications':
            // Parse bullet points
            currentContent.forEach(item => {
              if (item.startsWith('-')) {
                strategicImplications.push(item.substring(1).trim())
              }
            })
            break
          case 'Recommended Actions':
            currentContent.forEach(item => {
              if (item.startsWith('-')) {
                recommendedActions.push(item.substring(1).trim())
              }
            })
            break
          case 'Risks & Considerations':
            currentContent.forEach(item => {
              if (item.startsWith('-')) {
                risks.push(item.substring(1).trim())
              }
            })
            break
          case 'Confidence & Methodology':
            methodology = content
            break
        }
      }
      
      // Start new section
      currentSection = trimmedLine.substring(2).trim()
      currentContent = []
    } else if (trimmedLine && !trimmedLine.startsWith('#')) {
      currentContent.push(trimmedLine)
    }
  }
  
  // Handle the last section
  if (currentSection && currentContent.length > 0) {
    const content = currentContent.join(' ').trim()
    
    switch (currentSection) {
      case 'The Bottom Line':
        bottomLine = content
        break
      case 'Market Opportunity':
        marketOpportunity = content
        break
      case 'Key Finding':
        keyFinding = content
        break
      case 'Strategic Implications':
        currentContent.forEach(item => {
          if (item.startsWith('-')) {
            strategicImplications.push(item.substring(1).trim())
          }
        })
        break
      case 'Recommended Actions':
        currentContent.forEach(item => {
          if (item.startsWith('-')) {
            recommendedActions.push(item.substring(1).trim())
          }
        })
        break
      case 'Risks & Considerations':
        currentContent.forEach(item => {
          if (item.startsWith('-')) {
            risks.push(item.substring(1).trim())
          }
        })
        break
      case 'Confidence & Methodology':
        methodology = content
        break
    }
  }
  
  // Extract confidence from methodology if present
  const confidenceMatch = methodology.match(/(\d+)%/i)
  if (confidenceMatch) {
    confidence = parseInt(confidenceMatch[1])
  }
  
  return {
    bottomLine: bottomLine || 'Launch recommendation pending further analysis',
    marketOpportunity: marketOpportunity || 'Market opportunity analysis in progress',
    keyFinding: keyFinding || 'Key insights being analyzed',
    strategicImplications: strategicImplications.length > 0 ? strategicImplications : ['Strategic implications under review'],
    recommendedActions: recommendedActions.length > 0 ? recommendedActions : ['Action plan being developed'],
    risks: risks.length > 0 ? risks : ['Risk assessment in progress'],
    confidence: confidence,
    methodology: methodology || ' 500 responses analyzed'
  }
}
