import _ from 'lodash'

export interface DemographicProfile {
  age: string
  gender: string
  income: string
  location: string
  education: string
  ethnicity?: string
  familyStatus?: string
}

export interface PsychographicProfile {
  values: string[]
  lifestyle: string[]
  interests: string[]
  painPoints: string[]
  motivations: string[]
}

export const DEMOGRAPHIC_DISTRIBUTIONS = {
  age: {
    '18-24': 0.12,
    '25-34': 0.22,
    '35-44': 0.20,
    '45-54': 0.18,
    '55-64': 0.15,
    '65+': 0.13,
  },
  gender: {
    'Female': 0.51,
    'Male': 0.48,
    'Non-binary': 0.01,
  },
  income: {
    '<$30K': 0.20,
    '$30-50K': 0.20,
    '$50-75K': 0.20,
    '$75-100K': 0.15,
    '$100-150K': 0.15,
    '$150K+': 0.10,
  },
  location: {
    'Urban': 0.45,
    'Suburban': 0.35,
    'Rural': 0.20,
  },
  education: {
    'High School': 0.28,
    'Some College': 0.20,
    'Bachelor\'s': 0.35,
    'Graduate': 0.17,
  },
  ethnicity: {
    'White': 0.60,
    'Hispanic': 0.19,
    'Black': 0.13,
    'Asian': 0.06,
    'Other': 0.02,
  },
}

export const GEOGRAPHIC_REGIONS = {
  'Coastal': {
    states: ['CA', 'NY', 'WA', 'OR', 'MA', 'FL'],
    characteristics: {
      progressive: 0.7,
      urbanDensity: 0.8,
      incomeLevel: 1.2,
      sustainability: 0.8,
    },
  },
  'Mountain': {
    states: ['CO', 'UT', 'AZ', 'NV', 'ID'],
    characteristics: {
      progressive: 0.5,
      urbanDensity: 0.5,
      incomeLevel: 0.9,
      outdoorOriented: 0.9,
    },
  },
  'South': {
    states: ['TX', 'GA', 'NC', 'TN', 'LA'],
    characteristics: {
      progressive: 0.4,
      urbanDensity: 0.6,
      incomeLevel: 0.85,
      traditional: 0.7,
    },
  },
  'Midwest': {
    states: ['IL', 'OH', 'MI', 'WI', 'MN'],
    characteristics: {
      progressive: 0.5,
      urbanDensity: 0.5,
      incomeLevel: 0.9,
      practical: 0.8,
    },
  },
}

/**
 * Generate realistic demographic distribution
 */
export function generateDemographicSample(
  sampleSize: number,
  biases?: Partial<Record<keyof typeof DEMOGRAPHIC_DISTRIBUTIONS, Record<string, number>>>
): DemographicProfile[] {
  const sample: DemographicProfile[] = []

  for (let i = 0; i < sampleSize; i++) {
    sample.push({
      age: weightedRandomChoice(biases?.age || DEMOGRAPHIC_DISTRIBUTIONS.age),
      gender: weightedRandomChoice(biases?.gender || DEMOGRAPHIC_DISTRIBUTIONS.gender),
      income: weightedRandomChoice(biases?.income || DEMOGRAPHIC_DISTRIBUTIONS.income),
      location: weightedRandomChoice(biases?.location || DEMOGRAPHIC_DISTRIBUTIONS.location),
      education: weightedRandomChoice(biases?.education || DEMOGRAPHIC_DISTRIBUTIONS.education),
      ethnicity: weightedRandomChoice(biases?.ethnicity || DEMOGRAPHIC_DISTRIBUTIONS.ethnicity),
    })
  }

  return sample
}

/**
 * Weighted random selection
 */
function weightedRandomChoice(weights: Record<string, number>): string {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
  let random = Math.random() * totalWeight

  for (const [key, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) {
      return key
    }
  }

  return Object.keys(weights)[0] // Fallback
}

/**
 * Calculate demographic similarity score
 */
export function demographicSimilarity(
  profile1: DemographicProfile,
  profile2: DemographicProfile
): number {
  let matches = 0
  let total = 0

  const keys: (keyof DemographicProfile)[] = ['age', 'gender', 'income', 'location', 'education']

  keys.forEach((key) => {
    if (profile1[key] && profile2[key]) {
      total++
      if (profile1[key] === profile2[key]) {
        matches++
      }
    }
  })

  return total > 0 ? matches / total : 0
}

/**
 * Segment responses by demographic characteristic
 */
export function segmentByDemographic<T extends { demographics: DemographicProfile }>(
  responses: T[],
  characteristic: keyof DemographicProfile
): Map<string, T[]> {
  return _.groupBy(responses, (r) => r.demographics[characteristic]) as any
}

