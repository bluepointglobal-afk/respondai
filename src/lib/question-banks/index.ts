import { QuestionTemplate } from '../frameworks/research-frameworks'

export interface CategoryQuestionBank {
  category: string
  sub_category: string
  
  question_library: {
    [research_area: string]: QuestionTemplate[]
  }
}

// SUPPLEMENT CATEGORY QUESTION BANK
export const SUPPLEMENT_QUESTION_BANK: CategoryQuestionBank = {
  category: 'supplements',
  
  question_library: {
    'condition_assessment': [
      {
        id: 'supp_cond_001',
        type: 'scale-0-10',
        text: 'On a scale of 0-10, how would you rate your joint pain on a typical day?',
        options: [
          { value: '0', label: 'No pain' },
          { value: '10', label: 'Worst possible pain' }
        ],
        analysis_tags: ['segment_by_severity', 'correlate_with_wtp'],
        benchmarks: { industry_avg: 6.2 }
      },
      {
        id: 'supp_cond_002',
        type: 'multiple-choice-single',
        text: 'How often do you experience joint pain?',
        options: [
          { value: 'daily', label: 'Every day' },
          { value: 'most_days', label: 'Most days (5-6 days/week)' },
          { value: 'several_week', label: 'Several times a week (3-4 days)' },
          { value: 'weekly', label: 'Once or twice a week' },
          { value: 'monthly', label: 'A few times a month' },
          { value: 'rarely', label: 'Rarely' }
        ],
        skip_logic: {
          if: ['rarely', 'monthly'],
          action: 'show_question_id',
          target: 'supp_cond_003_occasional_pain'
        }
      },
      {
        id: 'supp_cond_003',
        type: 'multiple-choice-multiple',
        text: 'Which of the following activities are limited by your joint pain? (Select all that apply)',
        options: [
          { value: 'walking', label: 'Walking or climbing stairs' },
          { value: 'exercise', label: 'Exercise or sports' },
          { value: 'work', label: 'Work tasks' },
          { value: 'chores', label: 'Household chores' },
          { value: 'sleep', label: 'Sleep' },
          { value: 'hobbies', label: 'Hobbies or recreational activities' },
          { value: 'social', label: 'Social activities' },
          { value: 'none', label: 'None - pain doesn\'t limit my activities' }
        ],
        analysis_tags: ['impact_severity_index', 'segment_by_impact']
      }
    ],
    
    'current_treatment': [
      {
        id: 'supp_treat_001',
        type: 'multiple-choice-multiple',
        text: 'What are you currently doing to manage your joint pain? (Select all that apply)',
        options: [
          { value: 'otc', label: 'Over-the-counter pain relievers (ibuprofen, acetaminophen)' },
          { value: 'prescription', label: 'Prescription pain medications' },
          { value: 'anti_inflammatory', label: 'Prescription anti-inflammatory medications' },
          { value: 'joint_supplements', label: 'Joint health supplements (glucosamine, chondroitin, etc.)' },
          { value: 'turmeric', label: 'Turmeric or curcumin supplements' },
          { value: 'fish_oil', label: 'Fish oil/omega-3 supplements' },
          { value: 'physical_therapy', label: 'Physical therapy' },
          { value: 'exercise', label: 'Exercise or stretching routines' },
          { value: 'heat_cold', label: 'Heat or cold therapy' },
          { value: 'massage', label: 'Massage or chiropractic care' },
          { value: 'acupuncture', label: 'Acupuncture' },
          { value: 'topical', label: 'Topical creams or gels' },
          { value: 'weight', label: 'Weight management' },
          { value: 'diet', label: 'Diet changes' },
          { value: 'nothing', label: 'Nothing currently' },
          { value: 'other', label: 'Other (please specify)' }
        ],
        follow_up: 'supp_treat_002_satisfaction'
      },
      {
        id: 'supp_treat_002',
        type: 'scale-1-5',
        text: 'How satisfied are you with your current approach to managing joint pain?',
        options: [
          { value: '1', label: 'Very dissatisfied' },
          { value: '2', label: 'Somewhat dissatisfied' },
          { value: '3', label: 'Neither satisfied nor dissatisfied' },
          { value: '4', label: 'Somewhat satisfied' },
          { value: '5', label: 'Very satisfied' }
        ],
        analysis_tags: ['dissatisfaction_opportunity', 'switching_intent']
      },
      {
        id: 'supp_treat_003',
        type: 'multiple-choice-single',
        text: 'What is the biggest limitation of your current approach?',
        options: [
          { value: 'not_effective', label: 'Not effective enough' },
          { value: 'expensive', label: 'Too expensive' },
          { value: 'side_effects', label: 'Unpleasant side effects' },
          { value: 'inconvenient', label: 'Inconvenient to use' },
          { value: 'slow', label: 'Takes too long to work' },
          { value: 'root_cause', label: 'Doesn\'t address root cause' },
          { value: 'sustainable', label: 'Not sustainable long-term' },
          { value: 'prescription', label: 'Requires prescription/doctor visits' },
          { value: 'other', label: 'Other (please specify)' }
        ]
      },
      {
        id: 'supp_treat_004',
        type: 'multiple-choice-single',
        text: 'Approximately how much do you spend per month on managing your joint pain?',
        options: [
          { value: 'under_20', label: 'Less than $20' },
          { value: '20_49', label: '$20-$49' },
          { value: '50_99', label: '$50-$99' },
          { value: '100_149', label: '$100-$149' },
          { value: '150_199', label: '$150-$199' },
          { value: '200_plus', label: '$200 or more' }
        ],
        analysis_tags: ['current_spend_baseline', 'wtp_comparison']
      }
    ],
    
    'supplement_behavior': [
      {
        id: 'supp_behav_001',
        type: 'multiple-choice-single',
        text: 'How many dietary supplements or vitamins do you currently take regularly?',
        options: [
          { value: 'none', label: 'None' },
          { value: '1_2', label: '1-2' },
          { value: '3_4', label: '3-4' },
          { value: '5_6', label: '5-6' },
          { value: '7_plus', label: '7 or more' }
        ],
        analysis_tags: ['supplement_user_segmentation']
      },
      {
        id: 'supp_behav_002',
        type: 'maxdiff',
        text: 'What format do you prefer for supplements?',
        items: [
          'Capsules',
          'Tablets',
          'Softgels',
          'Gummies',
          'Powder (mix with liquid)',
          'Liquid (straight or in water)',
          'Chewable tablets'
        ],
        sets: 5,
        items_per_set: 4
      },
      {
        id: 'supp_behav_003',
        type: 'matrix-importance',
        text: 'How important is each of the following when choosing a supplement brand?',
        attributes: [
          'Clinically proven effectiveness',
          'Third-party tested for purity',
          'Made in USA',
          'Organic/non-GMO ingredients',
          'Doctor recommended',
          'Transparent ingredient sourcing',
          'Good manufacturing practices (GMP) certified',
          'Positive customer reviews',
          'Money-back guarantee',
          'Brand reputation',
          'Price/value',
          'Easy to swallow',
          'No artificial ingredients'
        ],
        scale: {
          1: 'Not at all important',
          2: 'Slightly important',
          3: 'Moderately important',
          4: 'Very important',
          5: 'Extremely important'
        }
      }
    ],
    
    'ingredient_perception': [
      {
        id: 'supp_ingr_001',
        type: 'multiple-choice-single',
        text: 'Before this survey, how familiar were you with turmeric/curcumin for joint health?',
        options: [
          { value: 'very_familiar', label: 'Very familiar - I know a lot about it' },
          { value: 'somewhat_familiar', label: 'Somewhat familiar - I\'ve heard about it' },
          { value: 'slightly_familiar', label: 'Slightly familiar - I\'ve heard the name' },
          { value: 'not_familiar', label: 'Not at all familiar' }
        ],
        skip_logic: {
          if: 'not_familiar',
          action: 'show_educational_content'
        }
      },
      {
        id: 'supp_ingr_002',
        type: 'multiple-choice-single',
        text: 'Have you ever taken a turmeric or curcumin supplement?',
        options: [
          { value: 'currently', label: 'Yes, currently taking one' },
          { value: 'past', label: 'Yes, took one in the past but stopped' },
          { value: 'considered', label: 'No, but I\'ve considered it' },
          { value: 'never', label: 'No, never considered it' }
        ],
        branch_logic: {
          'past': 'supp_ingr_002a_why_stopped',
          'currently': 'supp_ingr_002b_current_brand'
        }
      },
      {
        id: 'supp_ingr_003',
        type: 'text-short',
        text: 'What is your biggest concern or question about turmeric supplements?',
        analysis_tags: ['text_analytics', 'concern_clustering']
      }
    ],
    
    'pricing_van_westendorp': [
      {
        id: 'supp_price_vw_001',
        type: 'text-number',
        text: 'At what price per month would you consider this supplement to be so expensive that you would not consider buying it? (Too expensive)',
        prefix: '$',
        validation: { min: 0, max: 200 }
      },
      {
        id: 'supp_price_vw_002',
        type: 'text-number',
        text: 'At what price per month would you consider this supplement to be priced so low that you would feel the quality couldn\'t be very good? (Too cheap)',
        prefix: '$',
        validation: { min: 0, max: 200 }
      },
      {
        id: 'supp_price_vw_003',
        type: 'text-number',
        text: 'At what price per month would you consider this supplement starting to get expensive, but you would still consider buying it? (Expensive but acceptable)',
        prefix: '$',
        validation: { min: 0, max: 200 }
      },
      {
        id: 'supp_price_vw_004',
        type: 'text-number',
        text: 'At what price per month would you consider this supplement to be a bargain—a great buy for the money? (Good value)',
        prefix: '$',
        validation: { min: 0, max: 200 }
      },
      {
        id: 'supp_price_005',
        type: 'multiple-choice-single',
        text: 'Would you be more likely to purchase this supplement with a subscription that saves you 15%?',
        options: [
          { value: 'much_more', label: 'Yes, much more likely with subscription discount' },
          { value: 'somewhat_more', label: 'Yes, somewhat more likely' },
          { value: 'no_difference', label: 'No difference - same likelihood' },
          { value: 'prefer_one_time', label: 'No, prefer one-time purchases' }
        ]
      }
    ]
  }
}

