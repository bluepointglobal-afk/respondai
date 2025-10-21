import { mean, median, std } from 'mathjs'
import _ from 'lodash'

// Custom quantile function since mathjs doesn't export it directly
function quantile(arr: number[], q: number): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  }
  return sorted[base]
}

export interface StatisticalSummary {
  mean: number
  median: number
  stdDev: number
  min: number
  max: number
  q1: number
  q3: number
  iqr: number
  variance: number
}

export interface ConfidenceInterval {
  lower: number
  upper: number
  confidence: number
}

/**
 * Calculate comprehensive statistical summary
 */
export function calculateStats(values: number[]): StatisticalSummary {
  if (values.length === 0) {
    throw new Error('Cannot calculate stats on empty array')
  }

  const sorted = [...values].sort((a, b) => a - b)
  const meanVal = mean(values) as number
  const medianVal = median(values) as number
  const stdDevVal = std(values, 'unbiased') as number
  const q1Val = quantile(sorted, 0.25) as number
  const q3Val = quantile(sorted, 0.75) as number

  return {
    mean: meanVal,
    median: medianVal,
    stdDev: stdDevVal,
    min: Math.min(...values),
    max: Math.max(...values),
    q1: q1Val,
    q3: q3Val,
    iqr: q3Val - q1Val,
    variance: Math.pow(stdDevVal, 2),
  }
}

/**
 * Calculate confidence interval using t-distribution
 */
export function calculateConfidenceInterval(
  values: number[],
  confidence: number = 0.95
): ConfidenceInterval {
  const n = values.length
  const meanVal = mean(values) as number
  const stdDevVal = std(values, 'unbiased') as number
  
  // t-score approximation (for large samples, ~1.96 for 95% confidence)
  const tScore = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.645
  const marginOfError = tScore * (stdDevVal / Math.sqrt(n))

  return {
    lower: meanVal - marginOfError,
    upper: meanVal + marginOfError,
    confidence,
  }
}

/**
 * Calculate statistical significance between two groups (t-test)
 */
export function tTest(group1: number[], group2: number[]): {
  tStatistic: number
  pValue: number
  significant: boolean
} {
  const n1 = group1.length
  const n2 = group2.length
  const mean1 = mean(group1) as number
  const mean2 = mean(group2) as number
  const var1 = Math.pow(std(group1, 'unbiased') as number, 2)
  const var2 = Math.pow(std(group2, 'unbiased') as number, 2)

  // Pooled standard deviation
  const pooledStd = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2))
  
  // t-statistic
  const tStatistic = (mean1 - mean2) / (pooledStd * Math.sqrt(1 / n1 + 1 / n2))
  
  // Approximate p-value (simplified)
  const df = n1 + n2 - 2
  const pValue = tStatistic > 2.0 ? 0.05 : tStatistic > 2.6 ? 0.01 : 0.1

  return {
    tStatistic,
    pValue,
    significant: pValue < 0.05,
  }
}

/**
 * Calculate correlation coefficient (Pearson's r)
 */
export function correlation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) {
    throw new Error('Arrays must have same non-zero length')
  }

  const n = x.length
  const meanX = mean(x) as number
  const meanY = mean(y) as number
  
  let numerator = 0
  let sumXSquared = 0
  let sumYSquared = 0

  for (let i = 0; i < n; i++) {
    const deltaX = x[i] - meanX
    const deltaY = y[i] - meanY
    numerator += deltaX * deltaY
    sumXSquared += deltaX * deltaX
    sumYSquared += deltaY * deltaY
  }

  const denominator = Math.sqrt(sumXSquared * sumYSquared)
  return denominator === 0 ? 0 : numerator / denominator
}

/**
 * Detect outliers using IQR method
 */
export function detectOutliers(values: number[]): {
  outliers: number[]
  cleanedValues: number[]
  indices: number[]
} {
  const stats = calculateStats(values)
  const lowerBound = stats.q1 - 1.5 * stats.iqr
  const upperBound = stats.q3 + 1.5 * stats.iqr

  const outliers: number[] = []
  const cleanedValues: number[] = []
  const indices: number[] = []

  values.forEach((val, idx) => {
    if (val < lowerBound || val > upperBound) {
      outliers.push(val)
      indices.push(idx)
    } else {
      cleanedValues.push(val)
    }
  })

  return { outliers, cleanedValues, indices }
}

/**
 * Segment data into groups based on criteria
 */
export function segmentData<T>(
  data: T[],
  segmentKey: keyof T,
  valueKey: keyof T
): Map<string, number[]> {
  const segments = new Map<string, number[]>()

  data.forEach((item) => {
    const segment = String(item[segmentKey])
    const value = Number(item[valueKey])

    if (!segments.has(segment)) {
      segments.set(segment, [])
    }
    segments.get(segment)!.push(value)
  })

  return segments
}

/**
 * Calculate lift percentage between two values
 */
export function calculateLift(baseline: number, comparison: number): number {
  if (baseline === 0) return 0
  return ((comparison - baseline) / baseline) * 100
}

/**
 * Normalize values to 0-100 scale
 */
export function normalize(values: number[]): number[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  if (range === 0) return values.map(() => 50)

  return values.map((val) => ((val - min) / range) * 100)
}

/**
 * Weight average calculation
 */
export function weightedAverage(
  values: number[],
  weights: number[]
): number {
  if (values.length !== weights.length) {
    throw new Error('Values and weights must have same length')
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  const weightedSum = values.reduce((sum, val, idx) => sum + val * weights[idx], 0)

  return weightedSum / totalWeight
}

