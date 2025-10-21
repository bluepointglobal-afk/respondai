'use client'

import { useState } from 'react'
import { MoreVertical, Edit, Trash2, Archive, Copy, Play, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { TestStatus, getStatusConfig } from '@/lib/types/test-status'
import { formatDistanceToNow } from 'date-fns'

interface SurveyCardProps {
  test: {
    id: string
    name: string
    status: string
    productInfo: any
    createdAt: string
    updatedAt: string
    audiences?: any[]
    analysis?: any
  }
}

export function SurveyCard({ test }: SurveyCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  
  const statusConfig = getStatusConfig(mapDatabaseStatusToEnum(test.status))
  const productInfo = test.productInfo as any
  
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this survey? This cannot be undone.')) {
      return
    }
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/test/${test.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete')
      
      alert('Survey deleted')
      window.location.reload()
    } catch (error) {
      alert('Failed to delete survey')
    } finally {
      setDeleting(false)
    }
  }
  
  async function handleArchive() {
    try {
      await fetch(`/api/test/${test.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' })
      })
      
      alert('Survey archived')
      router.refresh()
    } catch (error) {
      alert('Failed to archive survey')
    }
  }
  
  async function handleDuplicate() {
    try {
      const response = await fetch(`/api/test/${test.id}/duplicate`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to duplicate')
      
      const { testId } = await response.json()
      alert('Survey duplicated')
      router.push(`/dashboard/test/${testId}`)
    } catch (error) {
      alert('Failed to duplicate survey')
    }
  }
  
  function handleEdit() {
    router.push(`/dashboard/test/${test.id}/edit`)
  }
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      {/* Header with Menu */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">
              {test.name}
            </h3>
            <StatusBadge status={test.status as TestStatus} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {productInfo?.description || 'No description'}
          </p>
        </div>
        
        {/* Actions Menu */}
        <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive}>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600"
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {test.analysis?.sampleSize || test.audiences?.reduce((sum, a) => sum + (a.targetSampleSize || 0), 0) || 0}
          </div>
          <div className="text-xs text-muted-foreground">Responses</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{test.audiences?.length || 0}</div>
          <div className="text-xs text-muted-foreground">Audiences</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {test.analysis?.confidence ? `${Math.round(test.analysis.confidence)}%` : '0%'}
          </div>
          <div className="text-xs text-muted-foreground">Confidence</div>
        </div>
      </div>
      
      {/* Date */}
      <div className="text-xs text-muted-foreground mb-4">
        Created {formatDistanceToNow(new Date(test.createdAt), { addSuffix: true })}
      </div>
      
      {/* Action Button */}
      <Button 
        onClick={() => router.push(statusConfig.nextRoute(test.id))}
        className="w-full"
        variant={test.status === 'COMPLETED' ? 'default' : 'outline'}
      >
        {test.status === 'COMPLETED' ? (
          <>
            <Play className="w-4 h-4 mr-2" />
            View Results
          </>
        ) : (
          statusConfig.nextAction
        )}
      </Button>
    </Card>
  )
}

function mapDatabaseStatusToEnum(status: string): TestStatus {
  switch (status) {
    case 'DRAFT': return TestStatus.DRAFT
    case 'SURVEY_BUILDING': return TestStatus.BUILDING_SURVEY
    case 'AUDIENCE_SETUP': return TestStatus.DEFINING_AUDIENCES
    case 'DEFINING_AUDIENCES': return TestStatus.DEFINING_AUDIENCES
    case 'BUILDING_SURVEY': return TestStatus.BUILDING_SURVEY
    case 'READY_TO_LAUNCH': return TestStatus.READY_TO_LAUNCH
    case 'READY_TO_RUN': return TestStatus.READY_TO_LAUNCH // Legacy mapping
    case 'RUNNING': return TestStatus.RUNNING
    case 'ANALYZING': return TestStatus.ANALYZING
    case 'COMPLETED': return TestStatus.COMPLETED
    case 'ARCHIVED': return TestStatus.ARCHIVED
    default: return TestStatus.DRAFT
  }
}

function StatusBadge({ status }: { status: TestStatus }) {
  const config = getStatusConfig(status)
  
  if (!config) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
        Unknown
      </span>
    )
  }
  
  return (
    <span className={cn(
      "px-2 py-1 text-xs font-medium rounded-full",
      config.bgColor,
      config.textColor
    )}>
      {config.label}
    </span>
  )
}
