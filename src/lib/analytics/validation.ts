/**
 * ROBUST DATA VALIDATION LAYER
 * Comprehensive validation for all data flows
 */

import { 
  ProductInfo, 
  ComprehensiveAnalysisResult, 
  DatabaseAnalysis, 
  DatabasePersona,
  ValidationResult,
  ValidationError,
  AnalysisError
} from './types'

// ============================================
// PRODUCT INFO VALIDATION
// ============================================

export function validateProductInfo(data: any): ValidationResult<ProductInfo> {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data || typeof data !== 'object') {
    errors.push('Product info must be an object')
    return { success: false, errors, warnings }
  }

  // Required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string')
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Product description is required and must be a non-empty string')
  }

  if (!data.industry || typeof data.industry !== 'string' || data.industry.trim().length === 0) {
    errors.push('Industry is required and must be a non-empty string')
  }

  if (!data.targetAudience || typeof data.targetAudience !== 'string' || data.targetAudience.trim().length === 0) {
    errors.push('Target audience is required and must be a non-empty string')
  }

  // Optional fields validation
  if (data.priceRange) {
    if (!data.priceRange.min || typeof data.priceRange.min !== 'number' || data.priceRange.min < 0) {
      errors.push('Price range minimum must be a non-negative number')
    }
    if (!data.priceRange.max || typeof data.priceRange.max !== 'number' || data.priceRange.max < 0) {
      errors.push('Price range maximum must be a non-negative number')
    }
    if (data.priceRange.min && data.priceRange.max && data.priceRange.min > data.priceRange.max) {
      errors.push('Price range minimum cannot be greater than maximum')
    }
  }

  if (data.brandValues && !Array.isArray(data.brandValues)) {
    errors.push('Brand values must be an array')
  }

  // Warnings for missing optional fields
  if (!data.uniqueValue) {
    warnings.push('Unique value proposition is missing - this will affect analysis quality')
  }

  if (!data.problemStatement) {
    warnings.push('Problem statement is missing - this will affect analysis quality')
  }

  if (!data.brandValues || data.brandValues.length === 0) {
    warnings.push('Brand values are missing - this will affect brand positioning analysis')
  }

  if (errors.length > 0) {
    return { success: false, errors, warnings }
  }

  return {
    success: true,
    data: {
      name: data.name.trim(),
      description: data.description.trim(),
      industry: data.industry.trim(),
      targetAudience: data.targetAudience.trim(),
      problemStatement: data.problemStatement?.trim(),
      solutionStatement: data.solutionStatement?.trim(),
      uniqueValue: data.uniqueValue?.trim(),
      priceRange: data.priceRange,
      brandValues: data.brandValues,
      companyStory: data.companyStory?.trim(),
      companyName: data.companyName?.trim()
    },
    errors,
    warnings
  }
}

// ============================================
// AI ANALYSIS VALIDATION
// ============================================

