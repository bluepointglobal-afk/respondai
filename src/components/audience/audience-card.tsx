import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calculator,
  BarChart,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AudienceDefinition } from '@/lib/audience/types'

interface AudienceCardProps {
  audience: AudienceDefinition
  onAdd?: () => void
  onEdit?: () => void
  onRemove?: () => void
  isSelected?: boolean
  isEditable?: boolean
}

export function AudienceCard({ 
  audience, 
  onAdd, 
  onEdit, 
  onRemove, 
  isSelected = false,
  isEditable = true 
}: AudienceCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <Card className={cn(
      "p-6 border-2 transition-all",
      isSelected ? "border-primary bg-primary/5" : "border-border",
      audience.priority === 'primary' && "ring-2 ring-primary/20"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{audience.name}</h3>
            <PriorityBadge priority={audience.priority} />
            {audience.isPrimary && (
              <Badge variant="default" className="text-xs">
                Primary
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {audience.demographics.age.min}-{audience.demographics.age.max} years old, 
            {audience.demographics.location.type} areas
          </p>
        </div>
        
        <div className="flex space-x-2">
          {!isSelected && onAdd && (
            <Button onClick={onAdd} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Audience
            </Button>
          )}
          {isEditable && onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onRemove && (
            <Button onClick={onRemove} variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <MetricBox
          icon={<Users className="w-5 h-5 text-blue-500" />}
          label="Total Addressable Market"
          value={audience.market_sizing?.tam_calculation?.estimated_tam?.toLocaleString() || 'N/A'}
          subtext="people in US"
        />
        
        <MetricBox
          icon={<Target className="w-5 h-5 text-green-500" />}
          label="Recommended Sample"
          value={audience.sample_recommendation?.recommended_sample || 'N/A'}
          subtext={`±${audience.sample_recommendation?.calculation?.margin_of_error || 5}% @ ${audience.sample_recommendation?.calculation?.confidence_level || 95}% conf.`}
        />
        
        <MetricBox
          icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
          label="Strategic Priority"
          value={`${audience.strategic?.priority_score || 0}/100`}
          subtext={audience.priority === 'primary' ? 'Primary target' : 'Secondary'}
        />
      </div>
      
      {/* Quick Demographics */}
      <div className="flex flex-wrap gap-2 mb-4">
        <DemographicPill>
          Age {audience.demographics?.age?.min || 'N/A'}-{audience.demographics?.age?.max || 'N/A'}
        </DemographicPill>
        <DemographicPill>
          {formatIncome(audience.demographics?.income)}
        </DemographicPill>
        <DemographicPill>
          {audience.demographics?.location?.type || 'N/A'}
        </DemographicPill>
        <DemographicPill>
          {audience.behavioral?.category_usage || 'N/A'} user
        </DemographicPill>
      </div>
      
      {/* Strategic Rationale (Collapsed/Expanded) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {expanded ? 'Hide' : 'Show'} detailed analysis
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {/* TAM Calculation Breakdown */}
          <Section title="TAM Calculation" icon={<Calculator />}>
            <div className="space-y-2">
              {audience.market_sizing?.tam_calculation?.calculation_steps?.map((step, i) => (
                <TAMStep key={i} step={step} />
              )) || <div className="text-sm text-muted-foreground">No calculation steps available</div>}
              <div className="pt-2 border-t font-semibold">
                Final TAM: {audience.market_sizing?.tam_calculation?.estimated_tam?.toLocaleString() || 'N/A'} people
              </div>
              <div className="text-sm text-muted-foreground">
                Confidence: <ConfidenceBadge level={audience.market_sizing?.confidence?.level || 'low'} />
              </div>
            </div>
          </Section>
          
          {/* Sample Size Breakdown */}
          <Section title="Sample Size Recommendation" icon={<BarChart />}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Minimum (statistically valid):</span>
                <span className="font-medium">{audience.sample_recommendation?.minimum_sample || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Recommended (industry standard):</span>
                <span className="font-medium">{audience.sample_recommendation?.recommended_sample || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Optimal (highest confidence):</span>
                <span className="font-medium">{audience.sample_recommendation?.optimal_sample || 'N/A'}</span>
              </div>
              <div className="pt-2 border-t text-sm text-muted-foreground">
                {audience.sample_recommendation?.calculation?.rationale || 'No rationale available'}
              </div>
            </div>
          </Section>
          
          {/* Strategic Rationale */}
          <Section title="Why This Audience?" icon={<Lightbulb />}>
            <p className="text-sm">{audience.strategic?.rationale || 'No rationale available'}</p>
            
            <div className="mt-3 grid grid-cols-2 gap-3">
              <ScoreItem
                label="Product Fit"
                score={audience.strategic?.fit_score || 0}
              />
              <ScoreItem
                label="Market Size"
                score={audience.strategic?.priority_factors?.size || 0}
              />
              <ScoreItem
                label="Accessibility"
                score={audience.strategic?.priority_factors?.accessibility || 0}
              />
              <ScoreItem
                label="Receptivity"
                score={audience.strategic?.priority_factors?.receptivity || 0}
              />
            </div>
          </Section>
          
          {/* Expected Performance */}
          <Section title="Expected Performance" icon={<Target />}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Purchase Intent:</span>
                <span className="font-medium">{audience.strategic?.expected_metrics?.purchase_intent || 'N/A'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Willingness to Pay:</span>
                <span className="font-medium">${audience.strategic?.expected_metrics?.willingness_to_pay || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Est. Conversion:</span>
                <span className="font-medium">{audience.strategic?.expected_metrics?.conversion_rate || 'N/A'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Lifetime Value:</span>
                <span className="font-medium">${audience.strategic?.expected_metrics?.lifetime_value || 'N/A'}</span>
              </div>
            </div>
          </Section>
        </div>
      )}
    </Card>
  )
}

// Helper Components
function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-green-100 text-green-800',
    exploratory: 'bg-yellow-100 text-yellow-800'
  }
  
  const safePriority = priority || 'primary'
  
  return (
    <Badge className={cn('text-xs', colors[safePriority as keyof typeof colors])}>
      {safePriority.charAt(0).toUpperCase() + safePriority.slice(1)}
    </Badge>
  )
}

function MetricBox({ icon, label, value, subtext }: {
  icon: React.ReactNode
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="text-center p-3 bg-muted/50 rounded-lg">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  )
}

function DemographicPill({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="text-xs">
      {children}
    </Badge>
  )
}

function Section({ title, icon, children }: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function TAMStep({ step }: { step: any }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span>{step.filter_description}</span>
      <span className="font-medium">{step.result.toLocaleString()}</span>
    </div>
  )
}

function ConfidenceBadge({ level }: { level: string }) {
  const colors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800'
  }
  
  const safeLevel = level || 'low'
  
  return (
    <Badge className={cn('text-xs', colors[safeLevel as keyof typeof colors])}>
      {safeLevel.charAt(0).toUpperCase() + safeLevel.slice(1)} Confidence
    </Badge>
  )
}

function ScoreItem({ label, score }: { label: string; score: number }) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold">{score}/100</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function formatIncome(income: any): string {
  if (!income) return 'N/A'
  if (income.brackets && income.brackets.length > 0) {
    return income.brackets[0]
  }
  return `$${income.median || 'N/A'}K median`
}