// BEVERAGE CATEGORY QUESTION BANK
export const BEVERAGE_QUESTION_BANK: CategoryQuestionBank = {
  category: 'beverages',
  
  question_library: {
    'consumption_profile': [
      {
        id: 'bev_cons_001',
        type: 'multiple-choice-single',
        text: 'How many cups of coffee do you drink per day?',
        options: [
          { value: 'none', label: 'None' },
          { value: '1', label: '1 cup' },
          { value: '2', label: '2 cups' },
          { value: '3', label: '3 cups' },
          { value: '4', label: '4 cups' },
          { value: '5_plus', label: '5 or more cups' }
        ]
      },
      {
        id: 'bev_cons_002',
        type: 'multiple-choice-multiple',
        text: 'What time(s) of day do you typically drink coffee? (Select all that apply)',
        options: [
          { value: 'morning', label: 'Morning (6-9 AM)' },
          { value: 'mid_morning', label: 'Mid-morning (9-11 AM)' },
          { value: 'afternoon', label: 'Afternoon (12-3 PM)' },
          { value: 'late_afternoon', label: 'Late afternoon (3-5 PM)' },
          { value: 'evening', label: 'Evening (5-8 PM)' },
          { value: 'night', label: 'Night (8 PM+)' }
        ]
      },
      {
        id: 'bev_cons_003',
        type: 'multiple-choice-single',
        text: 'How do you primarily prepare your coffee?',
        options: [
          { value: 'drip', label: 'Drip coffee maker' },
          { value: 'espresso', label: 'Espresso machine' },
          { value: 'french_press', label: 'French press' },
          { value: 'pour_over', label: 'Pour over' },
          { value: 'cold_brew', label: 'Cold brew' },
          { value: 'instant', label: 'Instant coffee' },
          { value: 'keurig', label: 'Keurig/K-cup' },
          { value: 'other', label: 'Other' }
        ]
      }
    ],
    
    'energy_needs': [
      {
        id: 'bev_energy_001',
        type: 'scale-1-10',
        text: 'How would you rate your typical energy levels throughout the day?',
        options: [
          { value: '1', label: 'Very low energy' },
          { value: '10', label: 'Very high energy' }
        ]
      },
      {
        id: 'bev_energy_002',
        type: 'multiple-choice-multiple',
        text: 'What times of day do you typically need an energy boost? (Select all that apply)',
        options: [
          { value: 'morning', label: 'Morning' },
          { value: 'mid_morning', label: 'Mid-morning' },
          { value: 'afternoon', label: 'Afternoon' },
          { value: 'late_afternoon', label: 'Late afternoon' },
          { value: 'evening', label: 'Evening' },
          { value: 'never', label: 'Never need energy boost' }
        ]
      },
      {
        id: 'bev_energy_003',
        type: 'multiple-choice-single',
        text: 'Do you currently use any products specifically for energy or focus?',
        options: [
          { value: 'yes_energy_drinks', label: 'Yes, energy drinks' },
          { value: 'yes_supplements', label: 'Yes, energy supplements' },
          { value: 'yes_pre_workout', label: 'Yes, pre-workout supplements' },
          { value: 'yes_other', label: 'Yes, other products' },
          { value: 'no', label: 'No' }
        ]
      }
    ],
    
    'functional_beverage_attitudes': [
      {
        id: 'bev_func_001',
        type: 'multiple-choice-single',
        text: 'How familiar are you with coffee that has added functional ingredients (like mushrooms, adaptogens, or vitamins)?',
        options: [
          { value: 'very_familiar', label: 'Very familiar - I know a lot about it' },
          { value: 'somewhat_familiar', label: 'Somewhat familiar - I\'ve heard about it' },
          { value: 'slightly_familiar', label: 'Slightly familiar - I\'ve heard the name' },
          { value: 'not_familiar', label: 'Not at all familiar' }
        ]
      },
      {
        id: 'bev_func_002',
        type: 'multiple-choice-single',
        text: 'Have you ever tried functional coffee products like mushroom coffee, bulletproof coffee, or coffee with added supplements?',
        options: [
          { value: 'yes_currently', label: 'Yes, currently drink them' },
          { value: 'yes_past', label: 'Yes, tried them in the past' },
          { value: 'no_interested', label: 'No, but I\'m interested' },
          { value: 'no_not_interested', label: 'No, not interested' }
        ]
      },
      {
        id: 'bev_func_003',
        type: 'multiple-choice-single',
        text: 'What is your biggest concern about functional coffee?',
        options: [
          { value: 'taste', label: 'Taste - worried it won\'t taste good' },
          { value: 'effectiveness', label: 'Effectiveness - not sure if it works' },
          { value: 'price', label: 'Price - too expensive' },
          { value: 'safety', label: 'Safety - concerned about side effects' },
          { value: 'natural', label: 'Naturalness - prefer pure coffee' },
          { value: 'no_concerns', label: 'No major concerns' }
        ]
      }
    ]
  }
}

