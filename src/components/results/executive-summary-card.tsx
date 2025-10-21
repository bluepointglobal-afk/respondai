/**
 * EXECUTIVE SUMMARY CARD
 * Displays C-level strategic summary with key insights and recommendations
 */

'use client'

import { CheckCircle, XCircle, AlertTriangle, TrendingUp, DollarSign, Target, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ExecutiveSummary {
  bottomLine: string
  marketOpportunity: string
  keyFinding: string
  strategicImplications: string[]
  recommendedActions: string[]
  risks: string[]
  confidence: number
  methodology: string
}

interface ExecutiveSummaryCardProps {
  summary: ExecutiveSummary
  onExport?: () => void
}

function ExecutiveSummaryCard({ summary, onExport }: ExecutiveSummaryCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800 border-green-200'
    if (confidence >= 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }
  
  const getLaunchRecommendation = (bottomLine: string | undefined) => {
    if (!bottomLine) {
      return { icon: AlertTriangle, color: 'text-yellow-600', text: 'PROCEED WITH CAUTION' }
    }
    
    const lower = bottomLine.toLowerCase()
    if (lower.includes('launch') && (lower.includes('recommend') || lower.includes('proceed'))) {
      return { icon: CheckCircle, color: 'text-green-600', text: 'LAUNCH RECOMMENDED' }
    }
    if (lower.includes('don\'t') || lower.includes('not launch') || lower.includes('abandon')) {
      return { icon: XCircle, color: 'text-red-600', text: 'DO NOT LAUNCH' }
    }
    return { icon: AlertTriangle, color: 'text-yellow-600', text: 'PROCEED WITH CAUTION' }
  }
  
  const launchRec = getLaunchRecommendation(summary.bottomLine)
  const LaunchIcon = launchRec.icon
  
  return (
    <div className="space-y-6">
      {/* Main Summary Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Executive Summary</CardTitle>
            <div className="flex items-center gap-3">
              <Badge className={getConfidenceColor(summary.confidence || 0)}>
                {summary.confidence || 0}% Confidence
              </Badge>
              <Button variant="outline" size="sm" onClick={onExport}>
                Export Summary
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bottom Line */}
          <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-l-blue-500">
            <div className="flex items-start gap-4">
              <LaunchIcon className={`w-8 h-8 ${launchRec.color} mt-1`} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{launchRec.text}</h3>
                <p className="text-gray-700 leading-relaxed">{summary.bottomLine || 'No summary available'}</p>
              </div>
            </div>
          </div>
          
          {/* Market Opportunity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Market Opportunity
            </h3>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-gray-700 leading-relaxed">{summary.marketOpportunity || 'Market opportunity data not available'}</p>
            </div>
          </div>
          
          {/* Key Finding */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Key Finding
            </h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed font-medium">{summary.keyFinding || 'Key findings not available'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Strategic Implications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Strategic Implications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(summary.strategicImplications || []).map((implication, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700">{implication}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Immediate Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(summary.recommendedActions || []).map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">{action}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Priority Action
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Immediate Implementation
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Risks & Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Risks & Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(summary.risks || []).map((risk, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-gray-700">{risk}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Methodology & Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Analysis Methodology</p>
              <p className="text-gray-800">{summary.methodology || 'Analysis methodology not specified'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
              <Badge className={getConfidenceColor(summary.confidence || 0)}>
                {summary.confidence || 0}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button size="lg" className="px-8">
          <DollarSign className="w-5 h-5 mr-2" />
          View Revenue Impact
        </Button>
        <Button variant="outline" size="lg" className="px-8">
          <Users className="w-5 h-5 mr-2" />
          Share with Team
        </Button>
        <Button variant="outline" size="lg" className="px-8">
          Download Full Report
        </Button>
      </div>
    </div>
  )
}

export default ExecutiveSummaryCard
