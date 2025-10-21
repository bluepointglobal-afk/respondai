import { AudienceDefinition, TAMCalculationInput, TAMCalculationResult } from './types'
import { calculateTAM } from './tam-calculator'
import { calculateSampleSize } from './sample-size-calculator'
import Groq from 'groq-sdk'

const AUDIENCE_GENERATION_PROMPT = `
You are a senior market research strategist with 20+ years of experience in audience segmentation, TAM estimation, and sample size determination. You specialize in identifying high-value target audiences for new product launches.

PRODUCT CONTEXT:
Product Name: {product_name}
Description: {product_description}
Industry: {industry}
Stage: {stage}
Target Customer (User Input): {user_target_audience}
Validation Goals: {validation_goals}
Competitive Context: {competitors}

YOUR TASK:
Generate 3-5 distinct audience segments that should be researched for this product launch. For each audience, provide comprehensive market intelligence.

SEGMENTATION APPROACH:
Use multi-dimensional segmentation considering:
1. Demographics (age, gender, income, education, location)
2. Psychographics (values, lifestyle, attitudes)
3. Behavioral (category usage, brand loyalty, purchase patterns)
4. Needs-based (what job they're hiring product to do)

AUDIENCE PRIORITY FRAMEWORK:
- PRIMARY: Largest opportunity, best fit, easiest to reach (1-2 segments)
- SECONDARY: Significant opportunity, good fit, moderate accessibility (1-2 segments)
- EXPLORATORY: Emerging opportunity, testing hypothesis (1 segment)

For EACH audience segment, you MUST provide:

1. AUDIENCE NAME & DESCRIPTION
   - Clear, descriptive name (e.g., "Urban Millennial Wellness Seekers")
   - 2-3 sentence description of who they are
   - Priority level (Primary/Secondary/Exploratory)

2. DETAILED DEMOGRAPHICS
   - Age range (specific)
   - Gender distribution (% breakdown)
   - Ethnicity distribution (% breakdown or "any")
   - Income brackets (be specific: "$50K-$75K")
   - Education levels
   - Location type (urban/suburban/rural) and regions
   - Employment status and occupation types

3. PSYCHOGRAPHIC PROFILE
   - Lifestyle characteristics (3-5 descriptors)
   - Core values (3-5 values)
   - Key interests
   - Attitudes toward:
     * Innovation (early adopter/mainstream/laggard)
     * Brand loyalty (high/medium/low)
     * Price sensitivity (high/medium/low)
     * Risk tolerance (high/medium/low)

4. BEHAVIORAL PROFILE
   - Current category usage (heavy/medium/light/non-user)
   - Brands currently using
   - Purchase frequency
   - Preferred channels (online/retail/direct)
   - Information seeking behavior

5. STRATEGIC RATIONALE
   
   Why this audience matters:
   - Market size opportunity: {$ potential}
   - Product-market fit score: {0-100}
   - Accessibility: {easy/moderate/hard to reach}
   - Competition level: {low/medium/high}
   - Expected purchase intent: {predicted %}
   - Expected WTP: {predicted $}
   
   Key insight: {1-2 sentences on why this segment is strategic}

6. VALIDATION PRIORITY
   
   This is a {PRIMARY/SECONDARY/EXPLORATORY} segment because:
   - {reason 1}
   - {reason 2}
   - {reason 3}

7. COMPETITIVE CONTEXT
   
   Current solutions this segment uses: {list}
   Unmet needs: {list}
   Differentiation opportunity: {explain}
   Switching barriers: {list}

8. TARGETING GUIDANCE
    
    Best channels to reach: {channels}
    Key messaging themes: {themes}
    Creative direction: {direction}
    Influencer types: {influencer categories}

OUTPUT FORMAT:
Return a JSON array with 3-5 audience objects following this schema:

{
  "audiences": [
    {
      "name": "string",
      "priority": "primary" | "secondary" | "exploratory",
      "description": "string",
      "demographics": { detailed object },
      "psychographics": { detailed object },
      "behavioral": { detailed object },
      "strategic": {
        "rationale": "string",
        "fit_score": number,
        "priority_score": number,
        "expected_metrics": { detailed object }
      },
      "competitive": { detailed object },
      "targeting": { detailed object }
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Demographics must be specific, not vague
2. Provide 3-5 distinct segments (not overlapping)
3. Prioritize by strategic value (size × fit × accessibility)
4. Be realistic about numbers
5. Consider industry-specific factors
6. Every claim must be backed by reasoning

NOW GENERATE AUDIENCES FOR THIS PRODUCT.
`

