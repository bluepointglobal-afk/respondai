/**
 * ANALYTICS UTILITY FUNCTIONS
 * Helper functions for formatting, validation, and data transformation
 */

import { Insight } from './insight-generator'
import { Pattern } from './pattern-detector'

/**
 * Generate executive summary from insights and patterns
 */
export function generateExecutiveSummary(
  insights: Insight[],
  overview: any,
  patterns: Pattern[]
): string {
  const critical = insights.filter(i => i.priority === 'critical')
  const high = insights.filter(i => i.priority === 'high')
  
  let summary = `## Executive Summary\n\n`
  summary += `**Overall Purchase Intent:** ${overview.avgPurchaseIntent}%\n`
  summary += `**Recommended Price:** $${overview.optimalPrice}\n`
  summary += `**Sample Size:** ${overview.sampleSize} responses\n\n`
  
  if (critical.length > 0) {
    summary += `### 🚨 Critical Insights\n\n`
    critical.forEach((insight, i) => {
      summary += `${i + 1}. **${insight.headline}**\n`
      summary += `   Revenue Impact: $${(insight.revenueImpact / 1000).toFixed(0)}K\n\n`
    })
  }
  
  if (high.length > 0) {
    summary += `### ⭐ High Priority\n\n`
    high.slice(0, 3).forEach((insight, i) => {
      summary += `${i + 1}. ${insight.headline}\n`
    })
  }
  
  if (patterns.length > 0) {
    summary += `\n### 📊 Key Patterns\n\n`
    patterns.slice(0, 3).forEach((pattern, i) => {
      summary += `${i + 1}. ${pattern.title}\n`
    })
  }
  
  return summary
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`
  }
  return num.toFixed(0)
}

/**
 * Validate analysis inputs
 */
export function validateAnalysisInputs(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!config.productName || config.productName.trim().length < 2) {
    errors.push('Product name must be at least 2 characters')
  }
  
  if (!config.productDescription || config.productDescription.trim().length < 20) {
    errors.push('Product description must be at least 20 characters')
  }
  
  if (!config.industry) {
    errors.push('Industry must be selected')
  }
  
  if (!config.personas || config.personas.length === 0) {
    errors.push('At least one persona is required')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

