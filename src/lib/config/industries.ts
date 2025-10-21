/**
 * INDUSTRY-AGNOSTIC CONFIGURATION SYSTEM
 * Supports any product category with custom attributes
 */

export type IndustryCategory = 
  | 'health-wellness'
  | 'food-beverage'
  | 'beauty-personal-care'
  | 'technology'
  | 'fashion-apparel'
  | 'home-garden'
  | 'sports-fitness'
  | 'education'
  | 'services'
  | 'saas-software'
  | 'b2b-services'
  | 'custom'

export interface IndustryConfig {
  category: IndustryCategory
  name: string
  icon: string
  description: string
  
  // Dynamic attributes that vary by industry
  benefits: string[]
  motivations: string[]
  concerns: string[]
  formats?: string[] // For physical products
  deliveryMethods?: string[] // For services/digital
  pricingModels: string[]
  
  // Industry-specific questions (optional)
  customQuestions?: string[]
  
  // Demographic biases (optional)
  targetDemographics?: {
    primaryAge?: string[]
    typicalIncome?: string[]
    preferredLocation?: string[]
  }
}

/**
 * PRE-CONFIGURED INDUSTRY TEMPLATES
 * Zero hardcoded assumptions - everything is configurable
 */
export const INDUSTRY_CONFIGS: Record<IndustryCategory, IndustryConfig> = {
  'health-wellness': {
    category: 'health-wellness',
    name: 'Health & Wellness',
    icon: '🏥',
    description: 'Supplements, vitamins, natural remedies, health products',
    benefits: [
      'Fast-Acting',
      'Natural Ingredients',
      'Clinically Tested',
      'Doctor Recommended',
      'No Side Effects',
      'Great Taste',
      'Easy to Use',
      'Trusted Brand',
    ],
    motivations: [
      'Improve overall health',
      'Reduce stress/anxiety',
      'Better sleep',
      'More energy',
      'Weight management',
      'Immune support',
      'Pain relief',
      'Mental clarity',
    ],
    concerns: [
      'Effectiveness',
      'Side effects',
      'Ingredients quality',
      'Scientific backing',
      'Price',
      'Drug interactions',
    ],
    formats: ['Gummies', 'Capsules', 'Powder', 'Liquid', 'Tablets'],
    pricingModels: ['One-time purchase', 'Subscribe & Save', 'Bundle'],
    targetDemographics: {
      primaryAge: ['25-34', '35-44', '45-54'],
      typicalIncome: ['$50-75K', '$75-100K', '$100-150K'],
    },
  },

  'food-beverage': {
    category: 'food-beverage',
    name: 'Food & Beverage',
    icon: '🍽️',
    description: 'Food products, beverages, snacks, meal kits',
    benefits: [
      'Great Taste',
      'Organic/Natural',
      'Healthy/Nutritious',
      'Convenient',
      'Affordable',
      'Sustainable Packaging',
      'Unique Flavor',
      'High Quality Ingredients',
    ],
    motivations: [
      'Better nutrition',
      'Convenience',
      'Taste preference',
      'Dietary restrictions',
      'Support local/ethical brands',
      'Try something new',
      'Health goals',
    ],
    concerns: [
      'Taste',
      'Price',
      'Ingredients',
      'Allergens',
      'Availability',
      'Freshness',
    ],
    formats: ['Ready-to-drink', 'Ready-to-eat', 'Requires preparation', 'Meal kit'],
    pricingModels: ['One-time purchase', 'Subscription box', 'Bulk discount'],
  },

  'beauty-personal-care': {
    category: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    icon: '💄',
    description: 'Skincare, cosmetics, haircare, personal care products',
    benefits: [
      'Visible Results',
      'Natural/Clean Ingredients',
      'Dermatologist Tested',
      'Cruelty-Free',
      'Suitable for Sensitive Skin',
      'Luxurious Feel',
      'Long-Lasting',
      'Multi-Purpose',
    ],
    motivations: [
      'Look better/younger',
      'Feel confident',
      'Address skin concerns',
      'Self-care routine',
      'Recommended by friend/influencer',
      'Natural/clean beauty preference',
    ],
    concerns: [
      'Skin reactions',
      'Effectiveness',
      'Ingredients safety',
      'Price',
      'Ethical practices',
      'Results timeline',
    ],
    formats: ['Cream/Lotion', 'Serum', 'Oil', 'Mask', 'Spray', 'Bar'],
    pricingModels: ['One-time', 'Subscription', 'Refill program'],
  },

  'technology': {
    category: 'technology',
    name: 'Technology & Electronics',
    icon: '📱',
    description: 'Gadgets, electronics, smart devices, consumer tech',
    benefits: [
      'Cutting-Edge Features',
      'Easy to Use',
      'Reliable',
      'Fast Performance',
      'Good Battery Life',
      'Great Design',
      'Good Value',
      'Excellent Support',
    ],
    motivations: [
      'Upgrade existing device',
      'Need for work/productivity',
      'Entertainment',
      'Stay current with technology',
      'Recommendation',
      'Specific feature need',
    ],
    concerns: [
      'Price',
      'Compatibility',
      'Learning curve',
      'Durability',
      'Support/warranty',
      'Privacy/security',
    ],
    formats: ['Physical device', 'Smart device', 'Accessory', 'Bundle'],
    pricingModels: ['One-time purchase', 'Financing', 'Trade-in program'],
  },

  'saas-software': {
    category: 'saas-software',
    name: 'SaaS & Software',
    icon: '💻',
    description: 'Software as a Service, web apps, productivity tools',
    benefits: [
      'Easy to Use',
      'Saves Time',
      'Great Support',
      'Integrations',
      'Scalable',
      'Secure',
      'Mobile Access',
      'Customizable',
    ],
    motivations: [
      'Increase productivity',
      'Save time',
      'Better collaboration',
      'Replace outdated tool',
      'Scale business',
      'Improve workflow',
    ],
    concerns: [
      'Learning curve',
      'Price',
      'Data security',
      'Integration with existing tools',
      'Migration difficulty',
      'Contract lock-in',
    ],
    deliveryMethods: ['Web-based', 'Desktop app', 'Mobile app', 'API'],
    pricingModels: [
      'Free tier',
      'Monthly subscription', 
      'Annual subscription',
      'Usage-based',
      'Per-seat pricing',
      'Enterprise custom',
    ],
  },

  'fashion-apparel': {
    category: 'fashion-apparel',
    name: 'Fashion & Apparel',
    icon: '👗',
    description: 'Clothing, accessories, footwear, fashion items',
    benefits: [
      'Stylish',
      'Comfortable',
      'High Quality',
      'Affordable',
      'Sustainable',
      'Versatile',
      'Perfect Fit',
      'Trendy',
    ],
    motivations: [
      'Update wardrobe',
      'Special occasion',
      'Personal style',
      'Seasonal needs',
      'Influencer/trend',
      'Comfort',
    ],
    concerns: [
      'Fit/sizing',
      'Quality',
      'Price',
      'Return policy',
      'Ethical production',
      'Care/maintenance',
    ],
    formats: ['Ready-to-wear', 'Custom-made', 'Rental', 'Subscription box'],
    pricingModels: ['One-time', 'Subscription box', 'Rental service'],
  },

  'home-garden': {
    category: 'home-garden',
    name: 'Home & Garden',
    icon: '🏡',
    description: 'Home goods, furniture, decor, garden products',
    benefits: [
      'High Quality',
      'Durable',
      'Stylish',
      'Easy to Use',
      'Affordable',
      'Space-Saving',
      'Eco-Friendly',
      'Multi-Functional',
    ],
    motivations: [
      'Home improvement',
      'Solve problem',
      'Aesthetic upgrade',
      'Seasonal need',
      'Moving/new home',
      'Gift',
    ],
    concerns: [
      'Quality/durability',
      'Price',
      'Size/fit',
      'Assembly required',
      'Return policy',
      'Maintenance',
    ],
    formats: ['Assembled', 'DIY/Assembly required', 'Professional installation'],
    pricingModels: ['One-time', 'Financing', 'Rental'],
  },

  'sports-fitness': {
    category: 'sports-fitness',
    name: 'Sports & Fitness',
    icon: '⚽',
    description: 'Fitness equipment, sports gear, training programs',
    benefits: [
      'Effective Results',
      'Durable',
      'Comfortable',
      'Space-Efficient',
      'Easy to Use',
      'Versatile',
      'Professional Grade',
      'Affordable',
    ],
    motivations: [
      'Get in shape',
      'Training for event',
      'Home workout',
      'Recommendation',
      'Upgrade equipment',
      'Injury recovery',
    ],
    concerns: [
      'Effectiveness',
      'Space requirements',
      'Price',
      'Durability',
      'Ease of use',
      'Assembly',
    ],
    formats: ['Equipment', 'Digital program', 'In-person classes', 'Virtual training'],
    pricingModels: ['One-time', 'Membership', 'Class packages', 'Personal training'],
  },

  'education': {
    category: 'education',
    name: 'Education & Learning',
    icon: '📚',
    description: 'Online courses, training programs, educational content',
    benefits: [
      'Expert Instructors',
      'Practical Skills',
      'Self-Paced',
      'Certificate/Credential',
      'Career Advancement',
      'Community Support',
      'Updated Content',
      'Affordable',
    ],
    motivations: [
      'Career advancement',
      'Learn new skill',
      'Career change',
      'Personal interest',
      'Certification',
      'Stay current',
    ],
    concerns: [
      'Time commitment',
      'Price',
      'Quality/credibility',
      'Completion rate',
      'Job outcomes',
      'Accreditation',
    ],
    deliveryMethods: ['Self-paced online', 'Live online', 'In-person', 'Hybrid'],
    pricingModels: ['One-time', 'Monthly subscription', 'Per-course', 'Bootcamp'],
  },

  'services': {
    category: 'services',
    name: 'Professional Services',
    icon: '🛠️',
    description: 'Consulting, professional services, freelance work',
    benefits: [
      'Expert Quality',
      'Fast Turnaround',
      'Reliable',
      'Good Communication',
      'Affordable',
      'Flexible',
      'Professional',
      'Proven Results',
    ],
    motivations: [
      'Need expertise',
      'Save time',
      'Quality results',
      'Recommendation',
      'Specific problem',
      'Ongoing need',
    ],
    concerns: [
      'Cost',
      'Quality/expertise',
      'Timeline',
      'Communication',
      'Trust/credentials',
      'Contract terms',
    ],
    deliveryMethods: ['In-person', 'Virtual', 'Hybrid', 'On-demand'],
    pricingModels: ['Hourly', 'Project-based', 'Retainer', 'Subscription'],
  },

  'b2b-services': {
    category: 'b2b-services',
    name: 'B2B Services',
    icon: '🏢',
    description: 'Business services, enterprise solutions, B2B offerings',
    benefits: [
      'ROI/Cost Savings',
      'Scalable',
      'Reliable',
      'Integration Support',
      'Dedicated Account Manager',
      'Security/Compliance',
      'Customizable',
      'Proven Track Record',
    ],
    motivations: [
      'Increase efficiency',
      'Reduce costs',
      'Scale operations',
      'Competitive advantage',
      'Compliance requirements',
      'Replace vendor',
    ],
    concerns: [
      'ROI justification',
      'Implementation complexity',
      'Contract terms',
      'Support/training',
      'Security',
      'Vendor lock-in',
    ],
    deliveryMethods: ['On-premise', 'Cloud', 'Hybrid', 'Managed service'],
    pricingModels: ['Per-user', 'Flat rate', 'Usage-based', 'Enterprise contract'],
  },

  'custom': {
    category: 'custom',
    name: 'Custom Industry',
    icon: '✨',
    description: 'AI will analyze your product to generate custom configuration',
    benefits: [], // AI-generated from product description
    motivations: [],
    concerns: [],
    formats: [],
    deliveryMethods: [],
    pricingModels: ['One-time', 'Subscription', 'Usage-based'],
  },
}

/**
 * Get industry configuration by category
 */
export function getIndustryConfig(category: IndustryCategory): IndustryConfig {
  return INDUSTRY_CONFIGS[category]
}

/**
 * Get all available industries
 */
export function getAllIndustries(): IndustryConfig[] {
  return Object.values(INDUSTRY_CONFIGS)
}

/**
 * Get industries as select options
 */
export function getIndustryOptions() {
  return Object.values(INDUSTRY_CONFIGS).map(config => ({
    value: config.category,
    label: config.name,
    icon: config.icon,
    description: config.description,
  }))
}

