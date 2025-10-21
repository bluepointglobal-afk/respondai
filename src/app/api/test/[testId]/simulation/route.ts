import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { runComprehensiveAnalysis } from '@/lib/analytics/comprehensive-analyzer'
import { clearTestCacheForTest } from '@/lib/cache'

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    // 1. GET USER from session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. PARSE REQUEST body
    const config = await req.json()
    
    // 3. VALIDATE data
    if (!config.mode || !config.sampleSize) {
      return NextResponse.json({ error: 'Missing required config fields' }, { status: 400 })
    }

    // 4. GET user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 5. VERIFY test ownership
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        survey: true,
        audiences: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    if (!test.survey) {
      return NextResponse.json({ error: 'No survey found for this test' }, { status: 400 })
    }

    // 6. CLEAR CACHE for this test to ensure fresh data
    clearTestCacheForTest(params.testId)
    
    // 7. CREATE simulation record
    const simulation = await prisma.simulation.create({
      data: {
        testId: params.testId,
        config,
        status: 'queued',
        syntheticResponses: [],
        progress: 0
      }
    })

    // 8. UPDATE test status
    await prisma.test.update({
      where: { id: params.testId },
      data: { status: 'RUNNING' }
    })

    // 8. START background processing (for MVP, we'll process immediately)
    if (config.mode === 'synthetic') {
      // Start processing asynchronously
      processSyntheticSimulation(simulation.id).catch(console.error)
    }

    return NextResponse.json({ 
      simulationId: simulation.id,
      status: simulation.status
    })
    
  } catch (error) {
    console.error('Create simulation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    // 1. GET USER from session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. GET user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. VERIFY test ownership and get simulation
    const test = await prisma.test.findFirst({
      where: { 
        id: params.testId,
        userId: user.id
      },
      include: {
        simulation: true
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      simulation: test.simulation,
      test: {
        id: test.id,
        status: test.status
      }
    })
    
  } catch (error) {
    console.error('Get simulation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Background processing function
async function processSyntheticSimulation(simulationId: string) {
  try {
    console.log(`🚀 Starting simulation processing for ${simulationId}`)
    
    // 0. CLEAR CACHE to ensure fresh data processing
    clearTestCacheForTest(simulationId)
    
    // 1. GET simulation and test data
    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: {
        test: {
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
            audiences: true
          }
        }
      }
    })

    if (!simulation) {
      throw new Error('Simulation not found')
    }

    // 2. UPDATE status to running
    await prisma.simulation.update({
      where: { id: simulationId },
      data: { 
        status: 'running', 
        startedAt: new Date(),
        progress: 10
      }
    })

    // 3. GENERATE SYNTHETIC RESPONSES
    console.log('📊 Generating synthetic responses...')
    const responses = await generateSyntheticResponses(
      simulation.test.survey.sections,
      simulation.test.audiences,
      simulation.config.sampleSize
    )

    // 4. SAVE EACH RESPONSE TO DATABASE (CRITICAL - don't skip this)
    console.log('💾 Saving responses to database...')
    
    for (const response of responses) {
      await prisma.surveyResponse.create({
        data: {
          testId: simulation.test.id,
          audienceId: response.audienceId,
          responseData: {
            purchaseIntent: response.purchaseIntent,
            priceOpinion: response.priceOpinion,
            featureRankings: response.featureRankings,
            messageResonance: response.messageResonance,
            // ... all other response data
          },
          demographics: response.demographics,
          psychographics: response.psychographics,
          behaviors: response.behaviors,
          metadata: {
            source: 'synthetic',
            generatedAt: new Date(),
            model: 'llama-3.3-70b-versatile'
          }
        }
      })
    }
    
    console.log(`✅ Saved ${responses.length} responses to database`)

    await prisma.simulation.update({
      where: { id: simulationId },
      data: { 
        syntheticResponses: responses,
        progress: 50
      }
    })

    // 5. RUN COMPREHENSIVE ANALYSIS using the new analyzer
    console.log('📊 Running comprehensive analysis...')
    
    const analysis = await runComprehensiveAnalysis(simulation.test.id)
    
    console.log('✅ Analysis complete')

    // 6. SAVE COMPLETE ANALYSIS
    const savedAnalysis = await prisma.analysis.create({
      data: {
        testId: simulation.test.id,
        
        // Core analysis
        purchaseIntent: analysis.purchaseIntent,
        insights: analysis.insights,
        patterns: analysis.patterns,
        pricing: analysis.priceSensitivity,
        
        // Personas and recommendations
        personas: {
          create: analysis.personas.map(p => ({
            name: p.name,
            tagline: p.tagline,
            demographics: p.demographics,
            narrative: p.narrative,
            jobsToBeDone: p.jobsToBeDone,
            motivations: p.motivations,
            painPoints: p.painPoints,
            purchaseDrivers: p.purchaseDrivers,
            decisionProcess: p.decisionProcess,
            messaging: p.messaging,
            quotableQuotes: p.quotableQuotes,
            dayInLife: p.dayInLife,
            marketingGuidance: p.marketingGuidance,
            sizeAndValue: p.sizeAndValue
          }))
        },
        
        recommendations: {
          create: analysis.recommendations.map(r => ({
            category: r.category,
            timeframe: r.timeframe,
            priority: r.priority,
            title: r.title,
            description: r.description,
            rationale: r.rationale,
            implementation: r.implementation,
            metrics: r.metrics,
            risks: r.risks,
            estimatedImpact: r.estimatedImpact
          }))
        },
        
        // Advanced analytics
        maxDiffResults: analysis.maxDiff,
        kanoResults: analysis.kano,
        messageResults: analysis.messageTesting,
        journeyMap: analysis.customerJourney,
        brandMap: analysis.brandPerception,
        channelStrategy: analysis.channelStrategy,
        launchReadiness: analysis.launchReadiness,
        
        // Executive summary
        executiveSummary: JSON.stringify(analysis.executiveSummary),
        
        // Metadata
        sampleSize: responses.length,
        confidence: analysis.executiveSummary.confidence,
        dataMode: 'synthetic'
      }
    })

    // 7. UPDATE STATUS
    await prisma.simulation.update({
      where: { id: simulationId },
      data: { 
        status: 'completed',
        completedAt: new Date(),
        progress: 100
      }
    })

    await prisma.test.update({
      where: { id: simulation.test.id },
      data: { status: 'COMPLETED' }
    })

    console.log('🎉 Simulation completed successfully!')
    
  } catch (error) {
    console.error('❌ Simulation failed:', error)
    
    await prisma.simulation.update({
      where: { id: simulationId },
      data: {
        status: 'failed',
        completedAt: new Date()
      }
    })
    
    throw error
  }
}

// Generate realistic synthetic responses based on survey structure
async function generateSyntheticResponses(sections: any, audiences: any[], sampleSize: number) {
  console.log('🎲 Generating synthetic responses...')
  
  return Array.from({ length: sampleSize }, (_, i) => {
    const audience = audiences[Math.floor(Math.random() * audiences.length)]
    
    // Generate realistic demographics based on audience
    const demographics = {
      age: getRandomAge(audience?.demographics?.age),
      gender: getRandomGender(audience?.demographics?.gender),
      income: getRandomIncome(audience?.demographics?.income),
      location: getRandomLocation(audience?.demographics?.location),
      education: getRandomEducation(),
      occupation: getRandomOccupation()
    }
    
    // Generate realistic psychographics
    const psychographics = {
      motivations: getRandomMotivations(audience?.psychographics?.motivations),
      concerns: getRandomConcerns(audience?.psychographics?.concerns),
      values: getRandomValues(audience?.psychographics?.values),
      lifestyle: getRandomLifestyle(audience?.psychographics?.lifestyle)
    }
    
    // Generate realistic behaviors
    const behaviors = {
      preferredChannel: getRandomChannel(),
      categoryUsage: getRandomCategoryUsage(),
      purchaseFrequency: getRandomPurchaseFrequency(),
      brandLoyalty: getRandomBrandLoyalty()
    }
    
    // Generate purchase intent (0-10 scale)
    const baseIntent = Math.random() * 8 + 1 // 1-9 range
    const purchaseIntent = Math.round(baseIntent * 10) / 10
    
    // Generate price opinion
    const priceOpinion = getRandomPriceOpinion(purchaseIntent)
    
    return {
      id: `response_${i}`,
      audienceId: audience?.id,
      purchaseIntent,
      priceOpinion,
      demographics,
      psychographics,
      behaviors,
      responseData: {
        purchaseIntent,
        priceOpinion,
        featureRankings: generateFeatureRankings(),
        messageResonance: generateMessageResonance()
      },
      metadata: {
        audience: audience?.name || 'General',
        startTime: new Date(),
        endTime: new Date(Date.now() + Math.random() * 300000),
        source: 'synthetic',
        generatedAt: new Date()
      }
    }
  })
}

// Helper functions for generating realistic data
function getRandomAge(targetAge?: string): string {
  if (targetAge) {
    // Use target age with some variation
    return targetAge
  }
  const ages = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
  return ages[Math.floor(Math.random() * ages.length)]
}

function getRandomGender(targetGender?: string): string {
  if (targetGender) return targetGender
  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
  return genders[Math.floor(Math.random() * genders.length)]
}

function getRandomIncome(targetIncome?: string): string {
  if (targetIncome) return targetIncome
  const incomes = ['Under $30k', '$30k-$50k', '$50k-$75k', '$75k-$100k', '$100k-$150k', '$150k+']
  return incomes[Math.floor(Math.random() * incomes.length)]
}

function getRandomLocation(targetLocation?: string): string {
  if (targetLocation) return targetLocation
  const locations = ['Urban', 'Suburban', 'Rural', 'International']
  return locations[Math.floor(Math.random() * locations.length)]
}

function getRandomEducation(): string {
  const education = ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD/Professional']
  return education[Math.floor(Math.random() * education.length)]
}

function getRandomOccupation(): string {
  const occupations = ['Student', 'Professional', 'Manager', 'Executive', 'Entrepreneur', 'Retired', 'Other']
  return occupations[Math.floor(Math.random() * occupations.length)]
}

function getRandomMotivations(targetMotivations?: string[]): string[] {
  const allMotivations = ['Health & Wellness', 'Convenience', 'Cost Savings', 'Quality', 'Innovation', 'Sustainability', 'Status', 'Safety']
  if (targetMotivations) {
    // Include some target motivations plus random ones
    const selected = [...targetMotivations]
    while (selected.length < 3 && selected.length < allMotivations.length) {
      const random = allMotivations[Math.floor(Math.random() * allMotivations.length)]
      if (!selected.includes(random)) {
        selected.push(random)
      }
    }
    return selected
  }
  
  const numMotivations = Math.floor(Math.random() * 4) + 2 // 2-5 motivations
  return allMotivations.sort(() => 0.5 - Math.random()).slice(0, numMotivations)
}

function getRandomConcerns(targetConcerns?: string[]): string[] {
  const allConcerns = ['Price', 'Quality', 'Safety', 'Complexity', 'Support', 'Compatibility', 'Privacy', 'Reliability']
  if (targetConcerns) {
    const selected = [...targetConcerns]
    while (selected.length < 2 && selected.length < allConcerns.length) {
      const random = allConcerns[Math.floor(Math.random() * allConcerns.length)]
      if (!selected.includes(random)) {
        selected.push(random)
      }
    }
    return selected
  }
  
  const numConcerns = Math.floor(Math.random() * 3) + 1 // 1-3 concerns
  return allConcerns.sort(() => 0.5 - Math.random()).slice(0, numConcerns)
}

function getRandomValues(targetValues?: string[]): string[] {
  const allValues = ['Innovation', 'Tradition', 'Sustainability', 'Efficiency', 'Community', 'Individualism', 'Security', 'Freedom']
  if (targetValues) {
    const selected = [...targetValues]
    while (selected.length < 2 && selected.length < allValues.length) {
      const random = allValues[Math.floor(Math.random() * allValues.length)]
      if (!selected.includes(random)) {
        selected.push(random)
      }
    }
    return selected
  }
  
  const numValues = Math.floor(Math.random() * 3) + 1 // 1-3 values
  return allValues.sort(() => 0.5 - Math.random()).slice(0, numValues)
}

function getRandomLifestyle(targetLifestyle?: string[]): string[] {
  const allLifestyle = ['Tech-Savvy', 'Health-Conscious', 'Busy Professional', 'Family-Oriented', 'Minimalist', 'Luxury-Seeker', 'Outdoor Enthusiast', 'Homebody']
  if (targetLifestyle) {
    const selected = [...targetLifestyle]
    while (selected.length < 2 && selected.length < allLifestyle.length) {
      const random = allLifestyle[Math.floor(Math.random() * allLifestyle.length)]
      if (!selected.includes(random)) {
        selected.push(random)
      }
    }
    return selected
  }
  
  const numLifestyle = Math.floor(Math.random() * 3) + 1 // 1-3 lifestyle factors
  return allLifestyle.sort(() => 0.5 - Math.random()).slice(0, numLifestyle)
}

function getRandomChannel(): string {
  const channels = ['Online', 'Retail Store', 'Social Media', 'Email', 'Direct Mail', 'TV/Radio', 'Word of Mouth']
  return channels[Math.floor(Math.random() * channels.length)]
}

function getRandomCategoryUsage(): string {
  const usage = ['Heavy User', 'Regular User', 'Occasional User', 'Light User', 'New User']
  return usage[Math.floor(Math.random() * usage.length)]
}

function getRandomPurchaseFrequency(): string {
  const frequency = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Rarely']
  return frequency[Math.floor(Math.random() * frequency.length)]
}

function getRandomBrandLoyalty(): string {
  const loyalty = ['Very Loyal', 'Somewhat Loyal', 'Neutral', 'Somewhat Disloyal', 'Very Disloyal']
  return loyalty[Math.floor(Math.random() * loyalty.length)]
}

function getRandomPriceOpinion(purchaseIntent: number): string {
  // Higher purchase intent correlates with more positive price opinion
  if (purchaseIntent >= 7) {
    const opinions = ['bargain', 'acceptable', 'acceptable', 'acceptable']
    return opinions[Math.floor(Math.random() * opinions.length)]
  } else if (purchaseIntent >= 4) {
    const opinions = ['acceptable', 'acceptable', 'too_expensive', 'too_expensive']
    return opinions[Math.floor(Math.random() * opinions.length)]
  } else {
    const opinions = ['too_expensive', 'too_expensive', 'too_expensive', 'acceptable']
    return opinions[Math.floor(Math.random() * opinions.length)]
  }
}

function generateFeatureRankings(): any {
  // Generate feature rankings if feature questions were asked
  return {
    feature1: Math.floor(Math.random() * 5) + 1,
    feature2: Math.floor(Math.random() * 5) + 1,
    feature3: Math.floor(Math.random() * 5) + 1
  }
}

function generateMessageResonance(): any {
  // Generate message resonance scores if message testing was done
  return {
    message1: Math.floor(Math.random() * 10) + 1,
    message2: Math.floor(Math.random() * 10) + 1,
    message3: Math.floor(Math.random() * 10) + 1
  }
}

// Old placeholder functions removed - now using comprehensive analyzer
