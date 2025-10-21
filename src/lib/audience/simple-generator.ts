// Simple, reliable audience generator that always works
export interface SimpleAudience {
  id: string
  name: string
  isPrimary: boolean
  demographics: {
    age: { min: number; max: number }
    gender: string
    income: string
    education: string
    location: string
  }
  psychographics: {
    lifestyle: string[]
    values: string[]
    painPoints: string[]
  }
  estimatedSize: number
  targetSampleSize: number
  reasoning: string
}

export function generateSimpleAudiences(productInfo: any, validationGoals: string[]): SimpleAudience[] {
  console.log('=== GENERATING SIMPLE AUDIENCES ===')
  console.log('Product:', productInfo?.name)
  console.log('Target:', productInfo?.targetAudience)
  
  // Parse target audience for demographics
  const targetAudience = productInfo?.targetAudience || 'general'
  const productName = productInfo?.name || 'Product'
  
  // Extract demographics from target audience string
  let ageRange = { min: 25, max: 45 }
  let gender = 'any'
  let location = 'urban'
  
  if (targetAudience.toLowerCase().includes('men') || targetAudience.toLowerCase().includes('male')) {
    gender = 'male'
  }
  if (targetAudience.toLowerCase().includes('women') || targetAudience.toLowerCase().includes('female')) {
    gender = 'female'
  }
  if (targetAudience.toLowerCase().includes('30')) {
    ageRange = { min: 30, max: 55 }
  }
  if (targetAudience.toLowerCase().includes('usa') || targetAudience.toLowerCase().includes('us')) {
    location = 'urban'
  }
  
  // Generate primary audience
  const primaryAudience: SimpleAudience = {
    id: `audience_${Date.now()}_1`,
    name: `${productName} Primary Market`,
    isPrimary: true,
    demographics: {
      age: ageRange,
      gender: gender,
      income: 'middle',
      education: 'college',
      location: location
    },
    psychographics: {
      lifestyle: ['Professional', 'Health-conscious'],
      values: ['Quality', 'Convenience'],
      painPoints: ['Time constraints', 'Quality concerns']
    },
    estimatedSize: 2000000,
    targetSampleSize: 500,
    reasoning: `Primary demographic for ${productName} based on ${targetAudience} targeting. This segment represents the largest opportunity with clear need and sufficient income for premium pricing.`
  }
  
  return [primaryAudience]
}

export function createEmptyAudience(): SimpleAudience {
  return {
    id: `audience_${Date.now()}_empty`,
    name: 'New Audience',
    isPrimary: false,
    demographics: {
      age: { min: 25, max: 45 },
      gender: 'any',
      income: 'middle',
      education: 'college',
      location: 'urban'
    },
    psychographics: {
      lifestyle: [],
      values: [],
      painPoints: []
    },
    estimatedSize: 1000000,
    targetSampleSize: 300,
    reasoning: ''
  }
}
