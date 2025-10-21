import { QuestionTemplate } from '../frameworks/research-frameworks'

export const SURVEY_GENERATION_MASTER_PROMPT = `
You are an elite market research consultant with 20+ years of experience designing surveys for Fortune 500 brands. You have deep expertise across all product categories and always follow research best practices.

YOUR TASK:
Generate a comprehensive, industry-leading survey for the following product validation project.

PRODUCT CONTEXT:
Product: {product_name}
Description: {product_description}
Target Audience: {target_audience}
Validation Goals: {validation_goals}
Industry: {industry}
Competitive Context: {competitors}

STEP 1: DEEPLY UNDERSTAND THE PRODUCT
Parse the product description and identify:
- Product category and sub-category
- Primary and secondary ingredients/features
- Target condition or use case
- Target demographic characteristics
- Explicit and implied claims
- Positioning (premium, value, mass market)
- Competitive differentiation
- Regulatory considerations

STEP 2: DETERMINE RESEARCH PRIORITIES
Based on the product, identify what MUST be validated:
- Category-specific considerations
- Unique product attributes
- Target audience behaviors
- Competitive dynamics
- Purchase barriers specific to this category
- Regulatory or safety concerns

STEP 3: DESIGN COMPREHENSIVE SURVEY
Create a survey that covers ALL necessary angles:

REQUIRED SECTIONS:
1. Screener (qualify respondents)
2. Current State (pain points, current solutions)
3. Category Behavior (usage patterns, preferences)
4. Knowledge Assessment (awareness of key ingredients/features)
5. Concept Presentation (show product clearly)
6. Concept Evaluation (purchase intent, uniqueness, fit)
7. Feature Importance (MaxDiff or ranking)
8. Pricing (Van Westendorp + value perception)
9. Brand & Messaging (message testing)
10. Competitive Context (alternatives, switching)
11. Barriers & Objections (what prevents purchase)
12. Demographics (for segmentation)

QUESTION QUALITY STANDARDS:
- Clear, simple language (8th grade reading level)
- One concept per question
- Balanced scales
- Avoid leading language
- Include "Not applicable" options
- Use validated scales (NPS, Likert, etc.)
- Randomize options where appropriate

METHODOLOGY REQUIREMENTS:
- Include Van Westendorp pricing (4 price questions)
- Include MaxDiff for feature prioritization
- Include NPS question
- Include Product-Market Fit question ("How disappointed if couldn't use?")
- Include open-ended questions for qualitative insights
- Use skip logic to personalize experience

TARGET SPECIFICATIONS:
- 70-90 questions total
- 18-24 minutes completion time
- Balance quantitative and qualitative questions
- Ensure statistical validity for key metrics

CATEGORY-SPECIFIC DEPTH:
For this specific product category, ensure you cover:
- [AI should list 10-15 category-specific must-haves based on product analysis]

OUTPUT FORMAT:
Return a JSON object with complete survey structure including:
- All questions with proper types
- Skip logic where appropriate
- Validation rules
- Analysis tagging
- Rationale for each section

Remember: This survey will inform a major investment decision. It must be comprehensive, unbiased, and actionable.
`

export interface SurveyGenerationContext {
  product_name: string
  product_description: string
  target_audience: string
  validation_goals: string[]
  industry: string
  competitors: string[]
}

export class MasterAIPromptBuilder {
  private context: SurveyGenerationContext
  
  constructor(context: SurveyGenerationContext) {
    this.context = context
  }

  buildPrompt(): string {
    let prompt = SURVEY_GENERATION_MASTER_PROMPT
    
    // Replace placeholders with actual context
    prompt = prompt.replace('{product_name}', this.context.product_name)
    prompt = prompt.replace('{product_description}', this.context.product_description)
    prompt = prompt.replace('{target_audience}', this.context.target_audience)
    prompt = prompt.replace('{validation_goals}', this.context.validation_goals.join(', '))
    prompt = prompt.replace('{industry}', this.context.industry)
    prompt = prompt.replace('{competitors}', this.context.competitors.join(', '))
    
    // Add category-specific requirements
    prompt += this.addCategorySpecificRequirements()
    
    return prompt
  }

  private addCategorySpecificRequirements(): string {
    const industry = this.context.industry.toLowerCase()
    
    const categoryRequirements = {
      'supplement': `
SUPPLEMENT-SPECIFIC REQUIREMENTS:
- Must assess current supplement usage patterns
- Must evaluate ingredient knowledge and trust
- Must test regulatory compliance awareness
- Must measure safety concerns
- Must assess dosing preferences
- Must evaluate certification importance (GMP, third-party tested)
- Must test natural vs pharmaceutical preference
- Must assess doctor recommendation importance
- Must measure side effect concerns
- Must test subscription vs one-time purchase
- Must evaluate brand trust factors
- Must assess information source preferences
- Must test money-back guarantee importance
- Must measure price sensitivity vs quality trade-offs
- Must assess switching barriers from current supplements`,

      'beverage': `
BEVERAGE-SPECIFIC REQUIREMENTS:
- Must assess current beverage consumption patterns
- Must evaluate taste preferences and expectations
- Must test functional benefit believability
- Must measure caffeine sensitivity
- Must assess preparation method preferences
- Must evaluate convenience vs quality trade-offs
- Must test temperature preferences
- Must assess packaging preferences
- Must measure brand vs generic preference
- Must test subscription delivery interest
- Must evaluate freshness and shelf-life concerns
- Must assess mixing preferences
- Must test seasonal consumption patterns
- Must measure social consumption factors
- Must assess health consciousness correlation`,

      'saas': `
SAAS-SPECIFIC REQUIREMENTS:
- Must assess current software tool usage
- Must evaluate integration needs
- Must test learning curve tolerance
- Must measure feature complexity preferences
- Must assess pricing model preferences (per user, per month, etc.)
- Must test free trial vs freemium preference
- Must evaluate customer support importance
- Must measure security and compliance concerns
- Must assess mobile vs desktop usage
- Must test collaboration features importance
- Must evaluate data export capabilities
- Must measure customization needs
- Must test onboarding experience preferences
- Must assess vendor lock-in concerns
- Must evaluate ROI measurement needs`,

      'beauty': `
BEAUTY-SPECIFIC REQUIREMENTS:
- Must assess current skincare routine
- Must evaluate ingredient knowledge and concerns
- Must test skin type and sensitivity
- Must measure brand loyalty factors
- Must assess packaging and application preferences
- Must test natural vs synthetic ingredient preference
- Must evaluate price vs efficacy trade-offs
- Must measure seasonal usage patterns
- Must assess age-specific concerns
- Must test dermatologist recommendation importance
- Must evaluate cruelty-free and ethical considerations
- Must measure social media influence
- Must assess subscription vs retail preference
- Must test sample and trial interest
- Must evaluate results timeline expectations`
    }
    
    return categoryRequirements[industry as keyof typeof categoryRequirements] || ''
  }
}

export function buildSurveyGenerationPrompt(context: SurveyGenerationContext): string {
  const builder = new MasterAIPromptBuilder(context)
  return builder.buildPrompt()
}
