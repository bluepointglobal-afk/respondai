/**
 * EXPANDABLE INSIGHT CARD
 * Displays marketing-grade insights with expandable detailed views
 */

'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, AlertTriangle, Lightbulb, Target, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

interface Insight {
  id: string
  type: 'opportunity' | 'risk' | 'strategy' | 'finding'
  category: 'market' | 'pricing' | 'positioning' | 'segmentation' | 'channel' | 'timing' | 'product'
  priority: 'high' | 'medium' | 'low'
  title: string
  summary: string
  description: string
  evidence: {
    dataPoints: string[]
    sampleSize: number
    confidence: number
    methodology?: string
  }
  impact: {
    revenue: string
    timeframe: 'short' | 'medium' | 'long'
    effort: 'low' | 'medium' | 'high'
    priority: 'critical' | 'important' | 'nice-to-have'
  }
  recommendations: Array<{
    action: string
    rationale: string
    timeline: string
    owner: string
    kpis: string[]
  }>
  relatedPatterns?: string[]
}

interface ExpandableInsightCardProps {
  insight: Insight
  onExport?: () => void
}

function ExpandableInsightCard({ insight, onExport }: ExpandableInsightCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  const iconMap = {
    opportunity: TrendingUp,
    risk: AlertTriangle,
    strategy: Lightbulb,
    finding: Target
  }
  
  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }
  
  const categoryColors = {
    market: 'bg-blue-100 text-blue-800',
    pricing: 'bg-purple-100 text-purple-800',
    positioning: 'bg-indigo-100 text-indigo-800',
    segmentation: 'bg-pink-100 text-pink-800',
    channel: 'bg-orange-100 text-orange-800',
    timing: 'bg-teal-100 text-teal-800',
    product: 'bg-cyan-100 text-cyan-800'
  }
  
  const timeframeIcons = {
    short: Clock,
    medium: Clock,
    long: Clock
  }
  
  const Icon = iconMap[insight.type] || iconMap.finding
  const TimeframeIcon = timeframeIcons[insight.impact?.timeframe] || timeframeIcons.short
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-3 rounded-lg ${
              insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
              insight.type === 'risk' ? 'bg-red-100 text-red-600' :
              insight.type === 'strategy' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{insight.title}</h3>
                <Badge className={priorityColors[insight.priority]}>
                  {insight.priority.toUpperCase()}
                </Badge>
                <Badge className={categoryColors[insight.category]}>
                  {insight.category}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-3">{insight.summary || 'No summary available'}</p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm">
                {insight.impact?.revenue && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">{insight.impact.revenue}</span>
                  </div>
                )}
                {insight.impact?.timeframe && (
                  <div className="flex items-center gap-2">
                    <TimeframeIcon className="w-4 h-4 text-blue-600" />
                    <span className="font-medium capitalize">{insight.impact.timeframe}</span>
                  </div>
                )}
                {insight.evidence?.confidence && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Confidence:</span>
                    <span className="text-blue-600">{insight.evidence.confidence}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="shrink-0"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 pt-6 border-t"
            >
              {/* Detailed Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Analysis</h4>
                <div className="prose prose-sm max-w-none">
                  {insight.description ? 
                    insight.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    )) : 
                    <p className="text-gray-500 italic">No detailed analysis available</p>
                  }
                </div>
              </div>
              
              {/* Evidence */}
              {insight.evidence && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Supporting Evidence</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {insight.evidence.dataPoints?.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1 font-bold">•</span>
                          <span className="text-sm text-gray-700">{point}</span>
                        </div>
                      )) || <div className="text-sm text-gray-500">No evidence data available</div>}
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Sample: n={insight.evidence.sampleSize || 0} | 
                      Confidence: {insight.evidence.confidence || 0}%
                      {insight.evidence.methodology && ` | Method: ${insight.evidence.methodology}`}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Business Impact */}
              {insight.impact && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Business Impact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {insight.impact.revenue && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-green-600 font-medium mb-1">Revenue Impact</div>
                        <div className="text-lg font-bold text-green-800">{insight.impact.revenue}</div>
                      </div>
                    )}
                    {insight.impact.timeframe && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-600 font-medium mb-1">Timeframe</div>
                        <div className="text-lg font-bold text-blue-800 capitalize">{insight.impact.timeframe}</div>
                      </div>
                    )}
                    {insight.impact.effort && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-sm text-purple-600 font-medium mb-1">Implementation Effort</div>
                        <div className="text-lg font-bold text-purple-800 capitalize">{insight.impact.effort}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Recommendations */}
              {insight.recommendations && insight.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions</h4>
                  <div className="space-y-4">
                    {insight.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-900">{rec.action || 'No action specified'}</div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {rec.timeline || 'No timeline'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{rec.rationale || 'No rationale provided'}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>👤 {rec.owner || 'Unassigned'}</span>
                          <span>⏱️ {rec.timeline || 'No timeline'}</span>
                        </div>
                        {rec.kpis && rec.kpis.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {rec.kpis.map((kpi, kpiIndex) => (
                              <span key={kpiIndex} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                📊 {kpi}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Related Patterns
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Insight
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  Insight ID: {insight.id}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default ExpandableInsightCard
