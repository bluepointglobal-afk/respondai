/**
 * RECOMMENDATIONS ENGINE
 * Generates actionable recommendations from analysis
 */

export interface Recommendation {
  id: string
  category: 'brand' | 'product' | 'pricing' | 'strategy' | 'geographic' | 'discontinue'
  priority: 'critical' | 'high' | 'medium' | 'low'
  
  title: string
  description: string
  reasoning: string
  
  supportingData: {
    insightIds: string[]
    patternIds: string[]
    metrics: Record<string, number>
  }
  
  actions: {
    action: string
    timeline: string
    difficulty: 'easy' | 'medium' | 'hard'
    estimatedImpact: string
  }[]
  
  expectedOutcome: {
    metric: string
    current: number
    projected: number
    lift: number
  }[]
  
  timeline: string
  difficulty: string
}

export function generateRecommendations(
  insights: any[],
  patterns: any[],
  overview: any
): Recommendation[] {
  const recommendations: Recommendation[] = []

  // 1. Purchase Intent Recommendations
  if (overview.avgPurchaseIntent >= 70) {
    recommendations.push({
      id: `rec-${Date.now()}-1`,
      category: 'strategy',
      priority: 'critical',
      title: 'Strong Market Signal - Accelerate Launch',
      description: `${overview.avgPurchaseIntent}% purchase intent indicates strong product-market fit. Recommend immediate launch.`,
      reasoning: 'High purchase intent (>70%) historically correlates with successful launches.',
      supportingData: {
        insightIds: [],
        patternIds: [],
        metrics: { purchaseIntent: overview.avgPurchaseIntent }
      },
      actions: [
        {
          action: 'Finalize product development',
          timeline: 'Week 1-2',
          difficulty: 'medium',
          estimatedImpact: 'Essential for launch'
        },
        {
          action: 'Begin pre-launch marketing',
          timeline: 'Week 2-3',
          difficulty: 'easy',
          estimatedImpact: 'Build early waitlist'
        }
      ],
      expectedOutcome: [
        {
          metric: 'Early Customers',
          current: 0,
          projected: 1000,
          lift: 100
        }
      ],
      timeline: 'Immediate',
      difficulty: 'medium'
    })
  }

  // 2. Pricing Recommendations
  if (overview.optimalPrice) {
    recommendations.push({
      id: `rec-${Date.now()}-2`,
      category: 'pricing',
      priority: 'high',
      title: `Set Launch Price at $${overview.optimalPrice}`,
      description: 'Data-driven optimal price point that maximizes both conversion and revenue.',
      reasoning: 'Based on price sensitivity analysis and willingness-to-pay data.',
      supportingData: {
        insightIds: [],
        patternIds: [],
        metrics: { optimalPrice: overview.optimalPrice }
      },
      actions: [
        {
          action: 'Set product price to optimal point',
          timeline: 'Pre-launch',
          difficulty: 'easy',
          estimatedImpact: 'Maximize revenue'
        }
      ],
      expectedOutcome: [
        {
          metric: 'Revenue',
          current: 0,
          projected: overview.optimalPrice * 1000,
          lift: 100
        }
      ],
      timeline: 'Pre-launch',
      difficulty: 'easy'
    })
  }

  // 3. Pattern-based Recommendations
  for (const pattern of patterns.filter(p => p.impact === 'critical' || p.impact === 'high').slice(0, 3)) {
    recommendations.push({
      id: `rec-pattern-${pattern.id}`,
      category: 'strategy',
      priority: pattern.impact === 'critical' ? 'critical' : 'high',
      title: `Target ${pattern.title}`,
      description: pattern.description,
      reasoning: `Shows ${pattern.lift}% higher engagement than average.`,
      supportingData: {
        insightIds: [],
        patternIds: [pattern.id],
        metrics: { lift: pattern.lift }
      },
      actions: [
        {
          action: `Create targeted messaging for ${pattern.title}`,
          timeline: 'Week 2-4',
          difficulty: 'medium',
          estimatedImpact: `+${pattern.lift}% conversion in this segment`
        }
      ],
      expectedOutcome: [
        {
          metric: 'Segment Conversion',
          current: overview.avgPurchaseIntent || 50,
          projected: (overview.avgPurchaseIntent || 50) * (1 + pattern.lift / 100),
          lift: pattern.lift
        }
      ],
      timeline: 'Month 1',
      difficulty: 'medium'
    })
  }

  // 4. Top Benefit Recommendation
  if (overview.topBenefit) {
    recommendations.push({
      id: `rec-${Date.now()}-4`,
      category: 'brand',
      priority: 'high',
      title: `Lead with "${overview.topBenefit}" in Marketing`,
      description: 'This benefit resonates strongest with your target audience.',
      reasoning: 'Highest preference score across all tested benefits.',
      supportingData: {
        insightIds: [],
        patternIds: [],
        metrics: { topBenefitScore: 100 }
      },
      actions: [
        {
          action: 'Feature in hero messaging',
          timeline: 'Immediate',
          difficulty: 'easy',
          estimatedImpact: 'Improve message clarity'
        },
        {
          action: 'Highlight in ad creative',
          timeline: 'Week 1-2',
          difficulty: 'easy',
          estimatedImpact: 'Increase click-through rates'
        }
      ],
      expectedOutcome: [],
      timeline: 'Immediate',
      difficulty: 'easy'
    })
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}
