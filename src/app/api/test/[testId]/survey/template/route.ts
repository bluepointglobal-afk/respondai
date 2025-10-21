import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const { industryCategory, validationGoals } = await req.json()
    
    console.log('📋 Loading survey template for:', industryCategory)
    
    // Get appropriate template
    const template = getSurveyTemplate(industryCategory, validationGoals)
    
    // Save survey to database
    const survey = await prisma.survey.create({
      data: {
        testId: params.testId,
        sections: template.sections,
        settings: template.settings,
        publicLink: `/s/${params.testId}`,
        embedCode: `<iframe src="${process.env.NEXT_PUBLIC_APP_URL}/s/${params.testId}" width="100%" height="600"></iframe>`
      }
    })
    
    // Update test status
    await prisma.test.update({
      where: { id: params.testId },
      data: { status: 'AUDIENCE_SETUP' }
    })
    
    console.log('✅ Template loaded:', survey.id)
    
    return NextResponse.json({ surveyId: survey.id })
    
  } catch (error) {
    console.error('❌ Template loading error:', error)
    return NextResponse.json(
      { error: 'Failed to load template' },
      { status: 500 }
    )
  }
}

function getSurveyTemplate(
  industryCategory: string,
  validationGoals: string[]
) {
  // Base template structure
  const baseTemplate = {
    id: 'standard-validation',
    name: 'Standard Product Validation',
    sections: []
  }
  
  // Add sections based on validation goals
  const sections = []
  
  // Always include: Demographics
  sections.push({
    id: 'demographics',
    title: 'About You',
    questions: [
      {
        id: 'age',
        type: 'multiple-choice-single',
        text: 'What is your age?',
        options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        required: true,
        order: 0
      },
      {
        id: 'gender',
        type: 'multiple-choice-single',
        text: 'What is your gender?',
        options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
        required: true,
        order: 1
      },
      {
        id: 'income',
        type: 'multiple-choice-single',
        text: 'What is your household income?',
        options: [
          'Less than $25,000',
          '$25,000 - $50,000',
          '$50,000 - $75,000',
          '$75,000 - $100,000',
          '$100,000 - $150,000',
          'More than $150,000'
        ],
        required: true,
        order: 2
      }
    ]
  })
  
  // Purchase Intent (always include)
  sections.push({
    id: 'purchase-intent',
    title: 'Product Interest',
    questions: [
      {
        id: 'awareness',
        type: 'multiple-choice-single',
        text: 'How familiar are you with this type of product?',
        options: [
          'Very familiar - I use similar products regularly',
          'Somewhat familiar - I know about them',
          'Not familiar - This is new to me'
        ],
        required: true,
        order: 0
      },
      {
        id: 'purchase-likelihood',
        type: 'scale-1-10',
        text: 'How likely would you be to purchase this product?',
        required: true,
        order: 1
      },
      {
        id: 'purchase-timeframe',
        type: 'multiple-choice-single',
        text: 'If interested, when would you likely purchase?',
        options: [
          'Immediately',
          'Within 1 month',
          'Within 3 months',
          'Within 6 months',
          'More than 6 months',
          'Not interested'
        ],
        required: true,
        order: 2
      }
    ]
  })
  
  // Price Sensitivity (if validation goal includes pricing)
  if (validationGoals.includes('Price Sensitivity') || validationGoals.includes('pricing')) {
    sections.push({
      id: 'pricing',
      title: 'Pricing Preferences',
      questions: [
        {
          id: 'price-expectation',
          type: 'text-short',
          text: 'What price would you expect to pay for this product?',
          required: true,
          order: 0
        },
        {
          id: 'too-cheap',
          type: 'text-short',
          text: 'At what price would this product be too cheap (low quality)?',
          required: true,
          order: 1
        },
        {
          id: 'too-expensive',
          type: 'text-short',
          text: 'At what price would this product be too expensive (not worth it)?',
          required: true,
          order: 2
        }
      ]
    })
  }
  
  // Feature Prioritization
  if (validationGoals.includes('Feature Prioritization') || validationGoals.includes('features')) {
    sections.push({
      id: 'features',
      title: 'Feature Preferences',
      questions: [
        {
          id: 'most-important',
          type: 'multiple-choice-multiple',
          text: 'Which features are most important to you? (Select up to 3)',
          options: [
            'Effectiveness',
            'Natural ingredients',
            'Fast results',
            'Scientific backing',
            'Brand reputation',
            'Price value'
          ],
          required: true,
          order: 0
        }
      ]
    })
  }
  
  // Brand Positioning
  if (validationGoals.includes('Brand Positioning') || validationGoals.includes('brand')) {
    sections.push({
      id: 'brand-perception',
      title: 'Brand Perception',
      questions: [
        {
          id: 'brand-words',
          type: 'multiple-choice-multiple',
          text: 'Which words best describe what you want in a brand? (Select up to 3)',
          options: [
            'Trustworthy',
            'Innovative',
            'Natural',
            'Scientific',
            'Premium',
            'Accessible',
            'Authentic'
          ],
          required: true,
          order: 0
        }
      ]
    })
  }
  
  // Messaging Testing
  if (validationGoals.includes('Messaging Testing') || validationGoals.includes('messaging')) {
    sections.push({
      id: 'messaging',
      title: 'Messaging Preferences',
      questions: [
        {
          id: 'message-resonance',
          type: 'multiple-choice-single',
          text: 'Which message resonates most with you?',
          options: [
            'Backed by science and clinical studies',
            'All-natural ingredients you can trust',
            'Join thousands of satisfied customers',
            'Results you can see in weeks'
          ],
          required: true,
          order: 0
        }
      ]
    })
  }
  
  return {
    id: baseTemplate.id,
    name: baseTemplate.name,
    sections: sections,
    settings: {
      estimatedTime: calculateDuration(sections),
      showProgressBar: true,
      allowSaveAndResume: true
    }
  }
}

function calculateDuration(sections: any[]): number {
  const totalQuestions = sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  )
  // Estimate 20 seconds per question
  return Math.ceil((totalQuestions * 20) / 60) // Convert to minutes
}
