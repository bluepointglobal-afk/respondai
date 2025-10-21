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
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SimpleAudience {
  id: string
  name: string
  isPrimary: boolean
  demographics: any
  psychographics?: any
  estimatedSize: number
  targetSampleSize: number
  reasoning?: string
}

interface SimpleAudienceCardProps {
  audience: SimpleAudience
  onEdit?: () => void
  onRemove?: () => void
  isSelected?: boolean
  isEditable?: boolean
}

export function SimpleAudienceCard({ 
  audience, 
  onEdit, 
  onRemove, 
  isSelected = false,
  isEditable = true 
}: SimpleAudienceCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  // Extract data with fallbacks
  const demographics = audience.demographics || {}
  const psychographics = audience.psychographics || {}
  
  const ageRange = demographics.age ? `${demographics.age.min || 25}-${demographics.age.max || 45}` : '25-45'
  const gender = demographics.gender || 'any'
  const income = demographics.income || 'middle'
  const education = demographics.education || 'college'
  const location = demographics.location || 'urban'
  
  const lifestyle = Array.isArray(psychographics.lifestyle) 
    ? psychographics.lifestyle 
    : psychographics.lifestyle 
      ? [psychographics.lifestyle] 
      : ['Professional']
  const values = Array.isArray(psychographics.values) 
    ? psychographics.values 
    : psychographics.values 
      ? [psychographics.values] 
      : ['Quality']
  const painPoints = Array.isArray(psychographics.painPoints) 
    ? psychographics.painPoints 
    : psychographics.painPoints 
      ? [psychographics.painPoints] 
      : []
  
  return (
    <Card className={cn(
      "p-6 border-2 transition-all",
      isSelected ? "border-primary bg-primary/5" : "border-border",
      audience.isPrimary && "ring-2 ring-primary/20"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{audience.name}</h3>
            {audience.isPrimary && (
              <Badge variant="default" className="text-xs">
                Primary
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {ageRange} years old, {location} areas
          </p>
        </div>
        
        <div className="flex space-x-2">
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
          label="Estimated Market Size"
          value={audience.estimatedSize ? audience.estimatedSize.toLocaleString() : 'N/A'}
          subtext="potential customers"
        />
        
        <MetricBox
          icon={<Target className="w-5 h-5 text-green-500" />}
          label="Target Sample"
          value={audience.targetSampleSize || 'N/A'}
          subtext="survey responses"
        />
        
        <MetricBox
          icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
          label="Priority Level"
          value={audience.isPrimary ? 'Primary' : 'Secondary'}
          subtext="target segment"
        />
      </div>
      
      {/* Quick Demographics */}
      <div className="flex flex-wrap gap-2 mb-4">
        <DemographicPill>
          Age {ageRange}
        </DemographicPill>
        <DemographicPill>
          {formatIncome(income)}
        </DemographicPill>
        <DemographicPill>
          {typeof location === 'string' ? location : location?.type || 'N/A'}
        </DemographicPill>
        <DemographicPill>
          {education}
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
          {/* Demographics Breakdown */}
          <Section title="Demographics" icon={<Users />}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Age Range:</span>
                <span className="font-medium">{ageRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Gender:</span>
                <span className="font-medium">{gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Income Level:</span>
                <span className="font-medium">{formatIncome(income)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Education:</span>
                <span className="font-medium">{education}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Location:</span>
                <span className="font-medium">{location}</span>
              </div>
            </div>
          </Section>
          
          {/* Psychographics */}
          <Section title="Psychographics" icon={<Lightbulb />}>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Lifestyle:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lifestyle.map((item: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">Values:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {values.map((item: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              {painPoints.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Pain Points:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {painPoints.map((item: string, i: number) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
          
          {/* Strategic Rationale */}
          <Section title="Strategic Rationale" icon={<Target />}>
            <p className="text-sm">{audience.reasoning || 'No rationale provided'}</p>
          </Section>
        </div>
      )}
    </Card>
  )
}

// Helper Components
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

function formatIncome(income: any): string {
  if (!income) return 'N/A'
  if (typeof income === 'string') {
    return income === 'middle' ? '$50K-$75K' : income
  }
  if (income.brackets && income.brackets.length > 0) {
    return income.brackets[0]
  }
  return `$${income.median || 'N/A'}K median`
}
