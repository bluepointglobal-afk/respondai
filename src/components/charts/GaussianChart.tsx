'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface GaussianChartProps {
  mean: number
  stdDev: number
  confidenceInterval: { lower: number; upper: number }
  data: { value: number; count: number }[]
}

export function GaussianChart({ mean, stdDev, confidenceInterval, data }: GaussianChartProps) {
  // Generate Gaussian curve
  const gaussianData = data.map(d => ({
    x: d.value,
    observed: d.count,
    gaussian: gaussianPdf(d.value, mean, stdDev) * data.reduce((sum, d) => sum + d.count, 0) * (data[1]?.value - data[0]?.value || 1)
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={gaussianData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey="x" 
          label={{ value: 'Purchase Intent', position: 'insideBottom', offset: -5 }}
        />
        <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        
        {/* Confidence Interval */}
        <ReferenceLine x={confidenceInterval.lower} stroke="#f59e0b" strokeDasharray="3 3" label="95% CI Lower" />
        <ReferenceLine x={confidenceInterval.upper} stroke="#f59e0b" strokeDasharray="3 3" label="95% CI Upper" />
        <ReferenceLine x={mean} stroke="#8b5cf6" strokeWidth={2} label="Mean" />
        
        {/* Observed data */}
        <Area 
          type="monotone" 
          dataKey="observed" 
          stroke="#06b6d4" 
          fill="#06b6d4" 
          fillOpacity={0.3}
          name="Observed"
        />
        
        {/* Gaussian curve */}
        <Area 
          type="monotone" 
          dataKey="gaussian" 
          stroke="#8b5cf6" 
          fill="none"
          strokeWidth={2}
          name="Expected (Normal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function gaussianPdf(x: number, mean: number, stdDev: number): number {
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
         Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))
}
