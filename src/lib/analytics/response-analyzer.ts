/**
 * RESPONSE ANALYZER
 * Deep statistical analysis of survey responses
 */

import { mean, median, std } from 'mathjs'
import _ from 'lodash'

export interface QuestionAnalysis {
  questionId: string
  questionText: string
  questionType: string
  
  totalResponses: number
  skipped: number
  completionRate: number
  
  // For scale questions
  statistics?: {
    mean: number
    median: number
    mode: number
    stdDev: number
    variance: number
    confidenceInterval: { lower: number; upper: number }
    distribution: { value: number; count: number; percentage: number }[]
  }
  
  // For multiple choice
  breakdown?: {
    option: string
    count: number
    percentage: number
  }[]
  
  // Cross-tabulation by demographics
  byDemographic: {
    demographic: string
    field: string
    breakdown: {
      value: string
      mean?: number
      count: number
      percentage: number
      significance?: {
        pValue: number
        significant: boolean
        vsOverall: string
      }
    }[]
  }[]
  
  insights: string[]
}

export function analyzeQuestionResponses(
  question: any,
  responses: any[]
): QuestionAnalysis {
  const answers = responses
    .map(r => r.answers?.find((a: any) => a.questionId === question.id))
    .filter(a => a !== undefined)

  const totalResponses = answers.length
  const skipped = responses.length - totalResponses

  if (question.type === 'scale') {
    return analyzeScaleQuestion(question, answers, responses)
  } else if (question.type === 'multiple_choice') {
    return analyzeMultipleChoiceQuestion(question, answers, responses)
  }

  return {
    questionId: question.id,
    questionText: question.text,
    questionType: question.type,
    totalResponses,
    skipped,
    completionRate: (totalResponses / responses.length) * 100,
    byDemographic: [],
    insights: [],
  }
}

function analyzeScaleQuestion(question: any, answers: any[], allResponses: any[]): QuestionAnalysis {
  const values = answers.map(a => a.value).filter(v => typeof v === 'number')
  
  const stats = {
    mean: mean(values),
    median: median(values),
    mode: calculateMode(values),
    stdDev: Number(std(values)),
    variance: Math.pow(Number(std(values)), 2),
    confidenceInterval: calculateCI(values),
    distribution: calculateDistribution(values),
  }

  // Demographic breakdowns
  const byDemographic = analyzeDemographicBreakdowns(question, allResponses)

  // Generate insights
  const insights = generateScaleInsights(stats, byDemographic)

  return {
    questionId: question.id,
    questionText: question.text,
    questionType: question.type,
    totalResponses: values.length,
    skipped: allResponses.length - values.length,
    completionRate: (values.length / allResponses.length) * 100,
    statistics: stats,
    byDemographic,
    insights,
  }
}

function analyzeMultipleChoiceQuestion(question: any, answers: any[], allResponses: any[]): QuestionAnalysis {
  const valueCounts = _.countBy(answers, a => a.value)
  const total = answers.length

  const breakdown = Object.entries(valueCounts).map(([option, count]) => ({
    option,
    count: count as number,
    percentage: ((count as number) / total) * 100,
  })).sort((a, b) => b.count - a.count)

  const byDemographic = analyzeDemographicBreakdowns(question, allResponses)
  const insights = generateMultipleChoiceInsights(breakdown, byDemographic)

  return {
    questionId: question.id,
    questionText: question.text,
    questionType: question.type,
    totalResponses: total,
    skipped: allResponses.length - total,
    completionRate: (total / allResponses.length) * 100,
    breakdown,
    byDemographic,
    insights,
  }
}

function calculateMode(values: number[]): number {
  const counts = _.countBy(values)
  const max = Math.max(...Object.values(counts))
  const mode = Object.entries(counts).find(([, count]) => count === max)
  return mode ? parseFloat(mode[0]) : values[0]
}

function calculateCI(values: number[], confidence: number = 0.95): { lower: number; upper: number } {
  const m = mean(values)
  const s = Number(std(values))
  const n = values.length
  const z = 1.96 // 95% confidence
  const margin = z * (s / Math.sqrt(n))
  
  return {
    lower: m - margin,
    upper: m + margin,
  }
}

