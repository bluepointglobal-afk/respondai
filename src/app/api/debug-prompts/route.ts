import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Showing AI prompts...')
    
    const prompts = {
      insights: `You are a senior marketing strategist analyzing market research data for a new product launch.

PRODUCT CONTEXT:
- Product: Turmeric supplement for Men with joint pain
- Description: Turmeric supplement for Men with joint pain
- Target Market: Men 30 - 65 in USA active professionals
- Industry: supplement
- Stage: idea

RESEARCH DATA:
- Total Responses: 500
- Overall Purchase Intent: 60%
- Price Sensitivity: -1.4
- Optimal Price Point: $65

YOUR TASK:
Generate 8-12 DEEP, ACTIONABLE insights that a CMO would pay $50,000 for. Each insight must:

1. **Be Specific**: Use exact numbers, percentages, and data points
2. **Reveal Non-Obvious Patterns**: Go beyond surface-level observations
3. **Be Actionable**: Include clear "what to do about it"
4. **Show Business Impact**: Quantify revenue opportunity or risk
5. **Use Marketing Frameworks**: Reference Jobs-to-be-Done, positioning theory, segmentation best practices

Return ONLY valid JSON array with insights.`,

      personas: `You are a marketing analyst. Generate 2-3 customer personas. Return ONLY valid JSON array with this exact structure for each persona: {"id": "unique-id", "name": "Persona Name", "tagline": "One sentence description", "demographics": {"age": "30-45", "gender": "Male/Female", "income": "$50K-$100K", "location": "Urban/Suburban", "education": "Bachelor's", "occupation": "Professional", "familyStatus": "Married/Single"}, "narrative": "2-3 paragraph story about this person", "jobsToBeDone": {"functional": ["practical needs"], "emotional": ["feelings sought"], "social": ["social needs"]}, "motivations": ["primary drivers"], "painPoints": ["frustrations"], "purchaseDrivers": {"mustHaves": ["non-negotiables"], "niceToHaves": ["bonus features"], "dealBreakers": ["what makes them walk away"]}, "decisionProcess": {"researchStyle": "Heavy researcher", "influencers": ["who influences them"], "timeline": "decision timeline", "objections": ["hesitations"]}, "messaging": {"resonates": ["messages that work"], "turnsOff": ["messages that repel"], "tone": "Professional/Casual", "channels": ["where to reach them"]}, "quotableQuotes": ["3-4 realistic quotes"], "dayInLife": "detailed narrative", "marketingGuidance": {"positioning": "how to position", "keyBenefits": ["benefits to emphasize"], "socialProof": "type of proof that resonates", "pricing": "price sensitivity", "campaignIdeas": ["campaign concepts"]}, "sizeAndValue": {"estimatedSize": 100000, "purchaseLikelihood": "75%", "expectedLTV": "$300", "acquisitionDifficulty": "Medium", "strategicValue": "High"}}`,

      recommendations: `You are a Chief Marketing Officer creating an action plan based on market research findings.

RESEARCH SUMMARY:
Overall Purchase Intent: 60%
Optimal Price: $65
Key Insights: High Demand for Joint Pain Relief, Positioning as a Natural Alternative, Potential Price Sensitivity
Validation Goals: Product-Market Fit, Price Sensitivity, Target Audience Validation

CREATE A COMPREHENSIVE ACTION PLAN with recommendations in 3 timeframes:

STRUCTURE EACH RECOMMENDATION AS:
{
  "id": "unique-id",
  "category": "brand" | "product" | "pricing" | "distribution" | "marketing" | "positioning",
  "timeframe": "immediate" | "near-term" | "long-term",
  "priority": "critical" | "high" | "medium" | "low",
  "title": "Clear, action-oriented title (8-12 words)",
  "description": "2-3 paragraphs explaining what to do and why it matters",
  "rationale": {
    "supportingInsights": ["Which insights this addresses"],
    "dataEvidence": ["Specific data points that support this"],
    "expectedImpact": "Quantified business impact"
  },
  "implementation": {
    "steps": [{"sequence": 1, "action": "Specific task", "owner": "Who does this", "duration": "How long", "dependencies": []}],
    "resources": {"team": ["Roles needed"], "budget": "Estimated cost", "tools": ["Software/tools"], "partners": ["External partners"]},
    "timeline": "Detailed timeline with milestones"
  },
  "metrics": {
    "kpis": [{"metric": "Specific KPI", "target": "Specific target", "measurement": "How to measure", "frequency": "How often"}],
    "successCriteria": ["What good looks like"],
    "learningGoals": ["What you're trying to validate"]
  },
  "risks": [{"risk": "What could go wrong", "likelihood": "High|Medium|Low", "impact": "High|Medium|Low", "mitigation": "How to prevent"}],
  "estimatedImpact": {
    "revenueImpact": "$X - $Y over N months",
    "confidence": 85,
    "assumptions": ["Key assumptions"],
    "upside": "Best case scenario",
    "downside": "Worst case scenario"
  }
}

Return ONLY valid JSON array.`,

      executiveSummary: `You are a C-level executive creating a strategic summary for a turmeric supplement launch.

PRODUCT: Turmeric supplement for Men with joint pain
PURCHASE INTENT: 60%
SAMPLE SIZE: 500 responses
CONFIDENCE: 95%

Create an executive summary with this EXACT structure:
{
  "bottomLine": "One-sentence launch recommendation with specific numbers",
  "marketOpportunity": "TAM/SAM analysis with specific dollar amounts and percentages",
  "keyFinding": "Most important insight with specific data points",
  "strategicImplications": ["3-4 strategic implications"],
  "recommendedActions": ["3-4 immediate actions"],
  "risks": ["2-3 key risks"],
  "confidence": 95,
  "methodology": "How the analysis was conducted with specific metrics"
}

Return ONLY valid JSON object.`,

      advancedAnalytics: `You are a market research analyst. Return ONLY valid JSON with this exact structure: {"maxDiffResults": {"topFeatures": ["feature1", "feature2"], "utilityScores": {"feature1": 0.8, "feature2": 0.7}}, "kanoResults": {"mustBeFeatures": ["feature1"], "performanceFeatures": ["feature2"], "attractiveFeatures": ["feature3"]}, "vanWestendorpResults": {"optimalPrice": 65, "priceRange": {"min": 45, "max": 85}}, "turfResults": {"optimalChannels": ["channel1", "channel2"], "reachEfficiency": 0.78}}`
    }

    return NextResponse.json({
      success: true,
      message: 'AI Prompts Retrieved',
      prompts: prompts,
      note: 'These are the exact prompts being sent to the AI engine for each component'
    })

  } catch (error) {
    console.error('❌ DEBUG: Fatal error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
