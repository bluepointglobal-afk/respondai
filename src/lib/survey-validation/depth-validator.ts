import { QuestionTemplate } from '../frameworks/research-frameworks'

export interface SurveyQualityMetrics {
  coverage_score: number // 0-100
  methodology_score: number // 0-100
  question_quality_score: number // 0-100
  overall_score: number // 0-100
  gaps_identified: string[]
  recommendations: string[]
}

export interface CoverageAnalysis {
  required_areas: string[]
  covered_areas: string[]
  missing_areas: string[]
  coverage_percentage: number
}

export class SurveyDepthValidator {
  private questions: QuestionTemplate[]
  private productType: string
  private targetCondition: string
  
  constructor(questions: QuestionTemplate[], productType: string, targetCondition: string) {
    this.questions = questions
    this.productType = productType
    this.targetCondition = targetCondition
  }

  validateSurvey(): SurveyQualityMetrics {
    const coverageAnalysis = this.analyzeCoverage()
    const methodologyScore = this.assessMethodology()
    const questionQualityScore = this.assessQuestionQuality()
    
    const overallScore = Math.round(
      (coverageAnalysis.coverage_percentage + methodologyScore + questionQualityScore) / 3
    )
    
    const gaps = this.identifyGaps(coverageAnalysis)
    const recommendations = this.generateRecommendations(gaps, coverageAnalysis)
    
    return {
      coverage_score: coverageAnalysis.coverage_percentage,
      methodology_score: methodologyScore,
      question_quality_score: questionQualityScore,
      overall_score: overallScore,
      gaps_identified: gaps,
      recommendations
    }
  }

  private analyzeCoverage(): CoverageAnalysis {
    const requiredAreas = this.getRequiredResearchAreas()
    const coveredAreas = this.getCoveredAreas()
    const missingAreas = requiredAreas.filter(area => !coveredAreas.includes(area))
    
    const coveragePercentage = Math.round(
      ((requiredAreas.length - missingAreas.length) / requiredAreas.length) * 100
    )
    
    return {
      required_areas: requiredAreas,
      covered_areas: coveredAreas,
      missing_areas: missingAreas,
      coverage_percentage: coveragePercentage
    }
  }

  private getRequiredResearchAreas(): string[] {
    const baseAreas = [
      'screener',
      'current_state',
      'category_behavior',
      'knowledge_assessment',
      'concept_evaluation',
      'feature_importance',
      'pricing',
      'brand_messaging',
      'competitive_context',
      'barriers_objections',
      'demographics'
    ]
    
    const categorySpecificAreas = this.getCategorySpecificAreas()
    
    return [...baseAreas, ...categorySpecificAreas]
  }

  private getCategorySpecificAreas(): string[] {
    const categoryAreas = {
      'supplement': [
        'current_treatment',
        'supplement_behavior',
        'ingredient_perception',
        'regulatory_concerns',
        'safety_profile',
        'dosing_preferences'
      ],
      'beverage': [
        'consumption_profile',
        'taste_preferences',
        'functional_benefits',
        'preparation_methods',
        'convenience_factors'
      ],
      'saas': [
        'current_tools',
        'pain_points',
        'workflow_needs',
        'integration_requirements',
        'security_concerns'
      ],
      'beauty': [
        'current_routine',
        'skin_concerns',
        'ingredient_knowledge',
        'brand_loyalty',
        'packaging_preferences'
      ]
    }
    
    return categoryAreas[this.productType as keyof typeof categoryAreas] || []
  }

  private getCoveredAreas(): string[] {
    const coveredAreas: string[] = []
    
    // Analyze question IDs to determine covered areas
    this.questions.forEach(question => {
      const area = this.extractAreaFromQuestionId(question.id)
      if (area && !coveredAreas.includes(area)) {
        coveredAreas.push(area)
      }
    })
    
    return coveredAreas
  }

