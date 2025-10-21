/**
 * STRATEGIC RECOMMENDATION GENERATOR
 * Creates detailed action plans with implementation details and timelines
 */

import { aiClient, getAIModel, isAIAvailable } from '../ai-client'

interface Insight {
  id: string
  title: string
  type: string
  category: string
  priority: string
  summary: string
  description: string
  evidence: {
    dataPoints: string[]
    sampleSize: number
    confidence: number
  }
  impact: {
    revenue: string
    timeframe: string
    effort: string
  }
}

interface Pattern {
  id: string
  title: string
  segment: {
    name: string
    size: number
  }
  metrics: {
    purchaseIntent: number
    lift: number
  }
}

interface Recommendation {
  id: string
  category: 'brand' | 'product' | 'pricing' | 'distribution' | 'marketing' | 'positioning'
  timeframe: 'immediate' | 'near-term' | 'long-term'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  rationale: {
    supportingInsights: string[]
    dataEvidence: string[]
    expectedImpact: string
  }
  implementation: {
    steps: Array<{
      sequence: number
      action: string
      owner: string
      duration: string
      dependencies: string[]
    }>
    resources: {
      team: string[]
      budget: string
      tools: string[]
      partners: string[]
    }
    timeline: string
  }
  metrics: {
    kpis: Array<{
      metric: string
      target: string
      measurement: string
      frequency: string
    }>
    successCriteria: string[]
    learningGoals: string[]
  }
  risks: Array<{
    risk: string
    likelihood: 'High' | 'Medium' | 'Low'
    impact: 'High' | 'Medium' | 'Low'
    mitigation: string
  }>
  estimatedImpact: {
    revenueImpact: string
    confidence: number
    assumptions: string[]
    upside: string
    downside: string
  }
}

