import { NextRequest, NextResponse } from 'next/server'
import { aiClient, getAIModel, isAIAvailable, getProviderName } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  try {
    const { productInfo, validationGoals, audiences } = await req.json()

    // If no AI available, return template survey
    if (!isAIAvailable()) {
      console.log('⚠️ No AI key available, using template survey')
      return NextResponse.json({ survey: getTemplateSurvey(validationGoals) })
    }

    console.log(`✓ Using ${getProviderName()} to generate survey`)

    // Build goals summary
    const goalsSummary = validationGoals
      .filter((g: any) => g.selected)
      .map((g: any) => `- ${g.label}: ${g.description}`)
      .join('\n')

    // Generate survey using AI
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: `You are an expert survey designer specializing in market research and product validation.

Create a comprehensive survey with 4-6 sections. Return ONLY a JSON object with this structure (no markdown):

{
  "sections": [
    {
      "id": "section-1",
      "title": "Screener",
      "description": "Qualify respondents",
      "questions": [
        {
          "id": "q1",
          "type": "multiple_choice",
          "text": "Question text",
          "helpText": "Optional clarification",
          "required": true,
          "options": ["Option 1", "Option 2"],
          "validationGoal": "audience",
          "analysisCategory": "demographic"
        }
      ]
    }
  ],
  "settings": {
    "estimatedTime": 8,
    "showProgressBar": true,
    "allowSaveAndResume": true
  }
}

SURVEY STRUCTURE REQUIREMENTS:

1. **SCREENER Section (2-3 questions)**
   - Qualify respondents match target audience
   - Demographic qualifiers
   - Behavior/purchase history if relevant

2. **PROBLEM VALIDATION Section (3-5 questions)**
   - Problem frequency/severity
   - Current solutions used
   - Pain points
   - Willingness to solve

3. **SOLUTION VALIDATION Section (5-7 questions)**
   - Show product concept
   - Purchase intent (1-10 scale)
   - Feature preferences (ranking or multiple choice)
   - Format/delivery preferences
   - Concerns/objections

4. **BRAND Section (if brand goal selected) (3-4 questions)**
   - Brand name perception
   - Tagline effectiveness
   - Trust factors
   - Values alignment

5. **PRICING Section (if pricing goal selected) (3-4 questions)**
   - Expected price range
   - Maximum willing to pay
   - Pricing model preference (one-time, subscription, etc.)
   - Value perception

6. **DEMOGRAPHICS Section (6-8 questions)**
   - Age (multiple choice ranges)
   - Gender
   - Ethnicity (be inclusive and specific)
   - Income (ranges)
   - Education level
   - Location (city, state)
   - Occupation

QUESTION TYPES TO USE:
- multiple_choice: For categorical options
- scale: For ratings (1-10, 1-5)
- yes_no: For binary decisions
- text_short: For brief text (names, cities)
- text_long: For open-ended feedback
- ranking: For prioritizing options

CRITICAL REQUIREMENTS:
- Questions must be clear, unbiased, and specific
- Use realistic answer options for multiple choice
- Include "Other" option where appropriate
- Consider cultural sensitivity in wording
- Map each question to a validationGoal
- Set appropriate analysisCategory for analysis pipeline`,
        },
        {
          role: 'user',
          content: `Create a survey for:

**Product Name:** ${productInfo.name || productInfo.productName}
**Category:** ${productInfo.category || 'Not specified'}
**Description:** ${productInfo.description}
**Industry:** ${productInfo.industry}
**Product Stage:** ${productInfo.stage}
**Target Audience:** ${productInfo.targetAudience || 'Not specified'}
**Problem Being Solved:** ${productInfo.problemStatement || 'Not specified'}
**Unique Value Proposition:** ${productInfo.uniqueValue || 'Not specified'}
**Price Range:** $${productInfo.priceRange?.min || 0} - $${productInfo.priceRange?.max || 0}
**Brand Values:** ${Array.isArray(productInfo.brandValues) ? productInfo.brandValues.join(', ') : 'Not specified'}
**Company Story:** ${productInfo.companyStory || 'Not specified'}

**Validation Goals:**
${goalsSummary}

**Target Audiences:**
${audiences.map((a: any) => `- ${a.name}`).join('\n')}

Generate a survey that:
- Thoroughly addresses each validation goal
- Uses appropriate question types
- Is clear and unbiased
- Takes 8-12 minutes to complete
- Collects actionable data
- Is culturally sensitive`,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content generated')
    }

    // Parse the JSON response
    let survey
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      survey = JSON.parse(cleaned)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error('Invalid JSON from OpenAI')
    }

    return NextResponse.json({ survey })
    
  } catch (error) {
    console.error('Error generating survey:', error)
    
    // Return template survey
    return NextResponse.json({
      survey: getTemplateSurvey([]),
      warning: 'Using template survey due to API error',
    })
  }
}