export function validateAnalysisResult(data: any): ValidationResult<ComprehensiveAnalysisResult> {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data || typeof data !== 'object') {
    errors.push('Analysis result must be an object')
    return { success: false, errors, warnings }
  }

  // Validate executive summary
  if (!data.executiveSummary || typeof data.executiveSummary !== 'object') {
    errors.push('Executive summary is required')
  } else {
    const summary = data.executiveSummary
    if (typeof summary.shouldLaunch !== 'boolean') {
      errors.push('Executive summary shouldLaunch must be a boolean')
    }
    if (typeof summary.confidence !== 'number' || summary.confidence < 0 || summary.confidence > 100) {
      errors.push('Executive summary confidence must be a number between 0 and 100')
    }
    if (!summary.oneLineSummary || typeof summary.oneLineSummary !== 'string') {
      errors.push('Executive summary oneLineSummary is required and must be a string')
    }
    if (!summary.keyFindingHighlight || typeof summary.keyFindingHighlight !== 'string') {
      errors.push('Executive summary keyFindingHighlight is required and must be a string')
    }
  }

  // Validate key metrics
  if (!data.keyMetrics || typeof data.keyMetrics !== 'object') {
    errors.push('Key metrics are required')
  } else {
    const metrics = data.keyMetrics
    const requiredMetrics = ['purchaseIntent', 'optimalPrice', 'topBenefit', 'brandFit']
    
    for (const metric of requiredMetrics) {
      if (!metrics[metric] || typeof metrics[metric] !== 'object') {
        errors.push(`${metric} metric is required`)
      } else {
        const metricData = metrics[metric]
        if (typeof metricData.value === 'undefined') {
          errors.push(`${metric} metric value is required`)
        }
        if (typeof metricData.subtitle !== 'string') {
          errors.push(`${metric} metric subtitle must be a string`)
        }
        if (typeof metricData.n !== 'number' || metricData.n < 0) {
          errors.push(`${metric} metric n must be a non-negative number`)
        }
        if (!metricData.distribution || typeof metricData.distribution !== 'object') {
          errors.push(`${metric} metric distribution is required`)
        }
      }
    }
  }

  // Validate arrays
  const arrayFields = ['insights', 'patterns', 'personas', 'risks']
  for (const field of arrayFields) {
    if (!Array.isArray(data[field])) {
      errors.push(`${field} must be an array`)
    }
  }

  // Validate recommendations and nextSteps
  const objectFields = ['recommendations', 'nextSteps']
  for (const field of objectFields) {
    if (!data[field] || typeof data[field] !== 'object') {
      errors.push(`${field} must be an object`)
    } else {
      const obj = data[field]
      const requiredKeys = ['immediate', 'nearTerm', 'longTerm']
      for (const key of requiredKeys) {
        if (!Array.isArray(obj[key])) {
          errors.push(`${field}.${key} must be an array`)
        }
      }
    }
  }

  // Warnings for empty arrays
  if (Array.isArray(data.insights) && data.insights.length === 0) {
    warnings.push('No insights generated - this may indicate an issue with the analysis')
  }
  if (Array.isArray(data.patterns) && data.patterns.length === 0) {
    warnings.push('No patterns detected - this may indicate an issue with the analysis')
  }
  if (Array.isArray(data.personas) && data.personas.length === 0) {
    warnings.push('No personas generated - this may indicate an issue with the analysis')
  }

  if (errors.length > 0) {
    return { success: false, errors, warnings }
  }

  return {
    success: true,
    data: data as ComprehensiveAnalysisResult,
    errors,
    warnings
  }
}

// ============================================
// DATABASE MAPPING VALIDATION
// ============================================

export function validateDatabaseAnalysis(
  analysis: ComprehensiveAnalysisResult, 
  testId: string
): ValidationResult<DatabaseAnalysis> {
  const errors: string[] = []
  const warnings: string[] = []

  if (!testId || typeof testId !== 'string') {
    errors.push('Test ID is required and must be a string')
  }

  if (!analysis) {
    errors.push('Analysis data is required')
    return { success: false, errors, warnings }
  }

  // Validate purchase intent data
  const purchaseIntent = analysis.keyMetrics?.purchaseIntent
  if (!purchaseIntent) {
    errors.push('Purchase intent data is missing from key metrics')
  } else {
    if (typeof purchaseIntent.value !== 'number') {
      errors.push('Purchase intent value must be a number')
    }
    if (!purchaseIntent.distribution || typeof purchaseIntent.distribution !== 'object') {
      errors.push('Purchase intent distribution is required')
    }
  }

  // Validate patterns mapping
  const patterns = analysis.patterns || []
  for (const pattern of patterns) {
    if (!pattern.title) {
      errors.push('Pattern title is required')
    }
    if (!Array.isArray(pattern.segments)) {
      errors.push('Pattern segments must be an array')
    } else {
      for (const segment of pattern.segments) {
        if (typeof segment.name !== 'string') {
          errors.push('Pattern segment name must be a string')
        }
        if (typeof segment.size !== 'number') {
          errors.push('Pattern segment size must be a number')
        }
      }
    }
  }

  // Validate insights mapping
  const insights = analysis.insights || []
  for (const insight of insights) {
    if (!insight.headline) {
      errors.push('Insight headline is required')
    }
  }

  if (errors.length > 0) {
    return { success: false, errors, warnings }
  }

  const dbAnalysis: DatabaseAnalysis = {
    testId,
    purchaseIntent: {
      avgIntent: purchaseIntent?.value || 0,
      distribution: purchaseIntent?.distribution || {},
      confidence: analysis.executiveSummary?.confidence || 85
    },
    patterns: analysis.patterns || [],
    culturalRisks: (analysis.risks || []).filter(r => r.type === 'market'),
    segments: (analysis.patterns || []).map(p => ({
      name: p.title || 'Unknown Segment',
      size: p.segments?.reduce((sum, s) => sum + (s?.size || 0), 0) || 0,
      intent: p.segments?.reduce((sum, s) => sum + (s?.purchaseIntent || 0), 0) / (p.segments?.length || 1) || 0,
      confidence: p.confidence || 0
    })),
    insights: analysis.insights || [],
    executiveSummary: {
      shouldLaunch: analysis.executiveSummary?.shouldLaunch ?? true,
      confidence: analysis.executiveSummary?.confidence ?? 85,
      keyFindings: (analysis.insights || []).slice(0, 3).map(i => i.headline).filter(h => h)
    },
    keyFindings: (analysis.insights || []).slice(0, 5).filter(i => i.headline),
    sampleSize: purchaseIntent?.n || 500,
    dataMode: 'ai-generated',
    confidence: analysis.executiveSummary?.confidence ?? 85,
    shouldLaunch: analysis.executiveSummary?.shouldLaunch ?? true,
    launchConfidence: analysis.executiveSummary?.confidence ?? 85,
    launchReasoning: analysis.executiveSummary?.oneLineSummary ?? 'Analysis complete'
  }

  return {
    success: true,
    data: dbAnalysis,
    errors,
    warnings
  }
}