export async function generateStrategicRecommendations(data: {
  insights: Insight[]
  patterns: Pattern[]
  purchaseIntent: any
  pricing: any
  validationGoals: string[]
}): Promise<Recommendation[]> {
  
  console.log('🎯 Generating strategic recommendations...')
  
  if (!isAIAvailable()) {
    throw new Error('AI service not available')
  }
  
  const prompt = buildRecommendationPrompt(data)
  
  console.log(`📊 Recommendation prompt prepared: ${prompt.length} chars`)
  
  try {
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: 'You are a Chief Marketing Officer creating an action plan based on market research findings. Generate specific, actionable recommendations with detailed implementation plans, timelines, and success metrics. Think strategically about resource allocation and risk management.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let recommendations: Recommendation[]
    let jsonContent = content.trim()
    
    try {
      // Clean the content - remove any markdown formatting
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/, '').replace(/\n?```$/, '')
      }
      
      // Look for JSON array or object
      const arrayMatch = jsonContent.match(/\[[\s\S]*\]/)
      const objectMatch = jsonContent.match(/\{[\s\S]*\}/)
      
      if (arrayMatch) {
        jsonContent = arrayMatch[0]
      } else if (objectMatch) {
        jsonContent = objectMatch[0]
      }
      
      console.log('🧹 Cleaned recommendations content for parsing:', jsonContent.substring(0, 200) + '...')
      
      // Parse the JSON
      recommendations = JSON.parse(jsonContent)
      
      // Ensure it's an array
      if (!Array.isArray(recommendations)) {
        recommendations = [recommendations]
      }
      
      console.log('✅ Successfully parsed recommendations:', recommendations.length, 'recommendations')
    } catch (parseError) {
      console.error('Failed to parse recommendations response:', content)
      console.error('Parse error:', parseError)
      console.error('Raw content length:', content.length)
      console.error('First 500 chars:', content.substring(0, 500))
      
      // Try to extract JSON from the content more aggressively
      try {
        const jsonStart = content.indexOf('[')
        const jsonEnd = content.lastIndexOf(']') + 1
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const extractedJson = content.substring(jsonStart, jsonEnd)
          recommendations = JSON.parse(extractedJson)
          if (!Array.isArray(recommendations)) {
            recommendations = [recommendations]
          }
          console.log('✅ Successfully extracted and parsed recommendations from content')
        } else {
          throw new Error('No valid JSON array found in content')
        }
      } catch (extractError) {
        console.error('Failed to extract JSON from content:', extractError)
        throw new Error('Invalid recommendations format from AI')
      }
    }

    console.log(`✅ Generated ${recommendations.length} strategic recommendations`)
    
    return recommendations

  } catch (error) {
    console.error('Recommendation generation error:', error)
    throw error
  }
}

function buildRecommendationPrompt(data: any): string {
  return `You are a Chief Marketing Officer creating an action plan based on market research findings.

RESEARCH SUMMARY:
Overall Purchase Intent: ${data.purchaseIntent?.overall?.mean || 0}%
Optimal Price: $${data.pricing?.optimalPrice || 0}
Key Insights: ${(data.insights || []).slice(0, 5).map((i: any) => i.title).join(', ')}
Validation Goals: ${(data.validationGoals || []).join(', ')}

TOP INSIGHTS DETAILS:
${(data.insights || []).slice(0, 8).map((insight: any) => `
- ${insight.title}
  Type: ${insight.type} | Category: ${insight.category} | Priority: ${insight.priority}
  Summary: ${insight.summary}
  Impact: ${insight.impact?.revenue || 'Unknown'}
`).join('\n')}

KEY PATTERNS:
${(data.patterns || []).slice(0, 5).map((pattern: any) => `
- ${pattern.title}
  Segment: ${pattern.segment?.name || 'Unknown'} (${pattern.segment?.size || 0} people)
  Purchase Intent: ${pattern.metrics?.purchaseIntent || 0}%
  Lift: ${pattern.metrics?.lift || 0}%
`).join('\n')}

CREATE A COMPREHENSIVE ACTION PLAN with recommendations in 3 timeframes:

STRUCTURE EACH RECOMMENDATION AS:
{
  "id": "rec-1",
  "category": "brand" | "product" | "pricing" | "distribution" | "marketing" | "positioning",
  "timeframe": "immediate" | "near-term" | "long-term",
  "priority": "critical" | "high" | "medium" | "low",
  
  "title": "Clear, action-oriented title (8-12 words)",
  
  "description": "2-3 paragraphs explaining:
    - What to do (specific, concrete actions)
    - Why it matters (tied to insights and data)
    - What success looks like
    - Potential pitfalls to avoid",
  
  "rationale": {
    "supportingInsights": ["Which insights this addresses"],
    "dataEvidence": ["Specific data points that support this"],
    "expectedImpact": "Quantified business impact"
  },
  
  "implementation": {
    "steps": [
      {
        "sequence": 1,
        "action": "Specific task",
        "owner": "Who does this",
        "duration": "How long it takes",
        "dependencies": ["What needs to happen first"]
      }
    ],
    "resources": {
      "team": ["Roles needed"],
      "budget": "Estimated cost range",
      "tools": ["Software/tools required"],
      "partners": ["External partners needed"]
    },
    "timeline": "Detailed timeline with milestones"
  },
  
  "metrics": {
    "kpis": [
      {
        "metric": "Specific KPI",
        "target": "Specific target value",
        "measurement": "How to measure",
        "frequency": "How often to track"
      }
    ],
    "successCriteria": ["What good looks like"],
    "learningGoals": ["What you're trying to validate"]
  },
  
  "risks": [
    {
      "risk": "What could go wrong",
      "likelihood": "High | Medium | Low",
      "impact": "High | Medium | Low",
      "mitigation": "How to prevent/mitigate"
    }
  ],
  
  "estimatedImpact": {
    "revenueImpact": "$X - $Y over N months",
    "confidence": 85,
    "assumptions": ["Key assumptions this depends on"],
    "upside": "Best case scenario",
    "downside": "Worst case scenario"
  }
}

TIMEFRAME DEFINITIONS:

IMMEDIATE (Week 1-4):
- Quick wins that can be executed now
- Low-hanging fruit
- No-regret moves
- Actions that de-risk future phases
Examples: Update website messaging, launch email campaign, adjust pricing

NEAR-TERM (Month 1-3):
- Initiatives requiring planning but not major builds
- Marketing campaigns
- Partnership discussions
- Channel tests
Examples: Influencer partnerships, content marketing, PR campaign

LONG-TERM (Month 3-12):
- Strategic initiatives
- Product development
- Market expansion
- Brand building
Examples: New product lines, enter new markets, build category leadership

PROVIDE:
- 3-5 IMMEDIATE actions (specific, can start tomorrow)
- 5-7 NEAR-TERM initiatives (require planning)
- 3-5 LONG-TERM strategic moves (transformational)

Each recommendation must be:
✓ Specific (not "improve marketing" but "Launch Instagram campaign targeting divorced dads 35-45 with transformation stories, $15K budget, Q1 2025")
✓ Data-driven (reference specific insights)
✓ Actionable (clear next steps)
✓ Measurable (defined success metrics)
✓ Strategic (connects to business goals)

Return ONLY valid JSON array with 10-15 recommendations. No markdown.`
}