export async function generateAudienceSuggestions(productContext: {
  productInfo: any
  validationGoals: string[]
}): Promise<any[]> {
  try {
    console.log('=== GENERATING AI AUDIENCE SUGGESTIONS ===')
    console.log('Product Context:', productContext)
    
    // Prepare the prompt with product context
    const prompt = AUDIENCE_GENERATION_PROMPT
      .replace('{product_name}', productContext.productInfo.name || 'Product')
      .replace('{product_description}', productContext.productInfo.description || 'Product description')
      .replace('{industry}', productContext.productInfo.industry || 'General')
      .replace('{stage}', productContext.productInfo.stage || 'idea')
      .replace('{user_target_audience}', productContext.productInfo.targetAudience || 'General audience')
      .replace('{validation_goals}', JSON.stringify(productContext.validationGoals))
      .replace('{competitors}', JSON.stringify(productContext.productInfo.competitors || []))
    
    console.log('Generated prompt length:', prompt.length)
    
    // Call Groq API
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
    
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a senior market research strategist. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
    
    console.log('Groq Response:', response)
    
    const aiResponse = response.choices[0]?.message?.content
    if (!aiResponse) {
      throw new Error('No response from Groq')
    }
    
    console.log('AI Response Content:', aiResponse)
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(aiResponse)
    console.log('Parsed Response:', parsedResponse)
    
    if (!parsedResponse.audiences || !Array.isArray(parsedResponse.audiences)) {
      throw new Error('Invalid response format from AI')
    }
    
    // Process each audience and convert to simple database format
    const processedAudiences: any[] = []
    
    for (let i = 0; i < parsedResponse.audiences.length; i++) {
      const aiAudience = parsedResponse.audiences[i]
      console.log(`Processing audience ${i + 1}:`, aiAudience.name)
      
      // Convert AI response to simple database format
      const audience = convertToSimpleFormat(aiAudience, i)
      processedAudiences.push(audience)
    }
    
    console.log('Processed audiences:', processedAudiences.length)
    return processedAudiences
    
  } catch (error) {
    console.error('Error generating audience suggestions:', error)
    
    // Fallback to mock data if AI fails
    console.log('Falling back to mock audience data')
    return generateMockAudiences(productContext)
  }
}

function convertToSimpleFormat(aiAudience: any, index: number): any {
  // Extract demographics from AI response
  const demographics = aiAudience.demographics || {}
  
  return {
    id: `audience_${Date.now()}_${index}`,
    name: aiAudience.name || `Audience ${index + 1}`,
    isPrimary: aiAudience.priority === 'primary',
    demographics: {
      age: {
        min: demographics.age_min || 25,
        max: demographics.age_max || 45
      },
      gender: demographics.gender || 'any',
      income: demographics.income || 'middle',
      education: demographics.education || 'college',
      location: demographics.location_type?.[0] || 'urban'
    },
    psychographics: {
      lifestyle: Array.isArray(aiAudience.psychographics?.lifestyle) 
        ? aiAudience.psychographics.lifestyle 
        : ['Professional'],
      values: Array.isArray(aiAudience.psychographics?.values) 
        ? aiAudience.psychographics.values 
        : ['Quality'],
      painPoints: Array.isArray(aiAudience.psychographics?.painPoints) 
        ? aiAudience.psychographics.painPoints 
        : []
    },
    estimatedSize: demographics.estimated_size || 1000000,
    targetSampleSize: demographics.target_sample || 500,
    reasoning: aiAudience.strategic?.rationale || 'AI-generated audience segment'
  }
}

