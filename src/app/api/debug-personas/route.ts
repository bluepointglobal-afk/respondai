import { NextRequest, NextResponse } from 'next/server'
import { aiClient, getAIModel } from '@/lib/ai-client'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Testing personas generator...')
    
    const completion = await aiClient.chat.completions.create({
      model: getAIModel('smart'),
      messages: [
        {
          role: 'system',
          content: 'You are a marketing analyst. Generate 2 customer personas. Return ONLY valid JSON array with this exact structure: [{"id": "persona-1", "name": "Persona Name", "tagline": "One sentence description", "demographics": {"age": "30-45", "gender": "Male", "income": "$50K-$100K", "location": "Urban", "education": "Bachelor\'s", "occupation": "Professional", "familyStatus": "Married"}, "narrative": "2-3 paragraph story about this person", "jobsToBeDone": {"functional": ["practical needs"], "emotional": ["feelings sought"], "social": ["social needs"]}, "motivations": ["primary drivers"], "painPoints": ["frustrations"], "purchaseDrivers": {"mustHaves": ["non-negotiables"], "niceToHaves": ["bonus features"], "dealBreakers": ["what makes them walk away"]}, "decisionProcess": {"researchStyle": "Heavy researcher", "influencers": ["who influences them"], "timeline": "decision timeline", "objections": ["hesitations"]}, "messaging": {"resonates": ["messages that work"], "turnsOff": ["messages that repel"], "tone": "Professional", "channels": ["where to reach them"]}, "quotableQuotes": ["3-4 realistic quotes"], "dayInLife": "detailed narrative", "marketingGuidance": {"positioning": "how to position", "keyBenefits": ["benefits to emphasize"], "socialProof": "type of proof that resonates", "pricing": "price sensitivity", "campaignIdeas": ["campaign concepts"]}, "sizeAndValue": {"estimatedSize": 100000, "purchaseLikelihood": "75%", "expectedLTV": "$300", "acquisitionDifficulty": "Medium", "strategicValue": "High"}}]'
        },
        {
          role: 'user',
          content: 'Product: Turmeric supplement for joint pain. Generate 2 personas. Return ONLY valid JSON array.'
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const content = completion.choices[0]?.message?.content
    console.log('🤖 Raw Personas Response:', content)
    
    // Try to parse it
    let parsed = null
    try {
      // Clean the content
      let cleanContent = content?.trim() || ''
      
      // Remove markdown code blocks if present
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Try to find JSON array in the content
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        cleanContent = jsonMatch[0]
      }
      
      console.log('🧹 Cleaned content for parsing:', cleanContent.substring(0, 200) + '...')
      
      // Parse the JSON
      parsed = JSON.parse(cleanContent)
      
      // Ensure it's an array
      if (!Array.isArray(parsed)) {
        parsed = [parsed]
      }
      
      console.log('✅ Successfully parsed personas:', parsed.length, 'personas')
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError)
      console.error('Raw content:', content)
    }

    return NextResponse.json({
      success: true,
      rawContent: content,
      parsedContent: parsed,
      parseError: parsed ? null : 'Failed to parse JSON',
      personaCount: parsed ? parsed.length : 0
    })

  } catch (error) {
    console.error('❌ DEBUG: Fatal error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