function calculateDistribution(values: number[]): { value: number; count: number; percentage: number }[] {
  const counts = _.countBy(values)
  const total = values.length
  
  return Object.entries(counts)
    .map(([value, count]) => ({
      value: parseFloat(value),
      count: count as number,
      percentage: ((count as number) / total) * 100,
    }))
    .sort((a, b) => a.value - b.value)
}

function analyzeDemographicBreakdowns(question: any, responses: any[]): any[] {
  // Analyze by age, gender, income, etc.
  const demographics = ['age', 'gender', 'income', 'location', 'ethnicity']
  
  return demographics.map(demo => {
    const breakdown = _.groupBy(responses, r => {
      const demoAnswer = r.answers?.find((a: any) => a.questionId?.includes(demo))
      return demoAnswer?.value || 'Unknown'
    })

    const stats = Object.entries(breakdown).map(([value, resps]) => {
      const values = resps
        .map((r: any) => r.answers?.find((a: any) => a.questionId === question.id)?.value)
        .filter((v: any) => v !== undefined)
      
      if (question.type === 'scale' && values.length > 0) {
        const m = mean(values)
        const overallMean = mean(
          responses
            .map((r: any) => r.answers?.find((a: any) => a.questionId === question.id)?.value)
            .filter((v: any) => v !== undefined)
        )
        
        return {
          value,
          mean: m,
          count: values.length,
          percentage: (values.length / responses.length) * 100,
          significance: calculateTTest(values, responses, question.id, overallMean),
        }
      }

      return {
        value,
        count: resps.length,
        percentage: (resps.length / responses.length) * 100,
      }
    }).filter(s => s.count > 5) // Only include if n>5

    return {
      demographic: demo,
      field: demo,
      breakdown: stats,
    }
  }).filter(d => d.breakdown.length > 1)
}

function calculateTTest(values: number[], allResponses: any[], questionId: string, overallMean: number): any {
  if (values.length < 10) return null
  
  const sampleMean = mean(values)
  const diff = ((sampleMean - overallMean) / overallMean) * 100
  
  // Simplified t-test (would use proper stats library in production)
  const se = Number(std(values)) / Math.sqrt(values.length)
  const t = (sampleMean - overallMean) / se
  const pValue = 2 * (1 - normalCDF(Math.abs(t)))
  
  return {
    pValue,
    significant: pValue < 0.05,
    vsOverall: diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`,
  }
}

function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)))
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1
  x = Math.abs(x)
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const t = 1 / (1 + p * x)
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return sign * y
}

function generateScaleInsights(stats: any, demographics: any[]): string[] {
  const insights: string[] = []
  
  // Distribution shape
  if (stats.stdDev < 1.5) {
    insights.push(`Strong consensus with low variance (σ=${stats.stdDev.toFixed(2)})`)
  } else if (stats.stdDev > 3) {
    insights.push(`High variance indicates polarized opinions (σ=${stats.stdDev.toFixed(2)})`)
  }
  
  // Demographic differences
  for (const demo of demographics) {
    const significant = demo.breakdown.filter((b: any) => b.significance?.significant)
    if (significant.length > 0) {
      const top = significant.sort((a: any, b: any) => (b.mean || 0) - (a.mean || 0))[0]
      insights.push(`${demo.demographic}: ${top.value} shows significantly higher response (${top.vsOverall}, p<0.05)`)
    }
  }
  
  return insights
}

function generateMultipleChoiceInsights(breakdown: any[], demographics: any[]): string[] {
  const insights: string[] = []
  
  if (breakdown[0].percentage > 50) {
    insights.push(`Clear majority preference for "${breakdown[0].option}" (${breakdown[0].percentage.toFixed(1)}%)`)
  }
  
  const top3 = breakdown.slice(0, 3)
  if (top3.length >= 3 && top3[0].percentage - top3[2].percentage < 10) {
    insights.push(`No clear winner - top 3 options within 10% of each other`)
  }
  
  return insights
}