  private extractAreaFromQuestionId(questionId: string): string | null {
    // Extract area from question ID patterns
    const patterns = {
      'supp_cond_': 'condition_assessment',
      'supp_treat_': 'current_treatment',
      'supp_behav_': 'supplement_behavior',
      'supp_ingr_': 'ingredient_perception',
      'supp_price_': 'pricing',
      'bev_cons_': 'consumption_profile',
      'bev_energy_': 'energy_needs',
      'bev_func_': 'functional_beverage_attitudes',
      'saas_tools_': 'current_tools',
      'saas_pain_': 'pain_points',
      'saas_workflow_': 'workflow_needs',
      'concept_': 'concept_evaluation',
      'screener_': 'screener',
      'demo_': 'demographics'
    }
    
    for (const [pattern, area] of Object.entries(patterns)) {
      if (questionId.startsWith(pattern)) {
        return area
      }
    }
    
    return null
  }

  private assessMethodology(): number {
    let score = 0
    const maxScore = 100
    
    // Check for Van Westendorp pricing (25 points)
    const hasVanWestendorp = this.questions.some(q => 
      q.id.includes('price_vw_') || q.text.toLowerCase().includes('too expensive')
    )
    if (hasVanWestendorp) score += 25
    
    // Check for MaxDiff (20 points)
    const hasMaxDiff = this.questions.some(q => q.type === 'maxdiff')
    if (hasMaxDiff) score += 20
    
    // Check for NPS (15 points)
    const hasNPS = this.questions.some(q => q.type === 'nps')
    if (hasNPS) score += 15
    
    // Check for Product-Market Fit question (15 points)
    const hasPMF = this.questions.some(q => 
      q.text.toLowerCase().includes('disappointed') && 
      q.text.toLowerCase().includes('couldn\'t use')
    )
    if (hasPMF) score += 15
    
    // Check for skip logic (10 points)
    const hasSkipLogic = this.questions.some(q => q.skip_logic)
    if (hasSkipLogic) score += 10
    
    // Check for open-ended questions (10 points)
    const hasOpenEnded = this.questions.some(q => 
      q.type === 'text-short' || q.type === 'text-long'
    )
    if (hasOpenEnded) score += 10
    
    // Check for matrix questions (5 points)
    const hasMatrix = this.questions.some(q => q.type.includes('matrix'))
    if (hasMatrix) score += 5
    
    return Math.min(score, maxScore)
  }

  private assessQuestionQuality(): number {
    let score = 0
    const maxScore = 100
    const totalQuestions = this.questions.length
    
    if (totalQuestions === 0) return 0
    
    // Check question length (20 points)
    const appropriateLength = this.questions.filter(q => 
      q.text.length >= 20 && q.text.length <= 150
    ).length
    score += (appropriateLength / totalQuestions) * 20
    
    // Check for balanced scales (20 points)
    const balancedScales = this.questions.filter(q => 
      this.hasBalancedScale(q)
    ).length
    score += (balancedScales / totalQuestions) * 20
    
    // Check for clear instructions (15 points)
    const clearInstructions = this.questions.filter(q => 
      q.text.includes('(Select all that apply)') || 
      q.text.includes('(Select one)') ||
      q.text.includes('scale of')
    ).length
    score += (clearInstructions / totalQuestions) * 15
    
    // Check for "Not applicable" options (15 points)
    const hasNAOptions = this.questions.filter(q => 
      q.options?.some(opt => 
        opt.label.toLowerCase().includes('not applicable') ||
        opt.label.toLowerCase().includes('prefer not to answer')
      )
    ).length
    score += (hasNAOptions / totalQuestions) * 15
    
    // Check for analysis tags (15 points)
    const hasAnalysisTags = this.questions.filter(q => 
      q.analysis_tags && q.analysis_tags.length > 0
    ).length
    score += (hasAnalysisTags / totalQuestions) * 15
    
    // Check for benchmarks (15 points)
    const hasBenchmarks = this.questions.filter(q => 
      q.benchmarks
    ).length
    score += (hasBenchmarks / totalQuestions) * 15
    
    return Math.min(score, maxScore)
  }

