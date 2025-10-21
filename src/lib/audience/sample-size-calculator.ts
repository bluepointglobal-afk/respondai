import { SampleSizeInput, SampleSizeResult, CostEstimate } from './types'

export function calculateSampleSize(input: SampleSizeInput): SampleSizeResult {
  // STEP 1: Base calculation (infinite population)
  const z_score = getZScore(input.confidence_level)
  const p = input.expected_proportion
  const e = input.margin_of_error / 100
  
  const n_infinite = Math.ceil(
    (z_score ** 2 * p * (1 - p)) / (e ** 2)
  )
  
  // STEP 2: Finite population correction
  let n_finite = n_infinite
  if (input.population_size < 100_000) {
    n_finite = Math.ceil(
      n_infinite / (1 + (n_infinite - 1) / input.population_size)
    )
  }
  
  // STEP 3: Design effect adjustment
  const n_design = Math.ceil(n_finite * input.design_effect)
  
  // STEP 4: Response rate adjustment
  const n_response = Math.ceil(n_design / input.expected_response_rate)
  
  // STEP 5: Subgroup analysis adjustment
  const min_per_subgroup = 100  // Minimum 100 per segment for valid analysis
  const n_subgroup = Math.max(
    n_response,
    input.subgroup_count * min_per_subgroup
  )
  
  // RECOMMENDATIONS
  const minimum = Math.max(n_subgroup, 200)  // Absolute minimum
  const recommended = Math.max(minimum, 400)  // Industry standard
  const optimal = Math.max(recommended, 600)  // High confidence
  
  // RATIONALE
  const rationale = generateRationale(input, {
    infinite: n_infinite,
    finite: n_finite,
    design: n_design,
    response: n_response,
    subgroup: n_subgroup
  })
  
  // COST ESTIMATION
  const cost_estimate = estimateCost(input, minimum, recommended, optimal)
  
  // FEASIBILITY
  const feasibility = assessFeasibility(optimal, input.population_size, cost_estimate)
  
  return {
    minimum,
    recommended,
    optimal,
    calculation: {
      infinite_population: n_infinite,
      finite_adjusted: n_finite,
      design_adjusted: n_design,
      response_adjusted: n_response,
      subgroup_adjusted: n_subgroup
    },
    rationale,
    cost_estimate,
    feasibility
  }
}

function getZScore(confidence_level: number): number {
  const z_scores = {
    90: 1.645,
    95: 1.96,
    99: 2.576
  }
  return z_scores[confidence_level]
}

function generateRationale(input: SampleSizeInput, calculations: any): string {
  let rationale = `Based on ${input.confidence_level}% confidence level and ±${input.margin_of_error}% margin of error:\n\n`
  
  rationale += `• Base sample (infinite population): ${calculations.infinite} responses\n`
  
  if (calculations.finite < calculations.infinite) {
    rationale += `• Adjusted for population size (${input.population_size.toLocaleString()}): ${calculations.finite} responses\n`
  }
  
  if (input.design_effect > 1) {
    rationale += `• Adjusted for design effect (${input.design_effect}x): ${calculations.design} responses\n`
  }
  
  if (input.expected_response_rate < 1) {
    rationale += `• Adjusted for ${(input.expected_response_rate * 100)}% completion rate: ${calculations.response} responses\n`
  }
  
  if (input.subgroup_count > 1) {
    rationale += `• Adjusted for ${input.subgroup_count} subgroup analysis (min 100 per group): ${calculations.subgroup} responses\n`
  }
  
  rationale += `\nRecommended sample ensures statistical validity for segmentation analysis and pattern detection.`
  
  return rationale
}

function estimateCost(input: SampleSizeInput, min: number, rec: number, opt: number): CostEstimate {
  // Cost depends on data collection method
  const synthetic_cost = 0  // Free
  const panel_cost_per_response = 3  // $3 per response via panel
  const targeted_cost_per_response = 8  // $8 for highly targeted audience
  
  // For estimation, use panel cost
  const cost_per_response = panel_cost_per_response
  
  return {
    cost_per_response,
    total_cost_minimum: min * cost_per_response,
    total_cost_recommended: rec * cost_per_response,
    total_cost_optimal: opt * cost_per_response,
    time_estimate: estimateTime(opt)
  }
}

function estimateTime(sample_size: number): string {
  if (sample_size < 200) return '2-3 days'
  if (sample_size < 500) return '3-5 days'
  if (sample_size < 1000) return '5-7 days'
  return '1-2 weeks'
}

function assessFeasibility(optimal: number, tam: number, cost: CostEstimate): 'easy' | 'moderate' | 'challenging' {
  const sample_rate = optimal / tam
  
  if (sample_rate < 0.01 && cost.total_cost_optimal < 5000) return 'easy'
  if (sample_rate < 0.05 && cost.total_cost_optimal < 10000) return 'moderate'
  return 'challenging'
}
