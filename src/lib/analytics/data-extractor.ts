import { prisma } from '@/lib/db'

export async function extractCompleteTestData(testId: string) {
  console.log('📊 Extracting complete test data for:', testId)
  
  // Fetch ALL related data
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      survey: {
        include: {
          sections: {
            include: {
              questions: true
            }
          }
        }
      },
      audiences: true, // Get ALL audience definitions
      surveyResponses: true, // Get ALL individual responses
      simulation: true
    }
  })
  
  if (!test) throw new Error('Test not found')
  
  console.log('✅ Data extracted:', {
    audiences: test.audiences.length,
    surveyQuestions: test.survey?.sections?.flatMap(s => s.questions).length || 0,
    responses: test.surveyResponses.length
  })
  
  return test
}

export function prepareDataForAI(test: any) {
  const responses = test.surveyResponses || []
  
  return {
    // PRODUCT INFORMATION (all fields)
    product: {
      name: test.productInfo.name,
      description: test.productInfo.description,
      targetAudience: test.productInfo.targetAudience,
      industryCategory: test.productInfo.industryCategory,
      stage: test.productInfo.stage,
      primaryBenefit: test.productInfo.primaryBenefit,
      keyFeatures: test.productInfo.keyFeatures || [],
      pricePoint: test.productInfo.pricePoint,
      competitors: test.productInfo.competitors || [],
      uniqueValueProp: test.productInfo.uniqueValueProp
    },
    
    // VALIDATION GOALS (user selected)
    validationGoals: test.validationGoals || [],
    
    // SURVEY STRUCTURE (all questions asked)
    survey: {
      sections: test.survey?.sections?.map(section => ({
        id: section.id,
        title: section.title,
        questions: section.questions.map(q => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options || [],
          required: q.required
        }))
      })) || [],
      totalQuestions: test.survey?.sections?.flatMap(s => s.questions).length || 0
    },
    
    // AUDIENCE DEFINITIONS (all audiences)
    audiences: test.audiences.map(audience => ({
      id: audience.id,
      name: audience.name,
      description: audience.description,
      isPrimary: audience.isPrimary,
      demographics: audience.demographics,
      psychographics: audience.psychographics,
      sampleSize: audience.sampleSize,
      tam: audience.tam,
      rationale: audience.rationale
    })),
    
    // RESPONSE DATA (calculated metrics)
    responses: {
      total: responses.length,
      data: responses
    },
    
    // CALCULATED METRICS
    metrics: calculateAllMetrics(responses),
    
    // SIMULATION CONFIG
    simulation: {
      mode: test.simulation?.config?.mode,
      sampleSize: test.simulation?.config?.sampleSize,
      completedAt: test.simulation?.completedAt
    }
  }
}

