/**
 * RECOMMENDATIONS TIMELINE
 * Displays strategic recommendations organized by timeframe with implementation details
 */

'use client'

import { useState } from 'react'
import { Calendar, Clock, DollarSign, Users, AlertTriangle, CheckCircle, Target, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

interface Recommendation {
  id: string
  category: 'brand' | 'product' | 'pricing' | 'distribution' | 'marketing' | 'positioning'
  timeframe: 'immediate' | 'near-term' | 'long-term'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  rationale: {
    supportingInsights: string[]
    dataEvidence: string[]
    expectedImpact: string
  }
  implementation: {
    steps: Array<{
      sequence: number
      action: string
      owner: string
      duration: string
      dependencies: string[]
    }>
    resources: {
      team: string[]
      budget: string
      tools: string[]
      partners: string[]
    }
    timeline: string
  }
  metrics: {
    kpis: Array<{
      metric: string
      target: string
      measurement: string
      frequency: string
    }>
    successCriteria: string[]
    learningGoals: string[]
  }
  risks: Array<{
    risk: string
    likelihood: 'High' | 'Medium' | 'Low'
    impact: 'High' | 'Medium' | 'Low'
    mitigation: string
  }>
  estimatedImpact: {
    revenueImpact: string
    confidence: number
    assumptions: string[]
    upside: string
    downside: string
  }
}

interface RecommendationsTimelineProps {
  recommendations: Recommendation[]
}

function RecommendationsTimeline({ recommendations }: RecommendationsTimelineProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'immediate' | 'near-term' | 'long-term' | 'all'>('all')
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null)
  
  const filteredRecommendations = recommendations.filter(rec => 
    selectedTimeframe === 'all' || rec.timeframe === selectedTimeframe
  )
  
  const timeframeStats = {
    immediate: recommendations.filter(r => r.timeframe === 'immediate').length,
    'near-term': recommendations.filter(r => r.timeframe === 'near-term').length,
    'long-term': recommendations.filter(r => r.timeframe === 'long-term').length
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'brand': return 'bg-blue-100 text-blue-800'
      case 'product': return 'bg-green-100 text-green-800'
      case 'pricing': return 'bg-purple-100 text-purple-800'
      case 'distribution': return 'bg-orange-100 text-orange-800'
      case 'marketing': return 'bg-pink-100 text-pink-800'
      case 'positioning': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return Clock
      case 'near-term': return Calendar
      case 'long-term': return Target
      default: return Clock
    }
  }
  
  const getRiskColor = (likelihood: string, impact: string) => {
    if (likelihood === 'High' && impact === 'High') return 'bg-red-100 text-red-800'
    if (likelihood === 'High' || impact === 'High') return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }
  
  return (
    <div className="space-y-6">
      {/* Timeline Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Strategic Recommendations</h2>
          <div className="flex gap-2">
            <Button
              variant={selectedTimeframe === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('all')}
            >
              All ({recommendations.length})
            </Button>
            <Button
              variant={selectedTimeframe === 'immediate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('immediate')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Immediate ({timeframeStats.immediate})
            </Button>
            <Button
              variant={selectedTimeframe === 'near-term' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('near-term')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Near-term ({timeframeStats['near-term']})
            </Button>
            <Button
              variant={selectedTimeframe === 'long-term' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('long-term')}
            >
              <Target className="w-4 h-4 mr-2" />
              Long-term ({timeframeStats['long-term']})
            </Button>
          </div>
        </div>
      </div>
      
      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation, index) => {
          const TimeframeIcon = getTimeframeIcon(recommendation.timeframe)
          const isExpanded = expandedRecommendation === recommendation.id
          
          return (
            <Card key={recommendation.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <TimeframeIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-900">{recommendation.title}</h3>
                      </div>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getCategoryColor(recommendation.category)}>
                        {recommendation.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{recommendation.description}</p>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">Revenue Impact</div>
                        <div className="text-lg font-bold text-green-800">{recommendation.estimatedImpact.revenueImpact}</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">Confidence</div>
                        <div className="text-lg font-bold text-blue-800">{recommendation.estimatedImpact.confidence}%</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-purple-600 font-medium">Timeline</div>
                        <div className="text-lg font-bold text-purple-800">{recommendation.implementation.timeline}</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-sm text-orange-600 font-medium">Steps</div>
                        <div className="text-lg font-bold text-orange-800">{recommendation.implementation.steps.length}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedRecommendation(isExpanded ? null : recommendation.id)}
                  >
                    {isExpanded ? 'Show Less' : 'Show Details'}
                  </Button>
                </div>
                
                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 pt-6 border-t"
                    >
                      {/* Rationale */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Why This Matters</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 mb-3">{recommendation.rationale.expectedImpact}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Supporting Insights</h5>
                              <ul className="space-y-1">
                                {recommendation.rationale.supportingInsights.map((insight, idx) => (
                                  <li key={idx} className="text-sm text-gray-600">• {insight}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Data Evidence</h5>
                              <ul className="space-y-1">
                                {recommendation.rationale.dataEvidence.map((evidence, idx) => (
                                  <li key={idx} className="text-sm text-gray-600">• {evidence}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Implementation Plan */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Implementation Plan</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">Resources Needed</h5>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-sm text-blue-600 font-medium">Team</div>
                                  <div className="text-sm text-blue-700">{recommendation.implementation.resources.team.join(', ')}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-blue-600 font-medium">Budget</div>
                                  <div className="text-sm text-blue-700">{recommendation.implementation.resources.budget}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-blue-600 font-medium">Tools</div>
                                  <div className="text-sm text-blue-700">{recommendation.implementation.resources.tools.join(', ')}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-blue-600 font-medium">Partners</div>
                                  <div className="text-sm text-blue-700">{recommendation.implementation.resources.partners.join(', ') || 'None'}</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <h5 className="font-medium text-green-800 mb-2">Timeline</h5>
                              <p className="text-sm text-green-700 mb-3">{recommendation.implementation.timeline}</p>
                              <div className="space-y-2">
                                {recommendation.implementation.steps.map((step, idx) => (
                                  <div key={idx} className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                      {step.sequence}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-green-800">{step.action}</div>
                                      <div className="text-xs text-green-600">
                                        {step.owner} • {step.duration}
                                        {step.dependencies.length > 0 && ` • Depends on: ${step.dependencies.join(', ')}`}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Success Metrics */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Success Metrics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h5 className="font-medium text-purple-800 mb-2">KPIs to Track</h5>
                            <div className="space-y-2">
                              {recommendation.metrics.kpis.map((kpi, idx) => (
                                <div key={idx} className="text-sm">
                                  <div className="font-medium text-purple-700">{kpi.metric}</div>
                                  <div className="text-purple-600">
                                    Target: {kpi.target} | Measure: {kpi.measurement} | Frequency: {kpi.frequency}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-lg">
                            <h5 className="font-medium text-indigo-800 mb-2">Success Criteria</h5>
                            <ul className="space-y-1">
                              {recommendation.metrics.successCriteria.map((criteria, idx) => (
                                <li key={idx} className="text-sm text-indigo-700">• {criteria}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Risk Assessment */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
                        <div className="space-y-3">
                          {recommendation.risks.map((risk, idx) => (
                            <div key={idx} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">{risk.risk}</div>
                                  <div className="text-sm text-gray-600 mt-1">{risk.mitigation}</div>
                                </div>
                                <div className="flex gap-2">
                                  <Badge className={getRiskColor(risk.likelihood, risk.impact)}>
                                    {risk.likelihood} Likelihood
                                  </Badge>
                                  <Badge className={getRiskColor(risk.likelihood, risk.impact)}>
                                    {risk.impact} Impact
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Impact Analysis */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Impact Analysis</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-2">Upside Scenario</h5>
                            <p className="text-sm text-green-700">{recommendation.estimatedImpact.upside}</p>
                          </div>
                          <div className="p-4 bg-red-50 rounded-lg">
                            <h5 className="font-medium text-red-800 mb-2">Downside Scenario</h5>
                            <p className="text-sm text-red-700">{recommendation.estimatedImpact.downside}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-800 mb-2">Key Assumptions</h5>
                            <ul className="space-y-1">
                              {recommendation.estimatedImpact.assumptions.map((assumption, idx) => (
                                <li key={idx} className="text-sm text-blue-700">• {assumption}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Started
                          </Button>
                          <Button variant="outline" size="sm">
                            <Users className="w-4 h-4 mr-2" />
                            Assign Team
                          </Button>
                          <Button variant="outline" size="sm">
                            Export Plan
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500">
                          Recommendation ID: {recommendation.id}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-500">Try selecting a different timeframe filter.</p>
        </div>
      )}
    </div>
  )
}

export default RecommendationsTimeline
