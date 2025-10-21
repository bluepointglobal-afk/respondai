'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface BoxPlotChartProps {
  segments: {
    name: string
    mean: number
    median: number
    q1: number
    q3: number
    min: number
    max: number
    n: number
  }[]
}

export function BoxPlotChart({ segments }: BoxPlotChartProps) {
  const data = segments.map(s => ({
    name: s.name,
    mean: s.mean,
    range: [s.min, s.max],
    iqr: [s.q1, s.q3],
    n: s.n
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis type="number" domain={[0, 100]} label={{ value: 'Purchase Intent (%)', position: 'insideBottom', offset: -5 }} />
        <YAxis type="category" dataKey="name" width={150} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="mean" fill="#8b5cf6" radius={4}>
          {segments.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.mean > 70 ? '#10b981' : entry.mean > 50 ? '#8b5cf6' : '#f59e0b'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm">Mean: {data.mean.toFixed(1)}%</p>
        <p className="text-sm">Sample: n={data.n}</p>
      </div>
    )
  }
  return null
}
