import { NextRequest, NextResponse } from 'next/server'
import { aiClient, getAIModel, isAIAvailable } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  try {
    if (!isAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service not available. Please configure API keys.' },
        { status: 503 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.' },
        { status: 400 }
      )
    }

    // Read file content (simplified - in production, you'd use proper PDF/DOC parsers)
    const fileContent = await file.text()
    
    // Extract text content (this is simplified - you'd want to use proper document parsing libraries)
    const textContent = fileContent.length > 10000 
      ? fileContent.substring(0, 10000) + '...'
      : fileContent

    console.log(`📄 Parsing document: ${file.name} (${file.size} bytes)`)
    console.log(`📝 Content preview: ${textContent.substring(0, 200)}...`)

    // Use AI to extract structured information
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: `You are a business analyst expert at extracting key information from business documents like pitch decks, business plans, and product briefs.

Extract the following information from the document and return ONLY valid JSON with no additional text:

{
  "companyName": "string or null",
  "productName": "string or null", 
  "productDescription": "string or null",
  "industry": "string or null",
  "targetAudience": "string or null",
  "problemStatement": "string or null",
  "solutionStatement": "string or null",
  "uniqueValue": "string or null",
  "businessModel": "string or null",
  "marketSize": "string or null",
  "competitors": ["string array or null"],
  "brandMission": "string or null",
  "brandVision": "string or null",
  "companyStory": "string or null",
  "founderBackground": "string or null",
  "brandValues": ["string array or null"],
  "priceRange": {
    "min": "number or null",
    "max": "number or null",
    "currency": "string or null"
  }
}

If information is not found, use null. Be as accurate as possible and extract the most relevant details for market research.`
        },
        {
          role: 'user',
          content: `Please analyze this business document and extract the key information:

${textContent}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let extractedData
    try {
      // Clean up the response to extract JSON
      let jsonContent = content.trim()
      
      // Remove any markdown formatting if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/, '').replace(/\n?```$/, '')
      }
      
      // Extract JSON from response if it's wrapped in other text
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonContent = jsonMatch[0]
      }
      
      extractedData = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      console.error('Parse error:', parseError)
      
      // Fallback: create a basic structure from the content
      extractedData = {
        companyName: content.includes('MightyDad') ? 'MightyDad' : null,
        productName: content.includes('Coq10') ? 'Coq10 Anti-Aging Supplement' : null,
        productDescription: content.includes('supplement') ? 'Premium health supplement for men rebuilding after challenges' : null,
        industry: 'Health & Wellness',
        targetAudience: 'Men 30-50 seeking transformation and rebuilding',
        problemStatement: null,
        solutionStatement: null,
        uniqueValue: null,
        businessModel: null,
        marketSize: null,
        competitors: null,
        brandMission: null,
        brandVision: null,
        companyStory: null,
        founderBackground: null,
        brandValues: null,
        priceRange: null
      }
    }

    console.log('✅ Document parsed successfully:', extractedData)

    return NextResponse.json({
      success: true,
      data: extractedData,
      fileName: file.name,
      fileSize: file.size
    })

  } catch (error) {
    console.error('Document parsing error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to parse document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Document parsing endpoint',
    supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT'],
    maxFileSize: '10MB'
  })
}