  private hasBalancedScale(question: QuestionTemplate): boolean {
    if (!question.options) return false
    
    const options = question.options.map(opt => opt.label.toLowerCase())
    
    // Check for balanced positive/negative options
    const positiveWords = ['excellent', 'very good', 'good', 'satisfied', 'likely', 'agree']
    const negativeWords = ['poor', 'very poor', 'bad', 'dissatisfied', 'unlikely', 'disagree']
    
    const hasPositive = options.some(opt => 
      positiveWords.some(word => opt.includes(word))
    )
    const hasNegative = options.some(opt => 
      negativeWords.some(word => opt.includes(word))
    )
    
    return hasPositive && hasNegative
  }

  private identifyGaps(coverageAnalysis: CoverageAnalysis): string[] {
    const gaps: string[] = []
    
    // Coverage gaps
    if (coverageAnalysis.missing_areas.length > 0) {
      gaps.push(`Missing research areas: ${coverageAnalysis.missing_areas.join(', ')}`)
    }
    
    // Methodology gaps
    const hasVanWestendorp = this.questions.some(q => 
      q.id.includes('price_vw_') || q.text.toLowerCase().includes('too expensive')
    )
    if (!hasVanWestendorp) {
      gaps.push('Missing Van Westendorp pricing methodology')
    }
    
    const hasMaxDiff = this.questions.some(q => q.type === 'maxdiff')
    if (!hasMaxDiff) {
      gaps.push('Missing MaxDiff feature prioritization')
    }
    
    const hasNPS = this.questions.some(q => q.type === 'nps')
    if (!hasNPS) {
      gaps.push('Missing Net Promoter Score (NPS) question')
    }
    
    // Question count gaps
    if (this.questions.length < 50) {
      gaps.push('Survey may be too short for comprehensive analysis')
    }
    
    if (this.questions.length > 100) {
      gaps.push('Survey may be too long, risking completion rates')
    }
    
    return gaps
  }

  private generateRecommendations(gaps: string[], coverageAnalysis: CoverageAnalysis): string[] {
    const recommendations: string[] = []
    
    // Coverage recommendations
    if (coverageAnalysis.missing_areas.length > 0) {
      recommendations.push(
        `Add questions covering: ${coverageAnalysis.missing_areas.slice(0, 3).join(', ')}`
      )
    }
    
    // Methodology recommendations
    if (!this.questions.some(q => q.id.includes('price_vw_'))) {
      recommendations.push('Add Van Westendorp pricing questions for optimal price point analysis')
    }
    
    if (!this.questions.some(q => q.type === 'maxdiff')) {
      recommendations.push('Add MaxDiff questions for feature prioritization')
    }
    
    if (!this.questions.some(q => q.type === 'nps')) {
      recommendations.push('Add NPS question for customer satisfaction measurement')
    }
    
    // Quality recommendations
    const questionsWithoutNA = this.questions.filter(q => 
      !q.options?.some(opt => 
        opt.label.toLowerCase().includes('not applicable')
      )
    )
    
    if (questionsWithoutNA.length > this.questions.length * 0.7) {
      recommendations.push('Add "Not applicable" options to more questions')
    }
    
    const questionsWithoutAnalysisTags = this.questions.filter(q => 
      !q.analysis_tags || q.analysis_tags.length === 0
    )
    
    if (questionsWithoutAnalysisTags.length > this.questions.length * 0.5) {
      recommendations.push('Add analysis tags to questions for better insights')
    }
    
    // Length recommendations
    if (this.questions.length < 60) {
      recommendations.push('Consider adding more questions for deeper insights')
    }
    
    if (this.questions.length > 90) {
      recommendations.push('Consider shortening survey to improve completion rates')
    }
    
    return recommendations.slice(0, 5) // Limit to top 5 recommendations
  }
}

export function validateSurveyDepth(
  questions: QuestionTemplate[], 
  productType: string, 
  targetCondition: string
): SurveyQualityMetrics {
  const validator = new SurveyDepthValidator(questions, productType, targetCondition)
  return validator.validateSurvey()
}