export function validateDatabasePersonas(
  personas: any[], 
  analysisId: string
): ValidationResult<DatabasePersona[]> {
  const errors: string[] = []
  const warnings: string[] = []

  if (!analysisId || typeof analysisId !== 'string') {
    errors.push('Analysis ID is required and must be a string')
  }

  if (!Array.isArray(personas)) {
    errors.push('Personas must be an array')
    return { success: false, errors, warnings }
  }

  const dbPersonas: DatabasePersona[] = []

  for (const [index, persona] of personas.entries()) {
    const personaErrors: string[] = []
    const personaWarnings: string[] = []

    // Validate required fields
    if (!persona.name || typeof persona.name !== 'string') {
      personaErrors.push(`Persona ${index + 1}: name is required`)
    }
    if (!persona.title || typeof persona.title !== 'string') {
      personaErrors.push(`Persona ${index + 1}: title is required`)
    }

    // Validate age parsing
    let age = 30
    if (persona.age && typeof persona.age === 'string') {
      const ageMatch = persona.age.match(/(\d+)/)
      if (ageMatch) {
        age = parseInt(ageMatch[1])
      } else {
        personaWarnings.push(`Persona ${index + 1}: could not parse age from "${persona.age}", using default 30`)
      }
    } else {
      personaWarnings.push(`Persona ${index + 1}: age not provided, using default 30`)
    }

    if (personaErrors.length === 0) {
      dbPersonas.push({
        analysisId,
        name: persona.name || 'Unknown Persona',
        avatar: persona.icon || '👤',
        age,
        archetype: persona.title || 'Unknown Archetype',
        demographics: {
          age: persona.age || 'Unknown',
          income: persona.income || 'Unknown',
          location: persona.location || 'Unknown'
        },
        surveyData: {
          purchaseIntent: persona.purchaseIntent || 0,
          priceSensitivity: persona.priceSensitivity || 0,
          preferredChannels: persona.preferredChannels || [],
          concerns: persona.concerns || []
        },
        psychographics: {
          values: persona.psychographics || 'Unknown',
          motivations: persona.topBenefits || [],
          lifestyle: 'Health-conscious professional'
        },
        personality: {
          traits: ['Health-conscious', 'Busy', 'Professional'],
          speakingStyle: 'Direct and health-focused',
          tone: 'Professional yet approachable'
        },
        systemPrompt: `You are ${persona.name || 'Unknown Persona'}, a ${persona.title || 'health-conscious professional'}. You are ${persona.psychographics || 'focused on wellness and convenience'}. Your main concerns are: ${(persona.concerns || []).join(', ') || 'effectiveness and value'}.`
      })
    } else {
      errors.push(...personaErrors)
    }

    warnings.push(...personaWarnings)
  }

  if (errors.length > 0) {
    return { success: false, errors, warnings }
  }

  return {
    success: true,
    data: dbPersonas,
    errors,
    warnings
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function createValidationError(field: string, message: string, value?: any): ValidationError {
  return new ValidationError(message, field, value)
}

export function createAnalysisError(message: string, code: string, details?: any): AnalysisError {
  return new AnalysisError(message, code, details)
}

export function sanitizeString(input: any): string {
  if (typeof input === 'string') {
    return input.trim()
  }
  if (typeof input === 'number') {
    return input.toString()
  }
  return ''
}

export function sanitizeNumber(input: any, defaultValue: number = 0): number {
  if (typeof input === 'number' && !isNaN(input)) {
    return input
  }
  if (typeof input === 'string') {
    const parsed = parseFloat(input)
    if (!isNaN(parsed)) {
      return parsed
    }
  }
  return defaultValue
}

export function sanitizeArray<T>(input: any, defaultValue: T[] = []): T[] {
  if (Array.isArray(input)) {
    return input
  }
  return defaultValue
}