async function processAIAudience(aiAudience: any, index: number): Promise<AudienceDefinition> {
  // Convert AI demographics to TAM calculation input
  const tamInput: TAMCalculationInput = {
    demographics: {
      age_min: aiAudience.demographics?.age_min || 25,
      age_max: aiAudience.demographics?.age_max || 45,
      gender: aiAudience.demographics?.gender || ['any'],
      income_min: aiAudience.demographics?.income_min || 50,
      income_max: aiAudience.demographics?.income_max || 100,
      education: aiAudience.demographics?.education || ['some_college', 'bachelors'],
      location_type: aiAudience.demographics?.location_type || ['urban', 'suburban'],
      regions: aiAudience.demographics?.regions || ['northeast', 'west']
    },
    psychographics: {
      health_consciousness: aiAudience.psychographics?.health_consciousness || 'medium',
      innovation_adoption: aiAudience.psychographics?.innovation_adoption || 'mainstream',
      natural_product_preference: aiAudience.psychographics?.natural_preference || 'medium',
      price_sensitivity: aiAudience.psychographics?.price_sensitivity || 'medium'
    },
    behavioral: {
      category_usage: aiAudience.behavioral?.category_usage || 'medium',
      condition_prevalence: aiAudience.behavioral?.condition_prevalence
    }
  }
  
  // Calculate TAM
  const tamResult = calculateTAM(tamInput)
  
  // Calculate sample size
  const sampleResult = calculateSampleSize({
    population_size: tamResult.final_tam,
    confidence_level: 95,
    margin_of_error: 5,
    expected_proportion: 0.5,
    subgroup_count: 1,
    design_effect: 1.5,
    expected_response_rate: 0.8
  })
  
  // Build the complete audience definition
  const audience: AudienceDefinition = {
    id: `audience_${Date.now()}_${index}`,
    name: aiAudience.name || `Audience ${index + 1}`,
    isPrimary: aiAudience.priority === 'primary',
    priority: aiAudience.priority || 'secondary',
    
    demographics: {
      age: {
        min: aiAudience.demographics?.age_min || 25,
        max: aiAudience.demographics?.age_max || 45,
        distribution: 'normal'
      },
      gender: {
        male: aiAudience.demographics?.gender_male || 50,
        female: aiAudience.demographics?.gender_female || 50,
        other: 0,
        any: aiAudience.demographics?.gender?.includes('any') || false
      },
      ethnicity: {
        white: 60,
        black: 13,
        hispanic: 19,
        asian: 6,
        other: 2,
        any: true
      },
      income: {
        brackets: [`$${tamInput.demographics.income_min}K-$${tamInput.demographics.income_max}K`],
        median: (tamInput.demographics.income_min + tamInput.demographics.income_max) / 2,
        distribution: 'normal'
      },
      education: {
        levels: tamInput.demographics.education,
        distribution: {
          'some_college': 0.3,
          'bachelors': 0.4,
          'graduate': 0.3
        }
      },
      location: {
        type: tamInput.demographics.location_type[0] as any,
        regions: tamInput.demographics.regions,
        cities: [],
        density: 'high'
      },
      employment: {
        status: ['Employed full-time'],
        occupation: ['Professional', 'Manager']
      }
    },
    
    psychographics: {
      lifestyle: Array.isArray(aiAudience.psychographics?.lifestyle) 
        ? aiAudience.psychographics.lifestyle 
        : ['Health-conscious', 'Professional'],
      values: Array.isArray(aiAudience.psychographics?.values) 
        ? aiAudience.psychographics.values 
        : ['Quality', 'Convenience'],
      interests: Array.isArray(aiAudience.psychographics?.interests) 
        ? aiAudience.psychographics.interests 
        : ['Wellness', 'Fitness'],
      attitudes: {
        innovation: aiAudience.psychographics?.innovation || 'mainstream',
        brand_loyalty: aiAudience.psychographics?.brand_loyalty || 'medium',
        price_sensitivity: aiAudience.psychographics?.price_sensitivity || 'medium',
        risk_tolerance: aiAudience.psychographics?.risk_tolerance || 'medium',
        health_consciousness: aiAudience.psychographics?.health_consciousness || 'high'
      }
    },
    
    behavioral: {
      category_usage: aiAudience.behavioral?.category_usage || 'medium',
      brand_usage: aiAudience.behavioral?.brands || [],
      purchase_frequency: aiAudience.behavioral?.frequency || 'Monthly',
      channel_preference: aiAudience.behavioral?.channels || ['Online', 'Retail'],
      information_seeking: aiAudience.behavioral?.info_seeking || 'high'
    },
    
    market_sizing: {
      tam_calculation: {
        total_us_population: 333_000_000,
        demographic_filter_rate: tamResult.steps.reduce((acc, step) => acc * step.penetration_rate, 1),
        geographic_filter_rate: 1,
        psychographic_filter_rate: 1,
        behavioral_filter_rate: 1,
        estimated_tam: tamResult.final_tam,
        calculation_steps: tamResult.steps
      },
      confidence: {
        level: tamResult.confidence,
        factors: tamResult.confidence_factors,
        assumptions: tamResult.assumptions,
        risks: tamResult.risks
      }
    },
    
    sample_recommendation: {
      minimum_sample: sampleResult.minimum,
      recommended_sample: sampleResult.recommended,
      optimal_sample: sampleResult.optimal,
      calculation: {
        confidence_level: 95,
        margin_of_error: 5,
        expected_proportion: 0.5,
        population_size: tamResult.final_tam,
        design_effect: 1.5,
        response_rate: 0.8,
        formula: 'n = (Z² × p × (1-p)) / E²',
        rationale: sampleResult.rationale
      },
      practical: {
        cost_per_response: sampleResult.cost_estimate.cost_per_response,
        total_cost: sampleResult.cost_estimate.total_cost_recommended,
        time_to_collect: sampleResult.cost_estimate.time_estimate,
        feasibility: sampleResult.feasibility
      }
    },
    
    strategic: {
      rationale: aiAudience.strategic?.rationale || 'Strategic audience segment identified through market analysis',
      fit_score: aiAudience.strategic?.fit_score || 75,
      fit_reasons: aiAudience.strategic?.fit_reasons || ['Strong product-market fit', 'Clear need'],
      priority_score: aiAudience.strategic?.priority_score || 80,
      priority_factors: {
        size: aiAudience.strategic?.size_score || 70,
        accessibility: aiAudience.strategic?.accessibility_score || 80,
        receptivity: aiAudience.strategic?.receptivity_score || 85,
        profitability: aiAudience.strategic?.profitability_score || 75
      },
      competitive: {
        competition_level: aiAudience.competitive?.level || 'medium',
        key_competitors: aiAudience.competitive?.competitors || [],
        differentiation_opportunity: aiAudience.competitive?.differentiation || 'Unique value proposition'
      },
      expected_metrics: {
        purchase_intent: aiAudience.strategic?.expected_metrics?.purchase_intent || 65,
        willingness_to_pay: aiAudience.strategic?.expected_metrics?.wtp || 50,
        conversion_rate: aiAudience.strategic?.expected_metrics?.conversion || 8,
        lifetime_value: aiAudience.strategic?.expected_metrics?.ltv || 500,
        confidence: aiAudience.strategic?.expected_metrics?.confidence || 75
      }
    },
    
    targeting: {
      channels: aiAudience.targeting?.channels || ['Social Media', 'Online'],
      messaging: aiAudience.targeting?.messaging || 'Focus on quality and convenience',
      creative: aiAudience.targeting?.creative || 'Professional, clean aesthetic',
      timing: aiAudience.targeting?.timing || 'Business hours',
      influencers: aiAudience.targeting?.influencers || ['Health professionals', 'Lifestyle bloggers']
    }
  }
  
  return audience
}

