'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  XCircle,
  Globe,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

const riskData = {
  markets: [
    {
      country: 'United States',
      flag: '🇺🇸',
      risk: 'low',
      score: 9.2,
      issues: [],
    },
    {
      country: 'Canada (English)',
      flag: '🇨🇦',
      risk: 'low',
      score: 8.8,
      issues: [],
    },
    {
      country: 'Australia',
      flag: '🇦🇺',
      risk: 'low',
      score: 8.6,
      issues: [],
    },
    {
      country: 'United Kingdom',
      flag: '🇬🇧',
      risk: 'medium',
      score: 6.4,
      issues: [
        '"Gummies" associated with children\'s vitamins in UK market',
      ],
      impact: '-23% perceived sophistication',
      recommendation: 'Rebrand as "Chews" or "Bites" for UK market',
      projectedImprovement: '+18% purchase intent',
      detailed: true,
    },
    {
      country: 'Germany',
      flag: '🇩🇪',
      risk: 'high',
      score: 3.1,
      issues: [
        '"Adaptogenic" unregulated - seen as pseudoscience',
        'Health claims require medical certification',
        '"Stress relief" needs approved studies',
      ],
      impact: '-67% lower purchase intent',
      complianceRisk: 'HIGH',
      recommendation: 'Delay German launch',
      detailed: true,
    },
  ],
  hiddenOpportunity: {
    country: 'Canada (French)',
    flag: '🇨🇦',
    translation: '"Calme Quotidien" (Daily Calm translation)',
    lift: '+31%',
    marketSize: '84,000 potential customers',
    revenueImpact: 2100000,
    insights: [
      'French messaging resonates 3x better than translated English',
      '"Nature" and "Équilibre" are powerful trigger words',
      'Quebec influencer partnerships show 67% higher engagement',
    ],
  },
}

