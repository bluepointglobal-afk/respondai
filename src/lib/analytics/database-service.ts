/**
 * ROBUST DATABASE SERVICE
 * Handles all database operations with proper error handling and transactions
 */

import { prisma } from '../db'
import { 
  ProductInfo, 
  ComprehensiveAnalysisResult, 
  DatabaseAnalysis, 
  DatabasePersona,
  DatabaseError,
  AnalysisError
} from './types'
import { 
  validateDatabaseAnalysis, 
  validateDatabasePersonas
} from './validation'

function createDatabaseError(message: string, operation: string, details?: any): DatabaseError {
  return new DatabaseError(message, operation, details)
}

/**
 * Create a new test with comprehensive product information
 */
export async function createTest(
  productInfo: ProductInfo,
  userId: string
): Promise<string> {
  try {
    console.log(`📝 Creating test for: ${productInfo.name}`)
    console.log(`📝 User ID: ${userId}`)
    
    const test = await prisma.test.create({
      data: {
        name: `${productInfo.name} Analysis`,
        status: 'COMPLETED',
        userId,
        productInfo: {
          name: productInfo.name,
          description: productInfo.description,
          industry: productInfo.industry,
          targetAudience: productInfo.targetAudience,
          problemStatement: productInfo.problemStatement,
          solutionStatement: productInfo.solutionStatement,
          uniqueValue: productInfo.uniqueValue,
          priceRange: productInfo.priceRange,
          brandValues: productInfo.brandValues,
          companyStory: productInfo.companyStory,
          companyName: productInfo.companyName
        },
        validationGoals: {
          audience: true,
          problem: true,
          solution: true,
          pricing: true,
          brand: true
        }
      }
    })
    
    console.log(`✅ Test created with ID: ${test.id}`)
    return test.id
    
  } catch (error) {
    console.error('❌ Failed to create test:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      productInfo: productInfo.name,
      userId
    })
    throw createDatabaseError(
      'Failed to create test record',
      'CREATE_TEST',
      { productInfo: productInfo.name, userId, error: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

/**
 * Create analysis record with comprehensive validation
 */
export async function createAnalysis(
  testId: string,
  analysis: ComprehensiveAnalysisResult
): Promise<void> {
  try {
    console.log(`📊 Creating analysis for test: ${testId}`)
    
    // Validate the analysis data
    const validation = validateDatabaseAnalysis(analysis, testId)
    if (!validation.success) {
      throw new AnalysisError(
        'Analysis validation failed',
        'VALIDATION_FAILED',
        { errors: validation.errors, warnings: validation.warnings }
      )
    }
    
    const dbAnalysis = validation.data
    
    await prisma.analysis.create({
      data: {
        testId: dbAnalysis.testId,
        purchaseIntent: dbAnalysis.purchaseIntent,
        patterns: dbAnalysis.patterns,
        culturalRisks: dbAnalysis.culturalRisks,
        segments: dbAnalysis.segments,
        insights: dbAnalysis.insights,
        executiveSummary: dbAnalysis.executiveSummary,
        keyFindings: dbAnalysis.keyFindings,
        sampleSize: dbAnalysis.sampleSize,
        dataMode: dbAnalysis.dataMode,
        confidence: dbAnalysis.confidence,
        shouldLaunch: dbAnalysis.shouldLaunch,
        launchConfidence: dbAnalysis.launchConfidence,
        launchReasoning: dbAnalysis.launchReasoning
      }
    })
    
    console.log(`✅ Analysis created for test: ${testId}`)
    
  } catch (error) {
    console.error('Failed to create analysis:', error)
    throw createDatabaseError(
      'Failed to create analysis record',
      'CREATE_ANALYSIS',
      { testId, error: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

/**
 * Create personas with comprehensive validation
 */
export async function createPersonas(
  analysisId: string,
  personas: any[]
): Promise<void> {
  try {
    console.log(`👥 Creating ${personas.length} personas for analysis: ${analysisId}`)
    console.log('Personas data:', JSON.stringify(personas, null, 2))
    
    // Validate the personas data
    const validation = validateDatabasePersonas(personas, analysisId)
    if (!validation.success) {
      console.error('Personas validation failed:', validation.errors)
      throw new AnalysisError(
        'Personas validation failed',
        'VALIDATION_FAILED',
        { errors: validation.errors, warnings: validation.warnings }
      )
    }
    
    const dbPersonas = validation.data
    console.log('Validated personas:', JSON.stringify(dbPersonas, null, 2))
    
    // Create personas in batch
    await Promise.all(
      dbPersonas.map(persona => 
        prisma.persona.create({ data: persona })
      )
    )
    
    console.log(`✅ Created ${dbPersonas.length} personas for analysis: ${analysisId}`)
    
    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Persona creation warnings:', validation.warnings)
    }
    
  } catch (error) {
    console.error('❌ Failed to create personas:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      analysisId,
      personaCount: personas.length
    })
    throw createDatabaseError(
      'Failed to create personas',
      'CREATE_PERSONAS',
      { analysisId, personaCount: personas.length, error: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

/**
 * Get or create demo user
 */
export async function getOrCreateDemoUser(): Promise<string> {
  try {
    let user = await prisma.user.findUnique({
      where: { email: 'demo@respondai.com' }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo@respondai.com',
          name: 'Demo User'
        }
      })
      console.log(`✅ Created demo user: ${user.id}`)
    } else {
      console.log(`✅ Found existing demo user: ${user.id}`)
    }
    
    return user.id
    
  } catch (error) {
    console.error('Failed to get or create demo user:', error)
    throw createDatabaseError(
      'Failed to get or create demo user',
      'GET_CREATE_USER',
      { error: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

/**
 * Get analysis results by test ID
 */
export async function getAnalysisResults(testId: string) {
  try {
    console.log(`📊 Fetching analysis results for test: ${testId}`)
    
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        analysis: true,
        personas: true
      }
    })
    
    if (!test) {
      throw createDatabaseError(
        'Test not found',
        'TEST_NOT_FOUND',
        { testId }
      )
    }
    
    if (!test.analysis) {
      return {
        test: {
          id: test.id,
          name: test.name,
          status: test.status,
          productInfo: test.productInfo
        },
        analysis: null,
        hasResults: false,
        message: 'No analysis available. Please run analysis first.'
      }
    }
    
    console.log(`✅ Found analysis results for test: ${testId}`)
    
    return {
      test: {
        id: test.id,
        name: test.name,
        status: test.status,
        productInfo: test.productInfo
      },
      analysis: test.analysis,
      personas: test.personas,
      hasResults: true,
      message: 'Analysis results loaded successfully'
    }
    
  } catch (error) {
    console.error('Failed to get analysis results:', error)
    throw createDatabaseError(
      'Failed to get analysis results',
      'GET_ANALYSIS_RESULTS',
      { testId, error: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

/**
 * Execute database operations in a transaction
 */
export async function executeInTransaction<T>(
  operations: (tx: any) => Promise<T>
): Promise<T> {
  try {
    console.log('🔄 Starting database transaction...')
    const result = await prisma.$transaction(operations)
    console.log('✅ Database transaction completed successfully')
    return result
  } catch (error) {
    console.error('❌ Transaction failed:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw createDatabaseError(
      'Database transaction failed',
      'TRANSACTION_FAILED',
      { error: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}