function generateMockAudiences(productContext: any): any[] {
  console.log('=== GENERATING MOCK AUDIENCES ===')
  console.log('Product Context:', productContext)
  
  // Extract actual product information
  const productInfo = productContext.productInfo || {}
  const validationGoals = productContext.validationGoals || []
  
  console.log('Product Info:', productInfo)
  console.log('Validation Goals:', validationGoals)
  
  // Parse target audience from product info
  const targetAudience = productInfo.targetAudience || 'general'
  const productName = productInfo.name || 'Product'
  const industry = productInfo.industry || 'general'
  const description = productInfo.description || 'A new product'
  
  console.log('Parsed values:', { targetAudience, productName, industry, description })
  
  // Generate dynamic audience based on actual product data
  const audienceName = targetAudience !== 'test' && targetAudience !== 'general' 
    ? `${targetAudience} - Primary Market`
    : `${productName} Primary Market`
  
  console.log('Generated audience name:', audienceName)
  
  // Determine demographics based on product context
  let ageRange = { min: 25, max: 45 }
  let genderSplit = { male: 50, female: 50, other: 0, any: false }
  let incomeBracket = ['$50K-$75K']
  let locationType = 'urban'
  
  // Adjust based on product context - ACTUALLY USE THE DATA
  console.log('Analyzing target audience:', targetAudience)
  
  if (targetAudience.toLowerCase().includes('men') || targetAudience.toLowerCase().includes('male')) {
    genderSplit = { male: 80, female: 20, other: 0, any: false }
    console.log('Set gender to male-focused:', genderSplit)
  }
  if (targetAudience.toLowerCase().includes('women') || targetAudience.toLowerCase().includes('female')) {
    genderSplit = { male: 20, female: 80, other: 0, any: false }
    console.log('Set gender to female-focused:', genderSplit)
  }
  if (targetAudience.toLowerCase().includes('30') || targetAudience.toLowerCase().includes('35')) {
    ageRange = { min: 30, max: 55 }
    console.log('Set age range to 30-55:', ageRange)
  }
  if (targetAudience.toLowerCase().includes('usa') || targetAudience.toLowerCase().includes('us')) {
    locationType = 'urban'
    console.log('Set location to urban USA')
  }
  
  // Additional parsing for more specific demographics
  if (targetAudience.toLowerCase().includes('25')) {
    ageRange = { min: 25, max: 45 }
    console.log('Set age range to 25-45:', ageRange)
  }
  if (targetAudience.toLowerCase().includes('45')) {
    ageRange = { min: 35, max: 55 }
    console.log('Set age range to 35-55:', ageRange)
  }
  
  console.log('Final demographics:', { ageRange, genderSplit, locationType })
  
  // Fallback mock data when AI fails - now using actual product context
  return [
    {
      id: 'mock_audience_1',
      name: audienceName,
      isPrimary: true,
      demographics: {
        age: {
          min: ageRange.min,
          max: ageRange.max
        },
        gender: genderSplit.male > 60 ? 'male' : genderSplit.female > 60 ? 'female' : 'any',
        income: incomeBracket[0] === '$50K-$75K' ? 'middle' : 'high',
        education: 'college',
        location: locationType
      },
      psychographics: {
        lifestyle: ['Health-conscious', 'Professional'],
        values: ['Quality', 'Convenience'],
        painPoints: ['Joint pain', 'Inflammation']
      },
      estimatedSize: 2000000,
      targetSampleSize: 400,
      reasoning: `Primary demographic for ${productName} based on ${targetAudience} targeting. This segment represents the largest opportunity with clear need, sufficient income for premium pricing, and established usage behavior in the ${industry} category.`
    }
  ]
}
