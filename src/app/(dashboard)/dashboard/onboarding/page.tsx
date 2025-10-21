'use client'

import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { useTestCreationStore } from '@/lib/stores/test-creation-store'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const { setProductInfo, setValidationGoals } = useTestCreationStore()

  const handleOnboardingComplete = (data: any) => {
    // Convert onboarding data to store format
    const productInfo = {
      name: data.productName,
      description: data.productDescription,
      category: data.industry,
      industry: data.industry,
      stage: 'idea' as const,
      productType: 'physical' as const,
      priceRange: { min: 0, max: 100, currency: 'USD' },
      productFeatures: [],
      companyName: '',
      companyStory: '',
      brandValues: [],
      brandPersonality: [],
      brandVoice: 'professional' as const,
      brandMission: '',
      brandVision: '',
      targetAudience: data.targetAudience,
      targetDemographics: {},
      targetPsychographics: {},
      competitors: [],
      uniqueValue: '',
      competitiveAdvantage: [],
      marketGap: '',
      currentChallenges: [],
      problemStatement: '',
      solutionStatement: '',
      customerStories: [],
      testimonials: [],
      pressOrAwards: [],
      socialMedia: [],
      certifications: [],
      distributionChannels: [],
      commonObjections: [],
      conversionBarriers: [],
      keyPurchaseDrivers: []
    }

    const validationGoals = data.validationGoals.map((goal: string) => ({
      id: goal,
      label: goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Validate ${goal.replace('-', ' ')}`,
      selected: true
    }))

    // Set the data in the store
    setProductInfo(productInfo)
    setValidationGoals(validationGoals)

    // Redirect to the test creation flow
    router.push('/dashboard/test/new')
  }

  return <OnboardingWizard onComplete={handleOnboardingComplete} />
}
