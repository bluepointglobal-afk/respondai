import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const productInfoSchema = z.object({
  productName: z.string(),
  description: z.string(),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
})

/**
 * POST /api/generate-personas
 * Generate AI-powered customer personas
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productInfo } = body

    // Validate input
    const validated = productInfoSchema.parse(productInfo)

    // If no OpenAI key, return fallback personas
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ No OpenAI key, using fallback personas')
      return NextResponse.json({ personas: getFallbackPersonas() })
    }

    // Generate personas using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a market research expert. Generate 3 detailed customer personas for a product. 
Return ONLY a JSON array with this exact structure (no markdown, no code blocks):
[
  {
    "id": "persona-1",
    "name": "First Name",
    "title": "Short descriptive title (e.g., The Busy Professional)",
    "age": "age range (e.g., 28-35)",
    "income": "$60-90K",
    "location": "Urban/Suburban/Rural",
    "psychographics": "detailed psychographic description focusing on values, lifestyle, pain points",
    "icon": "emoji that represents this persona"
  }
]`,
        },
        {
          role: 'user',
          content: `Generate 3 customer personas for:

Product: ${validated.productName}
Description: ${validated.description}
${validated.industry ? `Industry: ${validated.industry}` : ''}
${validated.targetAudience ? `Target Audience: ${validated.targetAudience}` : ''}

Make the personas diverse, realistic, and actionable.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content generated')
    }

    // Parse the JSON response
    let personas
    try {
      // Remove markdown code blocks if present
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      personas = JSON.parse(cleaned)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error('Invalid JSON from OpenAI')
    }

    return NextResponse.json({ personas })
    
  } catch (error) {
    console.error('Error generating personas:', error)
    
    // Return fallback personas if OpenAI fails
    return NextResponse.json({
      personas: getFallbackPersonas(),
      warning: 'Using fallback personas due to API error',
    })
  }
}

function getFallbackPersonas() {
  return [
    {
      id: 'persona-1',
      name: 'Sarah',
      title: 'The Busy Professional',
      age: '32-38',
      income: '$75-120K',
      location: 'Urban',
      psychographics: 'Health-conscious, time-poor, values convenience, active social media user, seeks work-life balance',
      icon: '👩‍💼',
    },
    {
      id: 'persona-2',
      name: 'Michael',
      title: 'The Wellness Seeker',
      age: '28-35',
      income: '$60-90K',
      location: 'Suburban',
      psychographics: 'Fitness enthusiast, researches products thoroughly, values natural ingredients, follows wellness trends',
      icon: '🧘‍♂️',
    },
    {
      id: 'persona-3',
      name: 'Jennifer',
      title: 'The Holistic Mom',
      age: '35-42',
      income: '$80-130K',
      location: 'Suburban',
      psychographics: 'Family-focused, seeks natural solutions, influenced by mom communities, prioritizes safety',
      icon: '👩‍👧',
    },
  ]
}