function calculateAllMetrics(responses: any[]) {
  if (responses.length === 0) {
    return {
      purchaseIntent: { overall: 0, bySegment: {} },
      demographics: {},
      psychographics: {},
      behaviors: {}
    }
  }
  
  return {
    // Purchase Intent
    purchaseIntent: {
      overall: calculateMean(responses.map(r => r.responseData?.purchaseIntent || 0)),
      byAge: groupAndCalculate(responses, 'demographics.age', 'responseData.purchaseIntent'),
      byGender: groupAndCalculate(responses, 'demographics.gender', 'responseData.purchaseIntent'),
      byIncome: groupAndCalculate(responses, 'demographics.income', 'responseData.purchaseIntent'),
      byLocation: groupAndCalculate(responses, 'demographics.location', 'responseData.purchaseIntent')
    },
    
    // Demographics Distribution
    demographics: {
      age: calculateDistribution(responses, 'demographics.age'),
      gender: calculateDistribution(responses, 'demographics.gender'),
      income: calculateDistribution(responses, 'demographics.income'),
      location: calculateDistribution(responses, 'demographics.location'),
      education: calculateDistribution(responses, 'demographics.education'),
      occupation: calculateDistribution(responses, 'demographics.occupation')
    },
    
    // Psychographics
    psychographics: {
      motivations: extractTopItems(responses, 'psychographics.motivations'),
      concerns: extractTopItems(responses, 'psychographics.concerns'),
      values: extractTopItems(responses, 'psychographics.values'),
      lifestyle: extractTopItems(responses, 'psychographics.lifestyle')
    },
    
    // Behaviors
    behaviors: {
      channelPreferences: calculateDistribution(responses, 'behaviors.preferredChannel'),
      categoryUsage: calculateDistribution(responses, 'behaviors.categoryUsage'),
      purchaseFrequency: calculateDistribution(responses, 'behaviors.purchaseFrequency'),
      brandLoyalty: calculateDistribution(responses, 'behaviors.brandLoyalty')
    },
    
    // Price Sensitivity
    pricing: {
      acceptable: responses.filter(r => r.responseData?.priceOpinion === 'acceptable').length / responses.length * 100,
      tooExpensive: responses.filter(r => r.responseData?.priceOpinion === 'too_expensive').length / responses.length * 100,
      bargain: responses.filter(r => r.responseData?.priceOpinion === 'bargain').length / responses.length * 100,
      tooCheap: responses.filter(r => r.responseData?.priceOpinion === 'too_cheap').length / responses.length * 100
    },
    
    // Feature Preferences (if asked)
    features: extractFeatureRankings(responses),
    
    // Message Resonance (if tested)
    messages: extractMessageScores(responses)
  }
}

// Helper functions
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function groupAndCalculate(responses: any[], groupField: string, valueField: string): Record<string, any> {
  const groups: Record<string, number[]> = {}
  
  responses.forEach(r => {
    const groupValue = getNestedValue(r, groupField)
    const value = getNestedValue(r, valueField)
    
    if (groupValue && value !== undefined) {
      if (!groups[groupValue]) groups[groupValue] = []
      groups[groupValue].push(value)
    }
  })
  
  return Object.fromEntries(
    Object.entries(groups).map(([key, values]) => [
      key,
      {
        mean: calculateMean(values),
        count: values.length,
        percentage: (values.length / responses.length * 100).toFixed(1)
      }
    ])
  )
}

function calculateDistribution(responses: any[], field: string): Record<string, any> {
  const counts: Record<string, number> = {}
  
  responses.forEach(r => {
    const value = getNestedValue(r, field)
    if (value) {
      counts[value] = (counts[value] || 0) + 1
    }
  })
  
  return Object.fromEntries(
    Object.entries(counts).map(([key, count]) => [
      key,
      {
        count,
        percentage: (count / responses.length * 100).toFixed(1)
      }
    ])
  )
}

function extractTopItems(responses: any[], field: string, limit = 10): Array<any> {
  const itemCounts = new Map<string, { count: number; totalIntent: number }>()
  
  responses.forEach(r => {
    const items = getNestedValue(r, field) || []
    const intent = r.responseData?.purchaseIntent || 0
    
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (!itemCounts.has(item)) {
          itemCounts.set(item, { count: 0, totalIntent: 0 })
        }
        const data = itemCounts.get(item)!
        data.count++
        data.totalIntent += intent
      })
    }
  })
  
  return Array.from(itemCounts.entries())
    .map(([item, data]) => ({
      item,
      count: data.count,
      percentage: (data.count / responses.length * 100).toFixed(1),
      avgIntent: (data.totalIntent / data.count).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

function extractFeatureRankings(responses: any[]): any {
  // Extract from responses if feature ranking questions were asked
  const featureData = responses
    .map(r => r.responseData?.featureRankings)
    .filter(Boolean)
  
  if (featureData.length === 0) return null
  
  // Calculate aggregate rankings
  return featureData // Process based on your survey structure
}

function extractMessageScores(responses: any[]): any {
  // Extract message testing data if available
  const messageData = responses
    .map(r => r.responseData?.messageResonance)
    .filter(Boolean)
  
  if (messageData.length === 0) return null
  
  return messageData // Process based on your survey structure
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => current?.[prop], obj)
}
