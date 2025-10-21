import { extractCompleteTestData, prepareDataForAI } from './data-extractor'
import { callGroq } from '@/lib/ai-client'

export async function runComprehensiveAnalysis(testId: string) {
  console.log('🧠 Starting comprehensive analysis for test:', testId)
  
  // STEP 1: Extract ALL user data
  const test = await extractCompleteTestData(testId)
  const data = prepareDataForAI(test)
  
  // STEP 2: Build comprehensive prompt with ALL user data
  const prompt = buildComprehensivePrompt(data)
  
  console.log('📝 Prompt built, calling AI...')
  console.log('📊 Prompt length:', prompt.length, 'characters')
  
  // STEP 3: Single AI call
  const response = await callGroq(prompt, {
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    maxTokens: 8000
  })
  
  console.log('✅ AI response received')
  
  // STEP 4: Parse and return
  const analysis = JSON.parse(response)
  
  console.log('✅ Analysis complete:', {
    insights: analysis.insights?.length || 0,
    personas: analysis.personas?.length || 0,
    recommendations: analysis.recommendations?.length || 0
  })
  
  return analysis
}

function buildComprehensivePrompt(data: any) {
  return `You are a senior marketing strategist and data analyst conducting a comprehensive market research analysis.

# PRODUCT INFORMATION (from user input)

Product Name: ${data.product.name}
Description: ${data.product.description}
Target Audience: ${data.product.targetAudience}
Industry Category: ${data.product.industryCategory}
Development Stage: ${data.product.stage}
Primary Benefit: ${data.product.primaryBenefit || 'Not specified'}
Key Features: ${data.product.keyFeatures?.join(', ') || 'Not specified'}
Price Point: ${data.product.pricePoint || 'To be determined'}
Unique Value Proposition: ${data.product.uniqueValueProp || 'Not specified'}

${data.product.competitors?.length > 0 ? `
Known Competitors: ${data.product.competitors.join(', ')}
` : ''}

# VALIDATION GOALS (selected by user)

The user wants to validate:
${data.validationGoals.map(g => `- ${g}`).join('\n')}

# SURVEY STRUCTURE (questions asked to respondents)

Total Questions Asked: ${data.survey.totalQuestions}

${data.survey.sections.map(section => `
## ${section.title}
${section.questions.map(q => `
- [${q.type}] ${q.question}
  ${q.options?.length > 0 ? `Options: ${q.options.join(', ')}` : ''}
`).join('')}
`).join('\n')}

# AUDIENCE DEFINITIONS (target segments defined by user)

${data.audiences.map((aud, i) => `
## Audience ${i + 1}: ${aud.name}${aud.isPrimary ? ' (PRIMARY)' : ''}
Description: ${aud.description}
Target Sample Size: ${aud.sampleSize} respondents
Total Addressable Market (TAM): ${aud.tam ? `${aud.tam.toLocaleString()} people` : 'Not calculated'}

Demographics:
${JSON.stringify(aud.demographics, null, 2)}

Psychographics:
${JSON.stringify(aud.psychographics, null, 2)}

Strategic Rationale: ${aud.rationale || 'Not provided'}
`).join('\n')}

# RESEARCH RESULTS (actual data from ${data.responses.total} respondents)

## Sample Composition

Total Responses: ${data.responses.total}
Data Collection: ${data.simulation.mode === 'synthetic' ? 'AI-generated synthetic responses' : 'Real user responses'}
Completed: ${data.simulation.completedAt ? new Date(data.simulation.completedAt).toLocaleDateString() : 'In progress'}

## Purchase Intent Analysis

Overall Purchase Intent: ${data.metrics.purchaseIntent.overall.toFixed(1)}%

### By Age Group:
${formatMetricBreakdown(data.metrics.purchaseIntent.byAge)}

### By Gender:
${formatMetricBreakdown(data.metrics.purchaseIntent.byGender)}

### By Income Level:
${formatMetricBreakdown(data.metrics.purchaseIntent.byIncome)}

### By Location:
${formatMetricBreakdown(data.metrics.purchaseIntent.byLocation)}

## Demographics Distribution

### Age:
${formatDistribution(data.metrics.demographics.age)}

### Gender:
${formatDistribution(data.metrics.demographics.gender)}

### Income:
${formatDistribution(data.metrics.demographics.income)}

### Location:
${formatDistribution(data.metrics.demographics.location)}

### Education:
${formatDistribution(data.metrics.demographics.education)}

### Occupation:
${formatDistribution(data.metrics.demographics.occupation)}

## Psychographic Insights

### Top Motivations (from open-ended responses):
${data.metrics.psychographics.motivations.map((m, i) => 
  `${i + 1}. "${m.item}" - ${m.count} mentions (${m.percentage}% of respondents), avg purchase intent: ${m.avgIntent}%`
).join('\n')}

### Top Concerns/Barriers:
${data.metrics.psychographics.concerns.map((c, i) =>
  `${i + 1}. "${c.item}" - ${c.count} mentions (${c.percentage}% of respondents), avg purchase intent: ${c.avgIntent}%`
).join('\n')}

### Core Values:
${data.metrics.psychographics.values.map((v, i) =>
  `${i + 1}. "${v.item}" - ${v.count} mentions (${v.percentage}% of respondents)`
).join('\n')}

### Lifestyle Factors:
${data.metrics.psychographics.lifestyle.map((l, i) =>
  `${i + 1}. "${l.item}" - ${l.count} mentions (${l.percentage}% of respondents)`
).join('\n')}

## Behavioral Data

### Channel Preferences:
${formatDistribution(data.metrics.behaviors.channelPreferences)}

### Current Category Usage:
${formatDistribution(data.metrics.behaviors.categoryUsage)}

### Purchase Frequency:
${formatDistribution(data.metrics.behaviors.purchaseFrequency)}

### Brand Loyalty:
${formatDistribution(data.metrics.behaviors.brandLoyalty)}

## Price Sensitivity

- Acceptable Price: ${data.metrics.pricing.acceptable.toFixed(1)}%
- Too Expensive: ${data.metrics.pricing.tooExpensive.toFixed(1)}%
- Great Value/Bargain: ${data.metrics.pricing.bargain.toFixed(1)}%
- Too Cheap (quality concerns): ${data.metrics.pricing.tooCheap.toFixed(1)}%

${data.metrics.features ? `
## Feature Preferences

${JSON.stringify(data.metrics.features, null, 2)}
` : ''}

${data.metrics.messages ? `
## Message Testing Results

${JSON.stringify(data.metrics.messages, null, 2)}
` : ''}

---

# YOUR TASK

Generate a COMPLETE, COMPREHENSIVE market research analysis for "${data.product.name}".

**CRITICAL REQUIREMENTS:**

1. Use ONLY the actual data provided above - NO assumptions, NO generic statements
2. Every number, percentage, and statistic must come from the data shown
3. Reference the specific survey questions that were asked
4. Tie insights back to the user's stated validation goals
5. Consider the defined audience segments in your analysis
6. Be specific to THIS product in THIS industry - avoid generic business advice
7. Quote actual customer motivations and concerns from the psychographic data
8. Reference the demographic breakdowns shown above
9. Consider the price sensitivity data in pricing recommendations

**OUTPUT FORMAT:**

Return a single JSON object with ALL sections below. Each section must be based on the actual data provided.

{
  "executiveSummary": {
    "bottomLine": "One sentence: Launch or don't launch? Based on ${data.metrics.purchaseIntent.overall.toFixed(1)}% purchase intent",
    "marketOpportunity": "2-3 sentences about TAM/SAM, who wants this (reference actual audience data), why compelling (reference actual motivations)",
    "keyFinding": "The single most important non-obvious insight from THIS data",
    "strategicImplications": [
      "3-4 strategic takeaways specific to ${data.product.name}",
      "Reference actual segments and their intent levels",
      "Tie to validation goals: ${data.validationGoals.join(', ')}"
    ],
    "recommendedActions": [
      "3-4 immediate actions based on THIS data",
      "Be specific: not 'improve marketing' but 'target age 35-45 segment showing ${data.metrics.purchaseIntent.byAge['35-45']?.mean || 0}% intent'"
    ],
    "risks": [
      "2-3 risks based on actual concerns found in data",
      "Reference specific barrier percentages"
    ],
    "confidence": ${(data.responses.total / 500 * 100).toFixed(0)}
  },
  
  "insights": [
    {
      "id": "insight-1",
      "type": "opportunity|risk|strategy",
      "category": "market|pricing|positioning|segmentation",
      "priority": "high|medium|low",
      "title": "Specific headline using actual data (e.g., 'Age 35-45 Segment Shows 23% Higher Intent')",
      "summary": "One sentence with specific numbers from the data",
      "description": "3-4 paragraphs that:
        - Present the specific data finding (use actual numbers)
        - Explain what's driving this (reference motivations/concerns data)
        - Discuss business implications for ${data.product.name}
        - Connect to ${data.product.targetAudience}
        - Reference the survey questions that revealed this",
      "evidence": {
        "dataPoints": [
          "Exact quotes from the data above",
          "Specific percentages and sample sizes",
          "Reference to which survey questions provided this data"
        ],
        "sampleSize": ${data.responses.total},
        "confidence": 85
      },
      "impact": {
        "revenue": "Quantified based on actual intent and audience TAM",
        "timeframe": "short|medium|long",
        "effort": "low|medium|high"
      },
      "recommendations": [
        {
          "action": "Specific, actionable step based on this finding",
          "rationale": "Why this addresses the insight",
          "timeline": "Specific timeframe",
          "owner": "Who should do this",
          "kpis": ["Measurable outcomes"]
        }
      ]
    }
    // Generate 8-12 insights total, each based on actual data patterns
  ],
  
  "personas": [
    {
      "id": "persona-1",
      "name": "Creative archetype name (e.g., 'The Evidence-Seeking Professional' if data shows high science emphasis)",
      "tagline": "Based on the actual psychographic profile from data",
      "demographics": {
        // Use the ACTUAL dominant demographic from data
        "age": "Most common age range from data",
        "gender": "Most common gender from data",
        "income": "Most common income from data",
        "location": "Most common location from data",
        "education": "From data",
        "occupation": "From data"
      },
      "narrative": "Rich 3-paragraph story about a REAL person who matches this data profile. Include:
        - Typical day scenario
        - How they encountered ${data.product.name}
        - Their relationship with ${data.product.industryCategory} products
        - What they're trying to achieve (use actual motivations from data)
        - Their fears (use actual concerns from data)",
      "jobsToBeDone": {
        "functional": ["From actual motivations data"],
        "emotional": ["From actual values data"],
        "social": ["From actual lifestyle data"]
      },
      "motivations": [
        "Use TOP motivations from the psychographics data",
        "Be specific: not 'health' but exact phrases from data"
      ],
      "painPoints": [
        "Use TOP concerns from the psychographics data",
        "Quote actual barriers mentioned"
      ],
      "purchaseDrivers": {
        "mustHaves": ["From feature preferences if available"],
        "niceToHaves": ["Secondary features"],
        "dealBreakers": ["From concerns data"]
      },
      "decisionProcess": {
        "researchStyle": "Infer from education/occupation data",
        "influencers": ["Based on values and lifestyle data"],
        "timeline": "Based on purchase frequency data",
        "objections": ["From concerns data"]
      },
      "messaging": {
        "resonates": [
          "Messages that would work based on motivations",
          "Use actual language from psychographic data"
        ],
        "turnsOff": [
          "Based on concerns data",
          "What would make them skeptical"
        ],
        "tone": "Based on demographics and values",
        "channels": ["From actual channel preferences data"]
      },
      "quotableQuotes": [
        "3-4 realistic quotes this persona would say",
        "Based on actual motivations and concerns from data",
        "Make them sound like real human speech",
        "Reference ${data.product.name} specifically"
      ],
      "dayInLife": "Detailed scenario (4-5 sentences) showing how ${data.product.name} fits into their life. When would they use it? What prompts the purchase? Base on actual behavioral data.",
      "marketingGuidance": {
        "positioning": "How to position ${data.product.name} to this persona",
        "keyBenefits": ["Which benefits to emphasize - reference ${data.product.primaryBenefit}"],
        "socialProof": "What proof resonates (based on values data)",
        "pricing": "Based on income and price sensitivity data",
        "campaignIdeas": ["3-4 specific campaigns for this persona using their channels and motivations"]
      },
      "sizeAndValue": {
        "estimatedSize": "Calculate from audience TAM and demographic fit",
        "purchaseLikelihood": "From actual purchase intent for this demographic",
        "expectedLTV": "Estimate based on price point and purchase frequency data",
        "strategicValue": "Why this persona matters for ${data.product.name}"
      }
    }
    // Generate 3-5 personas, each representing distinct high-intent segments from the data
  ],
  
  "recommendations": [
    {
      "id": "rec-1",
      "category": "brand|product|pricing|distribution|marketing|positioning",
      "timeframe": "immediate|near-term|long-term",
      "priority": "critical|high|medium|low",
      "title": "Action-oriented title based on insights (e.g., 'Emphasize ${data.product.primaryBenefit} in Marketing to Age 35-45')",
      "description": "2-3 paragraphs:
        - What specifically to do
        - Why (reference specific insights and data)
        - How this addresses validation goals
        - Expected impact on ${data.product.targetAudience}",
      "rationale": {
        "supportingInsights": ["Which insights from above support this"],
        "dataEvidence": ["Specific data points"],
        "expectedImpact": "Quantified outcome"
      },
      "implementation": {
        "steps": [
          {
            "sequence": 1,
            "action": "Specific task",
            "owner": "Role",
            "duration": "Timeline",
            "dependencies": ["What's needed first"]
          }
        ],
        "resources": {
          "team": ["Roles needed"],
          "budget": "Estimate",
          "tools": ["Software/platforms"],
          "partners": ["External help if needed"]
        },
        "timeline": "Detailed plan with milestones"
      },
      "metrics": {
        "kpis": [
          {
            "metric": "Specific KPI",
            "target": "Based on data",
            "measurement": "How to track",
            "frequency": "How often"
          }
        ],
        "successCriteria": ["What good looks like"],
        "learningGoals": ["What we're validating"]
      },
      "risks": [
        {
          "risk": "What could go wrong",
          "likelihood": "high|medium|low",
          "impact": "high|medium|low",
          "mitigation": "How to prevent"
        }
      ],
      "estimatedImpact": {
        "revenueImpact": "Based on audience TAM and intent data",
        "confidence": 85,
        "assumptions": ["Key assumptions"],
        "upside": "Best case",
        "downside": "Worst case"
      }
    }
    // Generate 10-15 recommendations across immediate/near-term/long-term
    // Cover: positioning, messaging, pricing, channel, product, timing
  ],
  
  "patterns": [
    {
      "id": "pattern-1",
      "type": "demographic|psychographic|behavioral",
      "title": "Descriptive name based on actual data pattern",
      "description": "What this pattern reveals about ${data.product.name}'s market",
      "segment": {
        "name": "Segment name",
        "size": "Count from data",
        "demographics": "Actual demographic profile",
        "psychographics": "Actual motivations/values",
        "behaviors": "Actual channel/usage patterns"
      },
      "metrics": {
        "purchaseIntent": "Actual %",
        "lift": "vs. overall mean",
        "sampleSize": "Count",
        "confidence": "Statistical significance"
      },
      "implications": "What this means for go-to-market",
      "impactScore": "Calculated based on size × intent × lift"
    }
    // Generate 10-15 patterns from actual data correlations
  ],
  
  "maxDiff": {
    "methodology": "MaxDiff feature prioritization analysis",
    "features": [
      // If feature ranking data available, analyze it
      // Otherwise: "Feature ranking data not collected in this survey"
    ],
    "interpretation": "Based on available data",
    "recommendations": ["What to emphasize"]
  },
  
  "kano": {
    "methodology": "Kano feature satisfaction model",
    "features": [
      // If satisfaction data available
      // Otherwise: "Feature satisfaction data not collected"
    ],
    "productStrategy": ["Based on available data"],
    "investmentGuidance": ["Where to invest"]
  },
  
  "priceSensitivity": {
    "methodology": "Price sensitivity analysis",
    "analysis": "Based on actual price opinion data: ${data.metrics.pricing.acceptable}% find price acceptable, ${data.metrics.pricing.tooExpensive}% find it too expensive",
    "optimalPrice": "Calculate from data or use ${data.product.pricePoint}",
    "acceptableRange": "Based on distribution",
    "recommendations": [
      "Pricing strategy based on actual data",
      "Consider income distribution and intent correlation"
    ]
  },
  
  "messageTesting": {
    "messages": [
      // If message testing data available
      // Otherwise note: "Message testing not included in this survey"
    ],
    "winningMessage": "Based on available data",
    "messageGuidance": [
      "Craft messages emphasizing top motivations: ${data.metrics.psychographics.motivations.slice(0, 3).map(m => m.item).join(', ')}",
      "Address concerns: ${data.metrics.psychographics.concerns.slice(0, 3).map(c => c.item).join(', ')}"
    ]
  },
  
  "customerJourney": {
    "stages": [
      {
        "stage": "Awareness",
        "triggers": ["Based on motivations data"],
        "touchpoints": ["Based on channel preferences"],
        "painPoints": ["From concerns data"]
      },
      {
        "stage": "Consideration",
        "triggers": ["What moves them forward"],
        "touchpoints": ["Where they research"],
        "painPoints": ["Decision barriers"]
      },
      {
        "stage": "Purchase",
        "triggers": ["Final drivers"],
        "touchpoints": ["Where they buy - from channel data"],
        "painPoints": ["Last objections"]
      }
    ],
    "criticalMoments": ["Key decision points"],
    "optimizations": ["How to improve conversion"]
  },
  
  "brandPerception": {
    "currentPosition": {
      "attributes": ["Based on values data"],
      "strengths": ["From motivations"],
      "weaknesses": ["From concerns"]
    },
    "whitespace": ["Positioning opportunities for ${data.product.name}"],
    "recommendations": [
      "Position as addressing top motivations",
      "Differentiate from competitors (if provided)"
    ]
  },
  
  "channelStrategy": {
    "channels": [
      // For each channel in preferences data
      {
        "channel": "Channel name from data",
        "preference": "% from actual data",
        "rationale": ["Why they prefer it"],
        "investment": "high|medium|low",
        "priority": "Based on preference %"
      }
    ],
    "recommendations": [
      "Focus on top 3 channels from data",
      "Align with target demographics and behaviors"
    ]
  },
  
  "launchReadiness": {
    "score": "Calculate 0-100 based on:",
    "factors": [
      {
        "factor": "Market Demand",
        "score": "Based on ${data.metrics.purchaseIntent.overall.toFixed(1)}% intent",
        "weight": 30,
        "assessment": "Strong/Moderate/Weak based on data"
      },
      {
        "factor": "Target Market Fit",
        "score": "Based on audience alignment",
        "weight": 25,
        "assessment": "Based on segment intent levels"
      },
      {
        "factor": "Price Acceptance",
        "score": "Based on ${data.metrics.pricing.acceptable}% acceptance",
        "weight": 20,
        "assessment": "Analysis"
      },
      {
        "factor": "Value Prop Clarity",
        "score": "Based on motivation resonance",
        "weight": 15,
        "assessment": "Analysis"
      },
      {
        "factor": "Risk Level",
        "score": "Based on concerns frequency",
        "weight": 10,
        "assessment": "Analysis"
      }
    ],
    "status": "GO if >70, CAUTION if 50-70, NO-GO if <50",
    "recommendation": "Launch recommendation with conditions",
    "criticalPath": [
      "Key actions needed before launch",
      "Based on gaps identified in data"
    ]
  }
}

**REMEMBER:**
- This analysis is for "${data.product.name}" specifically
- Sample size is ${data.responses.total} responses
- Target audience is ${data.product.targetAudience}
- Validation goals are: ${data.validationGoals.join(', ')}
- Every claim must reference actual data from above
- Be specific, not generic
- Think like a \$50,000 consultant report

Return ONLY the JSON object. No markdown, no commentary, no explanations outside the JSON.`
}

function formatMetricBreakdown(metrics: Record<string, any>): string {
  return Object.entries(metrics)
    .map(([key, value]) => `  ${key}: ${value.mean?.toFixed(1) || 0}% (n=${value.count || 0}, ${value.percentage || 0}% of sample)`)
    .join('\n')
}

function formatDistribution(dist: Record<string, any>): string {
  return Object.entries(dist)
    .map(([key, value]) => `  ${key}: ${value.count || 0} (${value.percentage || 0}%)`)
    .join('\n')
}