// SAAS CATEGORY QUESTION BANK
export const SAAS_QUESTION_BANK: CategoryQuestionBank = {
  category: 'saas',
  
  question_library: {
    'current_tools': [
      {
        id: 'saas_tools_001',
        type: 'multiple-choice-multiple',
        text: 'What software tools do you currently use for your work? (Select all that apply)',
        options: [
          { value: 'email', label: 'Email (Gmail, Outlook)' },
          { value: 'calendar', label: 'Calendar (Google Calendar, Outlook)' },
          { value: 'project_mgmt', label: 'Project management (Asana, Trello, Monday)' },
          { value: 'crm', label: 'CRM (Salesforce, HubSpot)' },
          { value: 'analytics', label: 'Analytics (Google Analytics, Mixpanel)' },
          { value: 'communication', label: 'Communication (Slack, Teams)' },
          { value: 'design', label: 'Design (Figma, Adobe Creative Suite)' },
          { value: 'development', label: 'Development tools (GitHub, VS Code)' },
          { value: 'marketing', label: 'Marketing (Mailchimp, Hootsuite)' },
          { value: 'accounting', label: 'Accounting (QuickBooks, Xero)' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'saas_tools_002',
        type: 'scale-1-5',
        text: 'How satisfied are you with your current software tools overall?',
        options: [
          { value: '1', label: 'Very dissatisfied' },
          { value: '2', label: 'Somewhat dissatisfied' },
          { value: '3', label: 'Neither satisfied nor dissatisfied' },
          { value: '4', label: 'Somewhat satisfied' },
          { value: '5', label: 'Very satisfied' }
        ]
      }
    ],
    
    'pain_points': [
      {
        id: 'saas_pain_001',
        type: 'multiple-choice-multiple',
        text: 'What are your biggest frustrations with your current software tools? (Select all that apply)',
        options: [
          { value: 'integration', label: 'Tools don\'t integrate well with each other' },
          { value: 'complexity', label: 'Too complex and hard to learn' },
          { value: 'cost', label: 'Too expensive' },
          { value: 'features', label: 'Missing features I need' },
          { value: 'support', label: 'Poor customer support' },
          { value: 'reliability', label: 'Frequent bugs or downtime' },
          { value: 'mobile', label: 'Poor mobile experience' },
          { value: 'collaboration', label: 'Hard to collaborate with team members' },
          { value: 'data', label: 'Hard to get insights from my data' },
          { value: 'other', label: 'Other' }
        ]
      }
    ],
    
    'workflow_needs': [
      {
        id: 'saas_workflow_001',
        type: 'multiple-choice-single',
        text: 'What is your primary role?',
        options: [
          { value: 'marketing', label: 'Marketing' },
          { value: 'sales', label: 'Sales' },
          { value: 'product', label: 'Product Management' },
          { value: 'engineering', label: 'Engineering/Development' },
          { value: 'design', label: 'Design' },
          { value: 'operations', label: 'Operations' },
          { value: 'customer_success', label: 'Customer Success' },
          { value: 'executive', label: 'Executive/Leadership' },
          { value: 'other', label: 'Other' }
        ]
      }
    ]
  }
}

// Export all question banks
export const QUESTION_BANKS = {
  supplements: SUPPLEMENT_QUESTION_BANK,
  beverages: BEVERAGE_QUESTION_BANK,
  saas: SAAS_QUESTION_BANK
}
