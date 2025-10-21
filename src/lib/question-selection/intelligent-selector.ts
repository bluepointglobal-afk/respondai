import { ProductIntelligence, QuestionSelectionEngine } from '../product-intelligence/types'
import { QUESTION_BANKS } from '../question-banks'
import { QuestionTemplate } from '../frameworks/research-frameworks'

export class IntelligentQuestionSelector {
  private productIntelligence: ProductIntelligence
  
  constructor(productIntelligence: ProductIntelligence) {
    this.productIntelligence = productIntelligence
  }

  selectQuestions(): QuestionTemplate[] {
    const selectionEngine = this.buildSelectionEngine()
    const selectedQuestions = this.executeSelectionAlgorithm(selectionEngine)
    
    return this.customizeQuestions(selectedQuestions)
  }

  private buildSelectionEngine(): QuestionSelectionEngine {
    const productType = this.productIntelligence.core_attributes.product_type
    const targetCondition = this.productIntelligence.core_attributes.target_condition
    const claims = this.productIntelligence.claims
    
    return {
      inputs: {
        product_description: `${productType} for ${targetCondition}`,
        target_audience: this.productIntelligence.core_attributes.target_demographic.join(', '),
        validation_goals: this.productIntelligence.research_implications.must_validate,
        industry_category: productType,
        competitive_context: this.productIntelligence.competitive_intel.category_leaders.join(', ')
      },
      
      selection_algorithm: {
        product_attributes: {
          condition: targetCondition,
          ingredient: this.productIntelligence.core_attributes.primary_ingredient,
          format: this.productIntelligence.core_attributes.delivery_format,
          target_demographic: this.productIntelligence.core_attributes.target_demographic[0] || 'general',
          claims: claims.explicit_claims
        },
        
        priority_areas: {
          must_have: this.getMustHaveAreas(productType, targetCondition),
          high_priority: this.getHighPriorityAreas(productType, targetCondition),
          medium_priority: this.getMediumPriorityAreas(productType, targetCondition),
          low_priority: this.getLowPriorityAreas(productType, targetCondition)
        },
        
        question_selection: {
          from_each_area: 3,
          prioritize_by: 'relevance',
          max_total_questions: 85,
          target_completion_time: 22
        },
        
        customization: {
          replace_generic_terms: true,
          add_product_specific_options: true,
          adjust_for_target_audience: true,
          maintain_benchmark_compatibility: true
        }
      }
    }
  }

  private getMustHaveAreas(productType: string, condition: string): string[] {
    const baseAreas = ['condition_assessment', 'concept_evaluation', 'pricing_van_westendorp', 'demographics']
    
    const categorySpecificAreas = {
      'supplement': ['current_treatment', 'supplement_behavior', 'ingredient_perception'],
      'beverage': ['consumption_profile', 'energy_needs', 'functional_beverage_attitudes'],
      'saas': ['current_tools', 'pain_points', 'workflow_needs'],
      'beauty': ['skin_concerns', 'current_routine', 'ingredient_knowledge'],
      'food': ['eating_habits', 'dietary_preferences', 'nutrition_knowledge']
    }
    
    return [...baseAreas, ...(categorySpecificAreas[productType as keyof typeof categorySpecificAreas] || [])]
  }

  private getHighPriorityAreas(productType: string, condition: string): string[] {
    return [
      'brand_messaging',
      'competitive_context',
      'barriers_objections',
      'purchase_behavior',
      'feature_importance'
    ]
  }

  private getMediumPriorityAreas(productType: string, condition: string): string[] {
    return [
      'distribution_preferences',
      'subscription_model',
      'packaging_preferences',
      'educational_content'
    ]
  }

  private getLowPriorityAreas(productType: string, condition: string): string[] {
    return [
      'brand_personality',
      'community_interest',
      'bundle_opportunities',
      'loyalty_programs'
    ]
  }

  private executeSelectionAlgorithm(engine: QuestionSelectionEngine): QuestionTemplate[] {
    const selectedQuestions: QuestionTemplate[] = []
    const productType = this.productIntelligence.core_attributes.product_type
    
    // Get the appropriate question bank
    const questionBank = QUESTION_BANKS[productType as keyof typeof QUESTION_BANKS]
    if (!questionBank) {
      throw new Error(`No question bank found for product type: ${productType}`)
    }
    
    // Select questions from each priority area
    const priorityAreas = engine.selection_algorithm.priority_areas
    
    // Must-have areas (get all questions)
    priorityAreas.must_have.forEach(area => {
      const questions = questionBank.question_library[area] || []
      selectedQuestions.push(...questions.slice(0, 5)) // Limit to 5 per area
    })
    
    // High priority areas (get 3-4 questions each)
    priorityAreas.high_priority.forEach(area => {
      const questions = questionBank.question_library[area] || []
      selectedQuestions.push(...questions.slice(0, 4))
    })
    
    // Medium priority areas (get 2-3 questions each)
    priorityAreas.medium_priority.forEach(area => {
      const questions = questionBank.question_library[area] || []
      selectedQuestions.push(...questions.slice(0, 3))
    })
    
    // Low priority areas (get 1-2 questions each)
    priorityAreas.low_priority.forEach(area => {
      const questions = questionBank.question_library[area] || []
      selectedQuestions.push(...questions.slice(0, 2))
    })
    
    // Add essential survey structure questions
    selectedQuestions.push(...this.getEssentialSurveyQuestions())
    
    // Limit to max questions
    return selectedQuestions.slice(0, engine.selection_algorithm.max_total_questions)
  }