export default function CulturalRiskPage() {
  const params = useParams()
  const router = useRouter()

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/test/${params.testId}/results`)}
              className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  Cultural Risk Assessment
                </h1>
              </div>
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                Daily Calm Gummies • 5 Market Analysis
              </p>
            </div>
          </div>
        </div>

        {/* Market Risk Overview */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-light-text-primary dark:text-dark-text-primary">
            Market Risk Overview
          </h2>

          <div className="space-y-3">
            {riskData.markets.map((market, index) => (
              <MarketRiskCard key={index} market={market} />
            ))}
          </div>
        </Card>

        {/* Detailed Analysis - UK & Germany */}
        {riskData.markets
          .filter((m) => m.detailed)
          .map((market, index) => (
            <DetailedRiskCard key={index} market={market} />
          ))}

        {/* Hidden Opportunity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            variant="insight"
            padding="lg"
            className="bg-gradient-to-br from-light-bg-elevated to-light-bg-secondary dark:from-dark-bg-elevated dark:to-purple-950/10 border-2 border-primary-200 dark:border-primary-700/30"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-accent-purple to-primary-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-accent-purple mb-2">
                  Hidden Opportunity: {riskData.hiddenOpportunity.country}
                </h3>

                <p className="text-light-text-primary dark:text-dark-text-primary mb-4">
                  {riskData.hiddenOpportunity.translation} tests{' '}
                  <span className="text-success-light dark:text-success-dark font-semibold">
                    {riskData.hiddenOpportunity.lift} HIGHER
                  </span>{' '}
                  than English name among French Canadian mothers
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Market Size */}
                  <div className="p-4 rounded-lg bg-light-bg-elevated dark:bg-dark-bg-elevated border border-light-border-primary dark:border-dark-border-primary">
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                      Market size:
                    </div>
                    <div className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                      {riskData.hiddenOpportunity.marketSize}
                    </div>
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      Revenue potential:
                    </div>
                    <div className="text-2xl font-bold text-success-light dark:text-success-dark">
                      +${(riskData.hiddenOpportunity.revenueImpact / 1000000).toFixed(1)}M annually
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary mb-3">
                      Key Insights:
                    </div>
                    {riskData.hiddenOpportunity.insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-500/10 flex items-center justify-center mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary-500" />
                        </div>
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {insight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="primary" size="sm">
                  Launch Dual-Language Strategy →
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

function MarketRiskCard({ market }: { market: any }) {
  const riskConfig = {
    low: {
      icon: CheckCircle,
      color: 'text-success-light dark:text-success-dark',
      bg: 'bg-success-light/10 dark:bg-success-dark/10',
      border: 'border-success-light/20 dark:border-success-dark/20',
      label: 'Low Risk',
    },
    medium: {
      icon: AlertTriangle,
      color: 'text-warning-light dark:text-warning-dark',
      bg: 'bg-warning-light/10 dark:bg-warning-dark/10',
      border: 'border-warning-light/20 dark:border-warning-dark/20',
      label: 'Medium Risk',
    },
    high: {
      icon: XCircle,
      color: 'text-error-light dark:text-error-dark',
      bg: 'bg-error-light/10 dark:bg-error-dark/10',
      border: 'border-error-light/20 dark:border-error-dark/20',
      label: 'High Risk',
    },
  }

  const config = riskConfig[market.risk as keyof typeof riskConfig]
  const Icon = config.icon

  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-lg border
        ${config.bg} ${config.border}
        transition-all hover:shadow-md
      `}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <span className="text-3xl">{market.flag}</span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">
            {market.country}
          </div>
          {market.issues.length > 0 && (
            <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              {market.issues[0]}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
            {config.label}
          </div>
          <div className={`text-2xl font-bold ${config.color}`}>
            {market.score}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailedRiskCard({ market }: { market: any }) {
  const isHighRisk = market.risk === 'high'

  return (
    <Card
      variant="risk"
      riskLevel={market.risk}
      padding="lg"
      className="mb-8"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-center gap-3">
          {isHighRisk ? (
            <XCircle className="h-6 w-6 text-error-light dark:text-error-dark" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-warning-light dark:text-warning-dark" />
          )}
          <span className="text-4xl">{market.flag}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            {market.country} - Detailed Risk Analysis
          </h3>
        </div>
      </div>

      {/* Issues */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm text-light-text-primary dark:text-dark-text-primary mb-3">
          {isHighRisk ? 'Critical Issues:' : 'Issue Identified:'}
        </h4>
        <div className="space-y-2">
          {market.issues.map((issue: string, index: number) => (
            <div
              key={index}
              className={`
                flex items-start gap-3 p-3 rounded-lg
                ${
                  isHighRisk
                    ? 'bg-error-light/5 dark:bg-error-dark/5 border border-error-light/20 dark:border-error-dark/20'
                    : 'bg-warning-light/5 dark:bg-warning-dark/5 border border-warning-light/20 dark:border-warning-dark/20'
                }
              `}
            >
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-light-bg-elevated dark:bg-dark-bg-elevated flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {issue}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact & Compliance */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
          <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
            Impact:
          </div>
          <div className="text-lg font-bold text-error-light dark:text-error-dark">
            {market.impact}
          </div>
        </div>
        {market.complianceRisk && (
          <div className="p-4 rounded-lg bg-error-light/10 dark:bg-error-dark/10 border border-error-light/20 dark:border-error-dark/20">
            <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              Compliance Risk:
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-error-light dark:text-error-dark" />
              <div className="text-lg font-bold text-error-light dark:text-error-dark">
                {market.complianceRisk}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendation */}
      {!isHighRisk ? (
        <div className="p-4 rounded-lg bg-success-light/10 dark:bg-success-dark/10 border border-success-light/20 dark:border-success-dark/20 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-success-light dark:text-success-dark flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-success-light dark:text-success-dark mb-1">
                Recommended Fix:
              </div>
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                {market.recommendation}
              </div>
              {market.projectedImprovement && (
                <div className="text-sm">
                  <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                    Projected improvement:{' '}
                  </span>
                  <span className="font-semibold text-success-light dark:text-success-dark">
                    {market.projectedImprovement}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-error-light/10 dark:bg-error-dark/10 border border-error-light/20 dark:border-error-dark/20 mb-4">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-error-light dark:text-error-dark flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-error-light dark:text-error-dark mb-1">
                Recommendation: {market.recommendation}
              </div>
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Entering this market carries significant compliance and brand risk. Consider alternative markets with better regulatory frameworks.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isHighRisk && (
          <Button variant="primary" size="sm">
            Apply Recommendation
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          icon={<ExternalLink className="h-4 w-4" />}
        >
          View {market.country === 'Germany' ? 'EU' : 'UK'} Certification Requirements
        </Button>
      </div>
    </Card>
  )
}

