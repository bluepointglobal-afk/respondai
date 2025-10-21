import { prisma } from '../src/lib/db'
import { extractCompleteTestData, prepareDataForAI } from '../src/lib/analytics/data-extractor'

async function testDataExtractor() {
  console.log('🧪 Testing data extractor...')
  
  try {
    // Find any existing test
    const test = await prisma.test.findFirst({
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
        audiences: true,
        surveyResponses: true,
        simulation: true
      }
    })
    
    if (!test) {
      console.log('❌ No tests found in database')
      return
    }
    
    console.log('📊 Found test:', test.id)
    console.log('  Product Name:', test.productInfo.name)
    console.log('  Target Audience:', test.productInfo.targetAudience)
    console.log('  Audiences:', test.audiences.length)
    console.log('  Survey Sections:', test.survey?.sections?.length || 0)
    console.log('  Responses:', test.surveyResponses.length)
    
    // Test data extraction
    console.log('\n🔍 Testing data extraction...')
    const extractedTest = await extractCompleteTestData(test.id)
    console.log('✅ Data extraction successful')
    
    // Test data preparation for AI
    console.log('\n🤖 Testing AI data preparation...')
    const aiData = prepareDataForAI(extractedTest)
    
    console.log('\n📋 AI Data Summary:')
    console.log('  Product Name:', aiData.product.name)
    console.log('  Target Audience:', aiData.product.targetAudience)
    console.log('  Survey Questions:', aiData.survey.totalQuestions)
    console.log('  Audiences:', aiData.audiences.length)
    console.log('  Responses:', aiData.responses.total)
    console.log('  Overall Purchase Intent:', aiData.metrics.purchaseIntent.overall.toFixed(1), '%')
    console.log('  Validation Goals:', aiData.validationGoals.length)
    
    console.log('\n✅ Data extractor test PASSED!')
    
  } catch (error) {
    console.error('❌ Data extractor test FAILED:', error)
  }
}

// Run test
testDataExtractor().catch(console.error)