  private getEssentialSurveyQuestions(): QuestionTemplate[] {
    return [
      {
        id: 'screener_001',
        type: 'multiple-choice-single',
        text: 'Are you 18 years or older?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        skip_logic: {
          if: 'no',
          action: 'end_survey',
          message: 'Thank you for your interest. This survey is for adults 18 and older.'
        }
      },
      {
        id: 'concept_001',
        type: 'scale-1-10',
        text: 'How appealing is this product concept to you overall?',
        options: [
          { value: '1', label: 'Not at all appealing' },
          { value: '10', label: 'Extremely appealing' }
        ],
        analysis_tags: ['overall_appeal', 'primary_metric']
      },
      {
        id: 'concept_002',
        type: 'scale-1-10',
        text: 'How likely are you to purchase this product?',
        options: [
          { value: '1', label: 'Not at all likely' },
          { value: '10', label: 'Extremely likely' }
        ],
        analysis_tags: ['purchase_intent', 'primary_metric']
      },
      {
        id: 'concept_003',
        type: 'nps',
        text: 'How likely are you to recommend this product to a friend or colleague?',
        options: [
          { value: '0', label: '0 - Not at all likely' },
          { value: '10', label: '10 - Extremely likely' }
        ],
        analysis_tags: ['nps_score', 'primary_metric']
      },
      {
        id: 'concept_004',
        type: 'multiple-choice-single',
        text: 'How disappointed would you be if you could no longer use this product?',
        options: [
          { value: 'very_disappointed', label: 'Very disappointed' },
          { value: 'somewhat_disappointed', label: 'Somewhat disappointed' },
          { value: 'not_disappointed', label: 'Not disappointed' },
          { value: 'indifferent', label: 'Indifferent' }
        ],
        analysis_tags: ['product_market_fit', 'primary_metric']
      }
    ]
  }

  private customizeQuestions(questions: QuestionTemplate[]): QuestionTemplate[] {
    const productName = this.extractProductName()
    const targetCondition = this.productIntelligence.core_attributes.target_condition
    const primaryIngredient = this.productIntelligence.core_attributes.primary_ingredient[0]
    
    return questions.map(question => ({
      ...question,
      text: this.customizeQuestionText(question.text, {
        productName,
        targetCondition,
        primaryIngredient
      }),
      options: question.options?.map(option => ({
        ...option,
        label: this.customizeOptionText(option.label, {
          productName,
          targetCondition,
          primaryIngredient
        })
      }))
    }))
  }

  private extractProductName(): string {
    // Extract product name from claims or create a generic one
    const claims = this.productIntelligence.claims.explicit_claims
    if (claims.length > 0) {
      return claims[0].split(' ')[0] + ' Supplement' // Simple extraction
    }
    
    const ingredient = this.productIntelligence.core_attributes.primary_ingredient[0]
    const condition = this.productIntelligence.core_attributes.target_condition
    
    return `${ingredient} ${condition} Supplement`
  }

  private customizeQuestionText(text: string, context: any): string {
    let customizedText = text
    
    // Replace generic terms with product-specific terms
    customizedText = customizedText.replace(/this supplement/g, context.productName)
    customizedText = customizedText.replace(/this product/g, context.productName)
    customizedText = customizedText.replace(/joint pain/g, context.targetCondition)
    customizedText = customizedText.replace(/turmeric/g, context.primaryIngredient)
    
    return customizedText
  }

  private customizeOptionText(text: string, context: any): string {
    let customizedText = text
    
    // Customize option text based on context
    customizedText = customizedText.replace(/turmeric/g, context.primaryIngredient)
    customizedText = customizedText.replace(/joint pain/g, context.targetCondition)
    
    return customizedText
  }
}

export function generateComprehensiveSurvey(productDescription: string): QuestionTemplate[] {
  // Parse the product
  const parser = new (require('../product-intelligence/parser')).ProductParser()
  const productIntelligence = parser.parse(productDescription)
  
  // Select questions
  const selector = new IntelligentQuestionSelector(productIntelligence)
  const questions = selector.selectQuestions()
  
  return questions
}