function getTemplateSurvey(validationGoals: any[]) {
  const sections: any[] = [
    {
      id: 'section-1',
      title: 'Screener',
      description: 'A few quick questions to make sure you\'re a good fit',
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          text: 'What is your age range?',
          required: true,
          options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
          validationGoal: 'audience',
          analysisCategory: 'demographic',
        },
        {
          id: 'q2',
          type: 'yes_no',
          text: 'Have you purchased a similar product in the past 12 months?',
          required: true,
          validationGoal: 'audience',
          analysisCategory: 'problem',
        },
      ],
    },
    {
      id: 'section-2',
      title: 'Problem Understanding',
      description: 'Help us understand your needs',
      questions: [
        {
          id: 'q3',
          type: 'scale',
          text: 'How often do you experience this problem?',
          helpText: '1 = Rarely, 10 = Daily',
          required: true,
          scaleMin: 1,
          scaleMax: 10,
          scaleLabels: { min: 'Rarely', max: 'Daily' },
          validationGoal: 'product',
          analysisCategory: 'problem',
        },
        {
          id: 'q4',
          type: 'text_long',
          text: 'What solutions have you tried? What didn\'t work?',
          required: false,
          validationGoal: 'product',
          analysisCategory: 'problem',
        },
      ],
    },
    {
      id: 'section-3',
      title: 'Product Concept',
      description: 'We\'d like your feedback on our solution',
      questions: [
        {
          id: 'q5',
          type: 'scale',
          text: 'How likely are you to purchase this product?',
          helpText: '1 = Not at all likely, 10 = Extremely likely',
          required: true,
          scaleMin: 1,
          scaleMax: 10,
          scaleLabels: { min: 'Not likely', max: 'Very likely' },
          validationGoal: 'product',
          analysisCategory: 'solution',
        },
        {
          id: 'q6',
          type: 'multiple_choice',
          text: 'Which features are most important to you? (Select up to 3)',
          required: true,
          options: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Other'],
          validationGoal: 'product',
          analysisCategory: 'solution',
        },
      ],
    },
  ]

  // Add pricing section if pricing goal selected
  const hasPricingGoal = validationGoals.some(g => g.category === 'pricing' && g.selected)
  if (hasPricingGoal) {
    sections.push({
      id: 'section-pricing',
      title: 'Pricing',
      description: 'Help us find the right price point',
      questions: [
        {
          id: 'q-price-1',
          type: 'scale',
          text: 'What price would you expect to pay?',
          helpText: 'Select a price range',
          required: true,
          scaleMin: 10,
          scaleMax: 100,
          scaleLabels: { min: '$10', max: '$100' },
          validationGoal: 'pricing',
          analysisCategory: 'pricing',
        },
        {
          id: 'q-price-2',
          type: 'multiple_choice',
          text: 'Which pricing model do you prefer?',
          required: true,
          options: ['One-time purchase', 'Monthly subscription', 'Annual subscription', 'Pay per use'],
          validationGoal: 'pricing',
          analysisCategory: 'pricing',
        },
      ],
    })
  }

  // Always add demographics
  sections.push({
    id: 'section-demographics',
    title: 'About You',
    description: 'Last few questions to understand who you are',
    questions: [
      {
        id: 'q-demo-1',
        type: 'multiple_choice',
        text: 'What is your gender?',
        required: true,
        options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
        validationGoal: 'audience',
        analysisCategory: 'demographic',
      },
      {
        id: 'q-demo-2',
        type: 'multiple_choice',
        text: 'What is your annual household income?',
        required: true,
        options: ['Under $25K', '$25-50K', '$50-75K', '$75-100K', '$100-150K', '$150K+', 'Prefer not to say'],
        validationGoal: 'audience',
        analysisCategory: 'demographic',
      },
      {
        id: 'q-demo-3',
        type: 'text_short',
        text: 'What city and state do you live in?',
        required: true,
        validationGoal: 'audience',
        analysisCategory: 'demographic',
      },
    ],
  })

  return {
    sections,
    settings: {
      estimatedTime: 8,
      showProgressBar: true,
      allowSaveAndResume: true,
    },
  }
}

